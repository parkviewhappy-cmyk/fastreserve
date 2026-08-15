import { SiteType } from '@/types/reservation'
import { ExecutionResult } from '@/domain/execution/types'
import type { ExecutionContext } from '@/domain/execution/types'
import { parseLocalDateTime, getNow } from '@/utils/time'
import type { SiteAdapter } from './siteAdapter'

/**
 * Interpark Mock Adapter.
 * 첫 번째 Site Adapter 구현체. 실제 Browser 제어/로그인/결제를 전혀 수행하지 않는
 * Mock 구현이며, Simulation Mode에서만 사용한다.
 *
 * 기능 범위(PM 지시, Sprint 6): Session 확인 / Reservation URL 확인 / ExecutionResult 반환.
 */
export class InterparkAdapter implements SiteAdapter {
  readonly site = SiteType.Interpark

  prepare(): void {
    // Mock: 실제 준비 동작 없음
  }

  /** Session 확인 (Mock). 실제 Session 검증은 향후 실 구현에서 처리한다. */
  checkSession(): boolean {
    return true
  }

  openReservationPage(): void {
    // Mock: 실제로 페이지를 열지 않는다.
  }

  /** Reservation URL 확인 + ExecutionResult 반환 (Mock). 실제 예약을 수행하지 않는다. */
  execute(context: ExecutionContext): ExecutionResult {
    if (!context.reservationUrl) {
      return ExecutionResult.Skipped
    }
    const openTime = parseLocalDateTime(context.openTime)
    const now = getNow()
    if (now.getTime() < openTime.getTime()) {
      return ExecutionResult.Waiting
    }
    return ExecutionResult.Success
  }

  healthCheck(): boolean {
    return true
  }

  cancel(): void {
    // Mock: 취소할 실제 실행이 없다.
  }
}
