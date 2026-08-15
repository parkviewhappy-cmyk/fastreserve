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
 *
 * PM Review 반영(Sprint 6): RETRY를 추가한다. Enum 값만 추가하며, 실제 재시도 로직은
 * 구현하지 않는다(ExecutionRule.retryCount/retryInterval과 마찬가지로 향후 사용 예정).
 */
export enum ExecutionResult {
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Waiting = 'WAITING',
  Running = 'RUNNING',
  Skipped = 'SKIPPED',
  Retry = 'RETRY',
}

/** Execution Queue의 개별 항목. Reservation의 현재 상태(Ready/Running)를 함께 담아 Running 상태를 유지한다. */
export interface ExecutionQueueItem {
  context: ExecutionContext
  status: ReservationStatus
  /**
   * Queue에 편입된 시각(ISO, UTC). Queue는 이미 Ready/Running 상태인 예약만 담기 때문에
   * "Queue 생성" 시각과 "Ready 확인" 시각을 동일 시점으로 기록한다.
   */
  queuedAt: string
}

/**
 * Execution Timeline의 단계.
 * PM 지시(Sprint 6 Review): Queue 생성 -> Ready -> Execution Start -> Adapter 호출 -> Completed
 * 순서를 시간과 함께 Simulation 화면에 표시한다.
 */
export type ExecutionTimelineStep =
  | 'QUEUED'
  | 'READY'
  | 'EXECUTION_START'
  | 'ADAPTER_CALLED'
  | 'COMPLETED'

/** Timeline의 개별 기록(단계 + 시각). */
export interface ExecutionTimelineEntry {
  step: ExecutionTimelineStep
  /** ISO(UTC) 시각. */
  at: string
}

/** Execution Engine이 실행(Simulation) 1회에 대해 반환하는 결과 + Timeline. */
export interface ExecutionRun {
  result: ExecutionResult
  timeline: ExecutionTimelineEntry[]
}
