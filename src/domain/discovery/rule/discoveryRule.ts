/**
 * DiscoveryRule.
 * Discovery 캐시의 시간 기준(TTL)을 코드에 직접 쓰지 않고 하나의 설정 객체로 관리한다.
 * ReadyRule/ExecutionRule/HealthRule과 동일한 패턴이다(Magic Number 금지 원칙).
 */
export interface DiscoveryRule {
  /** 캐시 유효 시간(분). 이 시간이 지나면 재조회(refresh)가 필요하다. */
  cacheTtlMinutes: number
}

/** 기본 DiscoveryRule. PM 지시(Sprint 11): 캐시 TTL 30분. */
export const DEFAULT_DISCOVERY_RULE: DiscoveryRule = {
  cacheTtlMinutes: 30,
}
