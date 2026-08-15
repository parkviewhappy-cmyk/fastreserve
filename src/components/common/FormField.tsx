import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
}

/** 라벨 + 입력 요소를 감싸는 재사용 가능한 폼 필드 레이아웃. */
function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-neutral-400">{label}</span>
      {children}
    </label>
  )
}

export default FormField
