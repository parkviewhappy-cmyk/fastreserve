export enum HealthResult {
  Good = 'GOOD',
  Warning = 'WARNING',
  Error = 'ERROR',
}

/** Dashboard에 표시하는 Health Check 결과 요약. */
export interface HealthCheckReport {
  result: HealthResult
  activeSiteCount: number
  loggedInSiteCount: number
  loginRequiredSiteCount: number
  /** 오픈이 임박(Ready)한 예약 수. Ready Engine 결과를 그대로 사용한다. */
  readyReservationCount: number
}
