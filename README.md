# FastReserve (Interpark MVP)

인터파크 티켓 예매를 자주 사용하는 사용자가 예약 정보를 미리 등록하고,
예약 시작 시간에 맞춰 예약 준비를 효율적으로 진행할 수 있도록 지원하는 웹앱(MVP)입니다.

인터파크 전용 MVP를 먼저 완성하고, 안정성과 사용성을 검증한 후
APK 및 다른 예약 사이트로 확장합니다.

현재 버전: v0.3.0

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
│   │   │                        # FormField, Toast, Dialog 등 공통 컴포넌트
│   │   └── layout/               # Header, BottomNavigation 등 레이아웃 컴포넌트
│   ├── domain/
│   │   └── reservation/          # Reservation 도메인
│   │       ├── model/             # 도메인 규칙 (순수 함수)
│   │       ├── service/           # Business Logic (조회)
│   │       ├── manager/           # Reservation Manager - CRUD 진입점 (Sprint 3)
│   │       ├── repository/        # 데이터 접근 추상화 (Mock/LocalStorage)
│   │       ├── validator/         # 입력값 검증
│   │       └── mock/              # Mock 데이터
│   ├── pages/
│   │   ├── Home/                  # Home 화면
│   │   ├── AddReservation/        # 예약 등록 화면 (Sprint 3)
│   │   └── ReservationDetail/     # 예약 상세/수정 화면 (Sprint 3)
│   ├── hooks/
│   │   └── useToast.tsx           # Toast 전역 상태 (Sprint 3)
│   ├── services/
│   │   ├── storage/                 # 예약/히스토리/설정 데이터 저장소 (미구현)
│   │   └── notification/            # 예약 알림 (미구현)
│   ├── types/                        # Reservation, History, Setting 타입
│   ├── utils/                         # uuid, date 등 공통 유틸 함수
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
- [x] Home 화면에서 예약 개수 / 오늘 예약 / 예약 준비중 개수 표시

Sprint 3 범위에서는 인터파크 연동/Browser 자동화/Scheduler/Notification/Countdown/APK를 구현하지 않았다.
Mock Repository는 코드에 그대로 유지했으며, 기본 Repository만 LocalStorage로 교체했다.

다음 Sprint(Sprint 4)에서 History, 설정 기능을 구현한다.
