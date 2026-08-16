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

## 5. Sprint 14 점검 결과 (② Android APK 준비 항목 점검 / ③ 실제 APK 생성 준비 상태 확인)

PM 지시(Sprint 14)에 따라 APK 생성에 필요한 항목을 아래와 같이 전수 점검했다.

| 항목 | 상태 | 비고 |
|---|---|---|
| `capacitor.config.ts` | ✅ 완료 | `appId: com.fastreserve.app`, `appName: FastReserve`, `webDir: dist` — 유효한 역방향 도메인 형식, Vite 기본 빌드 폴더와 일치 확인 |
| `package.json` (Capacitor 의존성/스크립트) | ✅ 완료 | Sprint 13에서 추가, 이번 Sprint에서 재확인만 함(변경 없음) |
| 앱 이름 | ✅ 완료 | "FastReserve" (`capacitor.config.ts` `appName`) |
| App ID | ✅ 완료 | `com.fastreserve.app` |
| App Icon | ✅ 신규 추가(Sprint 14) | `resources/icon.png`(1024x1024) 추가. 기존 `public/favicon.svg` 디자인을 그대로 재사용(새 디자인 제작 아님). 실제 Android `mipmap` 리소스 생성은 `@capacitor/assets` 필요(TODO, 아래 참고) |
| Splash | ✅ 신규 추가(Sprint 14) | `resources/splash.png`(2732x2732, 앱 배경색 `#0a0a0a` + 아이콘 중앙 배치) 추가. 리소스 생성은 App Icon과 동일하게 TODO |
| `AndroidManifest.xml` | ⛔ 확인 불가(TODO) | `android/` 네이티브 폴더 자체가 이 샌드박스에 없어(Android SDK 접근 불가) 파일이 존재하지 않는다. `npm run cap:add:android`를 PM이 로컬에서 실행해야 생성되며, 생성 후 `VIBRATE`/`POST_NOTIFICATIONS` 권한 포함 여부를 직접 확인해야 한다(Sprint 13에서 이미 TODO로 기록한 항목과 동일) |
| Permissions | ✅ 검토 완료(변경 없음) | 위 "3. Android 권한 점검" 표 그대로 유효. 이번 Sprint에서 재검토했으나 새로 발견된 항목 없음 |

### Android Studio에서 바로 Build 가능한 상태인가?

**아니오, 아직 아니다.** `android/` 네이티브 프로젝트가 생성되어 있지 않기 때문이다(이 샌드박스는
npm 레지스트리 접근 차단 + Android SDK 미설치로 `cap add android`를 실행할 수 없다). 설정 파일
(`capacitor.config.ts`, `package.json`, App Icon/Splash 소스)은 모두 준비되었으므로, PM이 로컬에서
"2. Web Build → APK 절차"의 1~5단계를 순서대로 실행하면 곧바로 Android Studio에서 Build가 가능한
상태다.

### Android SDK가 필요해 이번 Sprint에서 처리하지 못한 항목(TODO)

1. `npm run cap:add:android` 실행 → `android/` 네이티브 프로젝트 생성
2. `AndroidManifest.xml`의 `VIBRATE`/`POST_NOTIFICATIONS` 권한 실제 포함 여부 확인
3. `npx capacitor-assets generate --android` 실행 → `resources/icon.png`, `resources/splash.png`로부터 실제 `mipmap-*`/`drawable-*` 리소스 생성
4. Android Studio에서 실제 APK Build 및 실기기(또는 에뮬레이터) 설치 테스트

## 6. Sprint 15 점검 결과 (① Android 프로젝트 생성 / ⑤ Notification / ④ 권한 재점검)

### 6-1. `npx cap add android` 실행 시도 및 정확한 차단 원인

PM 지시대로 실제로 `npx cap add android`를 실행했다. 아래는 그 결과와, 왜 "이에 준하는
절차"(수동 스캐폴딩)도 이번 Sprint에서는 진행하지 않기로 판단했는지에 대한 근거다.

**실행 결과**: `npm error code E403 / 403 Forbidden - GET https://registry.npmjs.org/cap`
(Sprint 8부터 반복 확인된 것과 동일한 차단).

