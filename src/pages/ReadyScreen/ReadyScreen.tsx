import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/common/StatusBadge'
import { reservationManager, getStatusLabel } from '@/domain/reservation'
import { readyEngine } from '@/domain/ready'
import { siteAccountManager } from '@/domain/siteAccount'
import { getSessionStatusLabel, SessionStatus } from '@/domain/session'
import { pluginManager } from '@/domain/pluginManager'
import { formatVersion } from '@/domain/plugin'
import { getNow, parseLocalDateTime } from '@/utils/time'
import { SiteType } from '@/types/reservation'
import { computeReadinessScore, getReadinessLabel } from './readinessScore'
import { requestNotificationPermission, sendNotice } from '@/utils/notification'

const SITE_LABELS: Record<SiteType, string> = {
  [SiteType.Interpark]: 'Interpark',
  [SiteType.TicketLink]: 'TicketLink',
  [SiteType.Yes24]: 'YES24',
  [SiteType.JinAir]: 'JinAir',
  [SiteType.Custom]: '기타',
}

/** 알림/진동을 1회만 발생시키기 위한 임계값(분 단위, openTime 이전). */
const NOTICE_THRESHOLDS_MIN = [10, 5, 1] as const

/** Countdown을 초 단위로 강조 표시하기 시작하는 임계값(초). */
const URGENT_COUNTDOWN_SECONDS = 30

