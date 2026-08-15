import type { SiteType } from '@/types/reservation'
import type { ExecutionContext, ExecutionResult } from '@/domain/execution/types'
import type { SiteCapability, PluginVersion } from './types'

/**
 * Plugin Interface.
 * 모든 사이트는 이 Interface를 동일하게 구현한다.
 * Execution Engine은 Plugin Factory를 통해 얻은 이 Interface만 사용하며,
 * 사이트별 구현 세부사항(Session/Reservation URL/Site 연결)은 알지 못한다.
 *
 * PM Review 반영(Sprint 7): Plugin과 Adapter의 책임을 분리한다.
 * - Plugin: Version / Capability / Enable 여부를 관리한다.
 * - Adapter(domain/adapter): Session / Reservation URL / Site 연결을 담당한다.
 * Execution Engine -> Plugin -> Adapter 구조를 유지한다. Plugin은 내부적으로
 * Adapter(SiteAdapter)를 감싸 실제 사이트 동작(prepare/checkSession/openReservation/
 * execute/healthCheck/cancel)을 위임하고, 그 위에 Version/Capability/Enable 정보를 더한다.
 */
export interface Plugin {
  getSite(): SiteType
  getVersion(): PluginVersion
  getCapabilities(): SiteCapability[]
  /** 이 Plugin이 현재 사용 가능한 상태인지 확인한다. */
  isEnabled(): boolean

  /** 실행 준비. Adapter에 위임한다. */
  prepare(context: ExecutionContext): void

  /** Session(로그인) 상태 확인. Adapter에 위임한다. */
  checkSession(context: ExecutionContext): boolean

  /** 예약 페이지 진입. Adapter에 위임한다. */
  openReservation(context: ExecutionContext): void

  /** 예약 실행. Adapter에 위임하고 ExecutionResult를 반환한다. */
  execute(context: ExecutionContext): ExecutionResult

  /** 사이트/Plugin 상태 확인. Adapter에 위임한다. */
  healthCheck(): boolean

  /** 실행 취소. Adapter에 위임한다. */
  cancel(context: ExecutionContext): void
}
