import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/layout/BottomNavigation'
import ReservationCard from '@/components/common/ReservationCard'
import SummaryCard from '@/components/common/SummaryCard'
import { reservationManager } from '@/domain/reservation'
import { readyEngine } from '@/domain/ready'

/**
 * Home 화면.
 * Sprint 4 범위: 상단 Dashboard는 Ready Engine의 getDashboardSummary() 결과만 사용하며
 * Home에서 직접 통계를 계산하지 않는다. "오늘 예약"도 Ready Engine의
 * getTodayReservations()를 사용한다.
 */
function Home() {
  const reservations = reservationManager.list()
  const dashboard = readyEngine.getDashboardSummary()
  const todayReservations = readyEngine.getTodayReservations()

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
