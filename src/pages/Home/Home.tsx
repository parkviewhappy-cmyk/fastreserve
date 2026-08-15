import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/layout/BottomNavigation'
import StatusBadge from '@/components/common/StatusBadge'
import ReservationCard from '@/components/common/ReservationCard'
import { reservationService } from '@/domain/reservation'

/**
 * 예약별 남은 시간 표시(임시 Mock).
 * Sprint 2 범위 제한: 실제 카운트다운 계산 로직은 구현하지 않는다. (이후 Sprint에서 구현)
 */
const MOCK_REMAINING_TIME_LABEL: Record<string, string> = {
  'mock-1': '24일 3시간 남음',
  'mock-2': '준비중',
  'mock-3': '예약 종료',
}

/**
 * Home 화면.
 * Sprint 2 범위: domain/reservation Service를 통해 Mock 예약 데이터를 조회하여 카드로 표시한다.
 * 실제 저장소 연동(LocalStorage/DB/API)과 CRUD는 이후 Sprint에서 구현한다.
 */
function Home() {
  const reservations = reservationService.getReservations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="FastReserve" />

      <main className="flex-1 space-y-6 px-4 py-6">
        {/* 오늘 예약 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">
            오늘 예약
          </h2>
          <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div>
              <p className="text-sm text-neutral-400">등록된 예약이 없습니다</p>
            </div>
            <StatusBadge status="waiting" label="예약 준비중" />
          </div>
        </section>

        {/* 예약 목록 (Sprint 2: Mock Data) */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">
            예약 목록
          </h2>
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                remainingTimeLabel={
                  MOCK_REMAINING_TIME_LABEL[reservation.id] ?? '-'
                }
              />
            ))}
          </div>
        </section>

        {/* 예약 추가 */}
        <section>
          <button
            type="button"
            className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            예약 추가
          </button>
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
