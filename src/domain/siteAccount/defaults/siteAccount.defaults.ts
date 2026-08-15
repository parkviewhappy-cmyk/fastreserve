import { SiteType } from '@/types/reservation'
import { SessionStatus } from '@/domain/session'
import type { SiteAccount } from '../types'

/**
 * 최초 실행 시 기본으로 제공하는 사이트 목록.
 * Site Settings 화면 예시(Interpark/TicketLink/YES24)와 동일하게 구성했다.
 * Interpark만 MVP 범위상 활성화(enabled) 상태로 시작하고, 나머지는 비활성 상태로 시작한다.
 * PM Review 반영(Sprint 5): priority 기본값(Interpark=1, TicketLink=2, YES24=3)을 부여했다.
 * JinAir는 기본 Seed에서 제외한다.
 */
export const DEFAULT_SITE_ACCOUNTS: SiteAccount[] = [
  {
    id: 'site-interpark',
    site: SiteType.Interpark,
    displayName: 'Interpark',
    enabled: true,
    isLoggedIn: false,
    sessionStatus: SessionStatus.Unknown,
    lastChecked: null,
    lastLogin: null,
    priority: 1,
    memo: '',
  },
  {
    id: 'site-ticketlink',
    site: SiteType.TicketLink,
    displayName: 'TicketLink',
    enabled: false,
    isLoggedIn: false,
    sessionStatus: SessionStatus.Unknown,
    lastChecked: null,
    lastLogin: null,
    priority: 2,
    memo: '',
  },
  {
    id: 'site-yes24',
    site: SiteType.Yes24,
    displayName: 'YES24',
    enabled: false,
    isLoggedIn: false,
    sessionStatus: SessionStatus.Unknown,
    lastChecked: null,
    lastLogin: null,
    priority: 3,
    memo: '',
  },
]
