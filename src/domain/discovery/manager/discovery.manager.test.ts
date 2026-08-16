import { describe, it, expect, beforeEach } from 'vitest'
import { SiteType } from '@/types/reservation'
import { ReservationManager } from '@/domain/reservation/manager/reservation.manager'
import { DiscoveryStatus, type DiscoveryItem } from '../types'
import { DiscoveryManager } from './discovery.manager'
import { FakeDiscoveryRepository, FakeReservationRepository } from '@/test-utils'

/**
 * Discovery Manager Integration Test.
 * PM 지시(Sprint 12, ⑤ Discovery 테스트 코드 작성): Repository/Provider/Reservation Manager를
 * 실제로 조합해 동작을 검증한다("Integration Test" 단계).
 *
 * 이 프로젝트는 처음부터 모든 Manager가 생성자 주입(constructor injection) 구조였다
 * (SessionChecker, Plugin Factory 등과 동일한 패턴). 그 덕분에 LocalStorage/실제 브라우저
 * 환경 없이도, 메모리 기반 Fake Repository만으로 Manager 로직을 완전히 검증할 수 있다.
 * jsdom 등 추가 devDependency 없이 순수 Node 환경에서 실행 가능하다.
 *
 * PM 지시(Sprint 13, ⑦ 테스트 코드 정리): Fake Repository 구현체는 다른 Domain 테스트에서도
 * 재사용할 수 있도록 src/test-utils로 옮겼다(docs/TESTING.md 참고). 기존 테스트 케이스는
 * 하나도 삭제하지 않았고, import 경로만 바뀌었다.
 */

function makeItem(overrides: Partial<DiscoveryItem> = {}): DiscoveryItem {
  return {
    id: 'item-1',
    title: '테스트 콘서트',
    artist: '테스트 아티스트',
    genre: '콘서트',
    venue: '테스트홀',
    eventDate: '2026-10-01',
    eventTime: '19:00',
    openTime: '2026-09-01T20:00:00',
    status: DiscoveryStatus.Upcoming,
    url: 'https://tickets.interpark.com/goods/1',
    site: SiteType.Interpark,
    source: 'MOCK',
    ...overrides,
  }
}

describe('DiscoveryManager', () => {
  let discoveryRepo: FakeDiscoveryRepository
  let reservationManager: ReservationManager
  let manager: DiscoveryManager
  const fixedItems = [makeItem()]
  const provider = () => fixedItems

  beforeEach(() => {
    discoveryRepo = new FakeDiscoveryRepository()
    reservationManager = new ReservationManager(new FakeReservationRepository())
    manager = new DiscoveryManager(discoveryRepo, provider, reservationManager)
  })

  it('캐시가 없으면 refreshIfNeeded()가 Provider를 호출해 캐시를 채운다', () => {
    const now = new Date('2026-08-01T00:00:00')
    const items = manager.refreshIfNeeded(now)
    expect(items).toHaveLength(1)
    expect(manager.getLastFetchedAt()).toBe(now.toISOString())
  })

  it('TTL(30분) 이내면 재조회하지 않고 같은 캐시를 반환한다', () => {
    const first = new Date('2026-08-01T00:00:00')
    manager.refresh(first)
    const fetchedAtAfterFirst = manager.getLastFetchedAt()

    const soon = new Date(first.getTime() + 10 * 60 * 1000) // 10분 후
    manager.refreshIfNeeded(soon)
    expect(manager.getLastFetchedAt()).toBe(fetchedAtAfterFirst)
  })

  it('TTL(30분)이 지나면 재조회한다', () => {
    const first = new Date('2026-08-01T00:00:00')
    manager.refresh(first)

    const later = new Date(first.getTime() + 31 * 60 * 1000) // 31분 후
    manager.refreshIfNeeded(later)
    expect(manager.getLastFetchedAt()).toBe(later.toISOString())
  })

  it('즐겨찾기를 토글하면 isFavorite()에 반영된다', () => {
    expect(manager.isFavorite('item-1')).toBe(false)
    expect(manager.toggleFavorite('item-1')).toBe(true)
    expect(manager.isFavorite('item-1')).toBe(true)
    expect(manager.toggleFavorite('item-1')).toBe(false)
    expect(manager.isFavorite('item-1')).toBe(false)
  })

  it('prepareReservation()은 새 Reservation을 만들고 alreadyLinked=false를 반환한다', () => {
    manager.refresh(new Date('2026-08-01T00:00:00'))
    const result = manager.prepareReservation('item-1')
    expect(result.success).toBe(true)
    expect(result.alreadyLinked).toBe(false)
    expect(reservationManager.list()).toHaveLength(1)
  })

  it('같은 항목을 다시 prepareReservation()해도 중복 생성하지 않고 alreadyLinked=true를 반환한다', () => {
    manager.refresh(new Date('2026-08-01T00:00:00'))
    const first = manager.prepareReservation('item-1')
    const second = manager.prepareReservation('item-1')

    expect(second.success).toBe(true)
    expect(second.alreadyLinked).toBe(true)
    expect(second.reservationId).toBe(first.reservationId)
    expect(reservationManager.list()).toHaveLength(1)
  })

  it('존재하지 않는 itemId면 실패를 반환한다', () => {
    manager.refresh(new Date('2026-08-01T00:00:00'))
    const result = manager.prepareReservation('not-exist')
    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('isLinked()는 prepareReservation() 이후 true를 반환한다', () => {
    manager.refresh(new Date('2026-08-01T00:00:00'))
    expect(manager.isLinked('item-1')).toBe(false)
    manager.prepareReservation('item-1')
    expect(manager.isLinked('item-1')).toBe(true)
  })

  it('오프라인 시 사용하는 getCached()는 Provider를 호출하지 않고 정렬해서 반환한다', () => {
    const now = new Date('2026-08-01T00:00:00')
    manager.refresh(now)
    const cached = manager.getCached()
    expect(cached).toHaveLength(1)
    expect(cached[0].id).toBe('item-1')
  })
})
