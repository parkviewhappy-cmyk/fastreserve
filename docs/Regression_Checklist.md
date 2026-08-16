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
