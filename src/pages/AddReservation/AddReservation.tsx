import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import ReservationForm, {
  type ReservationFormValues,
} from '@/components/common/ReservationForm'
import { reservationManager } from '@/domain/reservation'
import { SiteType } from '@/types/reservation'
import { useToast } from '@/hooks/useToast'
import { toIsoDateTime } from '@/utils/date'

/**
 * 예약 등록 화면.
 * ReservationForm(재사용 컴포넌트) + ReservationManager(Business Logic)로 구성한다.
 */
function AddReservation() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [errors, setErrors] = useState<string[]>([])

  function handleSubmit(values: ReservationFormValues) {
    const result = reservationManager.create({
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

    showToast('예약이 등록되었습니다.', 'success')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="예약 추가" />
      <main className="flex-1 px-4 py-6">
        <Link
          to="/"
          className="mb-4 inline-block text-xs text-neutral-500 hover:text-neutral-300"
        >
          ← 목록으로
        </Link>
        <ReservationForm
          submitLabel="저장"
          errors={errors}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
        />
      </main>
    </div>
  )
}

export default AddReservation
