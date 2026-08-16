import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useToast } from '@/hooks/useToast'
import {
  discoveryManager,
  getDiscoveryStatusLabel,
  formatDDay,
  filterDiscoveryByKeyword,
  DiscoveryStatus,
  type DiscoveryItem,
} from '@/domain/discovery'
import { getNow } from '@/utils/time'

const STATUS_BADGE_STYLE: Record<DiscoveryStatus, string> = {
  [DiscoveryStatus.Upcoming]: 'bg-accent-500/20 text-accent-400',
  [DiscoveryStatus.Open]: 'bg-primary-500/20 text-primary-500',
  [DiscoveryStatus.Closed]: 'bg-neutral-800 text-neutral-500',
}

/**
 * Discovery(공연 찾기) 화면 (/discovery).
 * PM 지시(Sprint 11): "Ticket Discovery Center" — 관심 공연의 예매 오픈 정보를
 * 확인하고 Reservation으로 연결하는 화면이다.
 *
 * 데이터 출처: 1단계 조사 결과(README 참고), 인터파크는 이 프로젝트가 사용할 수 있는
 * 공식 API/RSS를 제공하지 않아 현재는 Mock Data Provider를 사용한다(Discovery Manager
 * 내부에서 SessionChecker와 동일한 교체 가능 구조로 주입된다). 화면 코드는 실제 데이터로
 * 교체되어도 변경할 필요가 없다.
 *
 * 캐시(TTL 30분)와 오프라인(마지막 조회 데이터 표시) 처리는 이 화면이 navigator.onLine을
 * 확인해 refreshIfNeeded()/getCached() 중 하나를 선택하는 방식으로 구현했다(Ready Screen의
 * 인터넷 상태 처리와 동일한 패턴).
 *
 * [예약 준비] 버튼은 Reservation을 생성하고 Ready Screen(/ready/:id)으로 이동시킬 뿐이며,
 * 어떤 자동 로그인/자동 클릭/자동 예약/자동 좌석선택/자동 결제도 수행하지 않는다.
 */
function Discovery() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [items, setItems] = useState<DiscoveryItem[]>([])
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favoriteVersion, setFavoriteVersion] = useState(0)
  const [online, setOnline] = useState<boolean>(
    typeof navigator === 'undefined' ? true : navigator.onLine
  )

  function loadItems(forceOnline = online) {
    const now = getNow()
    if (forceOnline) {
      setItems(discoveryManager.refreshIfNeeded(now))
    } else {
      setItems(discoveryManager.getCached())
    }
    setLastFetchedAt(discoveryManager.getLastFetchedAt())
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true)
      loadItems(true)
      showToast('인터넷에 다시 연결되었습니다. 최신 정보를 확인합니다.', 'info')
    }
    const handleOffline = () => {
      setOnline(false)
      showToast('오프라인 상태입니다. 마지막으로 조회한 정보를 표시합니다.', 'info')
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleRefresh() {
    if (!online) {
      showToast('오프라인 상태에서는 새로고침할 수 없습니다.', 'error')
      return
    }
    setItems(discoveryManager.refresh(getNow()))
    setLastFetchedAt(discoveryManager.getLastFetchedAt())
    showToast('공연 정보를 새로고침했습니다.', 'info')
  }

  function handleToggleFavorite(id: string) {
    const nowFavorite = discoveryManager.toggleFavorite(id)
    setFavoriteVersion((v) => v + 1)
    showToast(nowFavorite ? '즐겨찾기에 추가했습니다.' : '즐겨찾기에서 삭제했습니다.', 'info')
  }

  function handlePrepare(item: DiscoveryItem) {
    const result = discoveryManager.prepareReservation(item.id)
    if (!result.success || !result.reservationId) {
      showToast(result.errors.join(' ') || '예약 준비에 실패했습니다.', 'error')
      return
    }
    showToast('예약 준비 화면으로 이동합니다.', 'info')
    navigate(`/ready/${result.reservationId}`)
  }

  const now = getNow()
  // 검색은 Discovery Manager/Model이 공유하는 filterDiscoveryByKeyword()를 그대로 사용한다
  // (이미 로드된 items 목록 내에서만 필터링하며, 키 입력마다 재조회를 트리거하지 않는다).
  const keywordFiltered = filterDiscoveryByKeyword(items, keyword)
  // favoriteVersion은 즐겨찾기 토글 후 목록을 다시 그리기 위한 트리거로만 사용한다.
  void favoriteVersion
  const visibleItems = favoritesOnly
    ? keywordFiltered.filter((item) => discoveryManager.isFavorite(item.id))
    : keywordFiltered

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="공연 찾기" />
      <main className="flex-1 space-y-4 px-4 py-6">
        <Link to="/" className="inline-block text-xs text-neutral-500 hover:text-neutral-300">
          ← 홈으로
        </Link>

        {!online && (
          <div className="rounded-xl border border-accent-500/40 bg-accent-500/10 p-3 text-xs text-accent-400">
            오프라인 상태입니다. 마지막으로 조회한 정보를 표시하고 있습니다.
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <div>
            <p className="text-xs text-neutral-500">마지막 조회</p>
            <p className="mt-1 text-sm text-neutral-300">
              {lastFetchedAt ? lastFetchedAt.replace('T', ' ').slice(0, 16) : '조회 기록 없음'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={!online}
            className="rounded-lg border border-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:text-neutral-600"
          >
            새로고침
          </button>
        </div>

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="아티스트/공연명 검색 (예: 아이유)"
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-primary-600 focus:outline-none"
        />

        <label className="flex items-center gap-2 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-primary-600 focus:ring-0"
          />
          즐겨찾기만 보기
        </label>

        {visibleItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
            {items.length === 0
              ? '표시할 공연 정보가 없습니다.'
              : '검색/필터 조건에 맞는 공연이 없습니다.'}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleItems.map((item) => {
              const favorite = discoveryManager.isFavorite(item.id)
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">{item.artist}</p>
                      <h3 className="mt-0.5 text-sm font-semibold text-neutral-50">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(item.id)}
                      aria-label="즐겨찾기 토글"
                      className={`text-lg ${favorite ? 'text-yellow-400' : 'text-neutral-700'}`}
                    >
                      {favorite ? '★' : '☆'}
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_STYLE[item.status]}`}
                    >
                      {getDiscoveryStatusLabel(item.status)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {item.eventDate} {item.eventTime ?? ''}
                    </span>
                    {item.venue && (
                      <span className="text-xs text-neutral-600">· {item.venue}</span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-neutral-400">
                      예매 오픈: {item.openTime.replace('T', ' ').slice(0, 16)}
                    </p>
                    <p className="text-base font-bold text-primary-500">
                      {formatDDay(item.openTime, now)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePrepare(item)}
                    className="mt-3 block w-full rounded-lg bg-primary-600 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    예약 준비
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default Discovery
