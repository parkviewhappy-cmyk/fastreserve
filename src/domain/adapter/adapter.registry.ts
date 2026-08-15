import { SiteType } from '@/types/reservation'
import type { SiteAdapter } from './siteAdapter'
import { InterparkAdapter } from './interparkAdapter'

/**
 * Site Adapter Registry.
 * SiteType별 Adapter 구현체를 등록/조회한다.
 * Sprint 6 범위: Interpark만 등록한다. 다른 사이트는 향후 Adapter 구현 후 추가한다.
 */
const registry = new Map<SiteType, SiteAdapter>([
  [SiteType.Interpark, new InterparkAdapter()],
])

/** SiteType에 해당하는 Site Adapter를 조회한다. 등록되지 않은 사이트면 undefined. */
export function getSiteAdapter(site: SiteType): SiteAdapter | undefined {
  return registry.get(site)
}
