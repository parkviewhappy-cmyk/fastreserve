import { SiteType } from '@/types/reservation'
import type { SiteAdapter } from './siteAdapter'
import { InterparkAdapter } from './interparkAdapter'

/**
 * Site Adapter Factory.
 * SiteType에 맞는 Site Adapter 구현체를 생성/제공하는 단일 진입점이다.
 *
 * PM Review 반영(Sprint 6): 기존 Adapter Registry(단순 Map 조회 함수)를 Factory Pattern으로
 * 전환한다. Execution Engine은 이 Factory(getAdapter)만 호출하며, 구체 Adapter 클래스나
 * 등록 방식(Map 등)을 직접 알지 못한다.
 */
export class SiteAdapterFactory {
  private readonly adapters: Map<SiteType, SiteAdapter>

  constructor(
    adapters: Map<SiteType, SiteAdapter> = SiteAdapterFactory.createDefaultAdapters()
  ) {
    this.adapters = adapters
  }

  /** 기본 Adapter 목록 생성. Sprint 6 범위: Interpark만 등록한다. */
  private static createDefaultAdapters(): Map<SiteType, SiteAdapter> {
    return new Map<SiteType, SiteAdapter>([
      [SiteType.Interpark, new InterparkAdapter()],
    ])
  }

  /** SiteType에 해당하는 Site Adapter를 반환한다. 등록되지 않은 사이트면 undefined. */
  getAdapter(site: SiteType): SiteAdapter | undefined {
    return this.adapters.get(site)
  }
}

/** 기본 Site Adapter Factory 인스턴스. */
export const siteAdapterFactory = new SiteAdapterFactory()
