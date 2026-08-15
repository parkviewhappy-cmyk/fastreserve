# FastReserve (Interpark MVP)

인터파크 티켓 예매를 자주 사용하는 사용자가 예약 정보를 미리 등록하고,
예약 시작 시간에 맞춰 예약 준비를 효율적으로 진행할 수 있도록 지원하는 웹앱(MVP)입니다.

인터파크 전용 MVP를 먼저 완성하고, 안정성과 사용성을 검증한 후
APK 및 다른 예약 사이트로 확장합니다.

현재 버전: v0.5.0

## 개발 원칙

- MVP First
- Interpark Only
- WebApp First
- APK Later
- Platform Later
- Clean Architecture / Component 기반 개발
- Component와 Business Logic 분리
- 유지보수가 쉬운 구조
- 무료 환경만 사용 (Git, GitHub, React, TypeScript, Vite, TailwindCSS)

## 기술 스택

- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router

## 폴더 구조

```
fastreserve/
├── docs/                        # PRD, 기획 문서
├── src/
│   ├── adapters/
│   │   └── interpark/           # 인터파크 전용 어댑터
│   ├── components/
│   │   ├── common/              # StatusBadge, ReservationCard, ReservationForm,
│   │   │                        # FormField, Toast, Dialog, SummaryCard 등
│   │   └── layout/               # Header, BottomNavigation 등 레이아웃 컴포넌트
│   ├── domain/
│   │   ├── reservation/          # Reservation 도메인
│   │   │   ├── model/             # 도메인 규칙 (순수 함수)
│   │   │   ├── service/           # Business Logic (조회)
│   │   │   ├── manager/           # Reservation Manager - CRUD 진입점
│   │   │   ├── repository/        # 데이터 접근 추상화 (Mock/LocalStorage)
│   │   │   ├── validator/         # 입력값 검증
│   │   │   └── mock/              # Mock 데이터
│   │   ├── ready/                 # Ready Engine 도메인
│   │   │   ├── calculator/         # Reservation Status Calculator
│   │   │   ├── filter/             # Today/Upcoming/Ready/Completed/Failed Filter
│   │   │   ├── engine/             # Ready Engine (Dashboard Summary 포함)
│   │   │   ├── rule/               # ReadyRule (시간 기준 설정, Magic Number 제거)
│   │   │   └── types.ts            # DashboardSummary
│   │   ├── siteAccount/           # Site Account 도메인 (Sprint 5)
│   │   ├── session/               # Session 도메인 (Sprint 5, LocalStorage Mock)
│   │   ├── scheduler/             # Reservation Scan/Ready 판단 + Execution Engine 위임 (Sprint 6)
│   │   ├── healthCheck/           # Health Check 도메인 (Sprint 5)
│   │   ├── execution/              # Execution Engine 도메인 (Sprint 6)
│   │   │   ├── engine/              # Execution Engine (Queue 생성/Priority/Plugin 선택/실행)
│   │   │   ├── rule/                # ExecutionRule (Magic Number 제거)
│   │   │   ├── factory/             # ExecutionContext Factory
│   │   │   └── types.ts             # ExecutionContext / ExecutionResult / ExecutionQueueItem
│   │   ├── plugin/                 # Plugin 도메인 (Sprint 7, Site Adapter 도메인 대체)
│   │   │   ├── plugin.ts             # Plugin Interface
│   │   │   ├── interparkPlugin.ts    # Interpark Plugin (Mock)
│   │   │   ├── plugin.factory.ts     # Plugin Factory - createPlugin(site)
│   │   │   ├── rule/                 # PluginRule (Magic Number 제거)
│   │   │   ├── version/              # PluginVersion 비교 Utility
│   │   │   ├── model/                # SiteCapability 한글 라벨
│   │   │   └── types.ts              # PluginVersion / SiteCapability
│   │   ├── pluginManager/          # Plugin Manager 도메인 (Sprint 7)
│   │   │   └── pluginManager.ts      # 등록/제거/조회/활성화/비활성화/Version/Capability 조회
│   │   └── pluginRegistry/         # Plugin Registry 도메인 (Sprint 7)
│   │       ├── pluginRegistry.ts     # Plugin 목록(메타데이터) LocalStorage 저장 (생성은 안 함)
│   │       ├── defaults/             # 기본 Plugin Seed (Interpark)
│   │       └── types.ts              # PluginRecord
│   ├── pages/
│   │   ├── Home/                  # Home 화면 (Dashboard 포함)
│   │   ├── AddReservation/        # 예약 등록 화면
│   │   ├── ReservationDetail/     # 예약 상세/수정 화면
│   │   ├── SiteSettings/          # 사이트 관리 화면 (/site, Sprint 5)
│   │   ├── Simulation/            # Simulation Mode 화면 (/simulation, Sprint 6)
│   │   ├── PluginSettings/        # Plugin 관리 화면 (/plugin, Sprint 7)
│   │   └── ReadyScreen/           # 예약 준비 화면 (/ready/:id, Sprint 8)
│   ├── hooks/
│   │   └── useToast.tsx           # Toast 전역 상태
│   ├── services/
│   │   ├── storage/                 # 예약/히스토리/설정 데이터 저장소 (미구현)
│   │   └── notification/            # 예약 알림 (미구현)
│   ├── types/                        # Reservation, History, Setting 타입
│   ├── utils/                         # uuid, date, time 등 공통 유틸 함수
│   └── assets/                         # 이미지, 아이콘 등 정적 리소스
└── README.md
```

