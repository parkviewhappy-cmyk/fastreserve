import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/common/StatusBadge'
import Dialog from '@/components/common/Dialog'
import ReservationForm, {
  type ReservationFormValues,
} from '@/components/common/ReservationForm'
import { reservationManager, getStatusLabel } from '@/domain/reservation'
import { SiteType } from '@/types/reservation'
import { useToast } from '@/hooks/useToast'
import { toIsoDateTime, fromIsoDateTime } from '@/utils/date'

/**
 * 예약 상세 화면.
 * 조회 / 수정(ReservationForm 재사용) / 삭제(Dialog 확인) 기능을 제공한다.
 * Sprint 3 범위: 복사(복제) 기능은 개발 범위에 포함되지 않아 구현하지 않았다.
 */
function ReservationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const reservation = id ? reservationManager.getById(id) : undefined

  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  if (!reservation) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="예약 상세" />
        <main className="flex-1 px-4 py-6">
          <Link
            to="/"
            className="mb-4 inline-block text-xs text-neutral-500 hover:text-neutral-300"
          >
            ← 목록으로
          </Link>
          <p className="text-sm text-neutral-400">예약을 찾을 수 없습니다.</p>
        </main>
      </div>
    )
  }

  function handleUpdate(values: ReservationFormValues) {
    const result = reservationManager.update(reservation!.id, {
      title: values.title,
      site: SiteType.Interpark,
      eventName: values.eventName,
      eventDate: values.eventDate,
      eventTime: values.eventTime,
      openTime: toIsoDateTime(values.openTime),
      preferredSeat: values.preferredSeat || undefined,
      ticketCount: values.ticketCount,
      url: values.url || undefined,
      memo: values.memo || undefined,
    })

    if (!result.success) {
      setErrors(result.errors)
      showToast('입력값을 확인해주세요.', 'error')
      return
    }

    showToast('예약이 수정되었습니다.', 'success')
    setIsEditing(false)
    setErrors([])
  }

  function handleDelete() {
    reservationManager.remove(reservation!.id)
    setDeleteDialogOpen(false)
    showToast('예약이 삭제되었습니다.', 'success')
    navigate('/')
  }

  if (isEditing) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="예약 수정" />
        <main className="flex-1 px-4 py-6">
          <ReservationForm
            submitLabel="수정 완료"
            errors={errors}
            initialValue={{
              title: reservation.title,
              eventName: reservation.eventName,
              eventDate: reservation.eventDate,
              eventTime: reservation.eventTime,
              openTime: fromIsoDateTime(reservation.openTime),
              preferredSeat: reservation.preferredSeat ?? '',
              ticketCount: reservation.ticketCount,
              url: reservation.url ?? '',
              memo: reservation.memo ?? '',
            }}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditing(false)
              setErrors([])
            }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="예약 상세" />
      <main className="flex-1 space-y-4 px-4 py-6">
        <Link
          to="/"
          className="inline-block text-xs text-neutral-500 hover:text-neutral-300"
        >
          ← 목록으로
        </Link>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="flex items-start justify-between">
            <h2 className="text-base font-semibold text-neutral-50">
              {reservation.title}
            </h2>
            <StatusBadge
              status={reservation.status}
              label={getStatusLabel(reservation.status)}
            />
          </div>
          <dl className="mt-4 space-y-2 text-sm text-neutral-300">
            <DetailRow label="공연명" value={reservation.eventName} />
            <DetailRow label="공연일" value={reservation.eventDate} />
            <DetailRow label="공연시간" value={reservation.eventTime} />
            <DetailRow label="예약 시작시간" value={reservation.openTime} />
            <DetailRow
              label="선호 좌석"
              value={reservation.preferredSeat || '-'}
            />
            <DetailRow label="인원" value={`${reservation.ticketCount}명`} />
            <DetailRow label="URL" value={reservation.url || '-'} />
            <DetailRow label="메모" value={reservation.memo || '-'} />
          </dl>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex-1 rounded-xl border border-neutral-800 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-900"
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="flex-1 rounded-xl border border-red-900 py-3 text-sm font-medium text-red-400 hover:bg-red-950/40"
          >
            삭제
          </button>
        </div>
      </main>

      <Dialog
        open={isDeleteDialogOpen}
        title="예약을 삭제할까요?"
        description={`"${reservation.title}" 예약이 영구적으로 삭제됩니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right text-neutral-200">{value}</dd>
    </div>
  )
}

export default ReservationDetail
