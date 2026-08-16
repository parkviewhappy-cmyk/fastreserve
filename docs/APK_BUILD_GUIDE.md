# APK Build Guide

PM 지시(Sprint 13, ② Android APK 준비 / ③ Android 권한 점검)에 따라 작성한 로컬 빌드 절차 문서다.

이 샌드박스(개발 환경)는 npm 레지스트리 접근이 차단되어 있고 Android SDK/에뮬레이터/디스플레이가 없어
아래 절차를 실제로 실행하지 못했다. **PM이 로컬 PC에서 직접 실행해야 한다.**

## 1. 사전 준비

- Node.js + npm (이미 웹 개발에 사용 중인 환경 그대로)
- Android Studio (Android SDK 포함)
- JDK 17 (Android Studio가 함께 설치해주는 버전으로 충분)

## 2. Web Build → APK 절차

```bash
# 1) 의존성 설치(Capacitor 패키지 포함)
npm install

# 2) Web Build (Vite가 dist/ 폴더에 결과물을 만든다)
npm run build

# 3) Android 네이티브 프로젝트 생성 (최초 1회만 실행)
npm run cap:add:android
# 위 명령이 android/ 폴더를 새로 생성한다. 이 폴더는 이 프로젝트의 기존 src/ 구조와
# 무관한 별도의 네이티브 프로젝트이며, 한 번 생성한 뒤에는 Git에 커밋해서 관리한다.

# 4) Web Build 결과를 Android 프로젝트로 동기화
npm run cap:sync
# capacitor.config.ts의 webDir('dist')을 android/app/src/main/assets/public로 복사한다.
# 이후 코드를 수정할 때마다 "npm run build" → "npm run cap:sync" 순서로 다시 실행하면 된다.

# 5) Android Studio에서 열어 APK 빌드
npm run cap:open:android
# Android Studio가 열리면 Build → Build Bundle(s) / APK(s) → Build APK(s) 로 빌드한다.
```

## 3. Android 권한 점검 (Sprint 13 ③)

FastReserve는 "Reservation Assistant"(자동 예매 아님) 원칙을 유지하므로, 요청하는 권한도
최소한으로 유지한다. 아래는 현재 웹 코드가 사용 중인 브라우저 API와, 그것이 Android
WebView(Capacitor) 환경에서 정상 동작하기 위해 필요한 조치를 정리한 것이다.

| 항목 | 현재 웹 코드에서의 사용처 | Android(Capacitor) 동작 여부 | 필요한 조치 |
|---|---|---|---|
| **Internet** | Discovery/Reservation은 외부 API를 호출하지 않지만(Mock), 향후 실제 API 연동 시 필요 | Capacitor가 `android/app/src/main/AndroidManifest.xml`에 `INTERNET` 권한을 기본 포함시킨다 | 별도 조치 불필요(기본 포함) |
| **Storage(LocalStorage)** | Reservation/Session/SiteAccount/PluginRegistry/Discovery 캐시·즐겨찾기 등 전 Domain이 `window.localStorage` 사용 | Android WebView는 앱 전용 저장 공간에 LocalStorage를 유지한다(다른 앱과 공유되지 않음, 별도 Storage 권한 불필요) | 별도 조치 불필요. 단, 앱 삭제/데이터 초기화 시 예약 데이터가 함께 삭제됨을 사용자에게 안내할 필요는 있음(TODO) |
| **Notification** | `ReadyScreen.tsx`가 브라우저 `Notification` API로 10분/5분/1분 전 알림을 시도 | **TODO**: 순수 Web `Notification` API는 Android WebView 안에서 시스템 알림으로 안정적으로 뜨지 않는 경우가 많다. Android 13(API 33)부터는 `POST_NOTIFICATIONS` 런타임 권한도 별도로 필요하다 | **PM 승인(Sprint 13 PM Review): Sprint 15에서 `@capacitor/local-notifications` 도입**. 이번 Sprint(13)에서는 코드를 변경하지 않으며, Sprint 15에 가서 실제 플러그인 추가/연동을 진행한다 |
| **Vibration** | `ReadyScreen.tsx`가 `navigator.vibrate()`로 1분 전 진동 | Android는 `VIBRATE` 권한이 필요하며, Capacitor Android 프로젝트 생성 시 기본 `AndroidManifest.xml`에 포함되는 경우가 많다 | `cap add android` 실행 후 `AndroidManifest.xml`에 `<uses-permission android:name="android.permission.VIBRATE" />`가 있는지 직접 확인 필요(TODO, 이 샌드박스에서는 android/ 폴더 자체가 없어 확인 불가) |
| **Foreground 실행** | Countdown(`setInterval` 1초), TTL 캐시 등은 화면이 켜져 있고 앱이 포그라운드일 때를 가정하고 동작 | 포그라운드 상태에서는 기존 웹 코드가 그대로 동작할 것으로 예상됨(추가 네이티브 코드 불필요) | 실기기 테스트로 확인 필요(TODO) |
| **Background 복귀** | 앱이 백그라운드로 갔다가 돌아왔을 때 Countdown/캐시가 올바르게 갱신되는지는 확인되지 않음 | Android가 백그라운드에서 WebView의 JS 타이머(`setInterval`)를 절전 최적화로 지연/중지시킬 수 있다 | **TODO**: `@capacitor/app`의 `App.addListener('resume', ...)`으로 앱이 다시 포그라운드로 돌아올 때 `getNow()` 기준으로 상태를 다시 계산하도록 하는 로직이 필요하다. `package.json`에 `@capacitor/app`를 미리 추가해두었지만, 실제 리스너 연결은 다음 Sprint에서 진행한다(이번 Sprint는 "새 기능 최소화" 원칙에 따라 구현하지 않음) |

## 4. 참고: 이번 Sprint에서 실제로 변경한 것

- `package.json`: `@capacitor/core`/`@capacitor/android`/`@capacitor/app`(dependencies), `@capacitor/cli`(devDependencies), `cap:*` 스크립트 3개 추가
- `capacitor.config.ts` 신규 파일 추가(webDir: 'dist')
- 기존 React 소스 코드(`src/` 전체)는 이번 Sprint에서 전혀 수정하지 않았다(PM 지시 "기존 React 프로젝트는 변경하지 않는다" 준수)
- `android/` 네이티브 폴더는 이 샌드박스에서 생성하지 못했다. PM이 `npm run cap:add:android`를 로컬에서 실행해야 생성된다
