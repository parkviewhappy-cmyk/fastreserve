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
/**
 * 예약 시작 시간(openTime) 형식.
 * PM Review 반영: 대한민국(KST) Local Time을 그대로 저장하며 UTC 변환하지 않는다.
 * 따라서 타임존 표기(Z, +09:00 등)는 허용하지 않는다. (예: 2026-09-01T20:00:00)
 */
const LOCAL_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/

/**
 * Interpark 예약 URL 패턴.
 * PM 지시(Sprint 8): 예약 URL은 인터파크 URL인지 정규식 기반으로 확인한다.
 * PM 지시(Sprint 9): 검증을 강화한다. interpark.com 도메인 전체가 아니라
 * 실제 예약(티켓) 도메인인 tickets.interpark.com(및 그 하위 도메인, 예: m.tickets.interpark.com)
 * 만 허용한다. shop.interpark.com/tour.interpark.com/book.interpark.com 등
 * 다른 interpark.com 하위 서비스 도메인은 실패 처리한다.
 * 이번 MVP는 Interpark 하나만 지원한다(TicketLink/YES24/JinAir 구현 안 함).
 * 허용 예) https://tickets.interpark.com/... , https://m.tickets.interpark.com/...
 * 실패 예) https://shop.interpark.com/... , https://tour.interpark.com/...
 */
const INTERPARK_URL_PATTERN =
  /^https:\/\/([a-z0-9-]+\.)*tickets\.interpark\.com(\/|$)/i

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
  } else if (!LOCAL_DATETIME_PATTERN.test(draft.openTime)) {
    errors.push(
      '예약 시작 시간 형식이 올바르지 않습니다. (예: 2026-09-01T20:00:00, 대한민국 Local Time 기준)'
    )
  }

  if (!draft.ticketCount || draft.ticketCount < 1) {
    errors.push('예매 인원은 1명 이상이어야 합니다.')
  }

  if (draft.url) {
    if (!isValidUrl(draft.url)) {
      errors.push('공연 URL 형식이 올바르지 않습니다.')
    } else if (!INTERPARK_URL_PATTERN.test(draft.url)) {
      errors.push(
        '인터파크 예약 페이지(tickets.interpark.com) URL만 등록할 수 있습니다. (예: https://tickets.interpark.com/...)'
      )
    }
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
