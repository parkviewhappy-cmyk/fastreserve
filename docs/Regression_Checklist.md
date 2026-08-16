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

## Sprint 15 실기기 테스트 준비 상태 (13개 항목)

이번 Sprint에서 실제 APK를 생성하지 못했으므로(`docs/APK_BUILD_GUIDE.md` "6-1" 참고),
아래 13개 항목 전부 실기기 테스트 자체는 **NOT TESTED**다. 대신 각 항목이 "코드/설정
준비가 얼마나 되어 있는지"를 구분해서 기록했다 — PM이 실제 APK를 만들었을 때 무엇을
중점적으로 확인해야 하는지 우선순위를 제공하기 위함이다.

| # | 항목 | 실기기 테스트 결과 | 준비 상태 |
|---|---|---|---|
| 1 | 앱 설치 | NOT TESTED | APK 자체가 없어 설치 시도 불가. `capacitor.config.ts`/App ID/아이콘·스플래시 소스는 준비 완료 |
| 2 | 앱 실행 | NOT TESTED | 동일 이유 |
| 3 | Discovery | NOT TESTED | 코드 경로 정적 검증은 Sprint 14에서 PASS(로직 변경 없음) |
| 4 | Reservation | NOT TESTED | 코드 경로 정적 검증 PASS(로직 변경 없음) |
| 5 | Ready Screen | NOT TESTED | 코드 경로 정적 검증 PASS. Notification 발송 경로만 이번 Sprint에 교체(6-2) |
| 6 | Countdown | NOT TESTED | 로직 자체는 변경 없음(1초 `setInterval`). WebView에서의 타이머 정확도/절전 영향은 실기기 확인 필요(기존 TODO) |
| 7 | Plugin | NOT TESTED | 코드 경로 정적 검증 PASS(로직 변경 없음) |
| 8 | Session | NOT TESTED | 코드 경로 정적 검증 PASS(로직 변경 없음) |
| 9 | Notification | NOT TESTED | **이번 Sprint의 핵심 변경**. `@capacitor/local-notifications` 연동 코드는 작성 완료(정적 검증 PASS)했으나 `npm install` 불가로 실제 동작 확인 전무. 실기기 테스트 시 최우선 확인 대상 |
| 10 | LocalStorage | NOT TESTED | 코드 경로 정적 검증 PASS. Android WebView 저장소는 앱 전용으로 유지되는 것이 표준 동작(Sprint 13 결론과 동일) |
| 11 | 화면 회전 | NOT TESTED | Capacitor 기본 `MainActivity`는 보통 `android:configChanges`로 회전 시 Activity 재생성을 막아 React 상태를 보존하는 것이 표준 동작으로 알려져 있으나, `android/` 폴더 자체가 없어 이 프로젝트의 실제 `AndroidManifest.xml` 설정을 확인할 수 없다(TODO) |
| 12 | 백그라운드 복귀 | NOT TESTED | Sprint 13에 이미 기록된 TODO(`@capacitor/app`의 `App.addListener('resume', ...)` 미구현)와 동일한 리스크가 남아 있다. 이번 Sprint에서도 구현하지 않았다(PM 지시 "새로운 기능 추가하지 않는다" 범위 밖) |
| 13 | 앱 재실행 | NOT TESTED | LocalStorage는 앱을 완전히 종료 후 재실행해도 유지되는 것이 Android WebView의 표준 동작이나, 실제 확인은 되지 않았다 |

**결론**: 13개 항목 모두 NOT TESTED. 이 중 9번(Notification)이 이번 Sprint의 핵심 변경사항이므로
실기기 테스트 시 최우선으로 확인해야 하고, 11/12번(화면 회전/백그라운드 복귀)은 기존에
알려진 리스크가 그대로 남아있어 함께 확인이 필요하다.

## Sprint 16 종합 검증 (V1.0 Comprehensive Validation)

PC(Web) 환경 기준, 실제 브라우저/서버 실행 없이 코드 경로를 처음부터 끝까지 추적하는
방식으로 검증했다(이 샌드박스의 `npm install` 차단 제약은 Sprint 8부터 동일).

### 기능 검증 (①~⑦)

