import type { Reservation } from '@/types/reservation'

/**
 * Reservation Validation.
 * 참고: docs/PRD.md - 14. 예외 처리 (입력값 누락, 예약 시간 오류, URL 없음, 중복 예약)
 *
 * Sprint 2 범위: 순수 검증 함수만 제공한다. 실제 폼 연동은 이후 Sprint(예약 CRUD)에서 진행한다.
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^\d{2}:\d{2}$/
/** ISO 8601 datetime (예: 2026-09-01T20:00:00Z) */
const ISO_DATETIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/

export type ReservationDraft = Omit<
  Reservation,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>

/** 예약 입력값의 필수값/형식을 검증한다. */
export function validateReservation(
  draft: ReservationDraft
): ValidationResult {
  const errors: string[] = []

  if (!draft.title?.trim()) {
    errors.push('예약명을 입력해주세요.')
  }

  if (!draft.eventName?.trim()) {
    errors.push('공연명을 입력해주세요.')
  }

  if (!draft.eventDate?.trim()) {
    errors.push('공연 날짜를 입력해주세요.')
  } else if (!DATE_PATTERN.test(draft.eventDate)) {
    errors.push('공연 날짜 형식이 올바르지 않습니다. (ISO 8601, 예: 2026-10-10)')
  }

  if (!draft.eventTime?.trim()) {
    errors.push('공연 시간을 입력해주세요.')
  } else if (!TIME_PATTERN.test(draft.eventTime)) {
    errors.push('공연 시간 형식이 올바르지 않습니다. (예: 19:00)')
  }

  if (!draft.openTime?.trim()) {
    errors.push('예약 시작 시간을 입력해주세요.')
  } else if (!ISO_DATETIME_PATTERN.test(draft.openTime)) {
    errors.push(
      '예약 시작 시간 형식이 올바르지 않습니다. (ISO 8601, 예: 2026-09-01T20:00:00Z)'
    )
  }

  if (!draft.ticketCount || draft.ticketCount < 1) {
    errors.push('예매 인원은 1명 이상이어야 합니다.')
  }

  if (draft.url && !isValidUrl(draft.url)) {
    errors.push('공연 URL 형식이 올바르지 않습니다.')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/** 동일한 공연명/공연일/공연시간의 예약이 이미 존재하는지 검사한다. */
export function isDuplicateReservation(
  draft: ReservationDraft,
  existing: Reservation[]
): boolean {
  return existing.some(
    (reservation) =>
      reservation.eventName === draft.eventName &&
      reservation.eventDate === draft.eventDate &&
      reservation.eventTime === draft.eventTime
  )
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