## 실행 방법

```bash
npm install
npm run dev
```

## 개발 현황

### Sprint 1 (완료)

- [x] Git / GitHub 연결
- [x] React + Vite + TypeScript 프로젝트 생성
- [x] TailwindCSS 적용
- [x] 기본 폴더 구조 생성
- [x] Home 화면 생성
- [x] 기본 Layout 생성 (Header, BottomNavigation)
- [x] README 작성

### Sprint 2 (완료)

- [x] Reservation Type / Interface 정의 (Enum 기반 ReservationStatus/SiteType)
- [x] Reservation Model (도메인 규칙)
- [x] Reservation Validation
- [x] Reservation Repository (인터페이스 + Mock 구현, save/update/delete 포함)
- [x] Reservation Service
- [x] Mock Reservation Data 3건 (UUID, ISO 8601 날짜)

### Sprint 3 (완료)

- [x] Reservation Manager 구축 (Reservation[] 기반 CRUD 진입점)
- [x] LocalStorage Repository 구현 (Repository Interface 변경 없이 구현체 추가)
- [x] 예약 등록 / 수정 / 삭제
- [x] 예약 목록 조회 / 상세 보기
- [x] 입력 Validation (필수값/날짜/시간/중복 예약) 폼 연동
- [x] Toast, 삭제 확인 Dialog
- [x] 예약 시작시간(openTime)은 대한민국(KST) Local Time 그대로 저장 (UTC 변환 없음)

### Sprint 4 (완료)

- [x] Ready Engine 도메인 구축 (`src/domain/ready/`)
- [x] Reservation Status Calculator (ReadyRule 기반 실시간 상태 계산, Magic Number 없음)
- [x] Today / Upcoming / Ready / Completed / Failed Filter
- [x] Dashboard Summary (총 예약 / 오늘 예약 / 준비중 / 준비중(Preparing) / 준비 완료 / 진행중 / 완료 / 실패)
- [x] Home 화면 Dashboard를 Ready Engine 결과로만 연동 (직접 계산 제거)
- [x] ReservationStatus에 Running 추가 (상태 체계는 ReservationStatus 하나로 통일, 별도 ReadyStatus 없음)
- [x] ReadyRule 객체로 시간 기준 관리 (기본값: Preparing 60분 / Ready 10분 / Running 0분)

Sprint 4 범위에서는 인터파크 연동/Browser 제어/Scheduler/Notification/Countdown/API/APK를 구현하지 않았다.
Reservation Manager와 Repository는 수정하지 않았다.

### Sprint 5 (완료)

- [x] Site Account Manager (사이트 추가/삭제/활성화/비활성화/로그인 상태 저장/마지막 확인시간 저장)
- [x] Session Manager (LocalStorage 기반 Mock, Session 상태/만료/로그인 필요 여부 확인)
- [x] Scheduler 구조 (현재시간 확인 / Reservation Scan / Ready Engine 호출 / Execution Queue 생성) — 실제 실행 없음
- [x] ExecutionContext 타입 + Factory (Execution Engine은 미구현)
- [x] Health Check 도메인 (로그인/세션/사이트 활성/Ready Engine 상태 종합 → GOOD/WARNING/ERROR)
- [x] 사이트 관리 화면 (`/site`) — 로그인 상태, 세션 상태, 마지막 확인, 로그인 확인(Mock) 버튼
- [x] Home Dashboard에 로그인 완료/로그인 필요 카드 연동 (Health Check 결과만 사용)

