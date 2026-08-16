import type { DiscoveryCache } from '../types'

/**
 * Discovery Repository 인터페이스.
 * Discovery 캐시(공연 목록 + 조회 시각)와 즐겨찾기 ID 목록을 저장/조회한다.
 * SessionRepository/PluginRegistry와 동일한 패턴: Manager는 이 인터페이스만 사용하고
 * 저장소 구현(LocalStorage 등)은 알지 못한다.
 */
export interface DiscoveryRepository {
  getCache(): DiscoveryCache | null
  saveCache(cache: DiscoveryCache): void

  getFavoriteIds(): string[]
  saveFavoriteIds(ids: string[]): void
}
