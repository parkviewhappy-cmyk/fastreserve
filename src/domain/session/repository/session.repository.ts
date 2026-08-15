import type { Session } from '../types'

/** Session Repository 인터페이스. siteAccountId 기준으로 1건씩 관리한다. */
export interface SessionRepository {
  getAll(): Session[]
  getBySiteAccountId(siteAccountId: string): Session | undefined
  /** 동일 siteAccountId가 있으면 덮어쓰고(upsert), 없으면 추가한다. */
  save(session: Session): Session
  delete(siteAccountId: string): boolean
}
