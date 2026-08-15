/** Plugin(사이트 연동 모듈) Version. Semantic Version(major.minor.patch) 형식을 따른다. */
export interface PluginVersion {
  major: number
  minor: number
  patch: number
}

/**
 * Plugin(사이트) Capability.
 * PM Review 반영(Sprint 7): Sprint 6에서 만든 domain/adapter의 SiteCapability를
 * 이 도메인(domain/plugin)으로 이동하고 목록을 확장했다. 별도의 PluginCapability
 * Enum을 새로 만들지 않고 기존 개념을 그대로 확장했다(같은 "사이트가 지원하는 기능"
 * 개념이므로 병렬 Enum을 두지 않는다).
 * MobileOnly/DesktopOnly(배타적 제약 플래그) 대신 Mobile/Desktop(지원 여부 플래그)으로
 * 의미를 통일하고, AutoRefresh/Popup/LoginSession을 추가했다.
 */
export enum SiteCapability {
  SeatSelection = 'SEAT_SELECTION',
  QueueWaiting = 'QUEUE_WAITING',
  Captcha = 'CAPTCHA',
  Mobile = 'MOBILE',
  Desktop = 'DESKTOP',
  AutoRefresh = 'AUTO_REFRESH',
  Popup = 'POPUP',
  LoginSession = 'LOGIN_SESSION',
}
