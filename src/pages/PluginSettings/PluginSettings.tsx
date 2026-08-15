import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useToast } from '@/hooks/useToast'
import { SiteType } from '@/types/reservation'
import { pluginManager } from '@/domain/pluginManager'
import type { PluginRecord } from '@/domain/pluginRegistry'
import { formatVersion, getCapabilityLabel } from '@/domain/plugin'

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

/**
 * Plugin Settings 화면 (/plugin).
 * Plugin Manager를 통해 설치된 Plugin 목록/버전/활성화 상태/Capability를 보여주고,
 * 설치/삭제/활성화/비활성화를 수행한다.
 *
 * PM 지시(Sprint 7): TicketLink/YES24는 아직 Plugin이 구현되지 않았으므로
 * "Not Installed" 상태로 표시하고, 설치를 시도하면 안내만 한다(실제 설치되지 않음).
 */
function PluginSettings() {
  const { showToast } = useToast()
  const [records, setRecords] = useState<PluginRecord[]>(pluginManager.list())

  function refresh() {
    setRecords(pluginManager.list())
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
                      {record.enabled ? 'Enabled' : 'Disabled'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Capabilities:{' '}
                      {capabilities.length > 0
                        ? capabilities.map(getCapabilityLabel).join(', ')
                        : '-'}
                    </p>
                    <div className="mt-2 flex gap-2">
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
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleInstall(site)}
                    className="mt-2 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    설치
                  </button>
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