| # | 기능 | 결과 | 비고 |
|---|---|---|---|
| ① | Reservation (생성/수정/삭제/저장/조회/Validation) | PASS | CRUD 전체 경로 재확인. Validation 경계값(ticketCount 0/NaN/음수, URL 형식, 날짜/시간 패턴) 재확인 — 문제 없음 |
| ② | Discovery Center (목록/검색/정렬/Favorite/데이터없음/Mock표시) | PASS | Sprint 12에서 검증된 로직 그대로. 빈 목록 UI 분기 확인 |
| ③ | Ready Screen (Countdown/점수/URL검사/Plugin/Login/인터넷/Notification) | PASS | Notification 발송 경로만 Sprint 15에서 교체, 나머지 로직 불변 |
| ④ | History (저장/날짜/상태표시) | **N/A** | History Domain이 아직 구현되지 않았다(`src/types/history.ts`는 여전히 빈 placeholder). Sprint 13부터 동일하게 보고된 사항이며 이번 Sprint에서도 구현하지 않았다(신규 기능 추가 금지 원칙) |
| ⑤ | Session (로그인 유지/만료 처리) | PASS(만료 처리는 BUG-005 참고) | Mock 상태 흐름(UNKNOWN→READY→EXPIRED→LOGIN_REQUIRED→READY)으로 만료 시나리오 재현 가능. `expiresAt` 필드는 사실상 미사용(BUG-005, Low, 동작에 영향 없음) |
| ⑥ | Simulation (Preparation Simulation) | PASS | 로직 변경 없음 |
| ⑦ | Scheduler (Countdown/Timer) | PASS(구조 확인) | `Scheduler` 클래스 자체는 설계상 Timer가 없다(Sprint 6부터 "자동 실행 로직을 두지 않는다"). 실제 Countdown Timer는 Ready Screen(`ReadyScreen.tsx`)이 담당하며 Scheduler는 Queue 조회만 담당 — Domain 간 책임 분리가 의도대로 유지되고 있음을 재확인 |

### 예외 상황 테스트 (8개)

| 시나리오 | 결과 | 비고 |
|---|---|---|
| 인터넷 없음 | PASS | Discovery/ReadyScreen 모두 `navigator.onLine` 감지 + 오프라인 배너/버튼 비활성화 확인 |
| URL 오류 | PASS | `INTERPARK_URL_PATTERN` + `isValidUrl()` 이중 검증 확인 |
| Plugin 미설치 | PASS | `PluginManager.isAvailable/isHealthy/getCapabilities` 전부 미설치 시 안전한 기본값(`false`/`[]`) 반환 확인 |
| 로그인 안됨 | PASS | `loginReady = account?.sessionStatus === SessionStatus.Ready` — 계정 없음/미로그인 모두 안전 처리 |
| 데이터 없음 | PASS | Home/Discovery 빈 목록 UI 문구 확인 |
| **LocalStorage 초기화(쓰기 실패)** | **FAIL → 수정 완료(BUG-004)** | 5개 Repository의 `setItem()` 전부 예외 처리가 없어 쓰기 실패 시 화면이 깨질 수 있었다. 발견 즉시 수정(아래 참고) |
| Notification 권한 거부 | PASS | 네이티브/웹 모두 권한이 `granted`가 아니면 발송하지 않고 조용히 종료(`src/utils/notification.ts`) |
| Browser Refresh | PASS(코드 관점) | 모든 화면이 마운트 시 Manager에서 다시 조회하는 구조라 새로고침 후에도 LocalStorage 데이터를 그대로 복원한다. 다만 `/ready/:id`처럼 루트가 아닌 경로에서의 새로고침은 정적 파일 서버의 SPA Fallback 설정에 따라 달라지는 배포 설정 문제이며(코드 버그 아님), Android APK 환경(Capacitor WebView)에서는 해당하지 않는다 |

### 회귀 테스트 (Sprint 1~15)

이번 Sprint에서 실제로 수정한 코드는 5개 Repository의 `writeAll`/`saveCache`/`saveFavoriteIds`
메서드에 `try/catch`를 추가한 것뿐이다(성공 경로의 동작/반환값은 전혀 바뀌지 않았고, 실패
경로에서 예외를 던지는 대신 조용히 무시하도록만 바뀌었다). 따라서 Sprint 1~15에서 확인된
모든 정상 동작 경로(Reservation CRUD, Discovery, Ready Screen, Plugin, Session, Simulation,
Scheduler, Notification)는 코드 경로상 영향을 받지 않는다. Sprint 12/13에 만든 자동화된
단위/통합 테스트(`discovery.model.test.ts`/`discoveryRule.test.ts`/`discovery.manager.test.ts`,
총 9+16개 케이스)의 대상 코드도 이번 Sprint에서 건드리지 않았다.

**결론**: Sprint 1~15 기능 회귀 없음.

## Sprint 17: PC Runtime Verification

### 1~6단계 실행 검증 (PM 지정 순서)

