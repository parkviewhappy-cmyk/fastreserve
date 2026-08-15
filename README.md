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
│   │   │   ├── engine/              # Execution Engine (Queue 생성/Priority/Adapter 선택/실행)
│   │   │   ├── rule/                # ExecutionRule (Magic Number 제거)
│   │   │   ├── factory/             # ExecutionContext Factory
│   │   │   └── types.ts             # ExecutionContext / ExecutionResult / ExecutionQueueItem
│   │   └── adapter/                # Site Adapter 도메인 (Sprint 6)
│   │       ├── siteAdapter.ts        # Site Adapter Interface
│   │       ├── interparkAdapter.ts   # Interpark Mock Adapter
│   │       └── adapter.registry.ts   # SiteType -> Adapter 조회
│   ├── pages/
│   │   ├── Home/                  # Home 화면 (Dashboard 포함)
│   │   ├── AddReservation/        # 예약 등록 화면
│   │   ├── ReservationDetail/     # 예약 상세/수정 화면
│   │   ├── SiteSettings/          # 사이트 관리 화면 (/site, Sprint 5)
│   │   └── Simulation/            # Simulation Mode 화면 (/simulation, Sprint 6)
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
