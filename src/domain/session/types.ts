import type { SiteType } from '@/types/reservation'

/**
 * Session 상태.
 * FastReserve는 아이디/비밀번호를 저장하지 않으며, 사이트별 로그인 Session "상태"만 관리한다.
 */
export enum SessionStatus {
  Unknown = 'UNKNOWN',
  Ready = 'READY',
  Expired = 'EXPIRED',
  LoginRequired = 'LOGIN_REQUIRED',
  Error = 'ERROR',
}

/**
 * Session 레코드.
 * siteAccountId 기준으로 1:1 매핑되며, 자격 증명(아이디/비밀번호)은 포함하지 않는다.
 * PM Review 반영(Sprint 5): Reservation/SiteAccount/ExecutionContext와 동일한 SiteType을 사용한다.
 */
export interface Session {
  siteAccountId: string
  site: SiteType
  status: SessionStatus
  /** 마지막 확인 시각 (ISO, Local Time) */
  checkedAt: string
  /** 세션 만료 예정 시각 (Mock). 알 수 없으면 null. */
  expiresAt: string | null
}