**이번 Sprint에서 추가로 확인한 사실**: 이 샌드박스의 네트워크가 `npm` 클라이언트만
차단하는 것이 아니라 **프록시 레벨에서 거의 모든 외부 접속을 차단**한다는 것을 `curl`로
직접 확인했다.

```
curl https://registry.npmjs.org/@capacitor/android  -> 403 (proxy CONNECT 거부)
curl https://unpkg.com/@capacitor/android/package.json -> 403 (proxy CONNECT 거부)
curl https://cdn.jsdelivr.net/npm/@capacitor/android/package.json -> 403 (proxy CONNECT 거부)
curl https://github.com -> 403 (proxy CONNECT 거부)
```

즉 npm 레지스트리뿐 아니라 대체 CDN(unpkg/jsdelivr)과 GitHub 자체도 이 샌드박스에서는
접근이 차단된다(지금까지 GitHub에 Push가 되었던 것은 이 샌드박스가 아니라 PM님의 로컬
PowerShell에서 실행되었기 때문이다 — 이 프로젝트의 git 원격 작업은 항상 "패키징 →
사용자 PC에서 압축 해제 후 push" 흐름이었다).

**Android SDK/Gradle 확인 결과**: `gradle`/`adb`/`android` 명령어 없음, `ANDROID_HOME`/
`ANDROID_SDK_ROOT` 환경변수 없음, `/opt`, `/usr/lib/android-sdk` 등 SDK 흔적 없음.

**결론 및 판단**: `android/` 네이티브 프로젝트를 이 샌드박스에서 직접 생성하는 것은
불가능하다. "이에 준하는 절차"로 Capacitor 6 Android 템플릿을 수작업으로 통째로
작성하는 방법도 검토했으나 다음 이유로 진행하지 않았다.

1. 실제 Gradle/Android Studio로 열어서 검증할 방법이 이 샌드박스에 전혀 없어, 수작업으로
   작성한 파일이 실제로 빌드되는지 스스로 확인할 수 없다. "생성했다"고 보고하는 것이
   검증되지 않은 파일을 검증된 것처럼 보고하는 결과가 될 위험이 있다.
2. `npx cap add android`는 `android/` 폴더가 이미 있으면 실행을 거부하는 것으로 알려져
   있다(Capacitor CLI의 표준 동작). 즉 수작업으로 만든 `android/`를 미리 커밋해두면,
   PM이 로컬에서 실제 `npx cap add android`를 실행할 때 그 폴더부터 지워야 하므로
   오히려 한 단계가 늘어난다.
3. `android/app/capacitor.build.gradle`처럼 `npx cap sync`가 `node_modules`의 실제 설치된
   패키지 버전을 읽어 자동 생성하는 파일은, npm install이 안 되는 이 환경에서는 애초에
   정확하게 재현할 근거 데이터가 없다.

**대신 이번 Sprint에서 실제로 준비한 것**(모두 실 파일/실 코드, 검증 가능한 것만):

- `@capacitor/local-notifications` 의존성 추가 및 실제 연동 코드 작성(아래 6-2)
- `resources/android-icons/`에 Android 5개 밀도(mdpi~xxxhdpi) 런처 아이콘 + 원형 아이콘
  + 스플래시를 ImageMagick으로 정확한 픽셀 크기까지 미리 생성(`android/` 생성 직후 바로
  복사만 하면 되도록 준비, `resources/android-icons/README.md` 참고)
- 아래 6-3 권한 표를 Sprint 15 조사 결과로 갱신

### 6-2. `@capacitor/local-notifications` 도입 결과

`package.json`에 `@capacitor/local-notifications`(`^6.1.0`, 기존 `@capacitor/core` `^6.1.2`와
호환되는 6.x 범위)를 추가했다. `src/utils/notification.ts`(신규)에 `requestNotificationPermission()`/
`sendNotice()`를 구현했고, `src/pages/ReadyScreen/ReadyScreen.tsx`는 이제 이 공유 유틸만
호출한다. 두 함수 모두 `Capacitor.isNativePlatform()`으로 분기한다:

- **네이티브(Android/iOS)**: `LocalNotifications.checkPermissions()` → 필요 시
  `requestPermissions()` / `LocalNotifications.schedule({ notifications: [{ id, title, body,
  schedule: { at: new Date() } }] })`로 즉시 발송한다.
- **웹 브라우저**: 기존 `Notification.requestPermission()` / `new Notification()`을 그대로
  사용한다.

두 경로는 `if (Capacitor.isNativePlatform())`으로 완전히 분리되어 있어 한 번의 알림 발생에
하나의 경로만 실행된다(중복 발송 없음). Countdown/임계값 감지 로직(1초 `setInterval`,
10분/5분/1분 전 1회성 알림)은 전혀 변경하지 않았다 — "언제 알림을 보낼지"는 그대로
`ReadyScreen.tsx`가 판단하고, "어떻게 보낼지"만 이번에 교체했다.

이 코드는 `npm install`이 되지 않아 실제로 컴파일/실행해보지 못했다(다른 Domain 코드와
동일한 제약). Import 경로 정적 검증(외부 패키지 `@capacitor/core`, `@capacitor/local-notifications`
자체는 제외, 이 프로젝트 내부 상대경로/`@/` 경로만 검증)과 괄호 균형 검사는 통과했다.

### 6-3. 권한(Permission) 재점검 결과 (④)

| 권한 | 필요 여부 | 근거 |
|---|---|---|
| `INTERNET` | 필요(Capacitor 기본 포함) | 향후 실제 API 연동 대비. 현재도 Capacitor 기본 템플릿에 자동 포함됨 |
| `VIBRATE` | 필요 | `ReadyScreen.tsx`가 1분 전 `navigator.vibrate()` 호출 |
| `POST_NOTIFICATIONS` | **필요(Sprint 15 확정)** | Android 13(API 33)부터 알림 표시에 필수. `LocalNotifications.checkPermissions()`/`requestPermissions()`로 런타임 요청 코드는 이미 구현함(`src/utils/notification.ts`). Manifest 권한 선언 자체는 `android/` 생성 후 `npx cap sync`가 자동 추가하는 것으로 알려져 있으나, 실기기 테스트 시 `AndroidManifest.xml`에 실제로 포함되어 있는지 PM이 직접 확인 필요(TODO) |
| `SCHEDULE_EXACT_ALARM` | **불필요(의도적으로 추가하지 않음)** | 이 권한은 "정확한 시각"에 알림을 발송해야 하는 예약(scheduled) 알림에만 필요하다. FastReserve의 알림은 앱이 foreground에서 `setInterval`로 임계값을 감지한 "직후" `schedule({ at: new Date() })`로 즉시 발송하는 방식이라(기존 Web Notification 방식과 동일한 트리거 구조를 유지), 정확한 미래 시각 예약 기능을 쓰지 않는다. PM 지시("불필요한 권한은 추가하지 않습니다")에 따라 요청하지 않는다 |
| `WAKE_LOCK` | **불필요(검토 후 제외)** | Countdown/알림 감지는 화면이 켜져 있고 앱이 foreground일 때만 동작하도록 설계되어 있다(기존 Sprint 10 설계 그대로 유지, Sprint 13에 이미 "Foreground 실행 가정"으로 기록됨). 화면을 강제로 켜두거나 CPU를 깨우는 기능이 없으므로 Wake Lock이 필요 없다 |
| `FOREGROUND_SERVICE` | **불필요(검토 후 제외)** | 백그라운드에서 지속 실행되는 서비스가 없다(Foreground Service를 쓰지 않음). 앱이 백그라운드로 가면 Countdown/알림 감지도 함께 정지되는 것이 현재 설계이며, 이는 이미 알려진 제약(Sprint 13 TODO, "Background 복귀" 항목)이지 이번 Sprint에서 새로 발생한 문제가 아니다 |
| Storage(LocalStorage) | 별도 권한 불필요 | Android WebView 앱 전용 저장소, 기존 Sprint 13 결론과 동일 |

**요약**: 이번 Sprint에서 새로 필요해진 권한은 `POST_NOTIFICATIONS` 하나뿐이며, 나머지
후보(`SCHEDULE_EXACT_ALARM`/`WAKE_LOCK`/`FOREGROUND_SERVICE`)는 검토 후 "불필요"로
명확히 결론 내렸다(PM 지시 "불필요한 권한은 추가하지 않습니다" 준수).
