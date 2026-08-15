import type { Reservation } from '@/types/reservation'
import { ReservationStatus } from '@/types/reservation'
import { getTodayDateString } from '@/utils/time'
import { DEFAULT_READY_RULE, type ReadyRule } from '../rule/readyRule'
import { calculateReservationStatus } from '../calculator/reservationStatusCalculator'

/** Today Reservation Filter: 오늘(Local 기준) 공연일과 일치하는 예약만 반환한다. */
export function filterTodayReservations(
  reservations: Reservation[]
): Reservation[] {
  const today = getTodayDateString()
  return reservations.filter((reservation) => reservation.eventDate === today)
}

/** Upcoming Reservation Filter: 아직 오픈 전(Waiting/Preparing/Ready)인 예약만 반환한다. */
export function filterUpcomingReservations(
  reservations: Reservation[],
  now: Date = new Date(),
  rule: ReadyRule = DEFAULT_READY_RULE
): Reservation[] {
  return reservations.filter((reservation) => {
    const status = calculateReservationStatus(reservation, now, rule)
    return (
      status === ReservationStatus.Waiting ||
      status === ReservationStatus.Preparing ||
      status === ReservationStatus.Ready
    )
  })
}

/** Ready Reservation Filter: 오픈이 임박(Ready)한 예약만 반환한다. Running과는 구분한다. */
export function filterReadyReservations(
  reservations: Reservation[],
  now: Date = new Date(),
  rule: ReadyRule = DEFAULT_READY_RULE
): Reservation[] {
  return reservations.filter(
    (reservation) =>
      calculateReservationStatus(reservation, now, rule) ===
      ReservationStatus.Ready
  )
}

/** Completed Reservation Filter: 완료된 예약만 반환한다. */
export function filterCompletedReservations(
  reservations: Reservation[],
  now: Date = new Date(),
  rule: ReadyRule = DEFAULT_READY_RULE
): Reservation[] {
  return reservations.filter(
    (reservation) =>
      calculateReservationStatus(reservation, now, rule) ===
      ReservationStatus.Completed
  )
}

/** Failed Reservation Filter: 실패로 표시된 예약만 반환한다. */
export function filterFailedReservations(
  reservations: Reservation[],
  now: Date = new Date(),
  rule: ReadyRule = DEFAULT_READY_RULE
): Reservation[] {
  return reservations.filter(
    (reservation) =>
      calculateReservationStatus(reservation, now, rule) ===
      ReservationStatus.Failed
  )
}
