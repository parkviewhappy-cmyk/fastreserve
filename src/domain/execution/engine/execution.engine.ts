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
 * ExecutionContext 전달 / 준비 완료 상태 반환.
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
 *
 * PM 지시(Sprint 10, Reservation Assistant 전환): execute()를 prepareExecution()으로
 * 이름과 역할을 변경한다. 더 이상 Plugin.execute()(실제 예약 시도)를 호출하지 않으며,
 * "예약 준비 완료" 상태까지만 확인한다. 사람 대신 예약을 진행하지 않는다 - 최종 예약
 * 페이지 진입/예매 시작은 항상 사용자의 수동 클릭([예약 페이지 열기])으로만 이루어진다.
 * ExecutionResult.Success는 이제 "예약 성공"이 아니라 "예약 준비 완료"를 의미한다.
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
   * Execution Queue 항목의 "예약 준비"를 수행한다(Preparation/Simulation 전용).
   *
   * PM 지시(Sprint 10): 자동으로 예약을 실행하지 않는다. Plugin.execute()(실제 예약 시도)는
   * 호출하지 않으며, prepare/checkSession/openReservation(페이지 진입 준비)까지만 수행해
   * "예약 준비 완료" 여부를 판단한다. 사람 대신 예약을 진행하는 동작은 없다 - 실제 예약
   * 페이지 진입은 사용자가 [예약 페이지 열기] 버튼을 직접 눌러야만 이루어진다.
   *
   * 반환값(ExecutionResult) 의미:
   * - Success: 준비 완료(Plugin 사용 가능 + Session 정상 + 예약 URL 확인됨)
   * - Waiting: Session이 아직 준비되지 않음(로그인 필요 등)
   * - Skipped: Plugin이 없거나 예약 URL이 없어 준비할 수 없음
   */
  prepareExecution(item: ExecutionQueueItem): ExecutionRun {
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

    if (!item.context.reservationUrl) {
      timeline.push({ step: 'COMPLETED', at: getNow().toISOString() })
      return { result: ExecutionResult.Skipped, timeline }
    }

    timeline.push({ step: 'PLUGIN_CALLED', at: getNow().toISOString() })
    // 실제 예약 시도(Plugin.execute)는 호출하지 않는다. 페이지 진입 준비만 확인한다.
    plugin.openReservation(item.context)
    timeline.push({ step: 'COMPLETED', at: getNow().toISOString() })

    return { result: ExecutionResult.Success, timeline }
  }
}

/** 기본 Execution Engine 인스턴스. */
export const executionEngine = new ExecutionEngine()
