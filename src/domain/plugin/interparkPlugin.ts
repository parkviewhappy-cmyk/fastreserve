import { SiteType } from '@/types/reservation'
import type { ExecutionContext, ExecutionResult } from '@/domain/execution/types'
import type { SiteAdapter } from '@/domain/adapter/siteAdapter'
import { InterparkAdapter } from '@/domain/adapter/interparkAdapter'
import type { Plugin } from './plugin'
import { SiteCapability, type PluginVersion } from './types'

const INTERPARK_VERSION: PluginVersion = { major: 1, minor: 0, patch: 0 }

/** Interpark가 실제로 지원하는 기능. Mock이지만 실제 사이트 특성을 반영한 값이다. */
const INTERPARK_CAPABILITIES: SiteCapability[] = [
  SiteCapability.SeatSelection,
  SiteCapability.QueueWaiting,
  SiteCapability.Captcha,
  SiteCapability.Desktop,
  SiteCapability.Mobile,
  SiteCapability.LoginSession,
]

/**
 * Interpark Plugin (Mock).
 * 첫 번째 Plugin 구현체. Version/Capability/Enable 여부를 관리하며,
 * Session 확인/Reservation URL 처리/Site 연결 등 실제 사이트 동작은
 * 내부에 감싸고 있는 Site Adapter(domain/adapter)에 위임한다
 * (Execution Engine -> Plugin -> Adapter 구조, PM Review 반영/Sprint 7).
 *
 * 기능 범위(PM 지시, Sprint 7): Plugin 정보 반환 / Capability 반환 / Mock Session 확인 /
 * Mock Reservation URL 확인 / ExecutionResult 반환. 실제 Browser 제어 없음.
 */
export class InterparkPlugin implements Plugin {
  constructor(private readonly adapter: SiteAdapter = new InterparkAdapter()) {}

  getSite(): SiteType {
    return this.adapter.site
  }

  getVersion(): PluginVersion {
    return INTERPARK_VERSION
  }

  getCapabilities(): SiteCapability[] {
    return [...INTERPARK_CAPABILITIES]
  }

  /** Interpark Plugin(Mock)은 항상 사용 가능하다고 본다. 설치/활성화 여부는 Plugin Registry가 별도로 관리한다. */
  isEnabled(): boolean {
    return true
  }

  prepare(context: ExecutionContext): void {
    this.adapter.prepare(context)
  }

  checkSession(context: ExecutionContext): boolean {
    return this.adapter.checkSession(context)
  }

  openReservation(context: ExecutionContext): void {
    this.adapter.openReservationPage(context)
  }

  execute(context: ExecutionContext): ExecutionResult {
    return this.adapter.execute(context)
  }

  healthCheck(): boolean {
    return this.adapter.healthCheck()
  }

  cancel(context: ExecutionContext): void {
    this.adapter.cancel(context)
  }
}
