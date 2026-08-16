# FastReserve (Interpark MVP)

인터파크 티켓 예매를 자주 사용하는 사용자가 예약 정보를 미리 등록하고,
예약 시작 시간에 맞춰 예약 준비를 효율적으로 진행할 수 있도록 지원하는 웹앱(MVP)입니다.

인터파크 전용 MVP를 먼저 완성하고, 안정성과 사용성을 검증한 후
APK 및 다른 예약 사이트로 확장합니다.

현재 버전: v0.5.0

## Project Goal

**FastReserve는 자동 예매 프로그램이 아닙니다.**

FastReserve는 예약 성공률을 높이기 위한 **Reservation Assistant**입니다.

최종 예약 시작 및 예매 진행은 항상 사용자가 직접 수행합니다.

본 프로젝트는 다음을 지원하는 것을 목표로 합니다.

- 예약 준비
- 로그인 상태 확인
- 플러그인 상태 확인
- 예약 페이지 진입
- 예약 일정 관리
- 예약 준비 상태 점검

(PM Review 반영, Sprint 10 수정: 프로젝트 방향을 README 최상단에 명시적으로 기록한다.
Sprint 10에서 "자동 실행" 대신 "준비 지원"으로 방향을 전환한 배경은 아래 "Sprint 10 (완료)"
섹션에 상세히 기록되어 있다.)

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

### Sprint 9 (완료) — Interpark Integration (MVP)

PM 지시에 따라 이번 Sprint도 새로운 Engine/Manager/Domain을 추가하지 않고 기존 Core만 사용했다. Interpark 하나만 지원한다.

- [x] Interpark URL 검증 강화 — `interpark.com` 전체 도메인이 아니라 `tickets.interpark.com`(및 하위 도메인, 예: `m.tickets.interpark.com`)만 허용. `shop.interpark.com`/`tour.interpark.com`/`book.interpark.com` 등은 실패 처리
- [x] 예약 페이지 열기 버튼 — 예약 준비 화면(`/ready/:id`)에 `[예약 페이지 열기]` 버튼 추가. `window.open()`으로 새 탭에 예약 URL을 여는 것뿐이며, 페이지 내부에서 어떤 자동 동작도 수행하지 않는다. URL이 없으면 버튼을 비활성화한다
- [x] 로그인 상태 확인 구조 — 기존 `SessionChecker`(Mock, 주입 가능한 구조, Sprint 8) 유지. Plugin 관리 화면에서 `[로그인 상태 확인]` 클릭 시 마지막 확인 시각/상태가 화면과 Toast에 즉시 반영되는 것을 확인
- [x] 예약 준비 화면 개선 — 예약 URL, Plugin Version, Plugin 상태(활성화/사용가능 여부), Session 마지막 확인 시각, `[예약 페이지 열기]` 버튼 추가
- [x] Simulation 개선 — 항목별로 "1. Plugin 실행 → 2. 예약 페이지 열기(예정) → 3. Execution 결과" 순서를 버튼/표시로 나타냄. "예약 페이지 열기"는 Ready 화면과 동일하게 `window.open()`만 수행하며 실제 Browser 제어는 하지 않는다
- [x] Home 사용성 — 기존 Home → 예약 준비(`/ready/:id`) 링크에 이어, Ready 화면에 추가된 `[예약 페이지 열기]` 버튼으로 Home에서 클릭만으로 예약 페이지까지 도달 가능함을 확인(코드 변경 없이 기존 동선으로 충족)

구현 금지 항목(자동 로그인/자동 클릭/자동 좌석 선택/자동 결제/CAPTCHA 우회/Playwright/Puppeteer/Chrome Extension/외부 자동화 라이브러리/약관 우회)은 구현하지 않았다.

**설계 결정 (특이사항, PM 확인 요청)**
- Interpark URL 정규식은 `tickets.interpark.com` 및 그 하위 도메인(`m.tickets.interpark.com` 등)을 허용하고, `shop`/`tour`/`book` 등 다른 하위 서비스 도메인은 거부하도록 좁혔다. 도메인만 검사하며 경로(예: `/goods/...`)는 특정 패턴을 강제하지 않았다 — 필요하면 경로 패턴도 추가로 검증할 수 있다.
- Simulation 화면의 "예약 페이지 열기" 버튼은 `ExecutionContext.reservationUrl`을 그대로 사용한다(Execution Engine/Plugin을 거치지 않고 이미 계산된 Queue 데이터의 URL을 직접 사용). URL을 여는 것은 실행(Execution)이 아니라 순수 탐색 동작이라고 판단해 Scheduler를 거치지 않고 UI에서 바로 처리했다.
- "예약 페이지 열기"는 두 화면(예약 준비, Simulation) 모두 미실행 상태에서도 클릭 가능하다(꼭 Plugin을 먼저 실행해야 열리는 것은 아님). 실제 사용자는 준비 화면에서 로그인 확인 없이도 예약 페이지를 미리 볼 수 있어야 한다고 판단했다.

**MVP 테스트 결과**

