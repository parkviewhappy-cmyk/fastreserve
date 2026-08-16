import type { SiteAccount } from '../types'
import type { SiteAccountRepository } from './siteAccount.repository'
import { DEFAULT_SITE_ACCOUNTS } from '../defaults/siteAccount.defaults'

const STORAGE_KEY = 'fastreserve:siteAccounts'

/**
 * LocalStorage 기반 Site Account Repository.
 * 최초 실행(저장된 데이터가 없을 때)에는 DEFAULT_SITE_ACCOUNTS로 초기화한다.
 */
export class LocalStorageSiteAccountRepository implements SiteAccountRepository {
  getAll(): SiteAccount[] {
    return this.readAll()
  }

  getById(id: string): SiteAccount | undefined {
    return this.readAll().find((account) => account.id === id)
  }

  save(siteAccount: SiteAccount): SiteAccount {
    const all = this.readAll()
    all.push(siteAccount)
    this.writeAll(all)
    return siteAccount
  }

  update(id: string, patch: Partial<SiteAccount>): SiteAccount | undefined {
    const all = this.readAll()
    const index = all.findIndex((account) => account.id === id)
    if (index === -1) return undefined
    all[index] = { ...all[index], ...patch }
    this.writeAll(all)
    return all[index]
  }

  delete(id: string): boolean {
    const all = this.readAll()
    const index = all.findIndex((account) => account.id === id)
    if (index === -1) return false
    all.splice(index, 1)
    this.writeAll(all)
    return true
  }

  private readAll(): SiteAccount[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        this.writeAll(DEFAULT_SITE_ACCOUNTS)
        return [...DEFAULT_SITE_ACCOUNTS]
      }
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as SiteAccount[]) : []
    } catch {
      return []
    }
  }

  private writeAll(accounts: SiteAccount[]): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
    } catch {
      // BUG-004(docs/BUG_TRACKER.md, Sprint 16 발견/수정): LocalStorage 쓰기 실패를
      // 흡수한다(읽기 쪽과 동일한 보호 패턴). 상세 사유는 reservation.repository.localStorage.ts 참고.
    }
  }
}
