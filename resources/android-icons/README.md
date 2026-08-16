# Android Icon/Splash 사전 생성 리소스 (Sprint 15)

`resources/icon.png`, `resources/splash.png`(Sprint 14 추가)로부터 Android 표준 밀도별
런처 아이콘을 미리 생성해 둔 폴더다. `@capacitor/assets` npm 패키지 없이 ImageMagick으로
직접 정확한 픽셀 크기에 맞춰 생성했다(크기 자체는 Android 공식 규격이므로 정확성 보장됨).

## 포함 파일

| 폴더 | 크기(px) | 용도 |
|---|---|---|
| `mipmap-mdpi/` | 48x48 | 기준 밀도 |
| `mipmap-hdpi/` | 72x72 | |
| `mipmap-xhdpi/` | 96x96 | |
| `mipmap-xxhdpi/` | 144x144 | |
| `mipmap-xxxhdpi/` | 192x192 | |
| `drawable/splash.png` | 2732x2732 | 스플래시 원본(리사이즈는 Android가 자동 처리) |

각 밀도 폴더에는 `ic_launcher.png`(정사각형)와 `ic_launcher_round.png`(원형 마스크 적용,
Android 7.1+ 런처가 요구하는 원형 아이콘)가 들어 있다.

## 사용 방법 (PM이 로컬에서, `npm run cap:add:android` 실행 이후)

`android/` 네이티브 프로젝트가 생성된 뒤, 아래처럼 그대로 덮어쓰면 된다:

```bash
cp -r resources/android-icons/mipmap-* android/app/src/main/res/
cp resources/android-icons/drawable/splash.png android/app/src/main/res/drawable/splash.png
```

Capacitor 기본 템플릿에도 `mipmap-*`/`ic_launcher.png`가 이미 존재하므로, 위 명령은 기본
아이콘을 FastReserve 아이콘으로 교체하는 것이다(파일명이 같아 자동으로 덮어써진다).

`@capacitor/assets`(`npx @capacitor/assets generate`)를 대신 사용해도 되며, 그 경우 이
폴더의 파일은 참고용으로만 남겨두면 된다. 두 방법 중 하나만 사용하면 충분하다.