- Chrome 테스트 / Edge 테스트: 이 개발 환경(샌드박스)은 GUI 브라우저와 npm 레지스트리 접근이 모두 차단되어 있어(`npm install`/`npm run dev` 실행 불가, 문서 상단에 기록된 기존 제약과 동일) 실제 Chrome/Edge에서 직접 클릭 테스트를 수행하지 못했다. 코드 정적 검증(모든 import 경로 해석, 금지 패턴 grep, 정규식 단위 테스트)은 완료했지만, 실제 브라우저 동작 확인은 **PM(사용자)이 로컬에서 `npm install && npm run dev` 실행 후 Chrome/Edge 각각에서 직접 확인**해주셔야 한다. 확인해야 할 항목: 예약 등록 시 URL 검증 메시지, `/ready/:id` 화면의 각 카드, `[예약 페이지 열기]` 버튼(새 탭 오픈 여부), Simulation 화면의 1→2→3 버튼 흐름.
- 새로고침 확인: 코드상 모든 Repository/Registry(Reservation/SiteAccount/Session/PluginRegistry)가 호출마다 `window.localStorage`를 다시 읽는 구조임을 Sprint 8에 이어 재확인했다(모듈 레벨 캐시 없음). 실제 브라우저 새로고침 테스트는 위와 동일한 이유로 PM 확인이 필요하다.
- LocalStorage 확인: 저장 키(`fastreserve:reservations`, `fastreserve:siteAccounts`, `fastreserve:sessions`, `fastreserve:pluginRegistry`)와 읽기/쓰기 로직을 코드로 확인했다. 브라우저 개발자 도구의 Application 탭에서 직접 확인 가능하다.
- URL 검증: Python으로 정규식 로직을 동일하게 재현해 아래 케이스를 검증했다(모두 기대값과 일치).
  - 허용: `https://tickets.interpark.com/`, `https://m.tickets.interpark.com/goods/123`, `https://tickets.interpark.com/goods/26000001`
  - 거부: `https://shop.interpark.com/`, `https://tour.interpark.com/`, `https://book.interpark.com/`, `https://interpark.com/`, `https://ticketsxinterpark.com/`(유사 도메인), `http://tickets.interpark.com/`(https 아님)
- 예약 페이지 열기: `window.open(url, '_blank', 'noopener,noreferrer')` 호출부만 존재함을 코드로 확인했다(자동 클릭/자동 입력 없음). 실제 새 탭 오픈 동작은 브라우저에서만 확인 가능하므로 위와 동일하게 PM 확인이 필요하다.
- 발견된 버그: 없음(정적 검증 범위 내에서는 발견되지 않았다).

다음 Sprint에서 PM 승인 후 실제 브라우저 테스트 결과에 따른 후속 조치 또는 History/Setting 화면으로 진행한다.

### Sprint 10 (완료) — Reservation Assistant 전환

**중요 배경**: PM의 최초 Sprint 10 지시는 "예약 시간 도달 시 자동으로 예약을 실행하는 Scheduler/ExecutionManager"였다. 이는 2024년 개정 공연법(2024.3.22 시행, 매크로 프로그램을 이용한 부정 예매 시 1년 이하 징역 또는 1천만원 이하 벌금)이 금지하는 매크로 기반 티켓 구매의 핵심 동작(자동 로그인/자동 클릭/자동 예약 실행)과 일치하고, 인터파크 이용약관의 자동화 도구 금지 조항에도 위배된다고 판단해 구현을 보류하고 PM에 문의했다. PM은 이후 "자동 실행"을 완전히 제거하고 사용자의 수동 클릭을 항상 요구하는 **"Reservation Assistant"**(예약 준비 지원 도구) 방향으로 지시를 변경했고, 이번 Sprint는 그 변경된 지시를 구현했다.

- [x] Execution Engine: `execute()` → `prepareExecution()`으로 이름/역할 변경. `Plugin.execute()`(실제 예약 시도)를 더 이상 호출하지 않으며 "예약 준비 완료" 여부만 확인한다. `ExecutionResult.Success`는 이제 "예약 성공"이 아니라 "예약 준비 완료"를 의미한다(Enum 멤버 추가/삭제 없이 의미만 재정의)
- [x] Scheduler: `simulateExecution()`(메서드명 유지, 호출부 영향 최소화)이 내부적으로 `prepareExecution()`을 호출하도록 변경. "예약시간 도달 → 자동 실행" 흐름 제거, "예약시간 접근 → 사용자 알림 → 준비 확인" 흐름으로 전환
- [x] Ready Screen(`/ready/:id`) 대폭 개선 — 실시간 Countdown(1초 tick), 인터넷 상태(`navigator.onLine` + online/offline 이벤트), 예약 준비 점수(100점 만점: 로그인/Plugin/인터넷/URL 각 25점), 체크리스트 UI, 10분/5분/1분 전 1회성 알림(Notification API, 권한 허용 시에만) + 1분 전 진동(Vibration API), 30초 이하 구간 초 단위 강조 표시. 기존 `[예약 페이지 열기]` 버튼은 변경 없이 `window.open()`만 수행
- [x] Plugin: `PluginManager.isHealthy(site)` 추가(기존 `Plugin.healthCheck()`에 위임하는 조회 전용 메서드, 새 Manager/Engine 아님). Ready Screen에 "★★★★★ Plugin 정상" 형태로 표시
- [x] Home: "예매 준비 점수"를 가장 가까운 예약(readyTarget) 기준으로 표시. 점수 계산은 Ready Screen과 공유하는 순수 함수(`src/pages/ReadyScreen/readinessScore.ts`)를 사용해 로직 중복 없음
- [x] Simulation: "Execution Simulation" → "Preparation Simulation"으로 재정의. 예시 흐름("로그인 OK → Plugin OK → 예약 페이지 준비 → 사용자가 예매 시작") 안내 문구 추가, 버튼/결과 라벨을 준비-지향 표현으로 변경("1. 예약 준비 확인", "3. 준비 결과", `RESULT_LABEL`을 "준비 완료/준비 실패" 등으로 변경)

