import type { SiteAccount } from '../types'

export interface SiteAccountRepository {
  getAll(): SiteAccount[]
  getById(id: string): SiteAccount | undefined
  save(siteAccount: SiteAccount): SiteAccount
  update(id: string, patch: Partial<SiteAccount>): SiteAccount | undefined
  delete(id: string): boolean
}
