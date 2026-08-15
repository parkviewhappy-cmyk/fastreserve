import type { Reservation } from '@/types/reservation'
import { reservationManager, ReservationManager } from '@/domain/reservation'
import { ReadyStatus, type DashboardSummary } from '../types'
import { calculateReadyStatus } from '../calculator/reservationStatusCalculator'
import {
  filterTodayReservations,
  filterUpcomingReservations,
  filterReadyReservations,
  filterCompletedReservations,
  filterFailedReservations,
} from '../filter/reservationFilters'

/**
 * Ready Engine.
 * Reservation Manager가 제공하는 목록을 기반으로 실시간 상태 계산, 필터링,
 * Dashboard Summary 생성을 담당하는 독립 Domain Engine이다.
 *
 * - Reservation Manager/Repository는 수정하지 않고 그대로 사용한다.
 * - Business Logic을 UI와 완전히 분리하기 위해 Component는 이 Engine만 호출한다.
 * - 향후 Scheduler, 인터파크 연동에서도 이 Engine을 재사용한다.
 */
export class ReadyEngine {
  constructor(
    private readonly manager: ReservationManager = reservationManager
  ) {}

  private list(): Reservation[] {
    return this.manager.list()
  }

  /** Today Reservation Filter */
  getTodayReservations(): Reservation[] {
    return filterTodayReservations(this.list())
  }

  /** Upcoming Reservation Filter */
  getUpcomingReservations(now: Date = new Date()): Reservation[] {
    return filterUpcomingReservations(this.list(), now)
  }

  /** Ready Reservation Filter */
  getReadyReservations(now: Date = new Date()): Reservation[] {
    return filterReadyReservations(this.list(), now)
  }

  /** Completed Reservation Filter */
  getCompletedReservations(now: Date = new Date()): Reservation[] {
    return filterCompletedReservations(this.list(), now)
  }

  /** Failed Reservation Filter */
  getFailedReservations(now: Date = new Date()): Reservation[] {
    return filterFailedReservations(this.list(), now)
  }

  /** 개별 예약의 실시간 Ready 상태를 계산한다. Reservation 객체는 수정하지 않는다. */
  getReadyStatus(reservation: Reservation, now: Date = new Date()): ReadyStatus {
    return calculateReadyStatus(reservation, now)
  }

  /**
   * Dashboard Summary를 계산한다.
   * 참고: Running 상태는 별도 필드가 없어 readyReservation에 합산했다. (PM 확인 필요)
   */
  getDashboardSummary(now: Date = new Date()): DashboardSummary {
    const reservations = this.list()

    const summary: DashboardSummary = {
      totalReservation: reservations.length,
      todayReservation: filterTodayReservations(reservations).length,
      waitingReservation: 0,
      preparingReservation: 0,
      readyReservation: 0,
      completedReservation: 0,
      failedReservation: 0,
    }

    for (const reservation of reservations) {
      const status = calculateReadyStatus(reservation, now)
      switch (status) {
        case ReadyStatus.Waiting:
          summary.waitingReservation += 1
          break
        case ReadyStatus.Preparing:
          summary.preparingReservation += 1
          break
        case ReadyStatus.Ready:
        case ReadyStatus.Running:
          summary.readyReservation += 1
          break
        case ReadyStatus.Completed:
          summary.completedReservation += 1
          break
        case ReadyStatus.Failed:
          summary.failedReservation += 1
          break
      }
    }

    return summary
  }
}

/** 기본 Ready Engine 인스턴스. */
export const readyEngine = new ReadyEngine()
