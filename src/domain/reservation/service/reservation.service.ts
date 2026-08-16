import type { Reservation } from '@/types/reservation'
import type { ReservationRepository } from '../repository/reservation.repository'
import { MockReservationRepository } from '../repository/reservation.repository.mock'

/**
 * Reservation Service.
 * Component는 이 Service만 호출하고, Repository 구현(Mock/LocalStorage/API)을 직접 알지 못한다.
 * Sprint 2 범위: 조회 기능만 제공한다. (CRUD는 이후 Sprint)
 *
 * BUG-003(docs/BUG_TRACKER.md, Sprint 13 발견 / PM Review 확정): Sprint 3에서 도입된
 * `ReservationManager`(LocalStorage 기반, CRUD 전체 지원)로 완전히 대체되어 앱의 어떤
 * 화면도 이 Service를 더 이상 사용하지 않는다. PM 결정: V1.0에서는 삭제하지 않고 유지하며,
 * V2.0 Architecture Cleanup에서 다시 검토한다. 새 코드에서는 이 Service 대신
 * `@/domain/reservation`의 `reservationManager`를 사용해야 한다.
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
