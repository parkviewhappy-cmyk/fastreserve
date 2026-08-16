# Bug Tracker

PM 지시(Sprint 13, ⑤)에 따라 만든 재사용 가능한 버그 기록 양식이다. 새 버그를 발견하면
아래 표 맨 아래에 새 행을 추가한다(기존 행은 삭제하지 않고 Status만 갱신한다).

## 필드 설명

- **ID**: `BUG-XXX` 형식(3자리, 발견 순서대로 증가)
- **Priority**: `Critical` / `High` / `Medium` / `Low`
- **Description**: 증상을 한 줄로 설명(재현 조건 포함 권장)
- **Status**: `Open` / `In Progress` / `Fixed` / `Won't Fix`
- **Sprint**: 발견된 Sprint
- **Fixed Version**: 수정이 반영된 `package.json` version(미수정이면 `-`)

## 기록

| ID | Priority | Description | Status | Sprint | Fixed Version |
|---|---|---|---|---|---|
| BUG-001 | Medium | `formatDDay()`가 정확한 밀리초 차이를 24시간 단위로 올림 계산해서, "오늘 20시 오픈"인데 지금이 "오늘 09시"면 같은 날짜인데도 "D-1"로 잘못 표시됨(사용자는 "D-DAY"를 기대) | Fixed | Sprint 12 | 0.12.0 |
| BUG-002 | Low | Discovery 화면에서 이미 종료(`DiscoveryStatus.Closed`)된 공연도 [예약 준비] 버튼을 눌러 의미 없는 Reservation을 생성할 수 있었음 | Fixed | Sprint 12 | 0.12.0 |
| BUG-003 | Low | `src/domain/reservation/service/reservation.service.ts`(`ReservationService`/`reservationService`)와 그 의존 파일(`reservation.repository.mock.ts`, `reservation/mock/reservation.mock.ts`)이 Sprint 3에서 `ReservationManager`(LocalStorage 기반)로 완전히 대체된 뒤에도 삭제되지 않고 남아 있음. 정적 분석 결과 앱의 어떤 화면도 더 이상 이 파일들을 사용하지 않는다(Sprint 13 ① Build 오류 전수 점검 중 발견) | Open | Sprint 13 | - |
