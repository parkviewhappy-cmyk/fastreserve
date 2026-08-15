import type { SiteType } from '@/types/reservation'
import {
  pluginRegistry,
  PluginRegistry,
  type PluginRecord,
} from '@/domain/pluginRegistry'
import {
  pluginFactory,
  PluginFactory,
  DEFAULT_PLUGIN_RULE,
  type PluginRule,
  type PluginVersion,
  type SiteCapability,
} from '@/domain/plugin'
import { getNow } from '@/utils/time'

/**
 * Plugin Manager.
 * Plugin 등록/제거/조회/활성화/비활성화/Version 확인/Capability 조회를 담당하는
 * 단일 진입점이다. UI(Plugin Settings 화면 등)는 이 Manager만 사용한다.
 *
 * Plugin Registry(목록 저장)와 Plugin Factory(Plugin 인스턴스 생성)를 조합해서 쓴다.
 * PM Review 반영(Sprint 7): 등록 시 기록하는 Version은 PluginRule이 아니라
 * Plugin.getVersion()에서 가져온다(Rule은 정책만, Version은 Plugin이 관리한다).
 * autoEnable 등 정책값은 계속 PluginRule을 참조한다.
 */
export class PluginManager {
  constructor(
    private readonly registry: PluginRegistry = pluginRegistry,
    private readonly factory: PluginFactory = pluginFactory
  ) {}

  /** 등록된 Plugin 목록을 조회한다. */
  list(): PluginRecord[] {
    return this.registry.list()
  }

  /**
   * Plugin 등록(설치).
   * Plugin Factory가 아직 지원하지 않는 사이트(TicketLink/YES24 등 미구현)면
   * 등록하지 않고 undefined를 반환한다.
   */
  register(
    site: SiteType,
    rule: PluginRule = DEFAULT_PLUGIN_RULE
  ): PluginRecord | undefined {
    const plugin = this.factory.createPlugin(site)
    if (!plugin) {
      return undefined
    }
    return this.registry.register({
      site,
      version: plugin.getVersion(),
      enabled: rule.autoEnable,
      installedAt: getNow().toISOString(),
    })
  }

  /** Plugin 제거(삭제). */
  remove(site: SiteType): boolean {
    return this.registry.unregister(site)
  }

  /** Plugin 활성화. */
  enable(site: SiteType): PluginRecord | undefined {
    return this.registry.update(site, { enabled: true })
  }

  /** Plugin 비활성화. */
  disable(site: SiteType): PluginRecord | undefined {
    return this.registry.update(site, { enabled: false })
  }

  /** 등록된 Plugin의 Version을 확인한다. 등록되지 않았으면 undefined. */
  getVersion(site: SiteType): PluginVersion | undefined {
    return this.registry.getBySite(site)?.version
  }

  /**
   * Plugin의 Capability를 조회한다.
   * 등록 여부와 무관하게 Plugin Factory를 통해 조회한다(설치 전 미리보기 목적).
   * Factory가 지원하지 않는 사이트면 빈 배열을 반환한다.
   */
  getCapabilities(site: SiteType): SiteCapability[] {
    return this.factory.createPlugin(site)?.getCapabilities() ?? []
  }
}

/** 기본 Plugin Manager 인스턴스. */
export const pluginManager = new PluginManager()
