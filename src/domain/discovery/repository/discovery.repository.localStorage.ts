import type { DiscoveryCache } from '../types'
import type { DiscoveryRepository } from './discovery.repository'

const CACHE_STORAGE_KEY = 'fastreserve:discoveryCache'
const FAVORITES_STORAGE_KEY = 'fastreserve:discoveryFavorites'

/**
 * LocalStorage 기반 Discovery Repository.
 * 다른 Repository(Reservation/Session/PluginRegistry)와 동일하게, 호출마다
 * window.localStorage를 다시 읽는다(모듈 레벨 캐시 없음 - 새로고침/여러 탭 간 정합성 유지).
 */
export class LocalStorageDiscoveryRepository implements DiscoveryRepository {
  getCache(): DiscoveryCache | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(CACHE_STORAGE_KEY)
      if (!raw) return null
      const parsed: unknown = JSON.parse(raw)
      if (
        parsed &&
        typeof parsed === 'object' &&
        Array.isArray((parsed as DiscoveryCache).items) &&
        typeof (parsed as DiscoveryCache).fetchedAt === 'string'
      ) {
        return parsed as DiscoveryCache
      }
      return null
    } catch {
      return null
    }
  }

  saveCache(cache: DiscoveryCache): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache))
  }

  getFavoriteIds(): string[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (!raw) return []
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as string[]) : []
    } catch {
      return []
    }
  }

  saveFavoriteIds(ids: string[]): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
  }
}
