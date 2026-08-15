import type { SiteType } from '@/types/reservation'
import type { ExecutionContext, ExecutionResult } from '@/domain/execution/types'
import type { SiteCapability, PluginVersion } from './types'

/**
 * Plugin Interface.
 * 모든 사이트는 이 Interface를 동일하게 구현한다.
 * Execution Engine은 Plugin Factory를 통해 얻은 이 Interface만 사용하며,
 * 사이트별 구현 세부사항은 알지 못한다.
 *
 * PM Review 반영(Sprint 7): Sprint 6의 Site Adapter Interface를 대체한다.
 * getVersion()/getCapabilities()를 추가해 Plugin 스스로 버전과 지원 기능을 알려준다.
 * openReservationPage()는 openReservation()으로 이름을 통일했다.
 */
export interface Plugin {
  getSite(): SiteType
  getVersion(): PluginVersion
  getCapabilities(): SiteCapability[]

  /** 실행 준비. */
  prepare(context: ExecutionContext): void

  /** Session(로그인) 상태 확인. */
  checkSession(context: ExecutionContext): boolean

  /** 예약 페이지 진입. */
  openReservation(context: ExecutionContext): void

  /** 예약 실행. ExecutionResult를 반환한다. */
  execute(context: ExecutionContext): ExecutionResult

  /** 사이트/Plugin 상태 확인. */
  healthCheck(): boolean

  /** 실행 취소. */
  cancel(context: ExecutionContext): void
}
