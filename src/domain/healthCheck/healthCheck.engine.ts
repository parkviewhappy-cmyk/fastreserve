import { siteAccountManager, SiteAccountManager } from '@/domain/siteAccount'
import { sessionManager, SessionManager } from '@/domain/session'
import { readyEngine, ReadyEngine } from '@/domain/ready'
import { getNow } from '@/utils/time'
import { HealthResult, type HealthCheckReport } from './types'
import { DEFAULT_HEALTH_RULE, type HealthRule } from './rule/healthRule'

/**
 * Health Check Engine.
 * 로그인 확인 / 예약시간 확인 / 사이트 활성 여부 / Session 상태 / Ready Engine 상태를
 * 종합해 Dashboard에 표시할 Health 결과를 계산한다.
 *
 * PM Review 반영(Sprint 5): 판정 기준은 HealthRule로만 관리하며 매직 넘버/조건을
 * 직접 코드에 작성하지 않는다.
 * Site Account Manager / Session Manager / Ready Engine을 그대로 사용하며 수정하지 않는다.
 */
export class HealthCheckEngine {
  constructor(
    private readonly accountManager: SiteAccountManager = siteAccountManager,
    private readonly session: SessionManager = sessionManager,
    private readonly engine: ReadyEngine = readyEngine
  ) {}

  getReport(
    now: Date = getNow(),
    rule: HealthRule = DEFAULT_HEALTH_RULE
  ): HealthCheckReport {
    // 사이트 활성 여부
    const activeSites = this.accountManager
      .list()
      .filter((account) => account.enabled)
    // 로그인 확인 + Session 상태
    const loggedInSiteCount = activeSites.filter(
      (account) => account.isLoggedIn
    ).length
    const loginRequiredSiteCount = activeSites.filter((account) =>
      this.session.requiresLogin(account.id)
    ).length
    // 예약시간 확인 + Ready Engine 상태
    const readyReservationCount = this.engine.getReadyReservations(now).length

    const result = this.evaluateResult(
      loginRequiredSiteCount,
      readyReservationCount,
      rule
    )

    return {
      result,
      activeSiteCount: activeSites.length,
      loggedInSiteCount,
      loginRequiredSiteCount,
      readyReservationCount,
    }
  }

  private evaluateResult(
    loginRequiredSiteCount: number,
    readyReservationCount: number,
    rule: HealthRule
  ): HealthResult {
    if (
      loginRequiredSiteCount >= rule.errorLoginRequiredThreshold &&
      readyReservationCount > 0
    ) {
      return HealthResult.Error
    }
    if (loginRequiredSiteCount >= rule.warningLoginRequiredThreshold) {
      return HealthResult.Warning
    }
    return HealthResult.Good
  }
}

/** 기본 Health Check Engine 인스턴스. */
export const healthCheckEngine = new HealthCheckEngine()