구현 금지 항목(자동 로그인/자동 클릭/자동 예약/자동 좌석 선택/자동 결제/사람 대신 예약 진행)은 구현하지 않았다. `Plugin.execute()`/`SiteAdapter.execute()` 인터페이스 메서드 자체는 삭제하지 않았다(계약은 유지하되 Execution Engine이 더 이상 호출하지 않는 방식으로 "삭제보다 역할 변경"을 우선했다).

**기존 코드 유지율(%)**: 약 99.3% (develop 기준 `src/` 전체 4,330줄 중 이번 Sprint에서 삭제된 줄은 31줄. `git diff develop --stat` 기준 근사치이며, 대부분의 삭제는 "이름 변경"에 수반된 이전 줄 삭제이지 기능 삭제가 아니다)

**삭제된 파일**: 없음

**변경된 파일**: `src/domain/execution/engine/execution.engine.ts`, `src/domain/execution/types.ts`, `src/domain/pluginManager/pluginManager.ts`, `src/domain/scheduler/scheduler.ts`, `src/pages/Home/Home.tsx`, `src/pages/ReadyScreen/ReadyScreen.tsx`, `src/pages/Simulation/Simulation.tsx`

**추가된 기능**: Countdown(실시간)/인터넷 상태 표시/예약 준비 점수/체크리스트/10분·5분·1분 전 알림/1분 전 진동/Plugin Health Score(★)/Home 예매 준비 점수/Preparation Simulation 안내 문구. 새 파일은 점수 계산 공유 유틸 `readinessScore.ts` 1개뿐이며, 새로운 Domain/Engine/Manager는 추가하지 않았다

**기존 기능 영향**: 예약 CRUD/History/Session/Site Account/Plugin 등록·활성화/URL 검증/`[예약 페이지 열기]` 버튼 동작은 변경하지 않았다. `Simulation.simulateExecution()` 호출부(Simulation.tsx)는 메서드 시그니처가 그대로라 코드 수정 없이 새 `prepareExecution()` 로직으로 자동 연결된다

**MVP 테스트 결과**

- 정적 검증: 전체 `src/` import 경로 해석(Python 스크립트) 통과, 금지 패턴(`puppeteer`/`playwright`/`selenium`/`chrome-extension`/자동클릭/비밀번호 저장 등) grep 검사에서 발견 없음, 중괄호/괄호/대괄호 balance 검사 통과
- 예약 준비 점수 로직: `computeReadinessScore()`와 동일한 로직을 Node.js로 재구현해 4가지 케이스(전체 충족/로그인만 누락/전체 미충족/URL·Plugin만 누락)를 단위 테스트했고 모두 기대값(100/75/0/50점)과 일치했다
- Execution Engine 호출부 점검: `executionEngine`/`plugin.execute(` 관련 grep 결과, `Plugin.execute()`를 실제로 호출하는 코드는 더 이상 없고(주석 설명 문구만 남아 있음), Scheduler → Execution Engine 파이프라인은 `prepareExecution()`만 호출함을 확인
- Chrome/Edge 브라우저 테스트: 이 개발 환경은 GUI 브라우저와 npm 레지스트리 접근이 차단되어 있어(Sprint 8-9와 동일한 제약) Countdown/알림 권한 팝업/진동/온라인-오프라인 전환 등 브라우저 전용 동작은 코드 검증만 완료했다. **PM이 로컬에서 `npm install && npm run dev` 실행 후 직접 확인 필요**: (1) `/ready/:id`에서 Countdown이 1초마다 갱신되는지, (2) 알림 권한을 허용했을 때 10분/5분/1분 전 알림이 실제로 뜨는지(테스트 시 예약의 `openTime`을 가까운 시각으로 임시 수정해서 확인 권장), (3) 모바일 기기에서 1분 전 진동이 동작하는지, (4) Wi-Fi를 끄고 켰을 때 "인터넷 상태" 표시가 실시간으로 바뀌는지, (5) Home의 "예매 준비 점수"와 Ready Screen 점수가 같은 예약에 대해 일치하는지
- 발견된 버그: 없음(정적 검증 범위 내)

**PM Review 요청**

1. `ExecutionResult.Failed`/`Retry`는 현재 `prepareExecution()`이 실제로 반환하지 않는 값이 되었다(Enum 멤버는 유지). 향후 "준비 확인 자체가 실패하는 경우"(예: Plugin healthCheck 실패)를 별도로 반환하도록 확장할지, 아니면 현재처럼 Waiting/Skipped로만 표현할지 방향을 확인 부탁드린다.
2. 알림(Notification)은 브라우저 권한이 "허용"된 경우에만 동작하며, 권한 요청은 Ready Screen 최초 진입 시 1회 자동으로 뜬다(사용자가 "차단"을 누르면 이후 알림 없이 조용히 동작). 이 정책(자동으로 권한 요청 팝업을 띄우는 것)이 UX상 괜찮은지, 아니면 별도의 "알림 켜기" 버튼을 눌러야 요청하도록 바꿀지 확인 부탁드린다.
3. 예약 준비 점수의 4개 항목(로그인/Plugin/인터넷/URL) 가중치를 동일하게 25점씩 두었다. 항목별 가중치를 다르게 둘지(예: 로그인 상태를 더 중요하게) 확인 부탁드린다.

### Sprint 10 PM Review 수정 (완료)

