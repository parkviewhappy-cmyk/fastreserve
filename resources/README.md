# App Icon / Splash 소스 이미지

PM 지시(Sprint 14, ② Android APK 준비 항목 점검)에 따라 추가한 App Icon / Splash
소스 이미지 폴더다.

## 포함 파일

- `icon.png` (1024x1024) — 기존 `public/favicon.svg`(브랜드 컬러 `#10b981`, 시계 모양
  아이콘)를 동일한 디자인 그대로 1024x1024 PNG로 변환한 것. 새로운 디자인을 만들지
  않고 기존 웹 파비콘 디자인을 재사용했다(신규 UI 요소 추가 최소화 원칙).
- `splash.png` (2732x2732) — 앱 배경색(`src/index.css`의 `bg-neutral-950`, `#0a0a0a`)
  위에 위 아이콘을 중앙 배치한 것. `@capacitor/assets` 도구가 요구하는 기본 캔버스
  크기(2732x2732)를 그대로 사용했다.

## 사용 방법 (PM이 로컬에서 실행, Sprint 14 기준 TODO)

이 샌드박스는 npm 레지스트리 접근이 차단되어 있어 `@capacitor/assets` 패키지를
설치/실행할 수 없다. 아래 절차를 PM이 로컬 PC에서 실행해야 실제 Android(및 필요 시
iOS) 아이콘/스플래시 리소스 세트(mipmap 각 해상도 등)가 생성된다.

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --android
```

위 명령은 `resources/icon.png`, `resources/splash.png`를 읽어
`android/app/src/main/res/mipmap-*`, `android/app/src/main/res/drawable-*` 등에
필요한 모든 해상도의 리소스를 자동 생성한다. `android/` 네이티브 프로젝트가 먼저
생성되어 있어야 한다(`npm run cap:add:android`, docs/APK_BUILD_GUIDE.md 참고).

## 변경/유지 원칙

- 기존 `public/favicon.svg`는 수정하지 않았다(웹 파비콘 용도 그대로 유지).
- 새로운 디자인 리소스를 창작하지 않고 기존 디자인을 재사용했다(Sprint 14 "새로운
  기능 개발 아님" 원칙 준수).