Sprint 5 범위에서는 인터파크 자동 로그인/아이디·비밀번호 저장/Browser 자동 제어/예약 실행/결제 진행/API 연동을 구현하지 않았다.
FastReserve는 아이디와 비밀번호를 저장하지 않으며, 사이트별 로그인 Session 상태만 관리한다.

**PM Review 반영**
- 사이트 종류는 프로젝트 전체에서 `SiteType` 하나만 사용한다 (Reservation/SiteAccount/ExecutionContext/Session 공용, 별도 AccountSiteType 없음)
- Session Mock은 토글이 아닌 상태 흐름을 따른다: UNKNOWN → READY → EXPIRED → LOGIN_REQUIRED → READY (반복)
- Health Check 판정 기준은 `HealthRule` 객체로만 관리한다 (Magic Rule 없음)
- SiteAccount에 `priority` 필드 추가 (기본값: Interpark 1 / TicketLink 2 / YES24 3), Execution Queue는 이후 Sprint에서 이 값을 사용할 예정
- JinAir는 기본 Seed에서 제외

다음 Sprint(Sprint 6)에서 Site Adapter, 실제 Session/Scheduler 연동, Execution Engine을 구현한다.

### Sprint 6 (완료)

- [x] Execution 도메인 구축 (`src/domain/execution/`) — ExecutionContext(eventDate/eventTime 추가), ExecutionResult(SUCCESS/FAILED/WAITING/RUNNING/SKIPPED), ExecutionQueueItem
- [x] ExecutionRule 객체로 Queue 전략 관리 (`queueStrategy`, `sitePriorityEnabled`, `retryCount`, `retryInterval` — 기본값만 정의, 실제 Retry는 미구현)
- [x] Site Adapter Interface (`src/domain/adapter/siteAdapter.ts`) — prepare/checkSession/openReservationPage/execute/healthCheck/cancel
- [x] Interpark Mock Adapter — Session 확인 / Reservation URL 확인 / ExecutionResult 반환 (실제 Browser 제어 없음)
- [x] Execution Engine — Execution Queue 생성(Priority 정렬 + 동일 시간 Site Priority tie-break + Running 상태 유지), Site Adapter 선택, ExecutionContext 전달, 실행 결과 반환. Reservation은 수정하지 않는다.
- [x] Scheduler가 Execution Engine에 위임(`getExecutionQueue`/`simulateExecution`) — UI는 Execution Engine을 직접 호출하지 않고 Scheduler를 통해서만 접근한다.
- [x] Simulation Mode 화면 (`/simulation`) — Execution Queue, Priority, Reservation → Ready → Queue → Running → Completed 단계 표시, 항목별 Mock 실행 버튼
- [x] Home 화면에 Simulation 요약(현재 Queue 길이, 현재 실행 대상) + Simulation Mode 진입 버튼 추가

Sprint 6 범위에서는 인터파크 자동 로그인/아이디·비밀번호 저장/Browser 자동 제어/자동 예약/자동 결제/API 연동/Playwright·Puppeteer·Chrome Extension 등 외부 자동화 라이브러리를 구현하지 않았다.
Interpark Adapter는 Mock으로만 구현했으며, 실제 예약은 실행하지 않는다(Simulation Mode).

**설계 결정 (특이사항, PM 확인 요청)**
- `ExecutionResult`는 `ReservationStatus`와 개념이 달라(실행 시도 1건의 결과 vs 예약의 지속 상태) 별도 Enum으로 유지했다. Sprint 4/5에서 지양했던 "병렬 Enum"과는 다른 케이스로 판단했다.
- Sprint 5의 `domain/scheduler/types.ts`에 있던 `ExecutionContext`/`createExecutionContext`는 `domain/execution/`으로 이동하고 `eventDate`/`eventTime` 필드를 추가했다(Sprint 6 스펙에서 재정의된 필드 목록을 그대로 반영). Scheduler는 이 타입을 import해서 사용한다.
- Interpark Mock Adapter의 `execute()`는 `openTime` 이전이면 WAITING, 이후면 SUCCESS, URL이 없으면 SKIPPED를 반환하도록 단순화했다. FAILED/RUNNING은 이번 Mock에서는 발생시키지 않는다(실제 Adapter 구현 시 사용 예정).
- Execution Queue의 Site Priority는 Sprint 5에서 추가한 `SiteAccount.priority`를 그대로 사용한다.

