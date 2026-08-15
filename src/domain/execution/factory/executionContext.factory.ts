import type { Reservation } from '@/types/reservation'
import type { ExecutionContext } from '../types'

/** Reservation으로부터 ExecutionContext를 생성한다. Reservation 객체는 수정하지 않는다. */
export function createExecutionContext(
  reservation: Reservation,
  priority: number
): ExecutionContext {
  return {
    reservationId: reservation.id,
    site: reservation.site,
    reservationUrl: reservation.url,
    eventDate: reservation.eventDate,
    eventTime: reservation.eventTime,
    openTime: reservation.openTime,
    preferredSeat: reservation.preferredSeat,
    ticketCount: reservation.ticketCount,
    priority,
  }
}
