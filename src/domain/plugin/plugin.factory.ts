import { SiteType } from '@/types/reservation'
import type { Plugin } from './plugin'
import { InterparkPlugin } from './interparkPlugin'

/**
 * Plugin Factory.
 * SiteType에 맞는 Plugin 인스턴스를 생성/제공하는 단일 진입점이다.
 *
 * PM 지시(Sprint 7): createPlugin(site) -> Interpark Plugin / TicketLink Plugin / YES24 Plugin.
 * Execution Engine은 이 Factory(createPlugin)만 호출하며, 구체 Plugin 클래스나
 * 등록 방식을 직접 알지 못한다.
 *
 * Sprint 7 범위: Interpark Plugin(Mock)만 구현한다. TicketLink/YES24는 아직 Plugin이
 * 구현되지 않았으므로 createPlugin()이 undefined를 반환한다(Plugin Settings 화면의
 * "Not Installed" 상태와 대응한다).
 */
export class PluginFactory {
  private readonly plugins: Map<SiteType, Plugin>

  constructor(
    plugins: Map<SiteType, Plugin> = PluginFactory.createDefaultPlugins()
  ) {
    this.plugins = plugins
  }

  private static createDefaultPlugins(): Map<SiteType, Plugin> {
    return new Map<SiteType, Plugin>([
      [SiteType.Interpark, new InterparkPlugin()],
    ])
  }

  /** SiteType에 해당하는 Plugin을 생성/제공한다. 미구현 사이트는 undefined. */
  createPlugin(site: SiteType): Plugin | undefined {
    return this.plugins.get(site)
  }
}

/** 기본 Plugin Factory 인스턴스. */
export const pluginFactory = new PluginFactory()
