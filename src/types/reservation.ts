/**
 * Reservation 도메인 타입 정의.
 * 참고: docs/PRD.md - 7. 데이터 모델 > Reservation (Sprint 2 범위 확장 반영)
 * PM Review 반영: ReservationStatus/SiteType Enum화, ID UUID 형식, 날짜 ISO 8601 통일
 */

/** 예약 대상 사이트. 현재는 인터파크만 지원하며, 이후 확장을 대비해 Enum으로 정의한다. */
export enum SiteType {
  Interpark = 'interpark',
}

/**
 * 예약 상태.
 * 참고: docs/PRD.md - 8. 상태(State)
 * Idle -> Waiting -> Preparing -> Ready -> Completed, 오류 시 Failed
 */
export enum ReservationStatus {
  Idle = 'idle',
  Waiting = 'waiting',
  Preparing = 'preparing',
  Ready = 'ready',
  Completed = 'completed',
  Failed = 'failed',
}

/**
 * 예약 객체.
 * 참고: docs/PRD.md - Add Reservation 입력 항목 + Sprint 2 PM 지시사항
 *
 * 날짜/시간 형식 (ISO 8601):
 * - eventDate: YYYY-MM-DD
 * - eventTime: HH:mm
 * - openTime: YYYY-MM-DDTHH:mm:ss (대한민국 Local Time 기준, UTC 변환 없음. PM Review 반영)
 * - createdAt / updatedAt: YYYY-MM-DDTHH:mm:ssZ (시스템 생성 시각, UTC)
 */
export interface Reservation {
  /** UUID v4 형식 */
  id: string
  title: string
  site: SiteType
  eventName: string
  eventDate: string
  eventTime: string
  openTime: string
  url?: string
  preferredSeat?: string
  ticketCount: number
  memo?: string
  status: ReservationStatus
  createdAt: string
  updatedAt: string
}
