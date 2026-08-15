import type { Reservation } from '@/types/reservation'
import { ReservationStatus } from '@/types/reservation'
import { parseLocalDateTime } from '@/utils/time'
import { ReadyStatus } from '../types'

/**
 * Ready 상태 계산 시 사용하는 시간 기준(ms).
 * PM 지시에 정확한 수치가 명시되지 않아 합리적인 기본값을 사용했다. (PM 확인 필요)
 */
export const PREPARING_BEFORE_OPEN_MS = 24 * 60 * 60 * 1000 // 오픈 24시간 전부터 Preparing
export const READY_BEFORE_OPEN_MS = 10 * 60 * 1000 // 오픈 10분 전부터 Ready
export const RUNNING_AFTER_OPEN_MS = 10 * 60 * 1000 // 오픈 후 10분간 Running

/**
 * Reservation Status Calculator.
 * 현재 시간과 Reservation.openTime을 비교해 실시간 Ready 상태를 계산하는 순수 함수.
 * Reservation 객체는 읽기만 하며 절대 수정하지 않는다.
 *
 * 규칙:
 * - Reservation.status가 이미 Failed이면 그대로 Failed를 반환한다(수동/외부 판정을 존중).
 * - 오픈(openTime) 24시간 이전: Waiting
 * - 오픈 24시간 전 ~ 10분 전: Preparing
 * - 오픈 10분 전 ~ 오픈 시각: Ready
 * - 오픈 시각 ~ 오픈 후 10분: Running
 * - 오픈 10분 이후: Completed
 */
export function calculateReadyStatus(
  reservation: Reservation,
  now: Date = new Date()
): ReadyStatus {
  if (reservation.status === ReservationStatus.Failed) {
    return ReadyStatus.Failed
  }

  const openTime = parseLocalDateTime(reservation.openTime)
  const diffMs = openTime.getTime() - now.getTime()

  if (diffMs > PREPARING_BEFORE_OPEN_MS) {
    return ReadyStatus.Waiting
  }
  if (diffMs > READY_BEFORE_OPEN_MS) {
    return ReadyStatus.Preparing
  }
  if (diffMs > 0) {
    return ReadyStatus.Ready
  }
  if (Math.abs(diffMs) <= RUNNING_AFTER_OPEN_MS) {
    return ReadyStatus.Running
  }
  return ReadyStatus.Completed
}
