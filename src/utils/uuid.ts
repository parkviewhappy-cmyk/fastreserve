/**
 * UUID v4 형식의 ID를 생성한다.
 * Sprint 2 범위: Mock 데이터의 ID는 고정값을 사용하며, 이 유틸은
 * 이후 Sprint(예약 CRUD)에서 신규 예약 생성 시 사용할 목적으로 미리 준비한다.
 */
export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  // crypto.randomUUID 미지원 환경을 위한 폴백
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
