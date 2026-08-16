import { SiteType, type Reservation } from '@/types/reservation'
import type { ReservationDraft } from '@/domain/reservation'
import { DiscoveryStatus, type DiscoveryItem } from '../types'
import { parseLocalDateTime } from '@/utils/time'

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
 */
export function formatDDay(openTime: string, now: Date): string {
  const openDate = parseLocalDateTime(openTime)
  const diffDays = Math.ceil((openDate.getTime() - now.getTime()) / DAY_MS)
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

/** Discovery 도메인이 다루는 사이트는 현재 Interpark 하나뿐이다(MVP 범위, Reservation과 동일). */
export const DISCOVERY_SUPPORTED_SITE = SiteType.Interpark
