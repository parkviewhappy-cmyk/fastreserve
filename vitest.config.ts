import { defineConfig } from 'vitest/config'
import path from 'path'

/**
 * Vitest 설정.
 * PM 지시(Sprint 12, ⑤ Discovery 테스트 코드 작성): "Unit Test/Integration Test"를
 * Sprint 진행 순서에 포함시켰다. vite.config.ts는 건드리지 않고(기존 파일 변경 최소화),
 * 별도 설정 파일로 분리했다. alias(@/*)는 vite.config.ts와 동일하게 맞췄다.
 *
 * environment는 기본값 'node'를 사용한다(Discovery Model/Manager는 순수 로직 + 주입 가능한
 * Repository/Provider 구조라 jsdom 없이도 테스트 가능하다 - DI 패턴을 그대로 활용했다).
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