다음 Sprint에서 PM 승인 후 실제 Browser 연동 단계로 진행한다.

**PM Review 반영 (Sprint 6 Review)**
- Site Adapter 선택을 Factory Pattern으로 전환했다: `SiteAdapterFactory.getAdapter(site)`. Execution Engine은 이 Factory만 호출하며 구체 Adapter 클래스나 등록 방식을 알지 못한다(기존 `adapter.registry.ts`는 제거).
- Simulation 화면에 Execution Timeline을 추가했다: Queue 생성 → Ready → Execution Start → Adapter 호출 → Completed 순서를 각 단계 시각과 함께 표시한다. Execution Engine의 `execute()`가 Timeline을 생성해 반환한다(UI에서 재구성하지 않음).
- `ExecutionResult`에 `RETRY`를 추가했다. Enum 값만 추가했으며 실제 재시도 로직은 구현하지 않았다.
- Site Adapter Interface에 `supports(feature: SiteCapability): boolean`을 추가했다.
- `SiteCapability` 타입을 추가했다: `SEAT_SELECTION` / `QUEUE_WAITING` / `CAPTCHA` / `MOBILE_ONLY` / `DESKTOP_ONLY`. Interpark Adapter는 `supports()`를 구현했다(seatSelection/queueWaiting/captcha 지원, mobileOnly/desktopOnly 아님).

**설계 결정 (특이사항, PM 확인 요청)**
- Timeline의 "Queue 생성"과 "Ready" 시각은 동일 시점(`queuedAt`)으로 기록한다. Execution Queue는 이미 Ready/Running 상태인 예약만 담기 때문에, Queue에 편입되는 순간이 곧 Ready가 확인된 순간이라고 판단했다. openTime 기준으로 "언제 Ready 상태가 되었는지"를 ReadyRule로 역산하는 방식도 검토했으나, Execution 도메인이 ReadyRule 내부 계산식에 의존하게 되는 추가 결합이 생겨 이번 Sprint 범위에서는 제외했다.
- `simulateExecution`/`execute`가 받는 인자를 `ExecutionContext`에서 `ExecutionQueueItem`으로 변경했다. Timeline의 "Queue 생성"/"Ready" 단계 시각(`queuedAt`)이 Queue 항목에만 존재하기 때문이다(PM이 지정한 ExecutionContext 필드 목록 자체는 변경하지 않았다).

### Sprint 7 (완료)

- [x] Plugin 도메인 구축 (`src/domain/plugin/`) — Plugin Interface(getSite/getVersion/getCapabilities/prepare/checkSession/openReservation/execute/healthCheck/cancel), PluginVersion(major/minor/patch) + 비교 Utility(compareVersions/formatVersion/isVersionEqual 등)
- [x] PluginRule 객체로 등록 기준값 관리 (`autoEnable`, `allowMultipleVersion`, `defaultVersion` — Plugin 등록 로직은 이 Rule만 참조)
- [x] Interpark Plugin(Mock) — Plugin 정보 반환 / Capability 반환 / Mock Session 확인 / Mock Reservation URL 확인 / ExecutionResult 반환 (실제 Browser 제어 없음)
- [x] Plugin Factory — `createPlugin(site)`로 Interpark Plugin 제공 (TicketLink/YES24는 아직 미구현, undefined 반환)
- [x] Plugin Registry(`src/domain/pluginRegistry/`) — Plugin 목록(메타데이터, PluginRecord)만 LocalStorage로 관리. Plugin 인스턴스 생성은 하지 않는다. Interpark 기본 Seed(설치+활성화)
- [x] Plugin Manager(`src/domain/pluginManager/`) — 등록/제거/조회/활성화/비활성화/Version 확인/Capability 조회
- [x] Execution Engine이 Plugin Factory만 호출하도록 구성 (Execution Engine -> Plugin -> Adapter 구조)
- [x] Plugin Settings 화면 (`/plugin`) — Interpark/TicketLink/YES24 목록, 설치된 Plugin은 Version/Enabled/Capabilities 표시, 설치/활성화/비활성화/삭제
- [x] Simulation 화면에 Plugin 이름/Version/Capability 표시 추가

