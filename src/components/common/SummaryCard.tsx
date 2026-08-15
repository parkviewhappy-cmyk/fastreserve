interface SummaryCardProps {
  label: string
  value: number
}

/** 숫자 요약 정보를 보여주는 재사용 가능한 카드. Home Dashboard 등에서 사용한다. */
function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-neutral-50">{value}</p>
    </div>
  )
}

export default SummaryCard
