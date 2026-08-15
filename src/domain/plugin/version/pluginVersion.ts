import type { PluginVersion } from '../types'

/**
 * Plugin Version 비교 Utility.
 * PM 지시(Sprint 7): Version 비교 Utility를 생성한다.
 */

/** a와 b를 비교한다. a가 크면 양수, 작으면 음수, 같으면 0을 반환한다. */
export function compareVersions(a: PluginVersion, b: PluginVersion): number {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  return a.patch - b.patch
}

/** "major.minor.patch" 형식의 문자열로 변환한다. */
export function formatVersion(version: PluginVersion): string {
  return `${version.major}.${version.minor}.${version.patch}`
}

export function isVersionEqual(a: PluginVersion, b: PluginVersion): boolean {
  return compareVersions(a, b) === 0
}

export function isVersionGreaterThan(a: PluginVersion, b: PluginVersion): boolean {
  return compareVersions(a, b) > 0
}

export function isVersionLessThan(a: PluginVersion, b: PluginVersion): boolean {
  return compareVersions(a, b) < 0
}
