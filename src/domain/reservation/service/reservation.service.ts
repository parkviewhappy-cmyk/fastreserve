import type { Reservation } from '@/types/reservation'
import type { ReservationRepository } from '../repository/reservation.repository'
import { MockReservationRepository } from '../repository/reservation.repository.mock'

/**
 * Reservation Service.
 * Component는 이 Service만 호출하고, Repository 구현(Mock/LocalStorage/API)을 직접 알지 못한다.
 * Sprint 2 범위: 조회 기능만 제공한다. (CRUD는 이후 Sprint)
 */
export class ReservationService {
  constructor(
    private readonly repository: ReservationRepository = new MockReservationRepository()
  ) {}

  /** 등록일 기준 최신순으로 예약 목록을 조회한다. */
  getReservations(): Reservation[] {
    return this.repository
      .getAll()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  getReservationById(id: string): Reservation | undefined {
    return this.repository.getById(id)
  }
}

/** 기본 Service 인스턴스. 현재는 Mock Repository를 사용한다. */
export const reservationService = new ReservationService()
