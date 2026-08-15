/**
 * <input type="datetime-local"> 값(YYYY-MM-DDTHH:mm)과 ISO 8601 문자열 간 변환 유틸.
 *
 * PM Review 반영: FastReserve MVP는 대한민국(KST) 사용자를 대상으로 하므로
 * 예약 시작시간(openTime)은 사용자가 입력한 Local Time을 그대로 저장한다.
 * UTC 변환은 하지 않는다. (예: 입력 2026-09-01 20:00 -> 저장 2026-09-01T20:00:00)
 * 해외 사이트 지원 시(향후) 별도의 타임존 설계를 진행한다.
 */

export function toIsoDateTime(localValue: string): string {
  return localValue ? `${localValue}:00` : ''
}

export function fromIsoDateTime(iso: string): string {
  return iso ? iso.slice(0, 16) : ''
}
