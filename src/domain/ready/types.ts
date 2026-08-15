import type { Reservation, ReservationStatus } from '@/types/reservation'

/**
 * Ready Engine의 Dashboard 요약 정보.
 * PM Review 반영(Sprint 4): Ready와 Running을 합산하지 않고 별도 필드로 관리한다.
 */
export interface DashboardSummary {
  totalReservation: number
  todayReservation: number
  waitingReservation: number
  preparingReservation: number
  readyReservation: number
  runningReservation: number
  completedReservation: number
  failedReservation: number
}

/** Reservation과 계산된 상태를 함께 담는 헬퍼 타입. */
export interface ReservationWithStatus {
  reservation: Reservation
  status: ReservationStatus
}