| # | 절차 | 결과 |
|---|---|---|
| 1 | `npm install` | **실패** — `npm error 403 Forbidden - registry.npmjs.org`(Sprint 8부터 동일). Sprint 17에서 apt(`esbuild`)/pip(`PyPI`) 등 대체 경로도 전부 시도했으나 전부 프록시 403으로 차단됨을 재확인(`docs/APK_BUILD_GUIDE.md` "6-1" 및 이번 Sprint 완료 보고 참고) |
| 2 | `npm run dev` | **실패** — `sh: 1: vite: not found`(node_modules 없음, 1번 실패의 직접 결과) |
| 3 | 브라우저 실행 | **불가** — dev 서버 자체가 뜨지 않아 접속할 URL이 없음 |
| 4 | 모든 화면 진입 확인 | **불가**(브라우저 실행 불가로 인한 연쇄) — 대신 아래 "실제 Node 실행 기반 검증"으로 코드 레벨 대체 검증 수행 |
| 5 | `npm run build` | **실패** — `sh: 1: tsc: not found`(1번과 동일 원인) |
| 6 | 빌드 성공 여부 | **실패**(5번 결과) |

### 실제 Node 실행 기반 검증 (대체 수단, `docs/TESTING.md` "Sprint 17" 섹션 참고)

`npm install`이 근본적으로 막혀 있어(레지스트리뿐 아니라 apt/pip 대체 경로까지 이번
Sprint에서 전수 확인) 위 6단계를 그대로 재현할 수는 없었지만, Node.js 22의
`--experimental-transform-types`로 **실제로 TypeScript 코드를 파싱·실행**해 아래를
확인했다(자세한 방법은 `docs/TESTING.md`, 리졸버는 `scripts/alias-loader.mjs`):

- `src/domain/**`, `src/utils/*`, `src/types/*`, `src/test-utils/*` 총 79개 파일 중
  78개 실제 import 성공(문법 오류 없음/내부 import 전부 해석/모듈 최상위 코드 정상 실행,
  Manager 싱글턴 생성 포함). 나머지 1개(`notification.ts`)는 `@capacitor/core` 미설치가
  유일한 원인(코드 문제 아님)
- 8개 핵심 Manager/Engine의 실제 메서드 호출(`reservationManager.list/create`,
  `discoveryManager.refresh/toggleFavorite`, `readyEngine.getDashboardSummary`,
  `scheduler.getExecutionQueue/simulateExecution`, `healthCheckEngine.getReport`,
  `pluginManager.list/isHealthy`, `sessionManager.checkSession/isExpired`,
  `siteAccountManager.list`, `validateReservation` 경계값)까지 실제로 실행해 정상
  반환값을 확인 — 예외 없음
- `괄호/중괄호/대괄호 균형` 검사를 문자열·주석을 실제로 걸러내는 토크나이저 기반으로
  다시 작성해 재실행 — 114개 파일 전부 균형 확인(Sprint 13~16 보고서에 남아있던
  `reservation.validator.ts`의 거짓 양성 — 주석 안의 "예)" 텍스트 때문 — 이번에 완전히
  해소됨)
- 미사용 import: 0건, `console.*` 잔여: 0건 재확인

### 브라우저 테스트 (Chrome/Edge/새로고침/LocalStorage/인터넷끊김/Notification권한)

| 항목 | 결과 |
|---|---|
| Chrome / Edge 실제 실행 | **NOT TESTED** — 이 샌드박스는 GUI 브라우저가 없고 dev 서버도 못 띄움. PM 로컬 환경에서만 확인 가능 |
| 브라우저 새로고침 | 코드 관점 PASS(Sprint 16과 동일 결론) — 실제 브라우저 확인은 NOT TESTED |
| LocalStorage 유지 | 코드 관점 PASS(Sprint 16 BUG-004 수정으로 쓰기 실패 시에도 안전) — 실제 브라우저 확인은 NOT TESTED |
| 인터넷 끊김 | 코드 관점 PASS(`navigator.onLine` 처리 확인, Sprint 16과 동일) — 실제 브라우저 확인은 NOT TESTED |
| Notification 권한 | 코드 관점 PASS(권한 미허용 시 조용히 무시하는 로직 확인) — 실제 브라우저 권한 팝업 확인은 NOT TESTED |

## Sprint 18: 회귀 재확인

Sprint 17 이후 `src/` 변경이 없어 Node.js 실제 실행 기반 검증을 재실행한 결과도 동일했다
(79개 파일 중 78개 PASS, 1개는 `@capacitor/core` 미설치로 인한 예상된 결과, 괄호 균형
114개 파일 전부 정상). 회귀 없음.
