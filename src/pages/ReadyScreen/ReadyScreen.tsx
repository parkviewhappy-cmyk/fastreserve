import { Link, useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/common/StatusBadge'
import { reservationManager, getStatusLabel } from '@/domain/reservation'
import { readyEngine } from '@/domain/ready'
import { siteAccountManager } from '@/domain/siteAccount'
import { getSessionStatusLabel } from '@/domain/session'
import { pluginManager } from '@/domain/pluginManager'
import { formatVersion } from '@/domain/plugin'
import { getNow, parseLocalDateTime } from '@/utils/time'
import { SiteType } from '@/types/reservation'

const SITE_LABELS: Record<SiteType, string> = {
  [SiteType.Interpark]: 'Interpark',
  [SiteType.TicketLink]: 'TicketLink',
  [SiteType.Yes24]: 'YES24',
  [SiteType.JinAir]: 'JinAir',
  [SiteType.Custom]: '기타',
}

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

/**
 * 예약 준비 화면 (/ready/:id).
 * 예약 시간이 가까워졌을 때 사용자가 확인하는 화면이다.
 * 표시 항목(PM 지시, Sprint 8): 예약명/예약시간/남은 시간/사이트/좌석/인원/현재 상태/
 * Session 상태/Plugin 상태.
 *
 * 새로운 Engine/Manager/Domain을 추가하지 않고 기존 Core(Reservation Manager,
 * Ready Engine, Site Account Manager, Session Manager, Plugin Manager)만 조합해서 사용한다.
 */
function ReadyScreen() {
  const { id } = useParams<{ id: string }>()
  const reservation = id ? reservationManager.getById(id) : undefined

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

  const now = getNow()
  const status = readyEngine.getReservationStatus(reservation, now)
  const remainingTimeLabel = formatRemainingTime(reservation.openTime, now)

  const account = siteAccountManager
    .list()
    .find((candidate) => candidate.site === reservation.site)

  const pluginRecord = pluginManager
    .list()
    .find((record) => record.site === reservation.site)
  const pluginAvailable = pluginManager.isAvailable(reservation.site)

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
          <p className="mt-1 text-lg font-semibold text-primary-500">
            {remainingTimeLabel}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="mb-2 text-sm font-medium text-neutral-400">예약 정보</h3>
          <DetailRow label="사이트" value={SITE_LABELS[reservation.site]} />
          <DetailRow label="좌석" value={reservation.preferredSeat || '-'} />
          <DetailRow label="인원" value={`${reservation.ticketCount}명`} />
          <DetailRow label="현재 상태" value={getStatusLabel(status)} />
        </div>

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
          <h3 className="mb-2 text-sm font-medium text-neutral-400">Plugin 상태</h3>
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
