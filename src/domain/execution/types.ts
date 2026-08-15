import type { SiteType } from '@/types/reservation'
import type { ReservationStatus } from '@/types/reservation'

/**
 * ExecutionContext.
 * Execution Engine이 Plugin에 전달하는 실행 정보 단위.
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
 * Execution Engine의 준비 확인(prepareExecution) 결과로 반환되는 값.
 * ReservationStatus(예약 자체의 상태)와는 별개의 개념이다:
 * ExecutionResult는 "이번 준비 확인 시도"의 결과이고, ReservationStatus는 예약의 지속 상태다.
 *
 * PM Review 반영(Sprint 6): RETRY를 추가한다. Enum 값만 추가하며, 실제 재시도 로직은
 * 구현하지 않는다(ExecutionRule.retryCount/retryInterval과 마찬가지로 향후 사용 예정).
 *
 * PM 지시(Sprint 10, Reservation Assistant 전환): 이 Enum의 값 목록은 그대로 유지하되
 * 의미가 바뀐다. Execution Engine이 더 이상 실제 예약을 실행하지 않으므로:
 * - Success: 더 이상 "예약 성공"이 아니라 "예약 준비 완료"(로그인/Plugin/URL 확인 통과)를 의미한다.
 * - Failed/Retry: 실제 예약 시도 실패가 아니라, 향후 준비 확인 단계에서 사용할 수 있도록
 *   Enum 값만 유지한다(현재 prepareExecution()은 이 값을 반환하지 않는다).
 * - Waiting: 로그인/Session이 아직 준비되지 않은 상태.
 * - Skipped: Plugin 미설치 또는 예약 URL 미등록으로 준비 확인을 건너뛴 상태.
 * Enum 멤버를 추가/삭제하지 않고 문서(의미)만 갱신했다("새로운 Architecture 추가 금지" 원칙).
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
 * PM Review 반영(Sprint 7): Site Adapter -> Plugin 용어 통일에 맞춰 ADAPTER_CALLED를
 * PLUGIN_CALLED로 변경했다.
 */
export type ExecutionTimelineStep =
  | 'QUEUED'
  | 'READY'
  | 'EXECUTION_START'
  | 'PLUGIN_CALLED'
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
