/**
 * Reservation 도메인 타입 정의.
 * 참고: docs/PRD.md - 7. 데이터 모델 > Reservation (Sprint 2 범위 확장 반영)
 *
 * Sprint 2 범위: Type/Interface 정의만 포함한다.
 * 저장소 연동(LocalStorage/DB/API)은 이후 Sprint에서 구현한다.
 */

/** 예약 대상 사이트. 현재는 인터파크만 지원하며, 이후 확장을 대비해 union 타입으로 정의한다. */
export type ReservationSite = 'interpark'

/**
 * 예약 상태.
 * 참고: docs/PRD.md - 8. 상태(State)
 * Idle -> Waiting -> Preparing -> Ready -> Completed, 오류 시 Failed
 */
export type ReservationStatus =
  | 'idle'
  | 'waiting'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'failed'

/**
 * 예약 객체.
 * 참고: docs/PRD.md - Add Reservation 입력 항목 + Sprint 2 PM 지시사항
 */
export interface Reservation {
  id: string
  title: string
  site: ReservationSite
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
