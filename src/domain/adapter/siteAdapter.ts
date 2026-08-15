import type { SiteType } from '@/types/reservation'
import type { ExecutionContext, ExecutionResult } from '@/domain/execution/types'
import type { SiteCapability } from './types'

/**
 * Site Adapter Interface.
 * 모든 예약 사이트는 이 Interface를 동일하게 구현한다.
 * Execution Engine은 이 Interface만 알고, 사이트별 구현 세부사항은 알지 못한다.
 *
 * PM 지시(Sprint 6): 실제 Browser 제어는 하지 않는다. Sprint 6의 모든 구현체는 Mock이다.
 * PM Review 반영: 사이트가 특정 기능(SiteCapability)을 지원하는지 확인하는 supports()를 추가한다.
 */
export interface SiteAdapter {
  readonly site: SiteType

  /** 실행 준비. */
  prepare(context: ExecutionContext): void

  /** Session(로그인) 상태 확인. */
  checkSession(context: ExecutionContext): boolean

  /** 예약 페이지 진입. */
  openReservationPage(context: ExecutionContext): void

  /** 예약 실행. ExecutionResult를 반환한다. */
  execute(context: ExecutionContext): ExecutionResult

  /** 사이트/Adapter 상태 확인. */
  healthCheck(): boolean

  /** 실행 취소. */
  cancel(context: ExecutionContext): void

  /** 이 사이트가 특정 기능(SiteCapability)을 지원하는지 확인한다. */
  supports(feature: SiteCapability): boolean
}
