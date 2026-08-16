import type { DiscoveryCache } from '@/domain/discovery/types'
import type { DiscoveryRepository } from '@/domain/discovery/repository/discovery.repository'

/**
 * 메모리 기반 Fake Discovery Repository(테스트 전용).
 * PM 지시(Sprint 13, ⑦ 테스트 코드 정리): 공용 위치(src/test-utils)로 옮겨
 * 다른 테스트에서도 재사용할 수 있게 했다.
 */
export class FakeDiscoveryRepository implements DiscoveryRepository {
  private cache: DiscoveryCache | null = null
  private favoriteIds: string[] = []

  getCache(): DiscoveryCache | null {
    return this.cache
  }
  saveCache(cache: DiscoveryCache): void {
    this.cache = cache
  }
  getFavoriteIds(): string[] {
    return this.favoriteIds
  }
  saveFavoriteIds(ids: string[]): void {
    this.favoriteIds = ids
  }
}
