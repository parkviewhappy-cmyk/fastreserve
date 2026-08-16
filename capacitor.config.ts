import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor 설정.
 * PM 지시(Sprint 13, ② Android APK 준비): 기존 React 프로젝트는 변경하지 않고,
 * Web Build 결과(Vite의 기본 출력 폴더 `dist`)를 APK에서 그대로 사용할 수 있도록
 * Capacitor 구조만 추가한다.
 *
 * webDir이 'dist'인 이유: vite.config.ts에는 build.outDir을 별도로 지정하지 않았고,
 * Vite의 기본 빌드 출력 폴더가 'dist'이기 때문이다(vite.config.ts는 이번 Sprint에서도
 * 수정하지 않았다).
 *
 * 이 파일과 android/ 네이티브 프로젝트는 이 샌드박스에서 생성할 수 없다(Android SDK/
 * npm 레지스트리 접근 불가). PM이 로컬에서 아래 절차를 실행해야 한다(docs/APK_BUILD_GUIDE.md 참고):
 *   1) npm install
 *   2) npm run build          (Vite Web Build → dist/ 생성)
 *   3) npm run cap:add:android (android/ 네이티브 프로젝트 최초 1회 생성)
 *   4) npm run cap:sync        (dist/ 를 android/ 프로젝트로 복사)
 *   5) npm run cap:open:android (Android Studio로 열어 APK 빌드)
 */
const config: CapacitorConfig = {
  appId: 'com.fastreserve.app',
  appName: 'FastReserve',
  webDir: 'dist',
}

export default config