PM은 Sprint 10을 전체 승인했고, "기능 추가보다 프로젝트 방향을 명확히 하고 향후 확장성을 확보하는 수준"의 문서/주석 전용 수정만 요청했다. **코드 로직/동작은 하나도 변경하지 않았다.**

- [x] README 최상단에 "Project Goal" 섹션 추가 — FastReserve는 자동 예매 프로그램이 아니라 예약 성공률을 높이기 위한 Reservation Assistant이며, 최종 예약 시작/예매 진행은 항상 사용자가 직접 수행함을 명시
- [x] `src/pages/ReadyScreen/readinessScore.ts`에 TODO 주석 추가 — 현재 4항목 균등 배점(25점×4)을 유지하되, 향후 가중치 방식(예: Plugin 40 / Session 30 / Internet 20 / URL 10)으로 확장할 수 있음을 기록. 로직(`POINTS_PER_ITEM = 25`)은 변경하지 않았다
- [x] `src/domain/execution/types.ts`(`ExecutionResult` 주석)에 TODO 추가 — Failed/Retry는 삭제하지 않고, 향후 History의 Failure Analysis/Retry Statistics 기능에서 사용할 예정임을 명시. `prepareExecution()`은 여전히 이 값을 반환하지 않는다(동작 변경 없음)
- [x] `src/pages/ReadyScreen/ReadyScreen.tsx`의 Notification 권한 요청 `useEffect` 위에 TODO 추가 — 향후 "예약 알림을 사용하시겠습니까?" 안내 화면을 먼저 보여주고 사용자가 "허용"을 선택했을 때만 권한을 요청하도록 변경할 예정임을 기록. 현재 코드(화면 진입 시 자동 `Notification.requestPermission()` 호출)는 그대로 유지했다
- [x] Architecture 변경 없음 확인 — Execution/Plugin/Session/Scheduler/Simulation/Reservation/Ready 각 Domain 폴더/파일 구조에 삭제·리팩토링·신규 Engine 생성이 없음을 `git diff --stat`으로 확인(TODO 주석과 README 문구 추가만 발생)

**변경 파일**: `README.md`, `src/pages/ReadyScreen/readinessScore.ts`(TODO 주석), `src/domain/execution/types.ts`(TODO 주석), `src/pages/ReadyScreen/ReadyScreen.tsx`(TODO 주석)

**삭제 파일**: 없음(0개)

**Architecture 영향**: 없음 — 기존 7개 Domain(Execution/Plugin/Session/Scheduler/Simulation/Reservation/Ready) 모두 유지, 신규 Engine/Manager 없음, 기존 로직 리팩토링 없음

### Sprint 11 (완료) — Ticket Discovery Center

**1단계(설계) 조사 결과**: 이번 Sprint를 시작하기 전에 인터파크가 공식 API/RSS/공식 공연 일정/공식 오픈 일정/공식 공지 중 이 프로젝트가 실제로 사용할 수 있는 방식을 제공하는지 웹 검색으로 조사했다.

- 공식 API: `shop.interpark.com/openapi/`에 "인터파크 표준 API"가 존재하지만, 이는 인터파크 **쇼핑(오픈마켓 판매자용) API**이며 상품 주문/판매 연동이 목적이다. 공연 티켓 오픈 일정과는 무관한 별개 사업부 API이고, 신청도 판매자 대상(`api@interparkcs.com` 메일 접수)이라 이 프로젝트가 사용할 수 있는 대상이 아니다.
- RSS: 검색 결과 범위 내에서 `tickets.interpark.com`(NOL 티켓)의 티켓 오픈 일정을 위한 공식 RSS 피드는 발견하지 못했다.
- 공식 공연 일정 / 공식 오픈 일정: `tickets.interpark.com/contents/notice`에 "오픈예정" 공지 게시판이 공개되어 있다(사람이 웹 브라우저로 보는 페이지). 다만 이는 제3자가 프로그램적으로 가져다 쓰도록 설계·문서화된 기계 판독용 피드/API가 아니라 사람이 보는 일반 웹페이지다.
- 공식 공지: 위와 동일하게 `tickets.interpark.com/contents/notice`의 개별 공지 페이지(`/contents/notice/detail/{id}`)로 확인된다.

**결론**: 이 프로젝트가 지금 바로 연동할 수 있는, 문서화되고 제3자에게 공개된 API/RSS는 확인되지 않았다. 공개 웹페이지(오픈예정 공지 게시판)는 존재하지만, 이를 프로그램으로 긁어오는 것은 PM 지시("크롤링 우회 금지", "공식적으로 공개된 정보만 사용")의 취지에 비추어 볼 때 안전한 방식이라고 판단하지 않았다 — 문서화된 API/RSS 계약이 없는 상태에서의 자동 수집은 "크롤링"과 실질적으로 같고, 인터파크의 명시적 허가 없이는 이용약관 위반 소지가 있다.

**선택한 방식과 이유**: `SessionChecker`(Sprint 8)와 동일한 "교체 가능한 Provider" 패턴을 그대로 적용해 `DiscoveryDataProvider` 인터페이스를 만들고, 현재는 `mockDiscoveryDataProvider`(Mock 데이터)를 기본값으로 연결했다. **이 Mock 구현체는 임시(placeholder) 구현이며 실제 서비스에 사용할 목적이 아니다** — 실제 공연 정보를 담고 있지 않고, 모든 항목에 `source: 'MOCK'`이 명시되어 있으며, 실제 서비스 단계에서 인터파크와 공식 데이터 제휴(API 키 발급 등)를 맺으면 `DiscoveryManager` 생성자에 실제 Provider를 주입하는 것만으로 교체되어야 한다(Repository/Manager/화면 코드는 손댈 필요 없음). **비공식 스크래핑(문서화된 API/RSS 계약 없이 `tickets.interpark.com` 웹페이지를 프로그램으로 읽어오는 방식)은 이 프로젝트의 기본 구현 대상이 아니다** — 1단계 조사에서 확인한 공개 "오픈예정" 공지 게시판이 있더라도, 명시적인 API/제휴 계약 없이 이를 자동 수집하는 기능은 구현하지 않는다(PM 지시 "크롤링 우회 금지"의 연장선).

