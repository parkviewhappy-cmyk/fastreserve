/**
 * Reservation 도메인 타입 정의.
 * 참고: docs/PRD.md - 7. 데이터 모델 > Reservation (Sprint 2 범위 확장 반영)
 * PM Review 반영: ReservationStatus/SiteType Enum화, ID UUID 형식, 날짜 ISO 8601 통일
 */

/**
 * 예약 대상 사이트.
 * PM Review 반영(Sprint 5): Site Account/Session/ExecutionContext 등 프로젝트 전체가
 * 이 SiteType 하나만 공유해서 사용한다(별도의 AccountSiteType을 두지 않는다).
 * Reservation 자체의 MVP 범위는 여전히 Interpark만 지원한다(Interpark Only).
 */
export enum SiteType {
  Interpark = 'INTERPARK',
  TicketLink = 'TICKETLINK',
  Yes24 = 'YES24',
  JinAir = 'JINAIR',
  Custom = 'CUSTOM',
}

/**
 * 예약 상태.
 * 참고: docs/PRD.md - 8. 상태(State)
 * Idle -> Waiting -> Preparing -> Ready -> Running -> Completed, 오류 시 Failed
 *
 * PM Review 반영(Sprint 4): Running을 추가했다. 프로젝트의 상태 체계는
 * ReservationStatus 하나만 사용하며, Ready Engine이 계산하는 실시간 상태도
 * 이 Enum을 그대로 사용한다(별도의 ReadyStatus Enum을 두지 않는다).
 */
export enum ReservationStatus {
  Idle = 'idle',
  Waiting = 'waiting',
  Preparing = 'preparing',
  Ready = 'ready',
  Running = 'running',
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
