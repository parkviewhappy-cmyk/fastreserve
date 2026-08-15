import { SessionStatus } from '@/domain/session'
import { getNow } from '@/utils/time'
import { generateUuid } from '@/utils/uuid'
import type { SiteAccountRepository } from '../repository/siteAccount.repository'
import { LocalStorageSiteAccountRepository } from '../repository/siteAccount.repository.localStorage'
import { AccountSiteType, type SiteAccount } from '../types'

export interface AddSiteAccountInput {
  site: AccountSiteType
  displayName: string
  memo?: string
}

export interface UpdateLoginStateInput {
  isLoggedIn: boolean
  sessionStatus: SessionStatus
  checkedAt?: string
}

/**
 * Site Account Manager.
 * 사이트 계정(로그인 아이디/비밀번호 제외) 목록을 관리하는 단일 진입점이다.
 * 아이디/비밀번호는 다루지 않으며, 로그인 여부와 Session 상태만 저장한다.
 */
export class SiteAccountManager {
  constructor(
    private readonly repository: SiteAccountRepository = new LocalStorageSiteAccountRepository()
  ) {}

  list(): SiteAccount[] {
    return this.repository.getAll()
  }

  getById(id: string): SiteAccount | undefined {
    return this.repository.getById(id)
  }

  /** 사이트 추가 */
  add(input: AddSiteAccountInput): SiteAccount {
    const siteAccount: SiteAccount = {
      id: generateUuid(),
      site: input.site,
      displayName: input.displayName,
      enabled: true,
      isLoggedIn: false,
      sessionStatus: SessionStatus.Unknown,
      lastChecked: null,
      lastLogin: null,
      memo: input.memo,
    }
    return this.repository.save(siteAccount)
  }

  /** 사이트 삭제 */
  remove(id: string): boolean {
    return this.repository.delete(id)
  }

  /** 사이트 활성화 */
  enable(id: string): SiteAccount | undefined {
    return this.repository.update(id, { enabled: true })
  }

  /** 사이트 비활성화 */
  disable(id: string): SiteAccount | undefined {
    return this.repository.update(id, { enabled: false })
  }

  /** 로그인 상태 저장 + 마지막 확인시간 저장 */
  updateLoginState(
    id: string,
    input: UpdateLoginStateInput
  ): SiteAccount | undefined {
    const checkedAt = input.checkedAt ?? getNow().toISOString()
    const current = this.getById(id)
    return this.repository.update(id, {
      isLoggedIn: input.isLoggedIn,
      sessionStatus: input.sessionStatus,
      lastChecked: checkedAt,
      lastLogin: input.isLoggedIn ? checkedAt : current?.lastLogin ?? null,
    })
  }
}

/** 기본 Site Account Manager 인스턴스. */
export const siteAccountManager = new SiteAccountManager()
