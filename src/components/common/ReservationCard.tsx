import type { Reservation } from '@/types/reservation'
import { getStatusLabel } from '@/domain/reservation'
import StatusBadge from './StatusBadge'

interface ReservationCardProps {
  reservation: Reservation
  /** 남은 시간 등 부가 정보(선택). Sprint 3 Home 화면에서는 사용하지 않는다. */
  remainingTimeLabel?: string
}

/**
 * 예약 정보를 카드 형태로 보여주는 재사용 가능한 컴포넌트.
 * Business Logic(도메인 조회/가공)은 상위 컴포넌트와 domain/reservation이 담당하고,
 * 이 컴포넌트는 전달받은 데이터를 표시하는 역할만 한다.
 */
function ReservationCard({
  reservation,
  remainingTimeLabel,
}: ReservationCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-colors hover:border-neutral-700">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-neutral-50">
          {reservation.title}
        </h3>
        <StatusBadge
          status={reservation.status}
          label={getStatusLabel(reservation.status)}
        />
      </div>

      <div className="mt-2 space-y-1 text-xs text-neutral-400">
        <p>
          {reservation.eventDate} · {reservation.eventTime}
        </p>
        {remainingTimeLabel && (
          <p className="text-neutral-500">{remainingTimeLabel}</p>
        )}
      </div>
    </div>
  )
}

export default ReservationCard
