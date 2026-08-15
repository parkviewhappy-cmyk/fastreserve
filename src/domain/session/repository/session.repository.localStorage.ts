import type { Session } from '../types'
import type { SessionRepository } from './session.repository'

const STORAGE_KEY = 'fastreserve:sessions'

/**
 * LocalStorage 기반 Session Repository.
 * Sprint 5 범위: 실제 브라우저 세션 연동 없이 상태값만 저장한다(Session Mock).
 */
export class LocalStorageSessionRepository implements SessionRepository {
  getAll(): Session[] {
    return this.readAll()
  }

  getBySiteAccountId(siteAccountId: string): Session | undefined {
    return this.readAll().find(
      (session) => session.siteAccountId === siteAccountId
    )
  }

  save(session: Session): Session {
    const all = this.readAll()
    const index = all.findIndex(
      (item) => item.siteAccountId === session.siteAccountId
    )
    if (index === -1) {
      all.push(session)
    } else {
      all[index] = session
    }
    this.writeAll(all)
    return session
  }

  delete(siteAccountId: string): boolean {
    const all = this.readAll()
    const index = all.findIndex((item) => item.siteAccountId === siteAccountId)
    if (index === -1) return false
    all.splice(index, 1)
    this.writeAll(all)
    return true
  }

  private readAll(): Session[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as Session[]) : []
    } catch {
      return []
    }
  }

  private writeAll(sessions: Session[]): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }
}
