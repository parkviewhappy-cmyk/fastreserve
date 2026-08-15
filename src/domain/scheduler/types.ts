import type { SiteType } from '@/types/reservation'

/**
 * ExecutionContext.
 * 실제 예약 실행(자동 예매)에 필요한 정보를 담는 데이터 구조.
 * Sprint 5 범위: 구조만 생성한다. 이를 소비하는 Execution Engine은 아직 구현하지 않는다.
 */
export interface ExecutionContext {
  reservationId: string
  site: SiteType
  reservationUrl?: string
  openTime: string
  /** 낮을수록 우선순위가 높다 (1이 최우선). openTime 오름차순으로 부여한다. */
  priority: number
  preferredSeat?: string
  ticketCount: number
}
