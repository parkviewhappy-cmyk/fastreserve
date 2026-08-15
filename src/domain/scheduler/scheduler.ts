import type { Reservation } from '@/types/reservation'
import { reservationManager, ReservationManager } from '@/domain/reservation'
import { readyEngine, ReadyEngine } from '@/domain/ready'
import {
  executionEngine,
  ExecutionEngine,
  DEFAULT_EXECUTION_RULE,
  type ExecutionQueueItem,
  type ExecutionRun,
  type ExecutionRule,
} from '@/domain/execution'
import { getNow } from '@/utils/time'

/**
 * Scheduler.
 * Reservation Manager -> Ready Engine -> Scheduler -> Execution Engine -> Plugin
 * 로 이어지는 파이프라인에서, Scheduler는 Reservation 조회 + Ready 판단까지만 담당하고
 * 실제 Execution Queue 생성/준비는 Execution Engine에 위임한다.
 *
 * PM 지시(Sprint 6): UI는 Execution Engine을 직접 호출하지 않는다. Simulation 화면 등
 * UI는 Scheduler(getExecutionQueue/simulateExecution)를 통해서만 Execution Engine에 접근한다.
 *
 * 이 클래스에는 setInterval 등 자동 실행 로직을 두지 않는다. 모든 메서드는 명시적으로
 * 호출해야만 동작한다.
 *
 * PM 지시(Sprint 10, Reservation Assistant 전환): "예약시간 도달 -> 자동 실행" 흐름을
 * 제거했다. 이제 흐름은 "예약시간 접근 -> 사용자 알림(Ready Screen 등에서 UI가 표시) ->
 * 예약 페이지 준비 확인"이며, 자동 클릭/자동 예약은 없다. simulateExecution()은
 * Execution Engine의 prepareExecution()(준비 완료 여부 확인)을 호출할 뿐, 실제 예약을
 * 실행하지 않는다.
 */
export class Scheduler {
  constructor(
    private readonly manager: ReservationManager = reservationManager,
    private readonly engine: ReadyEngine = readyEngine,
    private readonly execution: ExecutionEngine = executionEngine
  ) {}

  /** 현재시간 확인 */
  getCurrentTime(): Date {
    return getNow()
  }

  /** Reservation Scan: 전체 예약 목록을 조회한다. */
  scanReservations(): Reservation[] {
    return this.manager.list()
  }

  /** Ready Engine 호출: Ready 상태(오픈 임박)인 예약만 골라낸다. */
  evaluateReadyReservations(now: Date = this.getCurrentTime()): Reservation[] {
    return this.engine.getReadyReservations(now)
  }

  /**
   * Execution Queue 조회.
   * Execution Engine에 위임해 Priority(+ Site Priority) 정렬이 반영된 Queue를 반환한다.
   * UI는 Execution Engine을 직접 호출하지 않고 이 메서드를 통해서만 Queue를 조회한다.
   */
  getExecutionQueue(
    now: Date = this.getCurrentTime(),
    rule: ExecutionRule = DEFAULT_EXECUTION_RULE
  ): ExecutionQueueItem[] {
    return this.execution.buildQueue(this.scanReservations(), now, rule)
  }

  /**
   * Execution Queue 항목의 예약 준비 상태를 확인(Simulation)한다.
   * 실제 예약을 실행하지 않으며, Mock Plugin의 준비 결과와 Execution Timeline
   * (Queue 생성 -> Ready -> Execution Start -> Plugin 호출 -> Completed)을 반환한다.
   */
  simulateExecution(item: ExecutionQueueItem): ExecutionRun {
    return this.execution.prepareExecution(item)
  }
}

/** 기본 Scheduler 인스턴스. */
export const scheduler = new Scheduler()
