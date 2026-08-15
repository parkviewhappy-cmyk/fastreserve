import type { Reservation } from '@/types/reservation'

/**
 * Reservation Repository 인터페이스.
 * 데이터 출처(Mock/LocalStorage/DB/API)를 추상화하여 Service 계층이
 * 저장소 구현에 의존하지 않도록 한다. (Clean Architecture)
 *
 * PM Review 반영: save/update/delete를 인터페이스에 포함한다.
 * 단, Sprint 2에서는 UI(CRUD 화면)와 연결하지 않으며, Mock 구현체 수준의 계약 충족만 목적으로 한다.
 * 실제 저장소 연동 및 CRUD 화면 구현은 이후 Sprint에서 진행한다.
 */
export interface ReservationRepository {
  getAll(): Reservation[]
  getById(id: string): Reservation | undefined
  save(reservation: Reservation): Reservation
  update(id: string, patch: Partial<Reservation>): Reservation | undefined
  delete(id: string): boolean
}
