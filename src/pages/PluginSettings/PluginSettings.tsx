import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useToast } from '@/hooks/useToast'
import { SiteType } from '@/types/reservation'
import { pluginManager } from '@/domain/pluginManager'
import type { PluginRecord } from '@/domain/pluginRegistry'
import { formatVersion, getCapabilityLabel } from '@/domain/plugin'
import { siteAccountManager, type SiteAccount } from '@/domain/siteAccount'
import { sessionManager, getSessionStatusLabel, SessionStatus } from '@/domain/session'

/** Plugin Settings 화면에 표시할 사이트 목록. PM 지시 화면 구성(Interpark/TicketLink/YES24)과 동일하다. */
const PLUGIN_SITES: SiteType[] = [
  SiteType.Interpark,
  SiteType.TicketLink,
  SiteType.Yes24,
]

const SITE_LABELS: Record<SiteType, string> = {
  [SiteType.Interpark]: 'Interpark',
  [SiteType.TicketLink]: 'TicketLink',
  [SiteType.Yes24]: 'YES24',
  [SiteType.JinAir]: 'JinAir',
  [SiteType.Custom]: '기타',
}

function formatLastChecked(value: string | null): string {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 16)
}

/**
 * Plugin Settings 화면 (/plugin).
 * Plugin Manager를 통해 설치된 Plugin 목록/버전/활성화 상태/Capability를 보여주고,
 * 설치/삭제/활성화/비활성화를 수행한다.
 *
 * PM 지시(Sprint 7): TicketLink/YES24는 아직 Plugin이 구현되지 않았으므로
 * "Not Installed" 상태로 표시하고, 설치를 시도하면 안내만 한다(실제 설치되지 않음).
 *
 * PM 지시(Sprint 8, Interpark MVP): Interpark 항목에는 Version/설치여부/활성화여부/
 * 사용가능 여부(Plugin.isEnabled())/Session 상태/마지막 확인시간을 모두 표시하고,
 * [로그인 상태 확인] 버튼을 제공한다. Session 확인은 기존 Session Manager
 * (checkSession)를 그대로 재사용하는 Mock이며, 새 Manager를 추가하지 않는다.
 * TicketLink/YES24는 이번 Sprint에서 구현하지 않으므로 이 확장 정보를 표시하지 않는다.
 */
function PluginSettings() {
  const { showToast } = useToast()
  const [records, setRecords] = useState<PluginRecord[]>(pluginManager.list())
  const [accounts, setAccounts] = useState<SiteAccount[]>(
    siteAccountManager.list()
  )

  function refresh() {
    setRecords(pluginManager.list())
    setAccounts(siteAccountManager.list())
  }

  function handleInstall(site: SiteType) {
    const record = pluginManager.register(site)
    if (!record) {
      showToast('아직 지원하지 않는 사이트입니다 (Plugin 미구현)', 'error')
      return
    }
    refresh()
    showToast('Plugin을 설치했습니다', 'success')
  }

  function handleToggle(site: SiteType, enabled: boolean) {
    if (enabled) {
      pluginManager.disable(site)
    } else {
      pluginManager.enable(site)
    }
    refresh()
  }

  function handleRemove(site: SiteType) {
    pluginManager.remove(site)
    refresh()
    showToast('Plugin을 삭제했습니다', 'info')
  }

  /**
   * 로그인 상태 확인(Mock).
   * 기존 Session Manager(SessionChecker 주입 가능한 구조, Sprint 8) + Site Account
   * Manager를 그대로 사용한다. 확인 후 마지막 확인 시각/상태를 화면에 즉시 반영한다
   * (PM 지시, Sprint 9: 로그인 상태 확인 시 마지막 확인 시각/상태를 정상 표시).
   */
  function handleCheckLogin(account: SiteAccount) {
    const session = sessionManager.checkSession(account.id, account.site)
    siteAccountManager.updateLoginState(account.id, {
      isLoggedIn: session.status === SessionStatus.Ready,
      sessionStatus: session.status,
      checkedAt: session.checkedAt,
    })
    refresh()
    showToast(
      `Session 상태: ${getSessionStatusLabel(session.status)} (${formatLastChecked(session.checkedAt)} 확인)`,
      'info'
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Plugin 관리" />

      <main className="flex-1 space-y-4 px-4 py-6">
        <Link to="/" className="text-xs text-neutral-500 hover:text-neutral-300">
          ← 홈으로
        </Link>

        <h2 className="text-sm font-medium text-neutral-400">
          Installed Plugins
        </h2>

        <div className="space-y-3">
          {PLUGIN_SITES.map((site) => {
            const record = records.find((r) => r.site === site)
            const capabilities = pluginManager.getCapabilities(site)
            const isInterpark = site === SiteType.Interpark
            const account = accounts.find((a) => a.site === site)

            return (
              <div
                key={site}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-50">
                    {SITE_LABELS[site]}
                  </h3>
                  {!record && (
                    <span className="text-xs text-neutral-500">
                      Not Installed
                    </span>
                  )}
                </div>

                {record ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-neutral-400">
                      Version {formatVersion(record.version)}
                    </p>
                    <p className="text-xs text-neutral-400">
                      설치여부: 설치됨
                    </p>
                    <p className="text-xs text-neutral-400">
                      활성화여부: {record.enabled ? '활성화' : '비활성화'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      사용가능 여부:{' '}
                      {pluginManager.isAvailable(site) ? '사용 가능' : '사용 불가'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Capabilities:{' '}
                      {capabilities.length > 0
                        ? capabilities.map(getCapabilityLabel).join(', ')
                        : '-'}
                    </p>

                    {isInterpark && account && (
                      <>
                        <p className="text-xs text-neutral-400">
                          Session 상태:{' '}
                          {getSessionStatusLabel(account.sessionStatus)}
                        </p>
                        <p className="text-xs text-neutral-400">
                          마지막 확인시간: {formatLastChecked(account.lastChecked)}
                        </p>
                      </>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(site, record.enabled)}
                        className="rounded-lg border border-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
                      >
                        {record.enabled ? '비활성화' : '활성화'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(site)}
                        className="rounded-lg border border-neutral-800 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-neutral-800"
                      >
                        삭제
                      </button>
                      {isInterpark && account && (
                        <button
                          type="button"
                          onClick={() => handleCheckLogin(account)}
                          className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                        >
                          로그인 상태 확인
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-neutral-400">설치여부: 미설치</p>
                    <button
                      type="button"
                      onClick={() => handleInstall(site)}
                      className="mt-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      설치
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default PluginSettings
