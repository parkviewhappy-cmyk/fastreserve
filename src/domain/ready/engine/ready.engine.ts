import type { Reservation } from '@/types/reservation'
import { ReservationStatus } from '@/types/reservation'
import { reservationManager, ReservationManager } from '@/domain/reservation'
import type { DashboardSummary } from '../types'
import { DEFAULT_READY_RULE, type ReadyRule } from '../rule/readyRule'
import { calculateReservationStatus } from '../calculator/reservationStatusCalculator'
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
 * - 상태 체계는 ReservationStatus 하나만 사용한다(별도의 ReadyStatus를 두지 않는다).
 * - 시간 기준은 ReadyRule로만 판단하며 매직 넘버를 사용하지 않는다.
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
  getUpcomingReservations(
    now: Date = new Date(),
    rule: ReadyRule = DEFAULT_READY_RULE
  ): Reservation[] {
    return filterUpcomingReservations(this.list(), now, rule)
  }

  /** Ready Reservation Filter */
  getReadyReservations(
    now: Date = new Date(),
    rule: ReadyRule = DEFAULT_READY_RULE
  ): Reservation[] {
    return filterReadyReservations(this.list(), now, rule)
  }

  /** Completed Reservation Filter */
  getCompletedReservations(
    now: Date = new Date(),
    rule: ReadyRule = DEFAULT_READY_RULE
  ): Reservation[] {
    return filterCompletedReservations(this.list(), now, rule)
  }

  /** Failed Reservation Filter */
  getFailedReservations(
    now: Date = new Date(),
    rule: ReadyRule = DEFAULT_READY_RULE
  ): Reservation[] {
    return filterFailedReservations(this.list(), now, rule)
  }

  /** 개별 예약의 실시간 상태를 계산한다. Reservation 객체는 수정하지 않는다. */
  getReservationStatus(
    reservation: Reservation,
    now: Date = new Date(),
    rule: ReadyRule = DEFAULT_READY_RULE
  ): ReservationStatus {
    return calculateReservationStatus(reservation, now, rule)
  }

  /** Dashboard Summary를 계산한다. Ready와 Running은 합산하지 않고 별도로 집계한다. */
  getDashboardSummary(
    now: Date = new Date(),
    rule: ReadyRule = DEFAULT_READY_RULE
  ): DashboardSummary {
    const reservations = this.list()

    const summary: DashboardSummary = {
      totalReservation: reservations.length,
      todayReservation: filterTodayReservations(reservations).length,
      waitingReservation: 0,
      preparingReservation: 0,
      readyReservation: 0,
      runningReservation: 0,
      completedReservation: 0,
      failedReservation: 0,
    }

    for (const reservation of reservations) {
      const status = calculateReservationStatus(reservation, now, rule)
      switch (status) {
        case ReservationStatus.Waiting:
          summary.waitingReservation += 1
          break
        case ReservationStatus.Preparing:
          summary.preparingReservation += 1
          break
        case ReservationStatus.Ready:
          summary.readyReservation += 1
          break
        case ReservationStatus.Running:
          summary.runningReservation += 1
          break
        case ReservationStatus.Completed:
          summary.completedReservation += 1
          break
        case ReservationStatus.Failed:
          summary.failedReservation += 1
          break
        case ReservationStatus.Idle:
          break
      }
    }

    return summary
  }
}

/** 기본 Ready Engine 인스턴스. */
export const readyEngine = new ReadyEngine()
