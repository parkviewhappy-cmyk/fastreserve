import { describe, it, expect } from 'vitest'
import { DEFAULT_DISCOVERY_RULE } from './discoveryRule'

/** DiscoveryRule Unit Test. 기본 TTL 값이 PM 지시(30분)와 일치하는지 확인한다. */
describe('DEFAULT_DISCOVERY_RULE', () => {
  it('캐시 TTL 기본값은 30분이다', () => {
    expect(DEFAULT_DISCOVERY_RULE.cacheTtlMinutes).toBe(30)
  })
})
