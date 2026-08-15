import { ReservationStatus } from '@/types/reservation'
import type { Reservation } from '@/types/reservation'

/**
 * Reservation 도메인 모델.
 * 순수 함수로만 구성하며, 저장소(LocalStorage/DB/API)에 의존하지 않는다.
 * Sprint 2 범위: 상태 판별 등 도메인 규칙만 포함한다. (CRUD/카운트다운 로직 제외)
 */

/** 아직 종료되지 않은(진행 중인) 예약인지 판별한다. */
export function isActiveReservation(reservation: Reservation): boolean {
  return (
    reservation.status !== ReservationStatus.Completed &&
    reservation.status !== ReservationStatus.Failed
  )
}

/** 예약이 실패 상태인지 판별한다. */
export function isFailedReservation(reservation: Reservation): boolean {
  return reservation.status === ReservationStatus.Failed
}

const STATUS_LABEL: Record<ReservationStatus, string> = {
  [ReservationStatus.Idle]: '대기',
  [ReservationStatus.Waiting]: '예약 준비중',
  [ReservationStatus.Preparing]: '준비중',
  [ReservationStatus.Ready]: '준비 완료',
  [ReservationStatus.Running]: '진행중',
  [ReservationStatus.Completed]: '완료',
  [ReservationStatus.Failed]: '실패',
}

/** 상태값에 대응하는 한글 라벨을 반환한다. UI 표시용. */
export function getStatusLabel(status: ReservationStatus): string {
  return STATUS_LABEL[status]
}
