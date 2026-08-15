import { ReservationStatus } from '@/types/reservation'

interface StatusBadgeProps {
  status: ReservationStatus
  label: string
}

const STATUS_STYLE: Record<ReservationStatus, string> = {
  [ReservationStatus.Idle]: 'bg-neutral-800 text-neutral-300',
  [ReservationStatus.Waiting]: 'bg-neutral-800 text-neutral-300',
  [ReservationStatus.Preparing]: 'bg-accent-500/20 text-accent-400',
  [ReservationStatus.Ready]: 'bg-primary-500/20 text-primary-500',
  [ReservationStatus.Running]: 'bg-primary-600/30 text-primary-500',
  [ReservationStatus.Completed]: 'bg-neutral-800 text-neutral-400',
  [ReservationStatus.Failed]: 'bg-red-500/20 text-red-400',
}

/**
 * 예약 상태를 표시하는 재사용 가능한 뱃지.
 * ReservationCard, Ready 화면 등에서 공통으로 사용한다.
 */
function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
