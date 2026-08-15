/**
 * Site Capability.
 * 사이트별로 지원하는 기능/제약을 나타낸다. Site Adapter의 supports()가 이 값을 기준으로 판단한다.
 */
export enum SiteCapability {
  SeatSelection = 'SEAT_SELECTION',
  QueueWaiting = 'QUEUE_WAITING',
  Captcha = 'CAPTCHA',
  MobileOnly = 'MOBILE_ONLY',
  DesktopOnly = 'DESKTOP_ONLY',
}
