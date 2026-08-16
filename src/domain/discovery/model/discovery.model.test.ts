import { describe, it, expect } from 'vitest'
import { SiteType, ReservationStatus } from '@/types/reservation'
import { DiscoveryStatus, type DiscoveryItem } from '../types'
import {
  getDiscoveryStatusLabel,
  formatDDay,
  filterDiscoveryByKeyword,
  filterDiscoveryByGenre,
  getAvailableGenres,
  sortDiscoveryItems,
  toReservationDraft,
  findLinkedReservation,
} from './discovery.model'

/**
 * Discovery Model Unit Test.
 * PM 지시(Sprint 12, ⑤ Discovery 테스트 코드 작성): 순수 함수 위주인 Model 계층부터
 * 테스트한다. 외부 상태(LocalStorage 등)에 의존하지 않는 함수만 다룬다.
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

describe('getDiscoveryStatusLabel', () => {
  it('각 상태에 대응하는 한글 라벨을 반환한다', () => {
    expect(getDiscoveryStatusLabel(DiscoveryStatus.Upcoming)).toBe('오픈예정')
    expect(getDiscoveryStatusLabel(DiscoveryStatus.Open)).toBe('예매중')
    expect(getDiscoveryStatusLabel(DiscoveryStatus.Closed)).toBe('종료')
  })
})

describe('formatDDay', () => {
  it('openTime이 정확히 10일 뒤면 D-10을 반환한다', () => {
    const now = new Date('2026-09-01T00:00:00')
    expect(formatDDay('2026-09-11T00:00:00', now)).toBe('D-10')
  })

  it('openTime이 오늘이면 D-DAY를 반환한다', () => {
    const now = new Date('2026-09-01T09:00:00')
    expect(formatDDay('2026-09-01T20:00:00', now)).toBe('D-DAY')
  })

  it('openTime이 지났으면 D+n을 반환한다', () => {
    const now = new Date('2026-09-05T00:00:00')
    expect(formatDDay('2026-09-01T00:00:00', now)).toBe('D+4')
  })
})

describe('filterDiscoveryByKeyword', () => {
  const items = [
    makeItem({ id: 'a', title: '아이유 콘서트', artist: '아이유' }),
    makeItem({ id: 'b', title: '임영웅 투어', artist: '임영웅' }),
  ]

  it('제목에 포함된 키워드로 검색된다', () => {
    expect(filterDiscoveryByKeyword(items, '콘서트').map((i) => i.id)).toEqual(['a'])
  })

  it('아티스트명에 포함된 키워드로 검색된다(대소문자 무시)', () => {
    expect(filterDiscoveryByKeyword(items, '아이유').map((i) => i.id)).toEqual(['a'])
  })

  it('빈 키워드면 전체를 반환한다', () => {
    expect(filterDiscoveryByKeyword(items, '   ')).toHaveLength(2)
  })

  it('일치하는 항목이 없으면 빈 배열을 반환한다', () => {
    expect(filterDiscoveryByKeyword(items, '존재하지않음')).toHaveLength(0)
  })
})

describe('filterDiscoveryByGenre / getAvailableGenres', () => {
  const items = [
    makeItem({ id: 'a', genre: '콘서트' }),
    makeItem({ id: 'b', genre: '팬미팅' }),
    makeItem({ id: 'c', genre: '콘서트' }),
    makeItem({ id: 'd', genre: undefined }),
  ]

  it('genre가 null이면 전체를 반환한다', () => {
    expect(filterDiscoveryByGenre(items, null)).toHaveLength(4)
  })

  it('지정한 장르만 필터링한다', () => {
    expect(filterDiscoveryByGenre(items, '콘서트').map((i) => i.id)).toEqual(['a', 'c'])
  })

  it('중복 없이 존재하는 장르 목록을 반환한다', () => {
    expect(getAvailableGenres(items)).toEqual(['콘서트', '팬미팅'])
  })
})

describe('sortDiscoveryItems', () => {
  it('종료(Closed) 항목을 뒤로 보내고, 나머지는 openTime 오름차순으로 정렬한다', () => {
    const items = [
      makeItem({ id: 'closed', status: DiscoveryStatus.Closed, openTime: '2026-01-01T00:00:00' }),
      makeItem({ id: 'later', status: DiscoveryStatus.Upcoming, openTime: '2026-12-01T00:00:00' }),
      makeItem({ id: 'sooner', status: DiscoveryStatus.Open, openTime: '2026-06-01T00:00:00' }),
    ]
    expect(sortDiscoveryItems(items).map((i) => i.id)).toEqual(['sooner', 'later', 'closed'])
  })

  it('원본 배열을 변경하지 않는다', () => {
    const items = [makeItem({ id: 'a' }), makeItem({ id: 'b' })]
    const originalOrder = items.map((i) => i.id)
    sortDiscoveryItems(items)
    expect(items.map((i) => i.id)).toEqual(originalOrder)
  })
})

describe('toReservationDraft', () => {
  it('DiscoveryItem을 ReservationDraft로 변환한다', () => {
    const item = makeItem()
    const draft = toReservationDraft(item)
    expect(draft.title).toBe(item.title)
    expect(draft.eventName).toBe(item.artist)
    expect(draft.eventDate).toBe(item.eventDate)
    expect(draft.eventTime).toBe(item.eventTime)
    expect(draft.openTime).toBe(item.openTime)
    expect(draft.url).toBe(item.url)
    expect(draft.ticketCount).toBe(1)
  })

  it('eventTime이 없으면 00:00을 기본값으로 사용한다', () => {
    const item = makeItem({ eventTime: undefined })
    expect(toReservationDraft(item).eventTime).toBe('00:00')
  })
})

describe('findLinkedReservation', () => {
  it('동일 아티스트/공연일/공연시간의 예약을 찾는다', () => {
    const item = makeItem()
    const reservations = [
      {
        id: 'r1',
        title: '기존 예약',
        site: SiteType.Interpark,
        eventName: item.artist,
        eventDate: item.eventDate,
        eventTime: item.eventTime as string,
        openTime: item.openTime,
        ticketCount: 1,
        status: ReservationStatus.Waiting,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ]
    expect(findLinkedReservation(item, reservations)?.id).toBe('r1')
  })

  it('일치하는 예약이 없으면 undefined를 반환한다', () => {
    expect(findLinkedReservation(makeItem(), [])).toBeUndefined()
  })
})