Sprint 7 범위에서는 실제 Browser 제어/자동 로그인/자동 클릭/자동 예약/자동 결제/Playwright·Puppeteer·Chrome Extension 등 외부 자동화 라이브러리를 구현하지 않았다.
Interpark Plugin은 Mock으로만 구현했으며, Plugin Framework 구조 완성이 이번 Sprint의 목표다.

**설계 결정 (특이사항, PM 확인 요청)**
- `SiteCapability`는 새 Enum(`PluginCapability` 등)을 만들지 않고 Sprint 6에서 만든 기존 타입을 그대로 확장했다. 값 목록을 PM 지시대로 Seat Selection/Queue Waiting/Captcha/Mobile/Desktop/Auto Refresh/Popup/Login Session으로 맞추면서, 기존 `MobileOnly`/`DesktopOnly`(배타적 제약 플래그)를 `Mobile`/`Desktop`(지원 여부 플래그)으로 의미를 바꿔 이름을 변경했다.
- `openReservationPage()`는 `openReservation()`으로 이름을 통일했고, Execution Timeline의 `ADAPTER_CALLED` 단계도 `PLUGIN_CALLED`로 변경했다(용어 일관성).
- Plugin Registry는 "생성은 하지 않는다"는 지시에 따라 `PluginRecord`(메타데이터)만 다루고 실제 Plugin 인스턴스는 다루지 않는다. 최초 실행 시 Interpark 기본 레코드를 Seed하는 로직은 Site Account의 기존 Seed 패턴과 동일하게 구현했다.

**PM Review 반영 (Sprint 7 Review)**
- `domain/adapter`를 삭제하지 않고 복원했다. Plugin과 Adapter의 책임을 분리했다: Plugin은 Version/Capability/Enable 여부를 관리하고, Adapter(Session/Reservation URL/Site 연결)는 그대로 `domain/adapter`에 둔다. Execution Engine -> Plugin -> Adapter 구조를 유지한다 — Interpark Plugin이 내부적으로 Interpark Adapter를 감싸(Site Adapter Factory에서 얻음) prepare/checkSession/openReservation/execute/healthCheck/cancel을 위임하고, 그 위에 Version/Capability/Enable 정보를 더한다. Adapter의 `supports()`/`SiteCapability`는 제거했다(Capability는 Plugin의 책임).
- Plugin Registry에 저장하는 `version`을 `PluginRule.defaultVersion`이 아니라 `Plugin.getVersion()`으로 변경했다(Rule은 정책만, Version은 Plugin이 관리). `autoEnable` 등 정책값은 계속 PluginRule을 참조한다.
- Home 화면에 "사이트 관리" 버튼을 추가해 `/plugin`으로 이동할 수 있게 했다.

**설계 결정 (특이사항, PM 확인 요청)**
- Home 화면에는 기존 Site Account 화면(`/site`)으로 가는 "사이트 관리로 이동 →" 링크가 이미 있었다. 이번에 추가한 "사이트 관리" 버튼은 `/plugin`(Plugin 관리)으로 이동한다. 두 화면이 서로 다른 개념(Site Account vs Plugin)인데 라벨이 겹쳐 사용자 혼동 가능성이 있다고 판단했다. 지시받은 라벨("사이트 관리")을 그대로 사용했으니, 명칭을 구분할지(예: 기존 링크를 "계정 관리로 이동"으로 변경) PM 확인 부탁드린다.
- `Plugin.isEnabled()`는 Registry에 저장된 활성화 상태를 조회하지 않고 Interpark Plugin(Mock)이 항상 사용 가능하다는 의미로 `true`를 고정 반환하도록 구현했다. Registry -> Plugin 방향의 의존을 추가하면 Plugin Registry(`domain/pluginRegistry`)가 이미 Plugin의 Version 타입을 참조하고 있어 양방향 결합이 생기기 때문에, "설치/활성화 여부"(사용자가 토글하는 영속 상태)는 계속 Plugin Registry/Plugin Manager가 관리하고, `isEnabled()`는 "이 Plugin 구현체가 지금 정상 동작 가능한지"(healthCheck에 가까운 개념)로 구분했다. 이 구분이 PM 의도와 맞는지 확인 부탁드린다.

다음 Sprint에서 PM 승인 후 실제 Plugin(TicketLink/YES24 등) 확장 또는 Browser 연동 단계로 진행한다.

### Sprint 8 (완료) — Interpark MVP

