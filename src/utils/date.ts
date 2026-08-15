/**
 * <input type="datetime-local"> 값(YYYY-MM-DDTHH:mm)과 ISO 8601 UTC 문자열 간 변환 유틸.
 * Sprint 3 범위: MVP 단순화를 위해 datetime-local 입력값을 UTC로 간주하고 'Z'를 붙인다.
 * 실제 타임존 처리는 이후 Sprint에서 필요 시 보완한다.
 */

export function toIsoDateTime(localValue: string): string {
  return localValue ? `${localValue}:00Z` : ''
}

export function fromIsoDateTime(iso: string): string {
  return iso ? iso.slice(0, 16) : ''
}
