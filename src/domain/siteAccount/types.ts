import type { SessionStatus } from '@/domain/session'

/**
 * 사이트 계정 관리용 사이트 종류.
 * 참고: Reservation 도메인의 SiteType(types/reservation.ts, 현재 Interpark만 지원)과는
 * 별개의 목록이다. Site Account는 "관리 대상 사이트 카탈로그"이고, Reservation.site는
 * "실제 예약이 걸려 있는 사이트"로 의미가 다르며, 이번 Sprint에서 Reservation 쪽은
 * 변경하지 않는다. 이름 충돌을 피하기 위해 AccountSiteType으로 명명했다. (PM 확인 필요)
 */
export enum AccountSiteType {
  Interpark = 'INTERPARK',
  TicketLink = 'TICKETLINK',
  Yes24 = 'YES24',
  JinAir = 'JINAIR',
  Custom = 'CUSTOM',
}

/**
 * 사이트 계정 정보.
 * 아이디/비밀번호는 절대 저장하지 않으며, 로그인 Session "상태"만 관리한다.
 */
export interface SiteAccount {
  id: string
  site: AccountSiteType
  displayName: string
  enabled: boolean
  isLoggedIn: boolean
  sessionStatus: SessionStatus
  /** 마지막으로 로그인 상태를 확인한 시각 (ISO, Local Time). 확인 전이면 null. */
  lastChecked: string | null
  /** 마지막으로 로그인에 성공한 시각 (ISO, Local Time). 없으면 null. */
  lastLogin: string | null
  memo?: string
}