**2단계 Architecture**: 기존 Reservation/Plugin/Session/Scheduler/Simulation/Ready/Execution Domain은 코드 한 줄도 수정하지 않았다(`git diff develop --stat` 확인, 아래 "변경 파일" 참고). 새 Domain은 지시대로 Discovery 1개만 추가했다.

- [x] **3단계 Discovery Domain** — Repository(LocalStorage, 캐시+즐겨찾기 ID), Manager(단일 진입점: list/refresh/search/즐겨찾기/prepareReservation), Model(D-day 계산/라벨/키워드 검색/Reservation Draft 변환), Types, Rule(DiscoveryRule, TTL 30분), Provider(DiscoveryDataProvider + Mock 구현), Mock 데이터(6건, 매 호출 시점 기준 상대 날짜로 생성해 날짜가 오래되지 않도록 함)
- [x] **4단계 Home** — 하단 메뉴(BottomNavigation)에 "🔍 공연 찾기" 추가. 기존에는 하단 메뉴가 라벨만 있고 실제 이동 기능이 없었는데, 이번에 Home/공연 찾기 두 항목을 실제 `Link`로 연결했다(History/Setting은 아직 화면이 없어 계속 비활성 상태로 남김)
- [x] **5단계 Discovery 화면(`/discovery`)** — 목록에 아티스트/제목/상태(오픈예정/예매중/종료)/공연일시/장소/예매 오픈 일시/D-day/[예약 준비] 버튼 표시
- [x] **6단계 검색** — 아티스트/제목 키워드로 실시간 필터링(이미 불러온 목록 내에서만 필터링하며 키 입력마다 재조회하지 않음)
- [x] **7단계 관심공연** — ☆/★ 버튼으로 즐겨찾기 추가/삭제, "즐겨찾기만 보기" 체크박스
- [x] **8단계 Reservation 연결** — [예약 준비] 클릭 시 `DiscoveryItem`을 `ReservationDraft`로 변환해 기존 `ReservationManager.create()`로 등록하고 Ready Screen(`/ready/:id`)으로 이동. 동일 공연으로 이미 연결된 예약이 있으면 새로 만들지 않고 재사용(중복 방지). Reservation 등록만 수행하며, 실제 예약 페이지 진입/자동 클릭/자동 예약/자동 좌석선택/자동 결제는 전혀 수행하지 않는다(그 이후는 기존 Ready Screen의 수동 흐름을 그대로 따른다)
- [x] **9단계 Cache** — Discovery 목록을 LocalStorage에 캐시하고 TTL 30분(`DEFAULT_DISCOVERY_RULE.cacheTtlMinutes`)이 지나면 재조회. Magic Number 없이 Rule 객체로 관리(ReadyRule/ExecutionRule과 동일한 패턴)
- [x] **10단계 Offline** — `navigator.onLine`이 false면 재조회를 시도하지 않고 캐시에 저장된 마지막 조회 데이터를 그대로 표시. 화면에 "오프라인 상태입니다. 마지막으로 조회한 정보를 표시하고 있습니다." 안내 배너 표시. 온라인으로 복귀하면 자동으로 재조회

구현 금지 항목(자동 예약/자동 클릭/자동 로그인/자동 좌석선택/자동 결제/크롤링 우회/비공개 API)은 구현하지 않았다.

**변경 파일**: `src/App.tsx`(`/discovery` 라우트 추가), `src/components/layout/BottomNavigation.tsx`(실제 Link로 전환 + "🔍 공연 찾기" 추가). 이 외 기존 파일은 전혀 수정하지 않았다.

**신규 파일(Discovery Domain, 10개)**: `src/domain/discovery/{types.ts, index.ts, rule/discoveryRule.ts, mock/discovery.mock.ts, provider/discovery.provider.ts, model/discovery.model.ts, repository/discovery.repository.ts, repository/discovery.repository.localStorage.ts, repository/index.ts, manager/discovery.manager.ts}`

**신규 파일(화면, 2개)**: `src/pages/Discovery/{Discovery.tsx, index.ts}`

**삭제된 파일**: 없음(0개)

**기존 코드 유지율(%)**: 약 99.5% (develop 기준 `src/` 전체 4,679줄 중 이번 Sprint에서 삭제된 줄은 22줄 — 전부 `BottomNavigation.tsx`를 정적 `<span>` 목록에서 실제 `<Link>` 목록으로 바꾸며 기존 줄을 다시 쓴 부분이며, 로직 삭제가 아니다)

**기존 Domain 재사용률**: Reservation Domain은 수정 없이 100% 그대로 재사용(`reservationManager.list()`/`create()` 호출). Plugin/Session/Scheduler/Simulation/Ready/Execution Domain은 이번 Sprint에서 직접 호출하지 않았지만, [예약 준비]로 생성된 Reservation이 곧바로 기존 Ready Screen 흐름(Session/Plugin 상태 확인 등)으로 이어지므로 간접적으로는 계속 연결되어 있다.

