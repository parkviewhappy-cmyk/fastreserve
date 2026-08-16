import { SiteType, type Reservation } from '@/types/reservation'
import type { ReservationDraft } from '@/domain/reservation'
import { DiscoveryStatus, type DiscoveryItem } from '../types'
import { parseLocalDateTime, toDateString } from '@/utils/time'

const DAY_MS = 24 * 60 * 60 * 1000

const DISCOVERY_STATUS_LABEL: Record<DiscoveryStatus, string> = {
  [DiscoveryStatus.Upcoming]: '오픈예정',
  [DiscoveryStatus.Open]: '예매중',
  [DiscoveryStatus.Closed]: '종료',
}

/** DiscoveryStatus에 대응하는 한글 라벨을 반환한다. UI 표시용. */
export function getDiscoveryStatusLabel(status: DiscoveryStatus): string {
  return DISCOVERY_STATUS_LABEL[status]
}

/**
 * openTime까지 남은 일수를 "D-n"/"D-DAY"/"D+n" 형태로 표시한다.
 * PM 지시(Sprint 11) 예시: "D-10"과 같은 형태.
 *
 * 버그 수정(Sprint 12, ⑦ 발견된 버그 수정): 기존에는 openTime과 now의 정확한 시:분:초
 * 차이를 24시간 단위로 올림(Math.ceil)해서 계산했다. 그 결과 "오늘 20시 오픈"인데
 * 지금이 "오늘 09시"면 같은 날짜인데도 "D-1"로 표시되는 오류가 있었다(단위 테스트로 발견).
 * 사용자가 기대하는 "D-DAY"는 "오픈 시각까지 정확히 24시간 이내"가 아니라 "오늘이 오픈일인가"
 * 이므로, 시:분:초를 버리고 날짜(YYYY-MM-DD)만 비교하도록 수정했다.
 */
export function formatDDay(openTime: string, now: Date): string {
  const openDateOnly = new Date(toDateString(parseLocalDateTime(openTime))).getTime()
  const nowDateOnly = new Date(toDateString(now)).getTime()
  const diffDays = Math.round((openDateOnly - nowDateOnly) / DAY_MS)
  if (diffDays === 0) return 'D-DAY'
  if (diffDays > 0) return `D-${diffDays}`
  return `D+${Math.abs(diffDays)}`
}

/** 제목/아티스트 기준으로 키워드 검색(대소문자 무시, 부분 일치)한다. */
export function filterDiscoveryByKeyword(
  items: DiscoveryItem[],
  keyword: string
): DiscoveryItem[] {
  const trimmed = keyword.trim().toLowerCase()
  if (!trimmed) return items
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(trimmed) ||
      item.artist.toLowerCase().includes(trimmed)
  )
}

/**
 * DiscoveryItem을 ReservationDraft로 변환한다([예약 준비] 버튼 클릭 시 사용).
 * eventTime이 아직 공지되지 않은 경우 '00:00'을 기본값으로 사용한다(Reservation 필수값).
 * ticketCount는 기본 1명으로 시작하며, 이후 예약 상세 화면에서 사용자가 직접 수정할 수 있다.
 */
export function toReservationDraft(item: DiscoveryItem): ReservationDraft {
  return {
    title: item.title,
    site: item.site,
    eventName: item.artist,
    eventDate: item.eventDate,
    eventTime: item.eventTime ?? '00:00',
    openTime: item.openTime,
    url: item.url,
    memo: `Discovery에서 연결됨 (Mock 데이터, ${item.venue ?? '장소 미정'})`,
    ticketCount: 1,
  }
}

/**
 * 기존 예약 중 이 DiscoveryItem과 동일한 공연(artist/eventDate/eventTime)으로 이미
 * 생성된 예약이 있는지 찾는다. [예약 준비]를 여러 번 눌러도 중복 예약이 생기지 않도록
 * ReservationManager.create()의 중복 검사와 동일한 기준을 재사용한다.
 */
export function findLinkedReservation(
  item: DiscoveryItem,
  reservations: Reservation[]
): Reservation | undefined {
  return reservations.find(
    (reservation) =>
      reservation.eventName === item.artist &&
      reservation.eventDate === item.eventDate &&
      reservation.eventTime === (item.eventTime ?? '00:00')
  )
}

/**
 * Discovery 목록 정렬 순서를 정하는 상태별 가중치.
 * PM 지시(Sprint 12, ① UI/UX 개선): 예매중/오픈예정 공연을 먼저 보여주고,
 * 이미 종료된 공연은 목록 뒤로 보낸다.
 */
const STATUS_SORT_WEIGHT: Record<DiscoveryStatus, number> = {
  [DiscoveryStatus.Open]: 0,
  [DiscoveryStatus.Upcoming]: 0,
  [DiscoveryStatus.Closed]: 1,
}

/**
 * Discovery 목록을 정렬한다: 종료(Closed)된 공연은 뒤로 보내고,
 * 그 외에는 예매 오픈 일시(openTime)가 가까운 순으로 정렬한다.
 * 원본 배열은 변경하지 않는다(새 배열을 반환).
 */
export function sortDiscoveryItems(items: DiscoveryItem[]): DiscoveryItem[] {
  return [...items].sort((a, b) => {
    const weightDiff = STATUS_SORT_WEIGHT[a.status] - STATUS_SORT_WEIGHT[b.status]
    if (weightDiff !== 0) return weightDiff
    return (
      parseLocalDateTime(a.openTime).getTime() -
      parseLocalDateTime(b.openTime).getTime()
    )
  })
}

/**
 * 목록에 실제로 존재하는 장르만 중복 없이 반환한다(검색 편의성 개선, Sprint 12 ②).
 * genre가 없는 아이템은 제외한다. 화면의 장르 필터 Chip 구성에 사용한다.
 */
export function getAvailableGenres(items: DiscoveryItem[]): string[] {
  const genres = items
    .map((item) => item.genre)
    .filter((genre): genre is string => Boolean(genre))
  return Array.from(new Set(genres))
}

/** 장르로 필터링한다. genre가 null/빈 문자열이면 필터링 없이 그대로 반환한다. */
export function filterDiscoveryByGenre(
  items: DiscoveryItem[],
  genre: string | null
): DiscoveryItem[] {
  if (!genre) return items
  return items.filter((item) => item.genre === genre)
}

/** Discovery 도메인이 다루는 사이트는 현재 Interpark 하나뿐이다(MVP 범위, Reservation과 동일). */
export const DISCOVERY_SUPPORTED_SITE = SiteType.Interpark
