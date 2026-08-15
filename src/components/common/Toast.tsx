export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
}

const TOAST_STYLE: Record<ToastType, string> = {
  success: 'bg-primary-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-neutral-800 text-neutral-100',
}

/**
 * 화면 하단에 잠시 표시되는 알림 메시지. 재사용 가능한 표시 전용 컴포넌트.
 * 상태 관리는 hooks/useToast.tsx의 ToastProvider가 담당한다.
 */
function Toast({ message, type = 'info' }: ToastProps) {
  return (
    <div
      className={`pointer-events-auto rounded-lg px-4 py-3 text-sm shadow-lg ${TOAST_STYLE[type]}`}
    >
      {message}
    </div>
  )
}

export default Toast