/** openTime까지 남은 시간을 "n일 n시간 n분" 형태로 표시한다. 지났으면 "예약 시작됨"을 반환한다. */
function formatRemainingTime(openTime: string, now: Date): string {
  const diffMs = parseLocalDateTime(openTime).getTime() - now.getTime()
  if (diffMs <= 0) {
    return '예약 시작됨'
  }
  const totalMinutes = Math.floor(diffMs / (60 * 1000))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days}일`)
  if (hours > 0) parts.push(`${hours}시간`)
  parts.push(`${minutes}분`)
  return `${parts.join(' ')} 남음`
}

/** 남은 시간이 URGENT_COUNTDOWN_SECONDS 이하일 때 초 단위로 표시한다. */
function formatUrgentCountdown(openTime: string, now: Date): string | null {
  const diffMs = parseLocalDateTime(openTime).getTime() - now.getTime()
  if (diffMs <= 0 || diffMs > URGENT_COUNTDOWN_SECONDS * 1000) {
    return null
  }
  const seconds = Math.ceil(diffMs / 1000)
  return `${seconds}초 남음`
}

/**
 * 알림 발송은 Sprint 15부터 `src/utils/notification.ts`의 공유 유틸(`sendNotice`)을 사용한다.
 * 네이티브(Android/iOS)에서는 `@capacitor/local-notifications`, 웹 브라우저에서는 기존 Web
 * Notification API로 자동 분기하며 두 경로가 동시에 실행되지는 않는다(중복 발송 없음).
 */

/** 진동 알림(지원 기기에서만 동작, 실패해도 무시). */
function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // 진동 미지원/실패는 무시한다.
    }
  }
}

/**
 * 예약 준비 화면 (/ready/:id).
 * 예약 시간이 가까워졌을 때 사용자가 확인하는 화면이다.
 * 표시 항목(PM 지시, Sprint 8): 예약명/예약시간/남은 시간/사이트/좌석/인원/현재 상태/
 * Session 상태/Plugin 상태.
 * 추가 표시 항목(PM 지시, Sprint 9): 예약 URL/Plugin Version/Session 마지막 확인 시각/
 * [예약 페이지 열기] 버튼.
 *
 * PM 지시(Sprint 10, Reservation Assistant 전환): 자동 예약 실행 대신 "준비"를 돕는
 * 화면으로 전환한다. 추가된 것: 실시간 Countdown, 인터넷 상태(navigator.onLine),
 * 예약 준비 점수(100점, 로그인/Plugin/인터넷/URL 각 25점), 체크리스트, 10분/5분/1분 전
 * 1회성 알림(+ 1분 전 진동), 30초 이하 구간 초 단위 강조 표시. 이 중 어떤 것도 예약
 * 페이지를 자동으로 열거나, 자동 클릭/자동 로그인/자동 좌석선택/자동 결제를 수행하지
 * 않는다 — [예약 페이지 열기] 버튼은 여전히 사용자의 수동 클릭 + window.open()만 수행한다.
 *
 * 새로운 Engine/Manager/Domain을 추가하지 않고 기존 Core(Reservation Manager,
 * Ready Engine, Site Account Manager, Session Manager, Plugin Manager)만 조합해서 사용한다.
 * 점수 계산은 이 화면과 Home이 공유하는 순수 함수(./readinessScore)로 분리했다.
 */
function ReadyScreen() {
  const { id } = useParams<{ id: string }>()
  const reservation = id ? reservationManager.getById(id) : undefined

  // 1초마다 갱신되는 현재 시각(Countdown/체크리스트용). 실행을 트리거하지 않는다.
  const [now, setNow] = useState<Date>(() => getNow())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(getNow()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  // 인터넷 연결 상태(navigator.onLine). 실제 네트워크 Ping은 수행하지 않는다.
  const [online, setOnline] = useState<boolean>(
    typeof navigator === 'undefined' ? true : navigator.onLine
  )
  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Plugin 상태(캐시). 5분 전 시점에 한 번 재확인한다(로컬 상태 재조회일 뿐, 외부 사이트 호출 아님).
  const [pluginHealthy, setPluginHealthy] = useState<boolean>(() =>
    reservation ? pluginManager.isHealthy(reservation.site) : false
  )

  // 10분/5분/1분 전 알림이 이미 발생했는지 기록(재실행 방지).
  const notifiedRef = useRef<Record<(typeof NOTICE_THRESHOLDS_MIN)[number], boolean>>({
    10: false,
    5: false,
    1: false,
  })

  // 알림 권한을 최초 1회 요청한다(사용자의 허용이 필요하며, 자동 승인되지 않는다).
  //
  // TODO(PM Review, Sprint 10 수정, 미해결): 화면 진입 시 자동으로 권한을 요청하는 대신,
  // "예약 알림을 사용하시겠습니까?" 안내 화면(Dialog 등 기존 공통 컴포넌트 재사용 예정)을
  // 먼저 보여주고, 사용자가 "허용"을 직접 선택했을 때만 권한을 요청하는 방식으로 변경할
  // 예정이다. 이번 Sprint(15)에서도 자동 요청 로직 자체는 유지한다(동작 변경 없음).
  //
  // PM 지시(Sprint 13 PM Review 승인, Sprint 15 구현 완료): Android(Capacitor WebView)에서는
  // 순수 Web Notification API가 시스템 알림으로 안정적으로 뜨지 않을 수 있어(docs/
  // APK_BUILD_GUIDE.md 참고), `@capacitor/local-notifications`를 도입했다. 권한 요청 자체는
  // `src/utils/notification.ts`의 `requestNotificationPermission()`이 네이티브/웹 여부를
  // 판단해 알맞은 API를 호출하므로, 이 화면은 플랫폼을 직접 분기하지 않는다.
  useEffect(() => {
    void requestNotificationPermission()
  }, [])

  // 임계값 통과 시 1회성 알림 + (1분 전) 진동 + (5분 전) Plugin 재확인.
  useEffect(() => {
    if (!reservation) return
    const diffMs = parseLocalDateTime(reservation.openTime).getTime() - now.getTime()
    if (diffMs <= 0) return
    const diffMin = diffMs / (60 * 1000)

    for (const threshold of NOTICE_THRESHOLDS_MIN) {
      if (!notifiedRef.current[threshold] && diffMin <= threshold) {
        notifiedRef.current[threshold] = true
        void sendNotice(
          '예약 준비 알림',
          `"${reservation.title}" 예약 시작 ${threshold}분 전입니다.`
        )
        if (threshold === 5) {
          setPluginHealthy(pluginManager.isHealthy(reservation.site))
        }
        if (threshold === 1) {
          vibrate([200, 100, 200])
        }
      }
    }
  }, [now, reservation])

  if (!reservation) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="예약 준비" />
        <main className="flex-1 px-4 py-6">
          <Link to="/" className="mb-4 inline-block text-xs text-neutral-500 hover:text-neutral-300">
            ← 홈으로
          </Link>
          <p className="text-sm text-neutral-400">예약을 찾을 수 없습니다.</p>
        </main>
      </div>
    )
  }

  const status = readyEngine.getReservationStatus(reservation, now)
  const remainingTimeLabel = formatRemainingTime(reservation.openTime, now)
  const urgentCountdown = formatUrgentCountdown(reservation.openTime, now)

  const account = siteAccountManager
    .list()
    .find((candidate) => candidate.site === reservation.site)

  const pluginRecord = pluginManager
    .list()
    .find((record) => record.site === reservation.site)
  const pluginAvailable = pluginManager.isAvailable(reservation.site)

  const loginReady = account?.sessionStatus === SessionStatus.Ready
  const { score, checklist } = computeReadinessScore({
    loginReady,
    pluginHealthy,
    internetOnline: online,
    urlRegistered: Boolean(reservation.url),
  })
  const readinessLabel = getReadinessLabel(score)
  const healthStars = pluginHealthy ? '★★★★★' : '★★☆☆☆'

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="예약 준비" />
      <main className="flex-1 space-y-4 px-4 py-6">
        <Link
          to={`/reservation/${reservation.id}`}
          className="inline-block text-xs text-neutral-500 hover:text-neutral-300"
        >
          ← 예약 상세로
        </Link>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="flex items-start justify-between">
            <h2 className="text-base font-semibold text-neutral-50">
              {reservation.title}
            </h2>
            <StatusBadge status={status} label={getStatusLabel(status)} />
          </div>

          <p className="mt-2 text-sm text-neutral-300">
            {reservation.eventDate} · {reservation.eventTime}
          </p>
          {urgentCountdown ? (
            <p className="mt-1 animate-pulse text-2xl font-bold text-red-500">
              {urgentCountdown}
            </p>
          ) : (
            <p className="mt-1 text-lg font-semibold text-primary-500">
              {remainingTimeLabel}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-400">예약 준비 점수</h3>
            <span className="text-lg font-bold text-primary-500">{score}점</span>
          </div>
          <p className="mb-3 text-xs text-neutral-500">{readinessLabel}</p>
          <ul className="space-y-1">
            {checklist.map((item) => (
              <li key={item.key} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-neutral-300">
                  <span className={item.ok ? 'text-emerald-500' : 'text-neutral-600'}>
                    {item.ok ? '✓' : '○'}
                  </span>
                  {item.label}
                </span>
                <span className="text-neutral-500">{item.points}점</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="mb-2 text-sm font-medium text-neutral-400">예약 정보</h3>
          <DetailRow label="사이트" value={SITE_LABELS[reservation.site]} />
          <DetailRow label="좌석" value={reservation.preferredSeat || '-'} />
          <DetailRow label="인원" value={`${reservation.ticketCount}명`} />
          <DetailRow label="현재 상태" value={getStatusLabel(status)} />
          <DetailRow label="예약 URL" value={reservation.url || '-'} />
          <DetailRow label="인터넷 상태" value={online ? '연결됨' : '연결 끊김'} />
        </div>

        <button
          type="button"
          onClick={() => {
            if (reservation.url) {
              window.open(reservation.url, '_blank', 'noopener,noreferrer')
            }
          }}
          disabled={!reservation.url}
          className="block w-full rounded-xl bg-primary-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          예약 페이지 열기
        </button>
        {!reservation.url && (
          <p className="-mt-2 text-xs text-neutral-500">
            등록된 예약 URL이 없어 열 수 없습니다.
          </p>
        )}

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="mb-2 text-sm font-medium text-neutral-400">Session 상태</h3>
          {account ? (
            <>
              <DetailRow
                label="Session"
                value={getSessionStatusLabel(account.sessionStatus)}
              />
              <DetailRow
                label="마지막 확인"
                value={account.lastChecked?.replace('T', ' ').slice(0, 16) ?? '-'}
              />
            </>
          ) : (
            <p className="text-sm text-neutral-500">등록된 사이트 계정이 없습니다.</p>
          )}
          <Link
            to="/site"
            className="mt-2 inline-block text-xs text-neutral-500 hover:text-neutral-300"
          >
            사이트 계정 관리로 이동 →
          </Link>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-400">Plugin 상태</h3>
            <span
              className={`text-xs font-semibold ${pluginHealthy ? 'text-emerald-500' : 'text-neutral-500'}`}
            >
              {healthStars} {pluginHealthy ? 'Plugin 정상' : 'Plugin 확인 필요'}
            </span>
          </div>
          {pluginRecord ? (
            <>
              <DetailRow label="Version" value={formatVersion(pluginRecord.version)} />
              <DetailRow label="활성화여부" value={pluginRecord.enabled ? '활성화' : '비활성화'} />
              <DetailRow label="사용가능 여부" value={pluginAvailable ? '사용 가능' : '사용 불가'} />
            </>
          ) : (
            <p className="text-sm text-neutral-500">설치된 Plugin이 없습니다.</p>
          )}
          <Link
            to="/plugin"
            className="mt-2 inline-block text-xs text-neutral-500 hover:text-neutral-300"
          >
            Plugin 관리로 이동 →
          </Link>
        </div>
      </main>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right text-neutral-200">{value}</span>
    </div>
  )
}

export default ReadyScreen
