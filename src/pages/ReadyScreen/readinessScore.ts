/**
 * 예약 준비 점수(Readiness Score) 계산 유틸.
 * PM 지시(Sprint 10, Reservation Assistant 전환): "예약 준비 점수"(100점 만점)를
 * Ready Screen과 Home에서 동일한 기준으로 표시해야 하므로, 점수 계산 로직을
 * 이 파일 하나로 공유한다(중복 코드 생성 금지 원칙).
 *
 * 새로운 Domain/Engine/Manager를 추가하지 않는다. 이 파일은 순수 함수 모음이며,
 * 기존 Manager(Session/Plugin/Reservation)가 반환한 상태값을 인자로 받아
 * 점수만 계산한다. 실제 상태 조회는 호출하는 화면(ReadyScreen/Home)이 담당한다.
 *
 * 구성 요소(PM 지시, 각 25점): 로그인 상태 / Plugin 상태 / 인터넷 상태 / 예약 URL 등록 여부.
 *
 * TODO(PM Review, Sprint 10 수정): 현재는 4개 항목을 동일하게 25점씩(균등 가중치) 채점한다.
 * 향후 항목별 중요도에 따라 가중치 방식으로 변경할 예정이다(예: Plugin 40 / Session 30 /
 * Internet 20 / URL 10). 가중치 확정 전까지는 현재 로직(POINTS_PER_ITEM = 25 균등 배분)을
 * 그대로 유지한다 - 이번 수정에서는 로직을 변경하지 않는다.
 */

export interface ReadinessChecklistItem {
  key: 'login' | 'plugin' | 'internet' | 'url'
  label: string
  ok: boolean
  points: number
}

export interface ReadinessScoreInput {
  /** Session이 로그인 가능 상태인지(SessionStatus.Ready). */
  loginReady: boolean
  /** Plugin이 정상 상태인지(PluginManager.isHealthy()). */
  pluginHealthy: boolean
  /** 인터넷 연결 여부(navigator.onLine). */
  internetOnline: boolean
  /** 예약 URL이 등록되어 있는지. */
  urlRegistered: boolean
}

export interface ReadinessScoreResult {
  /** 0~100 사이의 총점. */
  score: number
  checklist: ReadinessChecklistItem[]
}

const POINTS_PER_ITEM = 25

/**
 * 4개 항목(로그인/Plugin/인터넷/URL)을 각 25점으로 채점해 합산한다.
 * 순수 함수이며 어떤 외부 상태도 조회하지 않는다(테스트 용이성 확보).
 */
export function computeReadinessScore(input: ReadinessScoreInput): ReadinessScoreResult {
  const checklist: ReadinessChecklistItem[] = [
    {
      key: 'login',
      label: '로그인 상태',
      ok: input.loginReady,
      points: input.loginReady ? POINTS_PER_ITEM : 0,
    },
    {
      key: 'plugin',
      label: 'Plugin 상태',
      ok: input.pluginHealthy,
      points: input.pluginHealthy ? POINTS_PER_ITEM : 0,
    },
    {
      key: 'internet',
      label: '인터넷 상태',
      ok: input.internetOnline,
      points: input.internetOnline ? POINTS_PER_ITEM : 0,
    },
    {
      key: 'url',
      label: '예약 URL 등록',
      ok: input.urlRegistered,
      points: input.urlRegistered ? POINTS_PER_ITEM : 0,
    },
  ]

  const score = checklist.reduce((sum, item) => sum + item.points, 0)
  return { score, checklist }
}

/** 점수에 따른 짧은 상태 문구(화면 표시용). */
export function getReadinessLabel(score: number): string {
  if (score >= 100) return '예약 준비 완료'
  if (score >= 75) return '예약 준비 양호'
  if (score >= 50) return '예약 준비 보통'
  if (score > 0) return '예약 준비 부족'
  return '예약 준비 안 됨'
}
