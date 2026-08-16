import { reservationManager, ReservationManager } from '@/domain/reservation'
import type { ReservationMutationResult } from '@/domain/reservation'
import { getNow } from '@/utils/time'
import type { DiscoveryCache, DiscoveryItem } from '../types'
import type { DiscoveryRepository } from '../repository/discovery.repository'
import { LocalStorageDiscoveryRepository } from '../repository/discovery.repository.localStorage'
import type { DiscoveryDataProvider } from '../provider/discovery.provider'
import { mockDiscoveryDataProvider } from '../provider/discovery.provider'
import { DEFAULT_DISCOVERY_RULE, type DiscoveryRule } from '../rule/discoveryRule'
import { filterDiscoveryByKeyword, findLinkedReservation, toReservationDraft } from '../model/discovery.model'

export interface DiscoveryPrepareResult {
  success: boolean
  reservationId?: string
  errors: string[]
}

/**
 * Discovery Manager.
 * Discovery(공연 찾기) 관련 모든 동작(목록 조회/캐시 관리/검색/즐겨찾기/Reservation 연결)의
 * 단일 진입점이다. Component(Discovery 화면)는 이 Manager만 사용한다.
 *
 * PM 지시(Sprint 11): 새 Domain은 Discovery 1개만 허용되며, 기존 Reservation/Plugin/
 * Session/Scheduler/Simulation/Ready/Execution Domain은 그대로 재사용한다. 이 Manager는
 * Reservation Manager를 그대로 재사용해 [예약 준비] 연결을 구현하고, Execution/Scheduler/
 * Plugin 등에는 어떤 영향도 주지 않는다.
 *
 * 캐시 정책(PM 지시 9단계, TTL 30분)과 오프라인 정책(PM 지시 10단계, 마지막 조회 데이터 표시)은
 * 이 Manager가 아니라 호출부(Discovery 화면)가 navigator.onLine 등 브라우저 상태를 보고
 * getCached()/refreshIfNeeded() 중 무엇을 부를지 선택하는 방식으로 분리했다(Ready Screen의
 * 인터넷 상태 처리와 동일한 책임 분리 방식).
 */
export class DiscoveryManager {
  constructor(
    private readonly repository: DiscoveryRepository = new LocalStorageDiscoveryRepository(),
    private readonly provider: DiscoveryDataProvider = mockDiscoveryDataProvider,
    private readonly reservations: ReservationManager = reservationManager,
    private readonly rule: DiscoveryRule = DEFAULT_DISCOVERY_RULE
  ) {}

  /** 캐시가 없거나 TTL이 지났는지 확인한다. */
  private isCacheExpired(cache: DiscoveryCache | null, now: Date): boolean {
    if (!cache) return true
    const fetchedAt = new Date(cache.fetchedAt).getTime()
    const ttlMs = this.rule.cacheTtlMinutes * 60 * 1000
    return now.getTime() - fetchedAt > ttlMs
  }

  /** 캐시에 있는 데이터를 그대로 반환한다(재조회하지 않음). 오프라인 상태에서 사용한다. */
  getCached(): DiscoveryItem[] {
    return this.repository.getCache()?.items ?? []
  }

  /** 마지막으로 캐시가 채워진 시각(ISO)을 반환한다. 한 번도 조회한 적이 없으면 null. */
  getLastFetchedAt(): string | null {
    return this.repository.getCache()?.fetchedAt ?? null
  }

  /** Provider를 호출해 강제로 새로 조회하고 캐시를 갱신한다. */
  refresh(now: Date = getNow()): DiscoveryItem[] {
    const items = this.provider(now)
    this.repository.saveCache({ items, fetchedAt: now.toISOString() })
    return items
  }

  /** 캐시가 없거나 TTL(기본 30분)이 지났을 때만 재조회한다. 그렇지 않으면 캐시를 그대로 반환한다. */
  refreshIfNeeded(now: Date = getNow()): DiscoveryItem[] {
    const cache = this.repository.getCache()
    if (this.isCacheExpired(cache, now)) {
      return this.refresh(now)
    }
    return cache?.items ?? []
  }

  /** 제목/아티스트 키워드로 검색한다(현재 캐시 목록 내에서 필터링). */
  search(keyword: string, now: Date = getNow()): DiscoveryItem[] {
    return filterDiscoveryByKeyword(this.refreshIfNeeded(now), keyword)
  }

  isFavorite(id: string): boolean {
    return this.repository.getFavoriteIds().includes(id)
  }

  /** 즐겨찾기 상태를 토글하고, 토글 후의 상태(true=즐겨찾기됨)를 반환한다. */
  toggleFavorite(id: string): boolean {
    const ids = this.repository.getFavoriteIds()
    const index = ids.indexOf(id)
    if (index === -1) {
      this.repository.saveFavoriteIds([...ids, id])
      return true
    }
    const next = ids.filter((favoriteId) => favoriteId !== id)
    this.repository.saveFavoriteIds(next)
    return false
  }

  /** 즐겨찾기한 항목만 반환한다(현재 캐시 목록 기준). */
  listFavorites(now: Date = getNow()): DiscoveryItem[] {
    const favoriteIds = this.repository.getFavoriteIds()
    return this.refreshIfNeeded(now).filter((item) => favoriteIds.includes(item.id))
  }

  /**
   * [예약 준비] 버튼 동작.
   * DiscoveryItem을 Reservation Draft로 변환해 Reservation Manager로 등록한다.
   * 동일 공연으로 이미 연결된 Reservation이 있으면 새로 만들지 않고 그 Reservation을
   * 재사용한다(같은 항목을 여러 번 눌러도 중복 예약이 생기지 않는다).
   * 이 메서드는 Reservation을 "등록"할 뿐이며, 어떤 예약 페이지 진입/자동 클릭/자동 예약도
   * 수행하지 않는다 — 실제 예약 페이지 진입은 이어지는 Ready Screen에서 사용자가 직접
   * [예약 페이지 열기]를 눌러야 한다.
   */
  prepareReservation(itemId: string): DiscoveryPrepareResult {
    const item = this.getCached().find((candidate) => candidate.id === itemId)
    if (!item) {
      return { success: false, errors: ['Discovery 항목을 찾을 수 없습니다.'] }
    }

    const existing = findLinkedReservation(item, this.reservations.list())
    if (existing) {
      return { success: true, reservationId: existing.id, errors: [] }
    }

    const result: ReservationMutationResult = this.reservations.create(
      toReservationDraft(item)
    )
    if (!result.success || !result.reservation) {
      return { success: false, errors: result.errors }
    }
    return { success: true, reservationId: result.reservation.id, errors: [] }
  }
}

/** 기본 Discovery Manager 인스턴스. */
export const discoveryManager = new DiscoveryManager()
