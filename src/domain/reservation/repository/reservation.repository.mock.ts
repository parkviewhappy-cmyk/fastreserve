import type { Reservation } from '@/types/reservation'
import type { ReservationRepository } from './reservation.repository'
import { mockReservations } from '../mock/reservation.mock'

/**
 * Mock 데이터를 반환하는 Repository 구현체.
 * Sprint 2 범위: 조회만 지원한다.
 * 이후 Sprint에서 LocalStorageReservationRepository 등으로 교체 가능하도록
 * ReservationRepository 인터페이스에만 의존하게 설계했다.
 */
export class MockReservationRepository implements ReservationRepository {
  private readonly data: Reservation[] = mockReservations

  getAll(): Reservation[] {
    return [...this.data]
  }

  getById(id: string): Reservation | undefined {
    return this.data.find((reservation) => reservation.id === id)
  }
}
