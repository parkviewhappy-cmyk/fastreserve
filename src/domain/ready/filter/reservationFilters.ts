import type { Reservation } from '@/types/reservation'
import { getTodayDateString } from '@/utils/time'
import { ReadyStatus } from '../types'
import { calculateReadyStatus } from '../calculator/reservationStatusCalculator'

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
  now: Date = new Date()
): Reservation[] {
  return reservations.filter((reservation) => {
    const status = calculateReadyStatus(reservation, now)
    return (
      status === ReadyStatus.Waiting ||
      status === ReadyStatus.Preparing ||
      status === ReadyStatus.Ready
    )
  })
}

/** Ready Reservation Filter: 오픈이 임박(Ready)한 예약만 반환한다. */
export function filterReadyReservations(
  reservations: Reservation[],
  now: Date = new Date()
): Reservation[] {
  return reservations.filter(
    (reservation) =>
      calculateReadyStatus(reservation, now) === ReadyStatus.Ready
  )
}

/** Completed Reservation Filter: 오픈 시간이 지나 완료된 예약만 반환한다. */
export function filterCompletedReservations(
  reservations: Reservation[],
  now: Date = new Date()
): Reservation[] {
  return reservations.filter(
    (reservation) =>
      calculateReadyStatus(reservation, now) === ReadyStatus.Completed
  )
}

/** Failed Reservation Filter: 실패로 표시된 예약만 반환한다. */
export function filterFailedReservations(
  reservations: Reservation[],
  now: Date = new Date()
): Reservation[] {
  return reservations.filter(
    (reservation) =>
      calculateReadyStatus(reservation, now) === ReadyStatus.Failed
  )
}
