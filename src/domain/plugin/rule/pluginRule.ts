import type { PluginVersion } from '../types'

/**
 * PluginRule.
 * Plugin 등록/설치 시 참조하는 기준값을 매직 넘버/매직 조건 없이 정의한다.
 * PM 지시(Sprint 7): "Plugin은 Rule만 참조합니다" - Plugin Manager의 등록 로직은
 * 이 Rule의 값만 사용하며 별도의 하드코딩된 기본값을 두지 않는다.
 */
export interface PluginRule {
  /** 등록 시 자동으로 활성화할지 여부. */
  autoEnable: boolean
  /** 동일 사이트에 여러 Version을 동시에 허용할지 여부. Sprint 7에서는 값만 정의한다. */
  allowMultipleVersion: boolean
  /** 등록 시 기본으로 기록할 Version. */
  defaultVersion: PluginVersion
}

export const DEFAULT_PLUGIN_RULE: PluginRule = {
  autoEnable: true,
  allowMultipleVersion: false,
  defaultVersion: { major: 1, minor: 0, patch: 0 },
}
