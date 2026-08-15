/** Execution Queue 정렬 전략. */
export type QueueStrategy = 'FIFO' | 'PRIORITY'

/**
 * ExecutionRule.
 * Execution Engine의 동작 기준값을 매직 넘버 없이 정의한다.
 *
 * PM 지시(Sprint 6): 기본값만 정의한다. 실제 Retry 로직은 구현하지 않는다
 * (retryCount/retryInterval은 향후 재시도 기능을 위한 값 정의일 뿐이다).
 */
export interface ExecutionRule {
  /** Queue 정렬 전략. PRIORITY: openTime + Site Priority 기준 정렬. FIFO: 등록 순서 유지. */
  queueStrategy: QueueStrategy
  /** Site Account의 priority를 Queue 정렬에 반영할지 여부. */
  sitePriorityEnabled: boolean
  /** 재시도 횟수 기본값. Sprint 6에서는 값만 정의하고 사용하지 않는다. */
  retryCount: number
  /** 재시도 간격(ms) 기본값. Sprint 6에서는 값만 정의하고 사용하지 않는다. */
  retryInterval: number
}

export const DEFAULT_EXECUTION_RULE: ExecutionRule = {
  queueStrategy: 'PRIORITY',
  sitePriorityEnabled: true,
  retryCount: 0,
  retryInterval: 0,
}
