import type { Reservation } from '@/types/reservation'

/**
 * Mock Reservation Data (3건).
 * Sprint 2 범위: 실제 저장소 연동 전, 화면/도메인 로직 검증을 위한 임시 데이터.
 * PM 제공 예시에 없는 값(공연 URL, 메모 등)은 임의의 플레이스홀더로 채웠다.
 */
export const mockReservations: Reservation[] = [
  {
    id: 'mock-1',
    title: '임영웅 콘서트',
    site: 'interpark',
    eventName: '임영웅 콘서트',
    eventDate: '2026-10-10',
    eventTime: '19:00',
    openTime: '2026-09-01 20:00',
    url: 'https://tickets.interpark.com/goods/26000001',
    preferredSeat: 'VIP',
    ticketCount: 2,
    memo: '',
    status: 'waiting',
    createdAt: '2026-08-01T09:00:00',
    updatedAt: '2026-08-01T09:00:00',
  },
  {
    id: 'mock-2',
    title: '뮤지컬 위키드',
    site: 'interpark',
    eventName: '뮤지컬 위키드',
    eventDate: '2026-11-05',
    eventTime: '19:30',
    openTime: '2026-09-15 14:00',
    url: 'https://tickets.interpark.com/goods/26000002',
    preferredSeat: 'R석',
    ticketCount: 1,
    memo: '',
    status: 'preparing',
    createdAt: '2026-08-05T10:00:00',
    updatedAt: '2026-08-10T11:00:00',
  },
  {
    id: 'mock-3',
    title: '콜드플레이',
    site: 'interpark',
    eventName: '콜드플레이 내한공연',
    eventDate: '2026-07-20',
    eventTime: '20:00',
    openTime: '2026-06-01 20:00',
    url: 'https://tickets.interpark.com/goods/26000003',
    preferredSeat: 'S석',
    ticketCount: 2,
    memo: '',
    status: 'completed',
    createdAt: '2026-05-20T09:00:00',
    updatedAt: '2026-07-20T22:00:00',
  },
]
