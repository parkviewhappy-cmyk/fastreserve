/**
 * ReadyRule.
 * Ready Engine의 상태 계산에 사용되는 시간 기준을 코드가 아닌 하나의 설정 객체로 관리한다.
 * PM Review 반영(Sprint 4): 모든 계산은 이 ReadyRule만 사용하며, Magic Number를 직접
 * 코드에 작성하지 않는다.
 *
 * 값의 의미: "openTime 기준 몇 분 전부터 해당 상태로 볼 것인가"이다.
 * - preparingThresholdMinutes: 이 값(분) 이하로 남으면 Preparing
 * - readyThresholdMinutes: 이 값(분) 이하로 남으면 Ready
 * - runningThresholdMinutes: 이 값(분) 이하로 남으면 Running (0이면 오픈 시각부터 Running)
 */
export interface ReadyRule {
  preparingThresholdMinutes: number
  readyThresholdMinutes: number
  runningThresholdMinutes: number
}

/** 기본 ReadyRule. PM 지시 기본값: Preparing 60분, Ready 10분, Running 0분. */
export const DEFAULT_READY_RULE: ReadyRule = {
  preparingThresholdMinutes: 60,
  readyThresholdMinutes: 10,
  runningThresholdMinutes: 0,
}