**MVP 테스트 결과**

- 정적 검증: 전체 `src/` import 경로 해석(Python 스크립트) 통과, 금지 패턴(`puppeteer`/`playwright`/`selenium`/자동클릭/비밀번호/`fetch(...interpark`/`axios(...interpark` 등) grep 검사에서 발견 없음, 신규/변경 파일 전체 중괄호·괄호 balance 검사 통과
- Architecture 영향 점검: `git diff develop --stat` 결과 기존 Domain(Reservation/Plugin/Session/Scheduler/Simulation/Ready/Execution) 폴더 내 파일은 한 개도 변경되지 않았고, `App.tsx`/`BottomNavigation.tsx`(라우팅/네비게이션, Domain 아님) 2개 파일만 수정되었음을 확인
- `npm install` 시도: 이 개발 환경은 npm 레지스트리 접근이 차단되어 있어(`403 Forbidden`, Sprint 8부터 동일하게 반복 확인된 제약) 실제 `tsc`/`vite build`/`npm run dev`를 실행하지 못했다. **PM이 로컬에서 직접 확인 필요**
- 발견된 버그: 없음(정적 검증 범위 내)

**PM Review 요청**

1. 1단계 조사 결과, 인터파크의 공식 API는 이 프로젝트와 무관한 쇼핑(오픈마켓) API뿐이었고 티켓 오픈 일정용 공식 API/RSS는 찾지 못했다. Mock Provider로 우선 구현하는 이번 방향이 맞는지, 혹은 인터파크와 별도의 공식 데이터 제휴를 추진할지 확인 부탁드린다.
2. `tickets.interpark.com/contents/notice`(오픈예정 공지 게시판)는 사람이 보는 공개 웹페이지로 존재한다. 향후 이 페이지를 프로그램으로 읽어오는 것을 "공식적으로 공개된 정보 사용"으로 볼 수 있을지, 아니면 여전히 문서화된 API/제휴 없이는 시도하지 않아야 하는지 방향을 확인 부탁드린다(현재 구현에는 포함하지 않았다).
3. Discovery Mock 데이터는 아이유/임영웅/세븐틴 등 예시 아티스트명을 사용했다. 실제 서비스 전환 전에 예시 데이터를 그대로 노출해도 괜찮을지, 혹은 더 일반적인 이름(예: "아티스트 A")으로 바꿀지 확인 부탁드린다.

### Sprint 11 PM Review 수정 (완료)

PM이 요청한 6개 항목 모두 문서/TODO 주석 추가만으로 반영했다. **Architecture는 변경하지 않았고, 기존 코드는 삭제하지 않았으며, Discovery 구조(Repository/Manager/Model/Provider/Rule/Types)도 그대로 유지했다. 기능 동작은 하나도 바뀌지 않았다.**

- [x] `src/domain/discovery/provider/discovery.provider.ts`에 TODO 추가 — 지금은 `DiscoveryDataProvider` 하나(Mock)만 사용하지만, 향후 Official/Manual/Favorite 세 종류의 Provider를 조합하는 Composite Provider 구조로 확장할 수 있음을 문서화. `DiscoveryDataProvider` 타입/`mockDiscoveryDataProvider`/`DiscoveryManager`의 실제 코드는 변경하지 않았다(여전히 단일 Provider를 주입받는 구조 그대로)
- [x] README "선택한 방식과 이유" 문단에 Mock 구현체가 **임시(placeholder)**이며 실제 서비스용이 아님을 명확히 기술
- [x] README 같은 문단에 **비공식 스크래핑은 기본 구현 대상이 아님**을 명시(공개 웹페이지가 존재해도 문서화된 API/제휴 계약 없이는 자동 수집 기능을 구현하지 않는다)

**변경 파일**: `src/domain/discovery/provider/discovery.provider.ts`(TODO 주석만 추가), `README.md`

**삭제된 파일**: 없음(0개)

**Architecture 영향**: 없음 — 새 Provider 구현체나 Composite 클래스를 실제로 추가하지 않았다. `DiscoveryDataProvider` 타입 시그니처, `mockDiscoveryDataProvider`의 동작, `DiscoveryManager` 생성자 시그니처 모두 이전과 동일하다.

### Sprint 12 (완료) — Discovery Center 안정화

**PM 지시(Sprint 12부터)**: 기능 추가 대신 "현재 구현된 기능을 실제 사용할 수 있는 수준까지 완성·안정화"하는 방향으로 전환. v1.0 범위는 국내 공연 예매(인터파크/YES24/멜론티켓/티켓링크) + 국내 항공 예약(대한항공/아시아나/제주항공/진에어/티웨이/에어부산/에어서울)으로 한정되었고, Sprint마다 기능개선 → Unit Test → Integration Test → 실사용 시나리오 테스트 → PM Review → Git Push 순서를 따르기로 했다. 이번 Sprint는 그 첫 대상으로 기존 Discovery Center(Sprint 11)를 다룬다. **새 Domain/Architecture 변경 없음, Discovery 구조 유지, Mock Provider 구조 유지.**

