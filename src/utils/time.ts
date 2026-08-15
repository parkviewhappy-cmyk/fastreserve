/**
 * 공통 Time Utility.
 * PM 지시(Sprint 4): 모든 계산은 Local Time 기준으로 수행한다.
 *
 * Reservation.openTime은 타임존 표기가 없는 'YYYY-MM-DDTHH:mm:ss' 형식으로 저장되어 있다.
 * JS Date 파싱 규칙상 타임존 표기가 없는 date-time 문자열은 Local Time으로 해석되므로,
 * 별도의 타임존 변환 없이 new Date(value)로 그대로 비교할 수 있다.
 */

/** 현재 시각(Local Time)을 반환한다. */
export function getNow(): Date {
  return new Date()
}

/** Date를 YYYY-MM-DD(Local) 문자열로 변환한다. */
export function toDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 오늘 날짜 문자열(YYYY-MM-DD, Local)을 반환한다. */
export function getTodayDateString(): string {
  return toDateString(getNow())
}

/** 타임존 표기가 없는 Local Time 문자열(YYYY-MM-DDTHH:mm:ss)을 Date로 변환한다. */
export function parseLocalDateTime(value: string): Date {
  return new Date(value)
}
