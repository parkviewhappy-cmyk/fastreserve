import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useToast } from '@/hooks/useToast'
import { scheduler } from '@/domain/scheduler'
import { reservationManager } from '@/domain/reservation'
import { ExecutionResult, type ExecutionQueueItem } from '@/domain/execution'
import { ReservationStatus } from '@/types/reservation'

const RESULT_LABEL: Record<ExecutionResult, string> = {
  [ExecutionResult.Success]: '성공(Mock)',
  [ExecutionResult.Failed]: '실패(Mock)',
  [ExecutionResult.Waiting]: '대기',
  [ExecutionResult.Running]: '진행중',
  [ExecutionResult.Skipped]: '건너뜀',
}

const STAGES = ['Ready', 'Queue', 'Running', 'Completed'] as const

/** 큐 항목의 현재 진행 단계를 계산한다. 실제 상태를 변경하지 않고 화면 표시용으로만 사용한다. */
function getStageIndex(status: ReservationStatus, result?: ExecutionResult): number {
  if (result === ExecutionResult.Success) return 3
  if (status === ReservationStatus.Running || result === ExecutionResult.Running) {
    return 2
  }
  // Queue에 포함된 항목은 이미 Ready를 지난 상태이므로 최소 Queue 단계로 표시한다.
  return 1
}

/**
 * Simulation Mode 화면 (/simulation).
 * Scheduler(→ Execution Engine → Site Adapter)가 계산한 Execution Queue를 보여주고,
 * 항목별로 Mock 실행을 시도해 ExecutionResult를 확인할 수 있다.
 *
 * PM 지시(Sprint 6): 실제 예약을 실행하지 않는다. 이 화면은 Execution Queue/Priority/
 * 상태 변화/Execution 순서를 확인하기 위한 Simulation 목적으로만 사용한다.
 * UI는 Execution Engine을 직접 호출하지 않고 Scheduler를 통해서만 접근한다.
 */
function Simulation() {
  const { showToast } = useToast()
  const [queue] = useState<ExecutionQueueItem[]>(() => scheduler.getExecutionQueue())
  const [results, setResults] = useState<Record<string, ExecutionResult>>({})

  function handleRun(item: ExecutionQueueItem) {
    const result = scheduler.simulateExecution(item.context)
    setResults((prev) => ({ ...prev, [item.context.reservationId]: result }))
    showToast(`Simulation 결과: ${RESULT_LABEL[result]}`, 'info')
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
              const result = results[item.context.reservationId]
              const stageIndex = getStageIndex(item.status, result)

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

                  <div className="mt-3 flex items-center gap-1">
                    {STAGES.map((stage, index) => (
                      <span
                        key={stage}
                        className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                          index <= stageIndex
                            ? 'bg-primary-500/20 text-primary-500'
                            : 'bg-neutral-800 text-neutral-600'
                        }`}
                      >
                        {stage}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleRun(item)}
                      className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      시뮬레이션 실행
                    </button>
                    {result && (
                      <span className="text-xs text-neutral-400">
                        결과: {RESULT_LABEL[result]}
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