- [x] **① UI/UX 개선** — 목록 정렬 로직 추가(`sortDiscoveryItems`): 예매중/오픈예정 공연을 먼저, 종료된 공연은 뒤로 정렬. "총 N건" 표시 추가
- [x] **② 검색 편의성 개선** — 기존 `genre` 필드(이미 존재하던 데이터, 신규 필드 아님)를 활용한 장르 Chip 필터(`filterDiscoveryByGenre`/`getAvailableGenres`) 추가, 검색창에 지우기(✕) 버튼 추가
- [x] **③ 관심 공연 등록 UX 개선** — "즐겨찾기만 보기" 옆에 즐겨찾기 개수 표시
- [x] **④ Discovery → Reservation 연결 개선** — 이미 연결된 항목에 "이미 등록됨" 표시(`DiscoveryManager.isLinked()` 신규), 신규 등록과 기존 예약 재사용 시 토스트 문구를 구분(`DiscoveryPrepareResult.alreadyLinked` 필드 추가), **종료(Closed)된 공연은 [예약 준비] 버튼을 비활성화**(버그 수정, 아래 참고)
- [x] **⑤ Discovery 테스트 코드 작성** — `vitest`를 devDependency로 추가(App 런타임 Architecture와 무관한 개발 도구, 기존 Domain 코드는 건드리지 않음)하고 `vitest.config.ts` 신설(기존 `vite.config.ts`는 수정하지 않음). Model 테스트(`discovery.model.test.ts`, 20개 케이스), Rule 테스트(`discoveryRule.test.ts`), Manager 통합 테스트(`discovery.manager.test.ts`, 메모리 Fake Repository로 실제 브라우저 없이 TTL/즐겨찾기/중복 방지 로직 검증) 작성
- [x] **⑥ APK 실사용 테스트** — 아래 "테스트 결과"에 상세 기록(불가 사유 포함)
- [x] **⑦ 발견된 버그 수정** — 아래 "발견된 버그" 참고

**발견된 버그**

1. **`formatDDay()` 날짜 경계 오류(수정 완료)**: 테스트 코드 작성 중 발견. 기존 로직은 openTime과 현재 시각의 정확한 밀리초 차이를 24시간 단위로 올림(`Math.ceil`) 계산했다. 그 결과 "오늘 20시 오픈"인데 지금이 "오늘 09시"면 같은 날짜인데도 "D-1"로 잘못 표시되었다(사용자는 "D-DAY"를 기대). 시:분:초를 버리고 날짜(YYYY-MM-DD)만 비교하도록 수정했고, `discovery.model.test.ts`에 회귀 방지 테스트를 추가했다.
2. **종료된 공연도 [예약 준비] 가능했던 문제(수정 완료)**: 기존에는 `DiscoveryStatus.Closed`(종료) 상태인 공연도 [예약 준비] 버튼을 눌러 의미 없는 Reservation을 만들 수 있었다. 버튼을 비활성화하고 "예매 종료"로 라벨을 바꿨다.
3. **(참고용, 수정 안 함) 성능**: 목록의 각 항목마다 `isFavorite()`/`isLinked()`를 렌더링 시점에 호출해 LocalStorage를 반복 조회한다. 현재 Mock 데이터 규모(6건)에서는 체감 성능 문제가 없어 "안정성 우선, 기능 추가 최소화" 원칙에 따라 이번 Sprint에서는 손대지 않았다. 실제 데이터 규모가 커지면(수십~수백 건) 캐싱을 검토할 필요가 있다.

**변경 파일**: `src/domain/discovery/model/discovery.model.ts`(정렬/장르 필터/버그 수정), `src/domain/discovery/manager/discovery.manager.ts`(정렬 적용/isLinked 추가/alreadyLinked 필드), `src/pages/Discovery/Discovery.tsx`(UI 반영), `package.json`(버전, vitest devDependency, test 스크립트)

**신규 파일**: `vitest.config.ts`, `src/domain/discovery/model/discovery.model.test.ts`, `src/domain/discovery/rule/discoveryRule.test.ts`, `src/domain/discovery/manager/discovery.manager.test.ts`

**삭제된 파일**: 없음(0개)

**Architecture 영향**: 없음 — `git diff develop --stat` 확인 결과 Discovery 외의 기존 Domain(Reservation/Plugin/Session/Scheduler/Simulation/Ready/Execution) 파일은 한 개도 변경되지 않았다. 새 Domain을 추가하지 않았고, Discovery의 기존 구조(Repository/Manager/Model/Provider/Rule/Types)도 그대로 유지했다.

**기존 코드 유지율(%)**: 약 99.5% (develop 기준 `src/` 전체 5,454줄 중 삭제된 줄은 27줄 — 전부 `formatDDay()` 로직 교체와 `discovery.manager.ts`의 몇몇 메서드 내부를 다시 쓴 부분이며, 기능 삭제는 아니다)

**테스트 결과**