PM 지시에 따라 이번 Sprint는 새로운 Engine/Manager/Domain을 추가하지 않고, 기존 Core(Reservation Manager, Ready Engine, Session Manager, Site Account Manager, Plugin Manager/Registry/Factory, Scheduler, Execution Engine)만 조합해 실제 사용 가능한 화면을 완성했다. Interpark 하나만 지원하며 TicketLink/YES24/JinAir는 구현하지 않았다.

- [x] Plugin 관리 화면(`/plugin`) 개선 — Interpark 항목에 Version/설치여부/활성화여부/사용가능 여부(`Plugin.isEnabled()`)/Session 상태/마지막 확인시간을 모두 표시
- [x] Interpark 로그인 상태 확인(Mock) — `[로그인 상태 확인]` 버튼 추가. 기존 `sessionManager.checkSession()` + `siteAccountManager.updateLoginState()`를 그대로 재사용(SiteSettings 화면과 동일 패턴)
- [x] Session Manager에 `SessionChecker` 전략을 주입 가능하도록 확장 — 기본값은 기존 Mock 상태 흐름(`mockSessionChecker`)이며, 실제 Interpark Session Checker가 준비되면 생성자에서 교체만 하면 되는 구조. 새 Manager는 추가하지 않았다.
- [x] 예약 URL 검증 — 기존 `validateReservation()`에 Interpark URL 정규식(`https://(하위도메인.)*interpark.com/...`)을 추가. URL이 있는데 인터파크 도메인이 아니면 오류 메시지 표시
- [x] 예약 준비 화면(`/ready/:id`) 신설 — 예약명/예약시간/남은 시간/사이트/좌석/인원/현재 상태/Session 상태/Plugin 상태 표시. Reservation Manager/Ready Engine/Site Account Manager/Session Manager/Plugin Manager만 조합해서 사용
- [x] Simulation 화면 개선 — Queue 새로고침 버튼 추가로 Timeline/Queue/Plugin/ExecutionResult를 실시간으로 다시 확인 가능
- [x] Home 이동 동선 개선 — 예약 추가 / 예약 목록 / 사이트 계정 관리(`/site`) / 플러그인 관리(`/plugin`) / Simulation(`/simulation`) / 예약 준비(`/ready/:id`) 모두 Home에서 클릭만으로 도달 가능(직접 URL 입력 불필요)
- [x] LocalStorage Persistence 확인 — Reservation/Plugin(Registry)/Site Account/Session Repository가 모두 호출 시점마다 `window.localStorage`를 다시 읽는 구조임을 코드로 확인(모듈 레벨 캐시 없음). 새로고침 후에도 정상 복원된다.

구현 금지 항목(자동 로그인/자동 클릭/자동 예약/자동 결제/Playwright/Puppeteer/Chrome Extension/외부 자동화 라이브러리)은 구현하지 않았다.

**설계 결정 (특이사항, PM 확인 요청)**
- Sprint 7 Review에서 "사이트 관리" 라벨이 `/site`와 `/plugin` 두 곳에서 겹친다고 보고했었다. 이번 Sprint 지시문에서 "사이트 계정 관리"와 "플러그인 관리"라는 서로 다른 명칭을 사용하고 있어, 이 명칭을 그대로 Home 화면 라벨에 반영해 구분했다(`/site` → "사이트 계정 관리로 이동 →", `/plugin` → "플러그인 관리").
- Home의 "예약 준비" 진입점은 특정 예약 하나를 가리켜야 해서, 실행 대상(Execution Queue 1순위) → 오늘 예약 1번째 → 다가오는 예약 1번째 순으로 우선순위를 정해 하나를 자동으로 선택해 링크했다. 대상이 전혀 없으면 버튼을 표시하지 않는다. 예약 상세 화면에도 "예약 준비 화면 보기" 버튼을 추가해 예약별로 접근할 수 있게 했다.
- Interpark URL 검증 정규식은 `https://` + `interpark.com` 하위 도메인까지 허용하도록 다소 넉넉하게 잡았다(`tickets.interpark.com` 등). 더 엄격하게 `tickets.interpark.com` 경로만 허용할지는 확인 부탁드린다.
- Plugin Settings 화면의 Session 상태/마지막 확인시간/로그인 상태 확인 버튼은 Interpark 행에만 표시했다(TicketLink/YES24는 Plugin 미구현이라 Session 개념이 아직 의미가 없다고 판단했다).

다음 Sprint에서 PM 승인 후 실제 Session Checker/Browser 연동 또는 History/Setting 화면으로 진행한다.
