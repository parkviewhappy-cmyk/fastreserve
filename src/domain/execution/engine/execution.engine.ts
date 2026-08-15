import type { Reservation, SiteType } from '@/types/reservation'
import { ReservationStatus } from '@/types/reservation'
import { readyEngine, ReadyEngine } from '@/domain/ready'
import {
  siteAccountManager,
  SiteAccountManager,
} from '@/domain/siteAccount'
import {
  pluginFactory,
  PluginFactory,
  type Plugin,
} from '@/domain/plugin'
import { getNow } from '@/utils/time'
import type {
  ExecutionQueueItem,
  ExecutionRun,
  ExecutionTimelineEntry,
} from '../types'
import { ExecutionResult } from '../types'
import { DEFAULT_EXECUTION_RULE, type ExecutionRule } from '../rule/executionRule'
import { createExecutionContext } from '../factory/executionContext.factory'

/**
 * Execution Engine.
 * Sprint 6 범위: 실제 예약을 실행하지 않는다(Simulation Mode). 구조 완성이 목표다.
 *
 * 역할: Execution Queue 생성 / Priority 계산(Site Priority 포함) / Plugin 선택 /
 * ExecutionContext 전달 / 실행 결과 반환.
 *
 * 원칙:
 * - 어떤 사이트인지 알지 못한다. Plugin Interface를 통해서만 사이트와 상호작용한다.
 * - Plugin 선택은 Plugin Factory(PluginFactory)에만 위임한다. 구체 Plugin 클래스나
 *   등록 방식은 이 Engine에서 알지 못한다.
 * - Business Logic(Queue 정렬, Priority 계산, Plugin 선택)은 이 Engine에만 존재한다.
 * - Reservation Manager/Ready Engine/Site Account Manager는 그대로 사용하며 수정하지 않는다.
 * - Queue를 만드는 과정에서 Reservation을 수정하지 않는다(읽기 전용).
 *
 * PM Review 반영(Sprint 7): Site Adapter Factory 대신 Plugin Factory만 호출한다
 * ("Execution Engine은 Plugin Factory만 호출합니다").
 */
export class ExecutionEngine {
  constructor(
    private readonly engine: ReadyEngine = readyEngine,
    private readonly accountManager: SiteAccountManager = siteAccountManager,
    private readonly factory: PluginFactory = pluginFactory
  ) {}

  /** SiteType에 해당하는 Plugin을 Factory를 통해 선택한다. */
  selectPlugin(site: SiteType): Plugin | undefined {
    return this.factory.createPlugin(site)
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

    const queuedAt = now.toISOString()

    return sorted.map(({ reservation, status }, index) => ({
      context: createExecutionContext(reservation, index + 1),
      status,
      queuedAt,
    }))
  }

  /**
   * Execution Queue 항목을 Plugin에 전달해 실행한다(Simulation).
   * 실제 예약을 실행하지 않으며, Mock Plugin의 결과와 함께 Execution Timeline
   * (Queue 생성 -> Ready -> Execution Start -> Plugin 호출 -> Completed)을 반환한다.
   */
  execute(item: ExecutionQueueItem): ExecutionRun {
    const timeline: ExecutionTimelineEntry[] = [
      { step: 'QUEUED', at: item.queuedAt },
      { step: 'READY', at: item.queuedAt },
    ]

    const plugin = this.selectPlugin(item.context.site)
    if (!plugin) {
      timeline.push({ step: 'COMPLETED', at: getNow().toISOString() })
      return { result: ExecutionResult.Skipped, timeline }
    }

    timeline.push({ step: 'EXECUTION_START', at: getNow().toISOString() })
    plugin.prepare(item.context)
    const sessionReady = plugin.checkSession(item.context)
    if (!sessionReady) {
      timeline.push({ step: 'COMPLETED', at: getNow().toISOString() })
      return { result: ExecutionResult.Waiting, timeline }
    }

    timeline.push({ step: 'PLUGIN_CALLED', at: getNow().toISOString() })
    plugin.openReservation(item.context)
    const result = plugin.execute(item.context)
    timeline.push({ step: 'COMPLETED', at: getNow().toISOString() })

    return { result, timeline }
  }
}

/** 기본 Execution Engine 인스턴스. */
export const executionEngine = new ExecutionEngine()
