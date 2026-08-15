import type { Reservation, SiteType } from '@/types/reservation'
import { ReservationStatus } from '@/types/reservation'
import { readyEngine, ReadyEngine } from '@/domain/ready'
import {
  siteAccountManager,
  SiteAccountManager,
} from '@/domain/siteAccount'
import { getSiteAdapter, type SiteAdapter } from '@/domain/adapter'
import { getNow } from '@/utils/time'
import type { ExecutionContext, ExecutionQueueItem } from '../types'
import { ExecutionResult } from '../types'
import { DEFAULT_EXECUTION_RULE, type ExecutionRule } from '../rule/executionRule'
import { createExecutionContext } from '../factory/executionContext.factory'

/**
 * Execution Engine.
 * Sprint 6 범위: 실제 예약을 실행하지 않는다(Simulation Mode). 구조 완성이 목표다.
 *
 * 역할: Execution Queue 생성 / Priority 계산(Site Priority 포함) / Site Adapter 선택 /
 * ExecutionContext 전달 / 실행 결과 반환.
 *
 * 원칙:
 * - 어떤 사이트인지 알지 못한다. Site Adapter Interface를 통해서만 사이트와 상호작용한다.
 * - Business Logic(Queue 정렬, Priority 계산, Adapter 선택)은 이 Engine에만 존재한다.
 * - Reservation Manager/Ready Engine/Site Account Manager는 그대로 사용하며 수정하지 않는다.
 * - Queue를 만드는 과정에서 Reservation을 수정하지 않는다(읽기 전용).
 */
export class ExecutionEngine {
  constructor(
    private readonly engine: ReadyEngine = readyEngine,
    private readonly accountManager: SiteAccountManager = siteAccountManager,
    private readonly adapterResolver: (site: SiteType) => SiteAdapter | undefined = getSiteAdapter
  ) {}

  /** SiteType에 해당하는 Site Adapter를 선택한다. */
  selectAdapter(site: SiteType): SiteAdapter | undefined {
    return this.adapterResolver(site)
  }

  /** SiteAccount.priority를 조회한다. 등록되지 않은 사이트는 최저 우선순위로 취급한다. */
  private getSitePriority(site: SiteType): number {
    const account = this.accountManager
      .list()
      .find((candidate) => candidate.site === site)
    return account?.priority ?? Number.MAX_SAFE_INTEGER
  }

  /**
   * Execution Queue 생성.
   * Ready 또는 Running 상태(Running 상태 유지)인 예약만 대상으로 하며,
   * openTime 오름차순 정렬 후 동일 시간이면 Site Priority로 tie-break한다.
   * Reservation은 수정하지 않는다.
   */
  buildQueue(
    reservations: Reservation[],
    now: Date = getNow(),
    rule: ExecutionRule = DEFAULT_EXECUTION_RULE
  ): ExecutionQueueItem[] {
    const actionable = reservations
      .map((reservation) => ({
        reservation,
        status: this.engine.getReservationStatus(reservation, now),
      }))
      .filter(
        ({ status }) =>
          status === ReservationStatus.Ready ||
          status === ReservationStatus.Running
      )

    const sorted = [...actionable].sort((a, b) => {
      if (rule.queueStrategy === 'FIFO') {
        return a.reservation.createdAt.localeCompare(b.reservation.createdAt)
      }

      const timeCompare = a.reservation.openTime.localeCompare(
        b.reservation.openTime
      )
      if (timeCompare !== 0) {
        return timeCompare
      }

      if (rule.sitePriorityEnabled) {
        const priorityCompare =
          this.getSitePriority(a.reservation.site) -
          this.getSitePriority(b.reservation.site)
        if (priorityCompare !== 0) {
          return priorityCompare
        }
      }

      return 0
    })

    return sorted.map(({ reservation, status }, index) => ({
      context: createExecutionContext(reservation, index + 1),
      status,
    }))
  }

  /**
   * ExecutionContext를 Site Adapter에 전달해 실행한다(Simulation).
   * 실제 예약을 실행하지 않으며, Mock Adapter의 결과를 그대로 반환한다.
   */
  execute(context: ExecutionContext): ExecutionResult {
    const adapter = this.selectAdapter(context.site)
    if (!adapter) {
      return ExecutionResult.Skipped
    }

    adapter.prepare(context)
    const sessionReady = adapter.checkSession(context)
    if (!sessionReady) {
      return ExecutionResult.Waiting
    }

    adapter.openReservationPage(context)
    return adapter.execute(context)
  }
}

/** 기본 Execution Engine 인스턴스. */
export const executionEngine = new ExecutionEngine()
