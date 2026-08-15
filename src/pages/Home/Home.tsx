import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/layout/BottomNavigation'
import ReservationCard from '@/components/common/ReservationCard'
import SummaryCard from '@/components/common/SummaryCard'
import { reservationManager } from '@/domain/reservation'
import { readyEngine } from '@/domain/ready'
import { healthCheckEngine } from '@/domain/healthCheck'
import { scheduler } from '@/domain/scheduler'

/**
 * Home 화면.
 * Sprint 4 범위: 상단 Dashboard는 Ready Engine의 getDashboardSummary() 결과만 사용하며
 * Home에서 직접 통계를 계산하지 않는다. "오늘 예약"도 Ready Engine의
 * getTodayReservations()를 사용한다.
 * Sprint 5 범위: 사이트 로그인 상태 요약은 Health Check Engine의 getReport() 결과만 사용한다.
 * Sprint 6 범위: Simulation 요약(Queue 길이/현재 실행 대상)은 Scheduler를 통해서만 조회한다.
 * (Execution Engine을 Home에서 직접 호출하지 않는다.)
 * Sprint 7 범위(PM Review 반영): "플러그인 관리" 버튼으로 Plugin 관리 화면(/plugin)에
 * 진입할 수 있다.
 * Sprint 8 범위: 예약 추가/예약 목록/사이트 계정 관리(/site)/플러그인 관리(/plugin)/
 * Simulation(/simulation)/예약 준비(/ready/:id) 모두 Home에서 클릭만으로 도달 가능하다.
 * "사이트 계정 관리"와 "플러그인 관리"는 서로 다른 화면이므로 라벨을 구분했다
 * (PM Review 반영: Sprint 7 검토 시 라벨 중복을 특이사항으로 보고했고, 이번 Sprint 지시에
 * 쓰인 명칭을 그대로 반영해 구분했다).
 */
function Home() {
  const reservations = reservationManager.list()
  const dashboard = readyEngine.getDashboardSummary()
  const todayReservations = readyEngine.getTodayReservations()
  const health = healthCheckEngine.getReport()
  const executionQueue = scheduler.getExecutionQueue()
  const currentTarget = executionQueue[0]
    ? reservationManager.getById(executionQueue[0].context.reservationId)
    : undefined
  const upcomingReservations = readyEngine.getUpcomingReservations()
  const readyTarget = currentTarget ?? todayReservations[0] ?? upcomingReservations[0]

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="FastReserve" />

      <main className="flex-1 space-y-6 px-4 py-6">
        {/* Dashboard (Ready Engine 결과) */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">
            Dashboard
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="총 예약" value={dashboard.totalReservation} />
            <SummaryCard label="오늘 예약" value={dashboard.todayReservation} />
            <SummaryCard
              label="예약 준비중"
              value={dashboard.waitingReservation}
            />
            <SummaryCard label="준비중" value={dashboard.preparingReservation} />
            <SummaryCard label="준비 완료" value={dashboard.readyReservation} />
            <SummaryCard label="진행중" value={dashboard.runningReservation} />
            <SummaryCard label="완료" value={dashboard.completedReservation} />
            <SummaryCard label="실패" value={dashboard.failedReservation} />
          </div>
        </section>

        {/* 오늘 예약 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">
            오늘 예약
          </h2>
          {todayReservations.length === 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-400">
              오늘 예정된 공연이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {todayReservations.map((reservation) => (
                <Link key={reservation.id} to={`/reservation/${reservation.id}`}>
                  <ReservationCard reservation={reservation} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 예약 목록 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">
            예약 목록
          </h2>
          {reservations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
              예약 목록이 비어 있습니다
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <Link key={reservation.id} to={`/reservation/${reservation.id}`}>
                  <ReservationCard reservation={reservation} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 사이트 상태 (Health Check Engine 결과) */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">
            사이트 상태
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="로그인 완료" value={health.loggedInSiteCount} />
            <SummaryCard label="로그인 필요" value={health.loginRequiredSiteCount} />
          </div>
          <Link
            to="/site"
            className="mt-3 block text-center text-xs text-neutral-500 hover:text-neutral-300"
          >
            사이트 계정 관리로 이동 →
          </Link>
        </section>

        {/* Simulation (Scheduler를 통한 Execution Queue 요약) */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">
            Simulation
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="현재 Queue 길이" value={executionQueue.length} />
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <p className="text-xs text-neutral-500">현재 실행 대상</p>
              <p className="mt-1 truncate text-sm font-semibold text-neutral-50">
                {currentTarget?.title ?? '없음'}
              </p>
            </div>
          </div>
          <Link
            to="/simulation"
            className="mt-3 block w-full rounded-xl border border-neutral-800 py-3 text-center text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900"
          >
            Simulation Mode 열기
          </Link>
        </section>

        {/* 플러그인 관리 (Plugin Settings 진입) */}
        <section>
          <Link
            to="/plugin"
            className="block w-full rounded-xl border border-neutral-800 py-3 text-center text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900"
          >
            플러그인 관리
          </Link>
        </section>

        {/* 예약 준비 (가장 가까운 예약으로 바로 이동) */}
        {readyTarget && (
          <section>
            <Link
              to={`/ready/${readyTarget.id}`}
              className="block w-full rounded-xl border border-neutral-800 py-3 text-center text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900"
            >
              예약 준비 화면 보기 ({readyTarget.title})
            </Link>
          </section>
        )}

        {/* 예약 추가 */}
        <section>
          <Link
            to="/add"
            className="block w-full rounded-xl bg-primary-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            예약 추가
          </Link>
        </section>

        {/* 설정 진입 */}
        <section>
          <button
            type="button"
            className="w-full rounded-xl border border-neutral-800 py-3 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900"
          >
            설정
          </button>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}

export default Home
