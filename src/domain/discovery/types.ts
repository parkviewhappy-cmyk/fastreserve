import type { SiteType } from '@/types/reservation'

/**
 * Discovery(공연 찾기) 아이템의 예매 상태.
 * Reservation의 ReservationStatus(개인 예약의 상태)와는 다른 개념이다:
 * DiscoveryStatus는 "그 공연 자체의 티켓 오픈 상태"를 나타낸다.
 */
export enum DiscoveryStatus {
  /** 오픈예정: 아직 예매가 시작되지 않았다. */
  Upcoming = 'UPCOMING',
  /** 예매중: 현재 예매가 진행 중이다. */
  Open = 'OPEN',
  /** 종료: 예매가 마감되었다. */
  Closed = 'CLOSED',
}

/**
 * Discovery 아이템(발견된 공연 1건).
 * PM 지시(Sprint 11): "공식적으로 공개된 정보만 사용"한다. 이번 Sprint에서는
 * 실제 공식 API/RSS 연동 대신 Mock Data Provider를 사용하며(1단계 조사 결과 참고),
 * 각 아이템은 실제 공연이 아니라 Mock 데이터임을 명시한다(source 필드).
 *
 * openTime은 Reservation.openTime과 동일한 포맷(YYYY-MM-DDTHH:mm:ss, Local Time)을
 * 사용해 [예약 준비] 클릭 시 Reservation Draft로 그대로 변환할 수 있게 했다.
 */
export interface DiscoveryItem {
  id: string
  /** 공연/이벤트명 */
  title: string
  /** 아티스트/공연 주체명. 검색 대상 필드다. */
  artist: string
  genre?: string
  venue?: string
  /** 공연 날짜(YYYY-MM-DD) */
  eventDate: string
  /** 공연 시간(HH:mm). 아직 공지되지 않았으면 undefined. */
  eventTime?: string
  /** 예매 오픈 일시(YYYY-MM-DDTHH:mm:ss, Local Time) */
  openTime: string
  status: DiscoveryStatus
  /** 예매 페이지 URL. tickets.interpark.com 도메인만 사용한다(Reservation URL 검증 규칙과 동일). */
  url?: string
  site: SiteType
  /** 데이터 출처 표시. 현재는 항상 'MOCK'이다(1단계 조사 결과: 공식 API/RSS 미확보). */
  source: 'MOCK'
}

/** LocalStorage에 저장되는 Discovery 캐시 단위. */
export interface DiscoveryCache {
  items: DiscoveryItem[]
  /** 캐시가 채워진 시각(ISO). TTL 판정에 사용한다. */
  fetchedAt: string
}
