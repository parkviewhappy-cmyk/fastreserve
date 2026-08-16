import type { SiteType } from '@/types/reservation'
import type { PluginRecord } from './types'
import { createDefaultPluginRecords } from './defaults/pluginRegistry.defaults'

const STORAGE_KEY = 'fastreserve:pluginRegistry'

/**
 * Plugin Registry.
 * Plugin "목록"(메타데이터)만 관리한다. Plugin 인스턴스 생성은 Plugin Factory가 담당하며,
 * 이 Registry는 생성을 수행하지 않는다(PM 지시, Sprint 7).
 *
 * 최초 실행(저장된 데이터가 없을 때)에는 기본 Plugin(Interpark)로 초기화한다.
 */
export class PluginRegistry {
  list(): PluginRecord[] {
    return this.readAll()
  }

  getBySite(site: SiteType): PluginRecord | undefined {
    return this.readAll().find((record) => record.site === site)
  }

  /** Plugin 등록(설치). 이미 등록된 사이트면 덮어쓴다. */
  register(record: PluginRecord): PluginRecord {
    const records = this.readAll().filter(
      (existing) => existing.site !== record.site
    )
    records.push(record)
    this.writeAll(records)
    return record
  }

  /** Plugin 제거(삭제). */
  unregister(site: SiteType): boolean {
    const records = this.readAll()
    const next = records.filter((record) => record.site !== site)
    this.writeAll(next)
    return next.length !== records.length
  }

  /** 등록된 Plugin 정보를 일부 수정한다(활성화/비활성화 등). */
  update(
    site: SiteType,
    patch: Partial<Omit<PluginRecord, 'site'>>
  ): PluginRecord | undefined {
    const records = this.readAll()
    const index = records.findIndex((record) => record.site === site)
    if (index === -1) return undefined
    const updated = { ...records[index], ...patch }
    records[index] = updated
    this.writeAll(records)
    return updated
  }

  private readAll(): PluginRecord[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        const seed = createDefaultPluginRecords()
        this.writeAll(seed)
        return seed
      }
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as PluginRecord[]) : []
    } catch {
      return []
    }
  }

  private writeAll(records: PluginRecord[]): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    } catch {
      // BUG-004(docs/BUG_TRACKER.md, Sprint 16 발견/수정): LocalStorage 쓰기 실패를
      // 흡수한다(읽기 쪽과 동일한 보호 패턴). 상세 사유는 reservation.repository.localStorage.ts 참고.
    }
  }
}

/** 기본 Plugin Registry 인스턴스. */
export const pluginRegistry = new PluginRegistry()