- **Unit Test**: `discovery.model.test.ts`(getDiscoveryStatusLabel/formatDDay/filterDiscoveryByKeyword/filterDiscoveryByGenre/getAvailableGenres/sortDiscoveryItems/toReservationDraft/findLinkedReservation, 총 16개 케이스)
- **Integration Test**: `discovery.manager.test.ts`(메모리 Fake `DiscoveryRepository` + 고정 Provider + 실제 `ReservationManager`를 조합해 캐시 TTL, 즐겨찾기 토글, 중복 없는 Reservation 연결, `isLinked()`를 검증, 총 9개 케이스)
- **실행 여부(중요)**: 이 개발 환경은 npm 레지스트리 접근이 차단되어 있어(`vitest` 설치 시도 결과 `403 Forbidden`, Sprint 8부터 반복 확인된 동일 제약) 위 테스트 코드를 실제로 실행하지 못했다. 대신 각 함수의 핵심 로직(특히 `formatDDay`의 날짜 경계, 정렬, 장르 필터, TTL 판정)을 Python으로 동일하게 재구현해 테스트 케이스와 동일한 입력으로 결과가 일치하는지 확인했다(모두 일치). **PM이 로컬에서 `npm install && npm test`를 실행해 실제 Pass/Fail 결과를 확인해야 한다.**
- **실사용 시나리오 테스트(정적 코드 추적)**: 브라우저/모바일 기기가 없는 샌드박스 환경이라 실제 클릭 테스트 대신, PM이 제시한 9단계 흐름을 코드 상에서 단계별로 추적했다.
  1. 앱 실행: `main.tsx`가 `BrowserRouter` + `ToastProvider`로 `App`을 감싸고 있음을 확인
  2. Discovery 확인: Home → BottomNavigation "🔍 공연 찾기" → `/discovery` → mount 시 `discoveryManager.refreshIfNeeded()` 호출 확인
  3. 예약 등록: [예약 준비] 클릭 → `prepareReservation()` → `reservationManager.create()` → `/ready/:id`로 `navigate()` 확인
  4. 로그인 확인 / 5. Plugin 확인: Ready Screen이 `siteAccountManager`/`pluginManager`를 조회하는 기존 로직(Sprint 8-9) 그대로 재사용됨을 확인. Site Account/Plugin을 사전에 등록하지 않은 사용자는 "등록된 사이트 계정이 없습니다"/"설치된 Plugin이 없습니다"가 표시됨(기존 동작, 회귀 아님)
  6. Ready Screen / 7. Countdown: Sprint 10에서 구현한 실시간 Countdown/준비 점수/체크리스트가 그대로 동작함을 코드로 확인(이번 Sprint에서 변경하지 않음)
  7. 예약 페이지 열기: `reservation.url`이 없는 Discovery 항목(Mock 데이터 중 "아이유 팬미팅 - 부산" 1건은 의도적으로 url 없음)으로 등록한 경우, 버튼이 정상적으로 비활성화되고 안내 문구가 뜨는 기존 로직을 확인
  8. 사용자가 직접 예약 진행: `window.open()`으로 새 탭만 열릴 뿐, 이후 과정은 이 앱이 관여하지 않음을 재확인
  - **복귀 동작**: Ready Screen → "← 예약 상세로"(`/reservation/:id`) → "← 목록으로"(`/`)로 Home까지 돌아오는 경로가 끊기지 않고 연결되어 있음을 확인
- **Android APK 실행**: **이번 Sprint에서는 수행하지 못했다.** 이 프로젝트는 현재 순수 Vite 웹앱(React+TypeScript)이며, Capacitor/Cordova 등 모바일 패키징 도구가 아직 설정되어 있지 않다(`package.json`/설정 파일 확인 결과 없음). 이 개발 환경(샌드박스)에는 Android SDK/에뮬레이터/디스플레이도 없어 APK를 빌드하거나 실행할 수 없다. PRD의 "향후 APK 변환 가능 구조"는 지금까지 Clean Architecture 유지로 준비는 되어 있지만, 실제 APK 빌드 파이프라인 구축은 별도 Sprint로 분리해야 한다(아래 PM Review 요청 참고).
- **Build 성공 / Crash / Memory Leak**: `npm install`이 막혀 있어 `tsc -b`/`vite build`를 이 환경에서 실행하지 못했다(Sprint 8부터 동일). 정적 검증(import 경로 전수 해석, 금지 패턴 grep, 파일별 중괄호/괄호 balance)은 통과했다. Crash/Memory Leak은 실행 중인 프로세스를 관찰해야 확인 가능한 항목이라 이 샌드박스에서는 검증할 수 없다 — **PM 로컬 확인 필요**
- **History 저장 정상**: 이 체크리스트 항목은 이번 Sprint 범위에 해당하지 않는다. `src/types/history.ts`는 Sprint 4 이후 계속 빈 placeholder(`export {}`)로만 존재하며, History Domain/Manager/화면은 아직 구현되지 않았다(v1.0 범위 재확인 필요, 아래 PM Review 요청 참고)
- **Regression**: `git diff develop --stat` 기준 Discovery 외 기존 Domain 파일 변경 없음, 삭제 파일 0개. 기존 화면(Home/ReadyScreen/Simulation/PluginSettings/SiteSettings/ReservationDetail 등)의 코드는 이번 Sprint에서 전혀 수정하지 않았다.

**PM Review 요청**

1. "Sprint 완료 조건" 체크리스트 중 **Android APK 실행**과 **History 저장 정상**은 이번 Sprint 범위(Discovery 안정화)와 무관하고, 애초에 프로젝트에 아직 존재하지 않는 기능(APK 패키징 파이프라인, History Domain)이다. 이 두 항목을 매 Sprint 공통 체크리스트로 계속 유지할지, 아니면 해당 기능이 실제로 구현된 이후부터 적용할지 확인 부탁드린다.
2. Unit/Integration Test 코드는 작성했지만, npm 레지스트리 차단으로 이 환경에서는 실행할 수 없다. PM이 로컬에서 `npm install && npm test`를 실행해 실제 통과 여부를 확인해주셔야 다음 Sprint로 안전하게 진행할 수 있다.
3. v1.0 범위(인터파크/YES24/멜론티켓/티켓링크 + 국내 항공 7개사)가 확정되었는데, 현재 Reservation/Plugin/URL 검증 로직은 인터파크(`tickets.interpark.com`)만 지원한다. 나머지 사이트/항공사 지원은 언제부터, 어떤 순서로 진행할지 다음 Sprint 계획을 확인 부탁드린다.
