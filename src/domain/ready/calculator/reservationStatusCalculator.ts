import type { Reservation } from '@/types/reservation'
import { ReservationStatus } from '@/types/reservation'
import { parseLocalDateTime } from '@/utils/time'
import { DEFAULT_READY_RULE, type ReadyRule } from '../rule/readyRule'

const MINUTE_MS = 60 * 1000

/**
 * Reservation Status Calculator.
 * 현재 시간과 Reservation.openTime을 ReadyRule에 따라 비교해 실시간 상태를 계산하는 순수 함수.
 * Reservation 객체는 읽기만 하며 절대 수정하지 않는다.
 *
 * PM Review 반영(Sprint 4): 별도의 ReadyStatus 대신 ReservationStatus를 그대로 반환한다.
 * 시간 기준은 ReadyRule로만 판단하며 코드에 매직 넘버를 두지 않는다.
 *
 * 규칙:
 * - Reservation.status가 이미 Completed/Failed이면 그대로 반환한다(수동/외부 판정을 존중).
 * - 그 외의 경우, ReadyRule의 임계값(분)에 따라 Waiting/Preparing/Ready/Running을 계산한다.
 */
export function calculateReservationStatus(
  reservation: Reservation,
  now: Date = new Date(),
  rule: ReadyRule = DEFAULT_READY_RULE
): ReservationStatus {
  if (
    reservation.status === ReservationStatus.Completed ||
    reservation.status === ReservationStatus.Failed
  ) {
    return reservation.status
  }

  const openTime = parseLocalDateTime(reservation.openTime)
  const diffMinutes = (openTime.getTime() - now.getTime()) / MINUTE_MS

  if (diffMinutes > rule.preparingThresholdMinutes) {
    return ReservationStatus.Waiting
  }
  if (diffMinutes > rule.readyThresholdMinutes) {
    return ReservationStatus.Preparing
  }
  if (diffMinutes > rule.runningThresholdMinutes) {
    return ReservationStatus.Ready
  }
  return ReservationStatus.Running
}
