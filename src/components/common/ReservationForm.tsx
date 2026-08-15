import { useState, type FormEvent } from 'react'
import FormField from './FormField'

export interface ReservationFormValues {
  title: string
  eventName: string
  eventDate: string
  eventTime: string
  /** <input type="datetime-local"> 원시 값 (YYYY-MM-DDTHH:mm) */
  openTime: string
  preferredSeat: string
  ticketCount: number
  url: string
  memo: string
}

interface ReservationFormProps {
  initialValue?: ReservationFormValues
  submitLabel: string
  errors?: string[]
  onSubmit: (values: ReservationFormValues) => void
  onCancel: () => void
}

const DEFAULT_VALUES: ReservationFormValues = {
  title: '',
  eventName: '',
  eventDate: '',
  eventTime: '',
  openTime: '',
  preferredSeat: '',
  ticketCount: 1,
  url: '',
  memo: '',
}

const inputClass =
  'w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-primary-600 focus:outline-none'

/**
 * 예약 등록/수정에 공용으로 사용하는 재사용 가능한 폼 컴포넌트.
 * Business Logic(검증, 저장)은 포함하지 않으며, 입력값을 그대로 onSubmit으로 전달만 한다.
 */
function ReservationForm({
  initialValue,
  submitLabel,
  errors = [],
  onSubmit,
  onCancel,
}: ReservationFormProps) {
  const [values, setValues] = useState<ReservationFormValues>(
    initialValue ?? DEFAULT_VALUES
  )

  function handleChange<K extends keyof ReservationFormValues>(
    key: K,
    value: ReservationFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-xs text-red-300">
          <ul className="list-inside list-disc space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <FormField label="예약명">
        <input
          type="text"
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="사이트">
        <input
          type="text"
          value="인터파크"
          disabled
          className={`${inputClass} cursor-not-allowed opacity-60`}
        />
      </FormField>

      <FormField label="공연명">
        <input
          type="text"
          value={values.eventName}
          onChange={(e) => handleChange('eventName', e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="공연일">
        <input
          type="date"
          value={values.eventDate}
          onChange={(e) => handleChange('eventDate', e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="공연시간">
        <input
          type="time"
          value={values.eventTime}
          onChange={(e) => handleChange('eventTime', e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="예약 시작시간">
        <input
          type="datetime-local"
          value={values.openTime}
          onChange={(e) => handleChange('openTime', e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="선호 좌석 (선택)">
        <input
          type="text"
          value={values.preferredSeat}
          onChange={(e) => handleChange('preferredSeat', e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="인원">
        <input
          type="number"
          min={1}
          value={values.ticketCount}
          onChange={(e) => handleChange('ticketCount', Number(e.target.value))}
          className={inputClass}
        />
      </FormField>

      <FormField label="URL (선택)">
        <input
          type="url"
          value={values.url}
          onChange={(e) => handleChange('url', e.target.value)}
          className={inputClass}
          placeholder="https://tickets.interpark.com/..."
        />
      </FormField>

      <FormField label="메모 (선택)">
        <textarea
          value={values.memo}
          onChange={(e) => handleChange('memo', e.target.value)}
          rows={3}
          className={inputClass}
        />
      </FormField>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-neutral-800 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-900"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ReservationForm
