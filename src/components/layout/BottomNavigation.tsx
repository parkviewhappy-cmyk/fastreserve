interface NavItem {
  label: string
  active: boolean
}

// Sprint 1: Home만 구현되어 있어 나머지 탭은 비활성 상태로 표시한다.
// 이후 Sprint에서 History, Setting 라우트가 추가되면 활성화한다.
const NAV_ITEMS: NavItem[] = [
  { label: 'Home', active: true },
  { label: 'History', active: false },
  { label: 'Setting', active: false },
]

/**
 * 하단 네비게이션.
 * 재사용 가능한 컴포넌트로 페이지 전환 로직은 이후 Sprint에서 연결한다.
 */
function BottomNavigation() {
  return (
    <nav className="sticky bottom-0 z-10 flex h-16 items-center justify-around border-t border-neutral-800 bg-neutral-950/95 backdrop-blur">
      {NAV_ITEMS.map((item) => (
        <span
          key={item.label}
          className={
            item.active
              ? 'text-sm font-medium text-primary-500'
              : 'text-sm font-medium text-neutral-600'
          }
        >
          {item.label}
        </span>
      ))}
    </nav>
  )
}

export default BottomNavigation
