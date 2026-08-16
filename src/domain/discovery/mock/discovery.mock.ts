import { SiteType } from '@/types/reservation'
import { DiscoveryStatus, type DiscoveryItem } from '../types'
import { toDateString } from '@/utils/time'

/** now로부터 days일 뒤의 날짜 문자열(YYYY-MM-DD)을 반환한다. */
function daysFromNow(now: Date, days: number): string {
  const date = new Date(now)
  date.setDate(date.getDate() + days)
  return toDateString(date)
}

/** now로부터 days일 뒤, 지정한 시:분의 Local Time 문자열(YYYY-MM-DDTHH:mm:ss)을 반환한다. */
function localDateTimeFromNow(
  now: Date,
  days: number,
  hour: number,
  minute: number
): string {
  return `${daysFromNow(now, days)}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
}

/**
 * Mock Discovery 데이터 생성기.
 * PM 지시(Sprint 11, 1단계 조사 결과 반영): 인터파크는 이 프로젝트가 사용할 수 있는
 * 공식 API/RSS를 제공하지 않아(조사 상세는 README 참고), 현재는 Mock 데이터로 화면을
 * 구성한다. 항목의 날짜는 매번 호출 시점(now) 기준 상대값으로 계산해 "만료된 옛날 날짜"가
 * 표시되지 않도록 했다.
 *
 * 실제 서비스 연동 시에는 이 함수 대신 실제 API/RSS 응답을 DiscoveryItem[]으로 변환하는
 * Provider로 교체한다(provider/discovery.provider.ts 참고, SessionChecker와 동일한
 * 교체 가능 구조).
 */
export function createMockDiscoveryItems(now: Date): DiscoveryItem[] {
  return [
    {
      id: 'mock-discovery-01',
      title: '아이유 콘서트 - 서울',
      artist: '아이유',
      genre: '콘서트',
      venue: '잠실종합운동장',
      eventDate: daysFromNow(now, 45),
      eventTime: '19:00',
      openTime: localDateTimeFromNow(now, 10, 20, 0),
      status: DiscoveryStatus.Upcoming,
      url: 'https://tickets.interpark.com/goods/26000101',
      site: SiteType.Interpark,
      source: 'MOCK',
    },
    {
      id: 'mock-discovery-02',
      title: '임영웅 IM HERO TOUR - 서울',
      artist: '임영웅',
      genre: '콘서트',
      venue: 'KSPO DOME',
      eventDate: daysFromNow(now, 30),
      eventTime: '18:00',
      openTime: localDateTimeFromNow(now, 3, 14, 0),
      status: DiscoveryStatus.Upcoming,
      url: 'https://tickets.interpark.com/goods/26000102',
      site: SiteType.Interpark,
      source: 'MOCK',
    },
    {
      id: 'mock-discovery-03',
      title: '세븐틴 팬미팅',
      artist: '세븐틴',
      genre: '팬미팅',
      venue: '고척스카이돔',
      eventDate: daysFromNow(now, 20),
      eventTime: '17:00',
      openTime: localDateTimeFromNow(now, -2, 11, 0),
      status: DiscoveryStatus.Open,
      url: 'https://tickets.interpark.com/goods/26000103',
      site: SiteType.Interpark,
      source: 'MOCK',
    },
    {
      id: 'mock-discovery-04',
      title: '뮤지컬 <레미제라블>',
      artist: '레미제라블 내한공연팀',
      genre: '뮤지컬',
      venue: '블루스퀘어',
      eventDate: daysFromNow(now, 60),
      eventTime: '19:30',
      openTime: localDateTimeFromNow(now, 15, 11, 0),
      status: DiscoveryStatus.Upcoming,
      url: 'https://tickets.interpark.com/goods/26000104',
      site: SiteType.Interpark,
      source: 'MOCK',
    },
    {
      id: 'mock-discovery-05',
      title: '아이유 팬미팅 - 부산',
      artist: '아이유',
      genre: '팬미팅',
      venue: 'BEXCO',
      eventDate: daysFromNow(now, 90),
      eventTime: '18:30',
      openTime: localDateTimeFromNow(now, 25, 20, 0),
      status: DiscoveryStatus.Upcoming,
      site: SiteType.Interpark,
      source: 'MOCK',
    },
    {
      id: 'mock-discovery-06',
      title: '재즈 페스티벌 2026',
      artist: '다수 아티스트',
      genre: '페스티벌',
      venue: '올림픽공원',
      eventDate: daysFromNow(now, -5),
      eventTime: '15:00',
      openTime: localDateTimeFromNow(now, -30, 10, 0),
      status: DiscoveryStatus.Closed,
      url: 'https://tickets.interpark.com/goods/26000106',
      site: SiteType.Interpark,
      source: 'MOCK',
    },
  ]
}
