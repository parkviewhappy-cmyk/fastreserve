import type { SiteType } from '@/types/reservation'
import type { ReservationStatus } from '@/types/reservation'

/**
 * ExecutionContext.
 * Execution Engine이 Site Adapter에 전달하는 실행 정보 단위.
 *
 * PM Review 반영(Sprint 6): Sprint 5의 scheduler/types.ts ExecutionContext를 대체한다.
 * eventDate/eventTime을 추가하고, 소유 Domain을 execution으로 이동한다
 * (Scheduler는 이 타입을 그대로 import해서 사용한다).
 */
export interface ExecutionContext {
  reservationId: string
  site: SiteType
  reservationUrl?: string
  eventDate: string
  eventTime: string
  openTime: string
  preferredSeat?: string
  ticketCount: number
  /** 낮을수록 우선순위가 높다 (1이 최우선). */
  priority: number
}

/**
 * Site Adapter가 실행 시도 결과로 반환하는 값.
 * ReservationStatus(예약 자체의 상태)와는 별개의 개념이다:
 * ExecutionResult는 "이번 실행 시도"의 결과이고, ReservationStatus는 예약의 지속 상태다.
 */
export enum ExecutionResult {
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Waiting = 'WAITING',
  Running = 'RUNNING',
  Skipped = 'SKIPPED',
}

/** Execution Queue의 개별 항목. Reservation의 현재 상태(Ready/Running)를 함께 담아 Running 상태를 유지한다. */
export interface ExecutionQueueItem {
  context: ExecutionContext
  status: ReservationStatus
}
