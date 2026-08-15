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
 * Session Manager.
 * 사이트별 로그인 Session "상태"만 관리한다. 아이디/비밀번호 등 자격 증명은 절대 저장하지 않는다.
 *
 * Sprint 5 범위: 실제 브라우저 세션 연동 없이 LocalStorage 기반 Mock으로 동작한다.
 * checkSession()은 실제 로그인 여부를 확인하지 않고, MOCK_STATUS_FLOW에 따라 현재 상태를
 * 다음 상태로 갱신하는 Mock 동작으로 화면-도메인 간 연결(플로우)만 검증한다.
 * 실제 연동은 Sprint 6에서 구현한다.
 */
export class SessionManager {
  constructor(
    private readonly repository: SessionRepository = new LocalStorageSessionRepository()
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
   * Session 확인 (Mock).
   * 현재 상태를 MOCK_STATUS_FLOW에 따라 다음 상태로 갱신한다.
   * 실제 브라우저 세션 검증은 Sprint 6에서 구현한다.
   */
  checkSession(
    siteAccountId: string,
    site: SiteType,
    now: Date = getNow()
  ): Session {
    const existing = this.repository.getBySiteAccountId(siteAccountId)
    const currentStatus = existing?.status ?? SessionStatus.Unknown
    const nextStatus = MOCK_STATUS_FLOW[currentStatus]

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
