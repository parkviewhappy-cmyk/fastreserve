# FastReserve (Interpark MVP) - PRD

## 1. 프로젝트 개요

**프로젝트명**: FastReserve

**프로젝트 목표**: 인터파크 티켓 예매를 자주 사용하는 사용자가 예약 정보를 미리 등록하고, 예약 시작 시간에 맞춰 예약 준비를 효율적으로 진행할 수 있도록 지원하는 웹앱(MVP)을 개발한다. 본 프로젝트는 인터파크 전용 MVP를 먼저 완성하고, 안정성과 사용성을 검증한 후 APK 및 다른 예약 사이트로 확장한다.

## 2. 개발 원칙

**개발 환경**: Git (Free), GitHub (Free), React, TypeScript, Vite, TailwindCSS

**원칙**: 무료 환경만 사용 / Clean Architecture / Component 기반 개발 / 유지보수가 쉬운 구조 / 향후 APK 변환 가능 구조 / 인터파크 전용 MVP 우선 개발

## 3. MVP 범위

이번 버전은 인터파크만 지원한다.

지원 기능: 예약 프로필 등록, 예약 수정, 예약 삭제, 예약 목록 관리, 예약 시간 관리, 예약 준비 상태 확인, 카운트다운, 예약 페이지 빠른 진입 지원, 예약 결과 기록

## 4. 사용자

**Primary User**: 인터파크 공연 티켓을 자주 예매하는 사용자

**특징**: 인기 공연 예매 / 예약 시작 시간에 맞춰 접속 / 반복적으로 동일한 정보를 입력

## 5. User Flow

```
웹앱 실행 → 예약 목록 → 예약 등록 → 예약 저장 → 예약 대기
→ 예약 준비 → 예약 페이지 진입 → 사용자가 예약 진행 → 예약 종료 → History 저장
```

## 6. 화면 구성

**Splash**: 로고, 프로젝트명

**Home**: 오늘 예약, 예약 목록, 예약 추가, 설정

**Add Reservation**
- 입력 항목: 예약명, 공연명, 공연 날짜, 공연 시간, 예약 시작 시간, 공연 URL(선택), 메모
- 버튼: 저장, 취소

**Reservation Detail**: 수정, 삭제, 복사

**Ready Screen**: 예약명, 남은 시간, 현재 상태, 예약 시작 버튼

**History**: 실행 시간, 실행 결과, 메모

**Setting**: 다크모드, 알림, 데이터 백업

## 7. 데이터 모델

**Reservation**: id, title, eventName, eventDate, eventTime, openTime, url, memo, status, createdAt, updatedAt

**History**: id, reservationId, result, createdAt, message

**Setting**: theme, notification, backup, version

## 8. 상태(State)

```
Idle → Waiting → Preparing → Ready → Completed → History
```

Error: Failed

## 9. 프로젝트 구조

```
FastReserve
├── docs/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── assets/
└── README.md
```

PM 승인(Sprint 1 리뷰) 반영 후 구조: `src/adapters/interpark/`, `src/services/storage/`, `src/services/notification/` 추가.

## 10. 페이지

Home / Add Reservation / Reservation Detail / Ready / History / Setting

## 11. 컴포넌트

ReservationCard / CountdownTimer / StatusBadge / BottomNavigation / Header / Dialog / Toast / Loading / Button

## 12. 디자인 시스템

Theme: Dark / Primary: Emerald / Accent: Blue / Font: Pretendard / Style: Modern, Minimal, Business

## 13. 성능 목표

앱 실행 2초 이내 / 예약 저장 500ms 이내 / 예약 목록 1초 이내 / 화면 전환 300ms 이하

## 14. 예외 처리

예약 시간 오류 / 입력값 누락 / 인터넷 연결 없음 / 예약 데이터 없음 / URL 없음 / 중복 예약

## 15. Git 전략

```
main
develop
feature/ui
feature/reservation
feature/history
feature/setting
feature/core   (PM 승인 시 추가)
release
```

## 16. Sprint 계획

- Sprint 1: 프로젝트 생성, Git 연결, GitHub 연결, 기본 UI
- Sprint 2: 예약 CRUD
- Sprint 3: 카운트다운, 예약 준비 화면
- Sprint 4: History, 설정
- Sprint 5: UI 개선, 버그 수정
- Sprint 6: 웹앱 MVP 완료

## 17. QA

테스트 항목: 예약 등록 / 예약 수정 / 예약 삭제 / 목록 표시 / 카운트다운 / 준비 화면 / 설정 저장 / 히스토리 저장 / 오류 처리

## 18. MVP 완료 조건

- 사용자가 예약 정보를 등록할 수 있다.
- 예약 목록을 관리할 수 있다.
- 예약 시작 시각을 기준으로 준비 상태를 확인할 수 있다.
- 예약 페이지로 빠르게 이동하여 사용자가 예약을 진행할 수 있다.
- 실행 이력이 저장된다.

## 개발 원칙 (공통)

1. 한 번에 모든 기능을 구현하지 않는다.
2. Sprint 단위로 개발한다.
3. 각 Sprint 완료 후 Commit 한다.
4. 모든 코드에 TypeScript 타입을 적용한다.
5. React Functional Component를 사용한다.
6. 유지보수가 쉬운 구조를 유지한다.
7. 모든 기능은 재사용 가능한 컴포넌트로 작성한다.
8. README를 항상 최신 상태로 유지한다.
9. UI보다 Architecture를 우선한다.
10. 한 Sprint에는 하나의 목표만 구현한다.
