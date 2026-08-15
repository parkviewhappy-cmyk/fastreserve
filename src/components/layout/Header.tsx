interface HeaderProps {
  title: string
}

/**
 * 공통 상단 헤더.
 * 모든 페이지에서 재사용한다.
 */
function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b border-neutral-800 bg-neutral-950/90 px-4 backdrop-blur">
      <h1 className="text-base font-semibold text-neutral-50">{title}</h1>
    </header>
  )
}

export default Header
