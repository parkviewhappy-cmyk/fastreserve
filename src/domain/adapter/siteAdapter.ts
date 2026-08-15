import type { SiteType } from '@/types/reservation'
import type { ExecutionContext, ExecutionResult } from '@/domain/execution/types'

/**
 * Site Adapter Interface.
 * 사이트와의 실제 연결을 담당한다: Session 확인, Reservation URL 처리, Site 연결/실행.
 * Plugin이 이 Interface를 감싸서 사용하며, Execution Engine은 Adapter를 직접 호출하지
 * 않는다(Execution Engine -> Plugin -> Adapter).
 *
 * PM Review 반영(Sprint 7): Version/Capability/Enable 여부는 Plugin의 책임이므로
 * Adapter에서는 다루지 않는다(supports()/SiteCapability를 Plugin으로 이전).
 * PM 지시(Sprint 6): 실제 Browser 제어는 하지 않는다. Sprint 6의 모든 구현체는 Mock이다.
 */
export interface SiteAdapter {
  readonly site: SiteType

  /** 실행 준비(Site 연결). */
  prepare(context: ExecutionContext): void

  /** Session(로그인) 상태 확인. */
  checkSession(context: ExecutionContext): boolean

  /** Reservation URL을 이용해 예약 페이지로 진입한다. */
  openReservationPage(context: ExecutionContext): void

  /** 예약 실행. ExecutionResult를 반환한다. */
  execute(context: ExecutionContext): ExecutionResult

  /** 사이트/Adapter 상태 확인. */
  healthCheck(): boolean

  /** 실행 취소. */
  cancel(context: ExecutionContext): void
}
