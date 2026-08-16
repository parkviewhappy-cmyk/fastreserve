import type { Reservation } from '@/types/reservation'
import type { ReservationRepository } from '@/domain/reservation/repository/reservation.repository'

/**
 * 메모리 기반 Fake Reservation Repository(테스트 전용).
 * PM 지시(Sprint 13, ⑦ 테스트 코드 정리): Discovery Manager 통합 테스트에서 쓰던 것을
 * 여러 Domain의 테스트가 재사용할 수 있도록 공용 위치(src/test-utils)로 옮겼다.
 * `ReservationManager`는 생성자 주입 구조이므로, 이 Fake를 `new ReservationManager(fake)`
 * 형태로 그대로 주입해 LocalStorage/브라우저 없이 실제 Manager 로직을 검증할 수 있다.
 */
export class FakeReservationRepository implements ReservationRepository {
  private items: Reservation[] = []

  getAll(): Reservation[] {
    return this.items
  }
  getById(id: string): Reservation | undefined {
    return this.items.find((item) => item.id === id)
  }
  save(reservation: Reservation): Reservation {
    this.items.push(reservation)
    return reservation
  }
  update(id: string, patch: Partial<Reservation>): Reservation | undefined {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) return undefined
    this.items[index] = { ...this.items[index], ...patch }
    return this.items[index]
  }
  delete(id: string): boolean {
    const before = this.items.length
    this.items = this.items.filter((item) => item.id !== id)
    return this.items.length < before
  }
}
