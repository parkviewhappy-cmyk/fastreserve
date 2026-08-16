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
 * 확보되지 않아 Mock으로 구현한다.
 */
export type DiscoveryDataProvider = (now: Date) => DiscoveryItem[]

/** 기본(Mock) Discovery Data Provider. */
export const mockDiscoveryDataProvider: DiscoveryDataProvider = (now: Date = getNow()) =>
  createMockDiscoveryItems(now)
