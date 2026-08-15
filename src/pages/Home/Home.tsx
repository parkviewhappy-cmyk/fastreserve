import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/layout/BottomNavigation'
import StatusBadge from '@/components/common/StatusBadge'

/**
 * Home 화면.
 * Sprint 1 범위: 정적 UI 구성만 포함한다.
 * 예약 데이터 연동은 Sprint 2(예약 CRUD)에서 진행한다.
 */
function Home() {
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

        {/* 예약 목록 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">
            예약 목록
          </h2>
          <div className="rounded-xl border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
            예약 목록이 비어 있습니다
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
