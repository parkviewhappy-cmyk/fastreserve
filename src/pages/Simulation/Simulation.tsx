import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useToast } from '@/hooks/useToast'
import { scheduler } from '@/domain/scheduler'
import { reservationManager } from '@/domain/reservation'
import { pluginManager } from '@/domain/pluginManager'
import { formatVersion, getCapabilityLabel } from '@/domain/plugin'
import {
  ExecutionResult,
  type ExecutionQueueItem,
  type ExecutionRun,
  type ExecutionTimelineStep,
} from '@/domain/execution'
import { SiteType } from '@/types/reservation'

const RESULT_LABEL: Record<ExecutionResult, string> = {
  [ExecutionResult.Success]: '성공(Mock)',
  [ExecutionResult.Failed]: '실패(Mock)',
  [ExecutionResult.Waiting]: '대기',
  [ExecutionResult.Running]: '진행중',
  [ExecutionResult.Skipped]: '건너뜀',
  [ExecutionResult.Retry]: '재시도 필요',
}

const STEP_LABEL: Record<ExecutionTimelineStep, string> = {
  QUEUED: 'Queue 생성',
  READY: 'Ready',
  EXECUTION_START: 'Execution Start',
  PLUGIN_CALLED: 'Plugin 호출',
  COMPLETED: 'Completed',
}

const SITE_LABELS: Record<SiteType, string> = {
  [SiteType.Interpark]: 'Interpark',
  [SiteType.TicketLink]: 'TicketLink',
  [SiteType.Yes24]: 'YES24',
  [SiteType.JinAir]: 'JinAir',
  [SiteType.Custom]: '기타',
}

/** ISO(UTC) 시각 문자열에서 HH:mm:ss만 추출해 표시한다. */
function formatTimelineTime(value: string): string {
  return value.replace('T', ' ').slice(11, 19)
}

/**
 * Simulation Mode 화면 (/simulation).
 * Scheduler(→ Execution Engine → Plugin)가 계산한 Execution Queue를 보여주고,
 * 항목별로 Mock 실행을 시도해 Execution Timeline(Queue 생성 → Ready → Execution Start →
 * Plugin 호출 → Completed)과 ExecutionResult를 확인할 수 있다.
 *
 * PM 지시(Sprint 6): 실제 예약을 실행하지 않는다. 이 화면은 Execution Queue/Priority/
 * 상태 변화/Execution 순서를 확인하기 위한 Simulation 목적으로만 사용한다.
 * UI는 Execution Engine을 직접 호출하지 않고 Scheduler를 통해서만 접근한다.
 * PM 지시(Sprint 7): 항목별로 Plugin 이름/Version/Capability를 함께 표시한다.
 * (Plugin 이름/Version/Capability 조회는 Execution Engine이 아닌 Plugin Manager를
 * 통해 직접 조회한다 - 정보 조회이며 실행 자체가 아니므로 Scheduler 경유 대상이 아니다.)
 */
function Simulation() {
  const { showToast } = useToast()
  const [queue] = useState<ExecutionQueueItem[]>(() => scheduler.getExecutionQueue())
  const [runs, setRuns] = useState<Record<string, ExecutionRun>>({})

  function handleRun(item: ExecutionQueueItem) {
    const run = scheduler.simulateExecution(item)
    setRuns((prev) => ({ ...prev, [item.context.reservationId]: run }))
    showToast(`Simulation 결과: ${RESULT_LABEL[run.result]}`, 'info')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Simulation Mode" />

      <main className="flex-1 space-y-4 px-4 py-6">
        <Link to="/" className="text-xs text-neutral-500 hover:text-neutral-300">
          ← 홈으로
        </Link>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-500">Queue 길이</p>
          <p className="mt-1 text-xl font-semibold text-neutral-50">
            {queue.length}
          </p>
        </div>

        {queue.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
            실행 대기 중인 예약이 없습니다 (Ready/Running 상태 예약이 없음)
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((item) => {
              const reservation = reservationManager.getById(
                item.context.reservationId
              )
              const run = runs[item.context.reservationId]
              const version = pluginManager.getVersion(item.context.site)
              const capabilities = pluginManager.getCapabilities(
                item.context.site
              )

              return (
                <div
                  key={item.context.reservationId}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-neutral-50">
                      {reservation?.title ?? item.context.reservationId}
                    </h3>
                    <span className="text-xs text-neutral-500">
                      우선순위 {item.context.priority}
                    </span>
                  </div>

                  {/* Plugin 정보: 이름 / Version / Capability */}
                  <div className="mt-2 space-y-0.5 text-xs text-neutral-500">
                    <p>
                      Plugin: {SITE_LABELS[item.context.site]}
                      {version ? ` (v${formatVersion(version)})` : ' (미설치)'}
                    </p>
                    <p>
                      Capabilities:{' '}
                      {capabilities.length > 0
                        ? capabilities.map(getCapabilityLabel).join(', ')
                        : '-'}
                    </p>
                  </div>

                  {/* Execution Timeline: 실행 전에는 Queue/Ready 단계만 표시한다. */}
                  <ol className="mt-3 space-y-1">
                    {(
                      run?.timeline ?? [
                        { step: 'QUEUED' as const, at: item.queuedAt },
                        { step: 'READY' as const, at: item.queuedAt },
                      ]
                    ).map((entry, index) => (
                      <li
                        key={`${entry.step}-${index}`}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-neutral-300">
                          {index + 1}. {STEP_LABEL[entry.step]}
                        </span>
                        <span className="text-neutral-500">
                          {formatTimelineTime(entry.at)}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleRun(item)}
                      className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      시뮬레이션 실행
                    </button>
                    {run && (
                      <span className="text-xs text-neutral-400">
                        결과: {RESULT_LABEL[run.result]}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default Simulation
