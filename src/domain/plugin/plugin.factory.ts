import { SiteType } from '@/types/reservation'
import { siteAdapterFactory, SiteAdapterFactory } from '@/domain/adapter'
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
 * PM Review 반영(Sprint 7): Plugin은 내부적으로 Site Adapter Factory를 통해 Adapter를
 * 얻어 감싼다(Plugin -> Adapter). Adapter가 등록되지 않은 사이트는 Plugin도 생성하지 않는다.
 *
 * Sprint 7 범위: Interpark Plugin(Mock)만 구현한다. TicketLink/YES24는 아직 Plugin이
 * 구현되지 않았으므로 createPlugin()이 undefined를 반환한다(Plugin Settings 화면의
 * "Not Installed" 상태와 대응한다).
 */
export class PluginFactory {
  private readonly plugins: Map<SiteType, Plugin>

  constructor(
    adapterFactory: SiteAdapterFactory = siteAdapterFactory,
    plugins: Map<SiteType, Plugin> = PluginFactory.createDefaultPlugins(
      adapterFactory
    )
  ) {
    this.plugins = plugins
  }

  /** 기본 Plugin 목록 생성. Site Adapter Factory에서 얻은 Adapter를 Plugin으로 감싼다. */
  private static createDefaultPlugins(
    adapterFactory: SiteAdapterFactory
  ): Map<SiteType, Plugin> {
    const plugins = new Map<SiteType, Plugin>()

    const interparkAdapter = adapterFactory.getAdapter(SiteType.Interpark)
    if (interparkAdapter) {
      plugins.set(SiteType.Interpark, new InterparkPlugin(interparkAdapter))
    }

    return plugins
  }

  /** SiteType에 해당하는 Plugin을 생성/제공한다. 미구현 사이트는 undefined. */
  createPlugin(site: SiteType): Plugin | undefined {
    return this.plugins.get(site)
  }
}

/** 기본 Plugin Factory 인스턴스. */
export const pluginFactory = new PluginFactory()
