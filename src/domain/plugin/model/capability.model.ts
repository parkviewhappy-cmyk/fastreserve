import { SiteCapability } from '../types'

const CAPABILITY_LABEL: Record<SiteCapability, string> = {
  [SiteCapability.SeatSelection]: '좌석 선택',
  [SiteCapability.QueueWaiting]: '대기열',
  [SiteCapability.Captcha]: '캡차',
  [SiteCapability.Mobile]: '모바일',
  [SiteCapability.Desktop]: '데스크탑',
  [SiteCapability.AutoRefresh]: '자동 새로고침',
  [SiteCapability.Popup]: '팝업',
  [SiteCapability.LoginSession]: '로그인 세션',
}

/** Capability 값에 대응하는 한글 라벨을 반환한다. UI 표시용. */
export function getCapabilityLabel(capability: SiteCapability): string {
  return CAPABILITY_LABEL[capability]
}
