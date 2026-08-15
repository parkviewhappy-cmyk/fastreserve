import type { SiteType } from '@/types/reservation'
import type { PluginVersion } from '@/domain/plugin/types'

/**
 * Plugin Registry에 저장되는 등록(설치) 정보(메타데이터)이다.
 * Plugin 인스턴스 자체가 아니다 - 인스턴스 생성은 Plugin Factory가 담당한다.
 */
export interface PluginRecord {
  site: SiteType
  version: PluginVersion
  enabled: boolean
  /** 등록(설치) 시각 (ISO, UTC) */
  installedAt: string
}
