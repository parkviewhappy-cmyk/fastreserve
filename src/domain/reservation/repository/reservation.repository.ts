import type { Reservation } from '@/types/reservation'

/**
 * Reservation Repository 인터페이스.
 * 데이터 출처(Mock/LocalStorage/DB/API)를 추상화하여 Service 계층이
 * 저장소 구현에 의존하지 않도록 한다. (Clean Architecture)
 *
 * Sprint 2 범위: 조회(Read) 메서드만 정의한다. 생성/수정/삭제는 이후 Sprint(예약 CRUD)에서 추가한다.
 */
export interface ReservationRepository {
  getAll(): Reservation[]
  getById(id: string): Reservation | undefined
}
