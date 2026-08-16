import type { DiscoveryItem } from '../types'
import { createMockDiscoveryItems } from '../mock/discovery.mock'
import { getNow } from '@/utils/time'

/**
 * Discovery Data Provider.
 * 공연 오픈 정보를 가져오는 전략을 나타낸다. SessionChecker(Sprint 8)와 동일한
 * 교체 가능 구조: 지금은 Mock Provider를 기본값으로 쓰고, 실제 공식 API/RSS
 * 연동이 확보되면 이 타입을 만족하는 새 Provider로 교체하기만 하면 된다.
 * DiscoveryManager/Repository의 나머지 로직은 그대로 유지된다.
 *
 * PM 지시(Sprint 11, 1단계): "공식적으로 공개된 정보만 사용"하고 크롤링 우회/비공개 API는
 * 구현하지 않는다. 1단계 조사 결과(README 참고) 이번 Sprint에서는 실제 연동 대상이
 * 확보되지 않아 Mock으로 구현한다. Mock은 어디까지나 임시(placeholder) 구현체이며,
 * 실제 서비스에 사용할 목적이 아니다(README "Sprint 11 PM Review 수정" 섹션 참고).
 *
 * TODO(PM Review, Sprint 11 수정): 지금은 DiscoveryDataProvider 하나(Mock)만 사용하지만,
 * 향후 여러 출처를 조합하는 Composite Provider 구조로 확장할 수 있도록 설계를 열어둔다.
 * 예상하는 구성 요소(모두 이 동일한 DiscoveryDataProvider 타입을 만족):
 * - Official Provider: 공식 API/RSS/공지 등 실제 연동이 확보되면 사용할 Provider.
 * - Manual Provider: 운영자가 수동으로 입력/등록한 공연 오픈 정보를 제공하는 Provider.
 * - Favorite Provider: 사용자가 즐겨찾기한 아티스트 위주로 우선 노출하는 Provider.
 * Composite Provider는 이 여러 Provider의 결과를 병합/우선순위 조정해 하나의
 * DiscoveryItem[]로 합치는 역할을 한다(예: Official 우선, 없으면 Manual, 그 위에 Favorite로
 * 정렬). 이번 수정에서는 설계 방향만 문서화하며, 실제 Composite 구현이나 Manager/Repository
 * 변경은 하지 않는다 - DiscoveryManager는 지금처럼 단일 DiscoveryDataProvider를 그대로 주입받는다.
 */
export type DiscoveryDataProvider = (now: Date) => DiscoveryItem[]

/**
 * 기본(Mock) Discovery Data Provider.
 * TODO(PM Review, Sprint 11 수정): 이 Mock 구현체는 임시 placeholder다. 향후 위 Composite
 * Provider 구조가 도입되면, 이 값은 "Official/Manual 데이터가 전혀 없을 때의 최후 대체
 * 데이터" 정도의 역할로 축소되거나, 개발/데모 환경 전용으로만 사용될 수 있다.
 */
export const mockDiscoveryDataProvider: DiscoveryDataProvider = (now: Date = getNow()) =>
  createMockDiscoveryItems(now)
