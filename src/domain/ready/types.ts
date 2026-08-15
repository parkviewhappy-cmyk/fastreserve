import type { Reservation } from '@/types/reservation'

/**
 * Ready Engine이 계산하는 실시간 상태.
 *
 * 설계 노트(PM 확인 필요): Reservation.status(types/reservation.ts의 ReservationStatus)는
 * Manager가 관리하는 영속 상태이며, Sprint 4 원칙 "Reservation 객체를 직접 수정하지 않는다"에 따라
 * 이 Enum을 확장하는 대신 별도의 ReadyStatus를 ready 도메인에 새로 정의했다.
 * Running은 ReservationStatus에는 없는, Ready Engine에서만 사용하는 계산값이다.
 */
export enum ReadyStatus {
  Waiting = 'waiting',
  Preparing = 'preparing',
  Ready = 'ready',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

/**
 * Ready Engine의 Dashboard 요약 정보.
 * 참고: Running 상태는 PM이 제공한 필드 목록에 별도 항목이 없어 readyReservation에 포함했다. (PM 확인 필요)
 */
export interface DashboardSummary {
  totalReservation: number
  todayReservation: number
  waitingReservation: number
  preparingReservation: number
  readyReservation: number
  completedReservation: number
  failedReservation: number
}

/** Reservation과 계산된 Ready 상태를 함께 담는 헬퍼 타입. */
export interface ReservationWithReadyStatus {
  reservation: Reservation
  readyStatus: ReadyStatus
}
