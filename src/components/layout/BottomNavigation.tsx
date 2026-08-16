import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  to?: string
  active: boolean
}

/**
 * Sprint 1: Home만 구현되어 있어 나머지 탭은 비활성 상태로 표시한다.
 * Sprint 11(PM 지시): "🔍 공연 찾기"(Discovery, /discovery)를 실제 이동 가능한 링크로
 * 추가한다. Home도 함께 실제 링크로 전환했다(기존에는 라벨만 있고 이동 기능이 없었다).
 * History/Setting은 아직 화면이 없으므로 계속 비활성 상태로 남겨둔다.
 */
function BottomNavigation() {
  const location = useLocation()

  const items: NavItem[] = [
    { label: 'Home', to: '/', active: true },
    { label: '🔍 공연 찾기', to: '/discovery', active: true },
    { label: 'History', active: false },
    { label: 'Setting', active: false },
  ]

  return (
    <nav className="sticky bottom-0 z-10 flex h-16 items-center justify-around border-t border-neutral-800 bg-neutral-950/95 backdrop-blur">
      {items.map((item) =>
        item.active && item.to ? (
          <Link
            key={item.label}
            to={item.to}
            className={
              location.pathname === item.to
                ? 'text-sm font-medium text-primary-500'
                : 'text-sm font-medium text-neutral-300'
            }
          >
            {item.label}
          </Link>
        ) : (
          <span key={item.label} className="text-sm font-medium text-neutral-600">
            {item.label}
          </span>
        )
      )}
    </nav>
  )
}

export default BottomNavigation
