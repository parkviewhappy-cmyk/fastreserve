import { SiteType } from '@/types/reservation'
import { getNow } from '@/utils/time'
import type { PluginRecord } from '../types'

/**
 * 최초 실행 시 기본으로 등록되는 Plugin 목록을 생성한다.
 * Interpark만 기본 설치+활성화 상태로 Seed한다(Site Account 기본 Seed와 동일한 정책).
 */
export function createDefaultPluginRecords(): PluginRecord[] {
  return [
    {
      site: SiteType.Interpark,
      version: { major: 1, minor: 0, patch: 0 },
      enabled: true,
      installedAt: getNow().toISOString(),
    },
  ]
}
