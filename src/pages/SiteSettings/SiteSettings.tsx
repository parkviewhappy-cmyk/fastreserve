import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Dialog from '@/components/common/Dialog'
import FormField from '@/components/common/FormField'
import { useToast } from '@/hooks/useToast'
import { SiteType } from '@/types/reservation'
import { siteAccountManager, type SiteAccount } from '@/domain/siteAccount'
import { sessionManager, getSessionStatusLabel, SessionStatus } from '@/domain/session'

const SITE_LABELS: Record<SiteType, string> = {
  [SiteType.Interpark]: 'Interpark',
  [SiteType.TicketLink]: 'TicketLink',
  [SiteType.Yes24]: 'YES24',
  [SiteType.JinAir]: 'JinAir',
  [SiteType.Custom]: '기타',
}

const inputClass =
  'w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-primary-600 focus:outline-none'

function formatLastChecked(value: string | null): string {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 16)
}

/**
 * 사이트 관리 화면 (/site).
 * Site Account Manager + Session Manager를 사용해 사이트별 로그인/세션 상태를 표시하고
 * 사이트 추가/삭제/활성화/비활성화, 로그인 확인(Mock)을 수행한다.
 * 아이디/비밀번호는 다루지 않는다.
 */
function SiteSettings() {
  const { showToast } = useToast()
  const [accounts, setAccounts] = useState<SiteAccount[]>(siteAccountManager.list())
  const [isAdding, setIsAdding] = useState(false)
  const [newSite, setNewSite] = useState<SiteType>(SiteType.Custom)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  function refresh() {
    setAccounts(siteAccountManager.list())
  }

  function handleCheckLogin(account: SiteAccount) {
    const session = sessionManager.checkSession(account.id, account.site)
    siteAccountManager.updateLoginState(account.id, {
      isLoggedIn: session.status === SessionStatus.Ready,
      sessionStatus: session.status,
      checkedAt: session.checkedAt,
    })
    refresh()
    showToast(
      session.status === SessionStatus.Ready
        ? '로그인 상태가 확인되었습니다.'
        : `세션 상태: ${getSessionStatusLabel(session.status)}`,
      session.status === SessionStatus.Ready ? 'success' : 'info'
    )
  }

  function handleToggleEnabled(account: SiteAccount) {
    if (account.enabled) {
      siteAccountManager.disable(account.id)
    } else {
      siteAccountManager.enable(account.id)
    }
    refresh()
  }

  function handleAddSite() {
    if (!newDisplayName.trim()) {
      showToast('사이트 이름을 입력해주세요.', 'error')
      return
    }
    siteAccountManager.add({ site: newSite, displayName: newDisplayName.trim() })
    setNewDisplayName('')
    setIsAdding(false)
    refresh()
    showToast('사이트가 추가되었습니다.', 'success')
  }

  function handleDelete() {
    if (!deleteTargetId) return
    siteAccountManager.remove(deleteTargetId)
    sessionManager.deleteSession(deleteTargetId)
    setDeleteTargetId(null)
    refresh()
    showToast('사이트가 삭제되었습니다.', 'success')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="사이트 관리" />
      <main className="flex-1 space-y-4 px-4 py-6">
        <Link
          to="/"
          className="inline-block text-xs text-neutral-500 hover:text-neutral-300"
        >
          ← 홈으로
        </Link>

        <div className="space-y-3">
          {accounts
            .slice()
            .sort((a, b) => a.priority - b.priority)
            .map((account) => (
              <div
                key={account.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-neutral-50">
                    {SITE_LABELS[account.site]}
                    {account.displayName !== SITE_LABELS[account.site] && (
                      <span className="ml-1 text-xs font-normal text-neutral-500">
                        ({account.displayName})
                      </span>
                    )}
                    <span className="ml-2 text-xs font-normal text-neutral-600">
                      우선순위 {account.priority}
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(account)}
                    className={
                      account.enabled
                        ? 'rounded-full bg-primary-600/20 px-2 py-1 text-xs text-primary-500'
                        : 'rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-500'
                    }
                  >
                    {account.enabled ? '활성' : '비활성'}
                  </button>
                </div>

                <dl className="mt-3 space-y-1 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <dt>로그인 상태</dt>
                    <dd>{account.isLoggedIn ? '로그인됨' : '로그인 필요'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>세션 상태</dt>
                    <dd>{getSessionStatusLabel(account.sessionStatus)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>마지막 확인</dt>
                    <dd>{formatLastChecked(account.lastChecked)}</dd>
                  </div>
                </dl>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCheckLogin(account)}
                    className="flex-1 rounded-lg bg-primary-600 py-2 text-xs font-semibold text-white hover:bg-primary-700"
                  >
                    로그인 확인
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(account.id)}
                    className="rounded-lg border border-red-900 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

          {accounts.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
              등록된 사이트가 없습니다
            </div>
          )}
        </div>

        {isAdding ? (
          <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <FormField label="사이트 종류">
              <select
                value={newSite}
                onChange={(e) => setNewSite(e.target.value as SiteType)}
                className={inputClass}
              >
                {Object.values(SiteType).map((site) => (
                  <option key={site} value={site}>
                    {SITE_LABELS[site]}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="표시 이름">
              <input
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 rounded-xl border border-neutral-800 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleAddSite}
                className="flex-1 rounded-xl bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                추가
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full rounded-xl border border-neutral-800 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-900"
          >
            사이트 추가
          </button>
        )}
      </main>

      <Dialog
        open={deleteTargetId !== null}
        title="사이트를 삭제할까요?"
        description="등록된 사이트 계정 정보가 삭제됩니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}

export default SiteSettings
