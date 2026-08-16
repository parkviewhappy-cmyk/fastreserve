import type { Reservation } from '@/types/reservation'
import type { ReservationRepository } from './reservation.repository'
import { mockReservations } from '../mock/reservation.mock'

/**
 * Mock 데이터를 반환하는 Repository 구현체.
 *
 * BUG-003(docs/BUG_TRACKER.md, Sprint 13 발견 / PM Review 확정): `ReservationService`
 * 전용으로만 쓰이며, `ReservationService` 자체가 Sprint 3 이후 미사용 상태다. PM 결정에
 * 따라 V1.0에서는 삭제하지 않고 유지하며, V2.0 Architecture Cleanup에서 다시 검토한다.
 * 메모리 내 배열로 동작하며, 실제 영속성은 없다(새로고침 시 초기화).
 * 이후 Sprint에서 LocalStorageReservationRepository 등으로 교체 가능하도록
 * ReservationRepository 인터페이스에만 의존하게 설계했다.
 */
export class MockReservationRepository implements ReservationRepository {
  private data: Reservation[]

  constructor(initialData: Reservation[] = mockReservations) {
    this.data = [...initialData]
  }

  getAll(): Reservation[] {
    return [...this.data]
  }

  getById(id: string): Reservation | undefined {
    return this.data.find((reservation) => reservation.id === id)
  }

  save(reservation: Reservation): Reservation {
    this.data.push(reservation)
    return reservation
  }

  update(id: string, patch: Partial<Reservation>): Reservation | undefined {
    const index = this.data.findIndex((reservation) => reservation.id === id)
    if (index === -1) return undefined
    this.data[index] = { ...this.data[index], ...patch }
    return this.data[index]
  }

  delete(id: string): boolean {
    const index = this.data.findIndex((reservation) => reservation.id === id)
    if (index === -1) return false
    this.data.splice(index, 1)
    return true
  }
}
