import { SessionStatus } from '../types'

const SESSION_STATUS_LABEL: Record<SessionStatus, string> = {
  [SessionStatus.Unknown]: '확인 필요',
  [SessionStatus.Ready]: '로그인됨',
  [SessionStatus.Expired]: '세션 만료',
  [SessionStatus.LoginRequired]: '로그인 필요',
  [SessionStatus.Error]: '오류',
}

/** SessionStatus에 대응하는 한글 라벨을 반환한다. UI 표시용. */
export function getSessionStatusLabel(status: SessionStatus): string {
  return SESSION_STATUS_LABEL[status]
}
