import type { SiteType } from '@/types/reservation'
import type { SessionStatus } from '@/domain/session'

/**
 * 사이트 계정 정보.
 * 아이디/비밀번호는 절대 저장하지 않으며, 로그인 Session "상태"만 관리한다.
 *
 * PM Review 반영(Sprint 5): 별도의 AccountSiteType을 두지 않고 Reservation과 동일한
 * SiteType(types/reservation.ts)을 그대로 사용한다.
 */
export interface SiteAccount {
  id: string
  site: SiteType
  displayName: string
  enabled: boolean
  isLoggedIn: boolean
  sessionStatus: SessionStatus
  /** 마지막으로 로그인 상태를 확인한 시각 (ISO, Local Time). 확인 전이면 null. */
  lastChecked: string | null
  /** 마지막으로 로그인에 성공한 시각 (ISO, Local Time). 없으면 null. */
  lastLogin: string | null
  /** 실행 우선순위. 낮을수록 우선순위가 높다. Execution Queue에서 향후 사용한다. */
  priority: number
  memo?: string
}
