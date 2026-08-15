import { ReservationStatus, SiteType } from '@/types/reservation'
import type { Reservation } from '@/types/reservation'

/**
 * Mock Reservation Data (3건).
 * Sprint 2 범위: 실제 저장소 연동 전, 화면/도메인 로직 검증을 위한 임시 데이터.
 * PM 제공 예시에 없는 값(공연 URL, 메모 등)은 임의의 플레이스홀더로 채웠다.
 *
 * PM Review 반영: id는 UUID v4 형식, 날짜/시간은 ISO 8601 형식으로 통일했다.
 * openTime은 대한민국(KST) Local Time 그대로 저장하며 UTC 변환(Z)을 붙이지 않는다.
 */
export const mockReservations: Reservation[] = [
  {
    id: '1b9a6942-c5f2-4c5f-a36a-b89864076144',
    title: '임영웅 콘서트',
    site: SiteType.Interpark,
    eventName: '임영웅 콘서트',
    eventDate: '2026-10-10',
    eventTime: '19:00',
    openTime: '2026-09-01T20:00:00',
    url: 'https://tickets.interpark.com/goods/26000001',
    preferredSeat: 'VIP',
    ticketCount: 2,
    memo: '',
    status: ReservationStatus.Waiting,
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-01T09:00:00Z',
  },
  {
    id: 'e12709e7-a9ca-4931-970a-323b92319417',
    title: '뮤지컬 위키드',
    site: SiteType.Interpark,
    eventName: '뮤지컬 위키드',
    eventDate: '2026-11-05',
    eventTime: '19:30',
    openTime: '2026-09-15T14:00:00',
    url: 'https://tickets.interpark.com/goods/26000002',
    preferredSeat: 'R석',
    ticketCount: 1,
    memo: '',
    status: ReservationStatus.Preparing,
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-10T11:00:00Z',
  },
  {
    id: 'a24bfbe2-32b5-41f0-b572-8f19523e9613',
    title: '콜드플레이',
    site: SiteType.Interpark,
    eventName: '콜드플레이 내한공연',
    eventDate: '2026-07-20',
    eventTime: '20:00',
    openTime: '2026-06-01T20:00:00',
    url: 'https://tickets.interpark.com/goods/26000003',
    preferredSeat: 'S석',
    ticketCount: 2,
    memo: '',
    status: ReservationStatus.Completed,
    createdAt: '2026-05-20T09:00:00Z',
    updatedAt: '2026-07-20T22:00:00Z',
  },
]
