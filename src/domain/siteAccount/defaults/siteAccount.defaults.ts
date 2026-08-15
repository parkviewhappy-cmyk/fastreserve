import { SessionStatus } from '@/domain/session'
import { AccountSiteType, type SiteAccount } from '../types'

/**
 * 최초 실행 시 기본으로 제공하는 사이트 목록.
 * Site Settings 화면 예시(Interpark/TicketLink/YES24)와 동일하게 구성했다.
 * Interpark만 MVP 범위상 활성화(enabled) 상태로 시작하고, 나머지는 비활성 상태로 시작한다.
 */
export const DEFAULT_SITE_ACCOUNTS: SiteAccount[] = [
  {
    id: 'site-interpark',
    site: AccountSiteType.Interpark,
    displayName: 'Interpark',
    enabled: true,
    isLoggedIn: false,
    sessionStatus: SessionStatus.Unknown,
    lastChecked: null,
    lastLogin: null,
    memo: '',
  },
  {
    id: 'site-ticketlink',
    site: AccountSiteType.TicketLink,
    displayName: 'TicketLink',
    enabled: false,
    isLoggedIn: false,
    sessionStatus: SessionStatus.Unknown,
    lastChecked: null,
    lastLogin: null,
    memo: '',
  },
  {
    id: 'site-yes24',
    site: AccountSiteType.Yes24,
    displayName: 'YES24',
    enabled: false,
    isLoggedIn: false,
    sessionStatus: SessionStatus.Unknown,
    lastChecked: null,
    lastLogin: null,
    memo: '',
  },
]
