/**
 * HealthRule.
 * Health Check Engine이 GOOD/WARNING/ERROR를 판정할 때 사용하는 기준을
 * 코드가 아닌 하나의 설정 객체로 관리한다.
 * PM Review 반영(Sprint 5): Health Engine은 이 Rule만 보고 판정하며, Magic Rule을
 * 직접 코드에 작성하지 않는다.
 */
export interface HealthRule {
  /**
   * 로그인이 필요한 사이트 수가 이 값 이상이면 최소 WARNING으로 판정한다.
   */
  warningLoginRequiredThreshold: number
  /**
   * 로그인이 필요한 사이트 수가 이 값 이상이면서, 동시에 오픈이 임박(Ready)한 예약이
   * 하나라도 있으면 ERROR로 판정한다.
   */
  errorLoginRequiredThreshold: number
}

/** 기본 HealthRule. */
export const DEFAULT_HEALTH_RULE: HealthRule = {
  warningLoginRequiredThreshold: 1,
  errorLoginRequiredThreshold: 1,
}
