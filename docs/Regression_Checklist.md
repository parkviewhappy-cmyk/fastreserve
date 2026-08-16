# Regression Checklist

PM 지시(Sprint 13, ⑥)에 따라 만든 회귀 확인용 체크리스트다. 매 Sprint 종료 시 이 목록을
다시 확인해서, 새 기능을 추가하거나 기존 코드를 수정하는 과정에서 이미 동작하던 기존
기능이 깨지지 않았는지 검증한다. 이 개발 환경은 실제 브라우저/기기가 없어 아래 항목은
**정적 코드 검토(변경 파일 diff 확인)까지만 수행**하며, 실제 클릭 테스트는 PM이 로컬에서
진행해야 한다.

## 사용 방법

각 Sprint 완료 시:
1. 이번 Sprint에서 변경한 파일 목록(`git diff <base> --stat`)을 확인한다.
2. 아래 항목 중 변경된 파일과 관련된 항목을 표시하고, 코드 검토로 회귀 여부를 판단한다.
3. 실기기/브라우저 테스트가 가능해지면(Sprint 13 이후) 실제 클릭 테스트 결과로 갱신한다.

## 체크리스트

| 항목 | 관련 화면/파일 | Sprint 13 시점 상태 |
|---|---|---|
| Reservation 생성 | `AddReservation`, `domain/reservation` | 이번 Sprint에서 미변경 — 회귀 없음(정적 확인) |
| Reservation 수정 | `ReservationDetail`, `domain/reservation` | 이번 Sprint에서 미변경 — 회귀 없음(정적 확인) |
| Reservation 삭제 | `ReservationDetail`, `domain/reservation` | 이번 Sprint에서 미변경 — 회귀 없음(정적 확인) |
| History 저장 | (미구현) | 해당 사항 없음 — History Domain 자체가 없음 |
| Ready Screen | `pages/ReadyScreen`, `domain/execution`, `domain/scheduler` | 이번 Sprint에서 미변경 — 회귀 없음(정적 확인) |
| Plugin 상태 | `pages/PluginSettings`, `domain/plugin`, `domain/pluginManager` | 이번 Sprint에서 미변경 — 회귀 없음(정적 확인) |
| Session 상태 | `pages/SiteSettings`, `domain/session` | 이번 Sprint에서 미변경 — 회귀 없음(정적 확인) |
| Discovery | `pages/Discovery`, `domain/discovery` | Sprint 12에서 변경(정렬/장르 필터/버그 수정). 이번 Sprint(13)에서는 미변경 |
| Bottom Navigation | `components/layout/BottomNavigation` | 이번 Sprint에서 미변경 — 회귀 없음(정적 확인) |
| Simulation | `pages/Simulation`, `domain/scheduler` | 이번 Sprint에서 미변경 — 회귀 없음(정적 확인) |

## 참고

- "이번 Sprint에서 미변경"은 `git diff develop --stat` 결과 해당 파일이 diff에 나타나지
  않았다는 뜻이며, Sprint 13은 Build/Capacitor/문서 작업 위주라 대부분의 기존 화면 코드를
  건드리지 않았다.
- 실제 회귀는 코드가 변경되지 않아도 의존 관계(예: 공용 유틸 변경)를 통해 발생할 수 있으므로,
  Sprint 13처럼 코드 변경이 거의 없는 Sprint에서도 이 체크리스트 자체는 계속 유지한다.

## Sprint 14 통합 테스트 (실사용자 관점 정적 점검)

이 샌드박스는 브라우저/Android 실기기가 없어 실제 클릭 조작 테스트는 불가능하다.
아래는 각 기능의 코드 경로(Manager → Repository → 화면)를 처음부터 끝까지 따라가며
로직 일관성을 확인한 결과다. "실제 사용자 클릭/실기기 확인"이 필요한 항목은
NOT TESTED로 표시했다.

| # | 기능 | 결과 | 비고 |
|---|---|---|---|
| 1 | Discovery Center | PASS | `discoveryManager.refreshIfNeeded/getCached` → `Discovery.tsx` 목록 렌더링 경로 확인. 정렬/장르필터/키워드필터 로직(Sprint 12 테스트로 커버) 재확인 |
| 2 | 관심 공연 등록(즐겨찾기) | PASS | `toggleFavorite()` → LocalStorage(`fastreserve:discoveryFavorites`) 저장/조회 경로 확인 |
| 3 | Reservation 생성 | PASS | `ReservationManager.create()` validate → duplicate check → save 경로 확인 |
| 4 | Reservation 수정 | PASS | `ReservationManager.update()` 경로 확인. `ReservationDetail.tsx`의 `reservation!.id`는 이미 `if (!reservation) return` 가드 이후이므로 런타임상 안전(타입 내로잉 한계로 인한 `!`일 뿐 버그 아님) |
| 5 | Reservation 삭제 | PASS | Dialog 확인 → `remove()` → `navigate('/')` 경로 확인 |
| 6 | Ready Screen | PASS | 상태/체크리스트/버튼 로직 확인 |
| 7 | Countdown | PASS(코드) / NOT TESTED(실기기) | 1초 `setInterval` 로직은 정상. Android 백그라운드 절전 시 타이머 지연 여부는 실기기 필요(Sprint 13에 이미 TODO로 기록, Sprint 15 예정) |
| 8 | Session Check | PASS | `SessionManager` Mock 상태 흐름(UNKNOWN→READY→EXPIRED→LOGIN_REQUIRED→READY) 확인 |
| 9 | Plugin Status | PASS | `pluginManager.isHealthy()` → `healthCheck.engine.ts` 경로 확인 |
| 10 | URL Validation | PASS | `INTERPARK_URL_PATTERN` 정규식 재확인(Sprint 8/9에서 강화된 상태 유지, 변경 없음) |
| 11 | Notification | NOT TESTED | 브라우저/Android 실기기 없이는 실제 알림 발생 여부 확인 불가. 코드 경로(권한 확인 → `new Notification()`)는 정상이나, Android WebView에서의 실제 동작은 Sprint 15(`@capacitor/local-notifications`) 전까지 불확실(기존 TODO와 동일) |
| 12 | LocalStorage | PASS | 5개 Domain(Reservation/Session/SiteAccount/PluginRegistry/Discovery)의 Storage Key 전수 확인, 충돌 없음 |
| 13 | Bottom Navigation | PASS | `App.tsx` Route 경로와 `BottomNavigation.tsx`의 `to` 값 전수 대조, 불일치 없음 |
| 14 | Home Dashboard | PASS | Ready Engine/HealthCheck Engine/Scheduler/SiteAccount/Session/Plugin 결과를 Home이 직접 계산하지 않고 각 Manager/Engine 결과만 조합하는 구조 재확인 |

결론: 14개 항목 중 12개 PASS(정적 코드 검증), 2개는 실기기/실행 환경이 있어야 확정 가능한
NOT TESTED(Countdown 백그라운드 동작, Notification 실제 발생 — 둘 다 기존에 이미 알려진
제약이며 Sprint 15 계획에 포함되어 있다). 이번 Sprint에서 새로 발견된 버그는 없다.
