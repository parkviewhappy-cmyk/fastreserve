import type { SiteType } from '@/types/reservation'
import { SessionStatus, type Session } from '../types'
import type { SessionRepository } from '../repository/session.repository'
import { LocalStorageSessionRepository } from '../repository/session.repository.localStorage'
import { getNow } from '@/utils/time'

/**
 * Mock 상태 흐름표.
 * PM Review 반영(Sprint 5): 토글 대신 정해진 흐름을 따른다.
 * UNKNOWN -> READY -> EXPIRED -> LOGIN_REQUIRED -> READY (이후 반복)
 * ERROR는 이 흐름에 포함되지 않으며(실제 오류 상황 전용), 확인 시 재시도하듯 READY로 되돌린다.
 */
const MOCK_STATUS_FLOW: Record<SessionStatus, SessionStatus> = {
  [SessionStatus.Unknown]: SessionStatus.Ready,
  [SessionStatus.Ready]: SessionStatus.Expired,
  [SessionStatus.Expired]: SessionStatus.LoginRequired,
  [SessionStatus.LoginRequired]: SessionStatus.Ready,
  [SessionStatus.Error]: SessionStatus.Ready,
}

/**
 * Session Checker.
 * 실제 로그인 상태를 확인하는 전략을 나타낸다. siteAccountId/site/현재 상태/현재시간을
 * 받아 다음 SessionStatus를 반환한다.
 *
 * PM 지시(Sprint 8): "현재는 Mock으로 구현하되 실제 Session Checker로 교체 가능한
 * 구조를 유지"하기 위해 SessionManager의 생성자에 주입 가능한 전략으로 분리했다.
 * 새 Manager/Domain을 추가하지 않고 기존 SessionManager를 확장하는 방식으로 구현했다.
 */
export type SessionChecker = (
  siteAccountId: string,
  site: SiteType,
  currentStatus: SessionStatus,
  now: Date
) => SessionStatus

/** 기본(Mock) Session Checker. MOCK_STATUS_FLOW에 따라 다음 상태로 갱신한다. */
export const mockSessionChecker: SessionChecker = (
  _siteAccountId,
  _site,
  currentStatus
) => MOCK_STATUS_FLOW[currentStatus]

/**
 * Session Manager.
 * 사이트별 로그인 Session "상태"만 관리한다. 아이디/비밀번호 등 자격 증명은 절대 저장하지 않는다.
 *
 * Sprint 5 범위: 실제 브라우저 세션 연동 없이 LocalStorage 기반 Mock으로 동작한다.
 * checkSession()은 주입된 SessionChecker(기본값: mockSessionChecker)를 호출해 다음 상태를
 * 얻는다. 실제 Interpark Session 확인 로직이 준비되면 SessionChecker만 교체하면 되고,
 * SessionManager/checkSession()의 시그니처나 나머지 로직은 그대로 유지된다.
 */
export class SessionManager {
  constructor(
    private readonly repository: SessionRepository = new LocalStorageSessionRepository(),
    private readonly checker: SessionChecker = mockSessionChecker
  ) {}

  /** Session 상태 반환 */
  getSessionStatus(siteAccountId: string): SessionStatus {
    return (
      this.repository.getBySiteAccountId(siteAccountId)?.status ??
      SessionStatus.Unknown
    )
  }

  /** Session 만료 확인 */
  isExpired(siteAccountId: string, now: Date = getNow()): boolean {
    const session = this.repository.getBySiteAccountId(siteAccountId)
    if (!session) return false
    if (session.status === SessionStatus.Expired) return true
    if (session.expiresAt) {
      return new Date(session.expiresAt).getTime() <= now.getTime()
    }
    return false
  }

  /** 로그인 필요 여부 반환 */
  requiresLogin(siteAccountId: string): boolean {
    const status = this.getSessionStatus(siteAccountId)
    return status !== SessionStatus.Ready
  }

  /**
   * Session 확인.
   * 주입된 SessionChecker(기본값: mockSessionChecker)를 호출해 다음 상태를 얻고 저장한다.
   */
  checkSession(
    siteAccountId: string,
    site: SiteType,
    now: Date = getNow()
  ): Session {
    const existing = this.repository.getBySiteAccountId(siteAccountId)
    const currentStatus = existing?.status ?? SessionStatus.Unknown
    const nextStatus = this.checker(siteAccountId, site, currentStatus, now)

    const session: Session = {
      siteAccountId,
      site,
      status: nextStatus,
      checkedAt: now.toISOString(),
      expiresAt: null,
    }
    return this.repository.save(session)
  }

  deleteSession(siteAccountId: string): boolean {
    return this.repository.delete(siteAccountId)
  }
}

/** 기본 Session Manager 인스턴스. */
export const sessionManager = new SessionManager()
