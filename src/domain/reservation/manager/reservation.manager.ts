import type { Reservation } from '@/types/reservation'
import { ReservationStatus } from '@/types/reservation'
import type { ReservationRepository } from '../repository/reservation.repository'
import { LocalStorageReservationRepository } from '../repository/reservation.repository.localStorage'
import {
  validateReservation,
  isDuplicateReservation,
  type ReservationDraft,
} from '../validator/reservation.validator'
import { generateUuid } from '@/utils/uuid'

export interface ReservationMutationResult {
  success: boolean
  reservation?: Reservation
  errors: string[]
}

/**
 * Reservation Manager.
 * 여러 개의 예약(Reservation[])을 다루는 단일 진입점(entry point)이다.
 * Component는 Repository/Validator를 직접 호출하지 않고 이 Manager만 사용한다.
 * 이후 Sprint의 Scheduler, 인터파크 연동 등은 이 Manager를 중심으로 확장한다.
 *
 * Sprint 3 범위: LocalStorage Repository를 기본으로 사용한다.
 */
export class ReservationManager {
  constructor(
    private readonly repository: ReservationRepository = new LocalStorageReservationRepository()
  ) {}

  /** 등록일 기준 최신순으로 예약 목록(Array)을 조회한다. */
  list(): Reservation[] {
    return this.repository
      .getAll()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  getById(id: string): Reservation | undefined {
    return this.repository.getById(id)
  }

  /** 새 예약을 검증 후 등록한다. */
  create(draft: ReservationDraft): ReservationMutationResult {
    const validation = validateReservation(draft)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }
    if (isDuplicateReservation(draft, this.list())) {
      return {
        success: false,
        errors: ['이미 등록된 동일한 공연 예약이 있습니다.'],
      }
    }

    const now = new Date().toISOString()
    const reservation: Reservation = {
      ...draft,
      id: generateUuid(),
      status: ReservationStatus.Waiting,
      createdAt: now,
      updatedAt: now,
    }
    this.repository.save(reservation)
    return { success: true, reservation, errors: [] }
  }

  /** 기존 예약을 검증 후 수정한다. */
  update(id: string, draft: ReservationDraft): ReservationMutationResult {
    const validation = validateReservation(draft)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const others = this.list().filter((reservation) => reservation.id !== id)
    if (isDuplicateReservation(draft, others)) {
      return {
        success: false,
        errors: ['이미 등록된 동일한 공연 예약이 있습니다.'],
      }
    }

    const updated = this.repository.update(id, {
      ...draft,
      updatedAt: new Date().toISOString(),
    })
    if (!updated) {
      return { success: false, errors: ['예약을 찾을 수 없습니다.'] }
    }
    return { success: true, reservation: updated, errors: [] }
  }

  /** 예약을 삭제한다. */
  remove(id: string): boolean {
    return this.repository.delete(id)
  }
}

/** 기본 Manager 인스턴스. LocalStorage Repository를 사용한다. */
export const reservationManager = new ReservationManager()
