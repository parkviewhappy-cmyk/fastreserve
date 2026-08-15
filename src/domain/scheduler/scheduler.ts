import type { Reservation } from '@/types/reservation'
import { ReservationStatus } from '@/types/reservation'
import { reservationManager, ReservationManager } from '@/domain/reservation'
import { readyEngine, ReadyEngine } from '@/domain/ready'
import { getNow } from '@/utils/time'
import type { ExecutionContext } from './types'
import { createExecutionContext } from './executionContext.factory'

/**
 * Scheduler.
 * Sprint 5 범위: 구조만 만들며 실제로 실행(자동 예매 등)하지 않는다.
 * 아래 메서드들은 명시적으로 호출해야만 동작하며, setInterval 등 자동 실행 로직을 두지 않는다.
 * 실제 주기 실행/자동화는 Sprint 6에서 구현한다.
 *
 * Reservation Manager / Ready Engine은 수정하지 않고 그대로 사용한다.
 */
export class Scheduler {
  constructor(
    private readonly manager: ReservationManager = reservationManager,
    private readonly engine: ReadyEngine = readyEngine
  ) {}

  /** 현재시간 확인 */
  getCurrentTime(): Date {
    return getNow()
  }

  /** Reservation Scan: 전체 예약 목록을 조회한다. */
  scanReservations(): Reservation[] {
    return this.manager.list()
  }

  /** Ready Engine 호출: Ready 상태(오픈 임박)인 예약만 골라낸다. */
  evaluateReadyReservations(now: Date = this.getCurrentTime()): Reservation[] {
    return this.engine.getReadyReservations(now)
  }

  /**
   * Execution Queue 생성.
   * Ready 또는 Running 상태(지금 처리해야 하는) 예약들을 openTime 오름차순으로 정렬해
   * ExecutionContext 큐를 만든다. 실제 실행(Execution Engine)은 아직 구현하지 않는다.
   */
  buildExecutionQueue(now: Date = this.getCurrentTime()): ExecutionContext[] {
    const reservations = this.scanReservations()
    const actionable = reservations.filter((reservation) => {
      const status = this.engine.getReservationStatus(reservation, now)
      return (
        status === ReservationStatus.Ready ||
        status === ReservationStatus.Running
      )
    })
    const sorted = [...actionable].sort((a, b) =>
      a.openTime.localeCompare(b.openTime)
    )
    return sorted.map((reservation, index) =>
      createExecutionContext(reservation, index + 1)
    )
  }
}

/** 기본 Scheduler 인스턴스. */
export const scheduler = new Scheduler()
