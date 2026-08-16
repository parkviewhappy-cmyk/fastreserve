/**
 * Sprint 17 검증용 Node.js ESM 커스텀 리졸버.
 *
 * 이 프로젝트의 프로덕션 코드와는 무관하다(Vite/Capacitor 빌드에 전혀 관여하지 않음).
 * npm install이 불가능한 환경(이 프로젝트의 개발 샌드박스)에서, node의
 * `--experimental-transform-types` 실행 모드가 vite.config.ts의 `@` alias
 * (`'@' -> path.resolve(__dirname, './src')`)를 이해하지 못하는 문제를 보완하기 위한
 * 최소한의 리졸버다. `.ts`/`.tsx`/디렉터리의 `index.ts`까지 확장자를 순서대로 시도한다.
 *
 * 사용법(docs/TESTING.md "Sprint 17: Node.js 실제 실행 기반 검증" 참고):
 *   FASTRESERVE_ROOT="$(pwd)" node --experimental-transform-types \
 *     --experimental-loader=./scripts/alias-loader.mjs \
 *     --input-type=module -e "import('./src/domain/reservation/index.ts').then(() => console.log('OK'))"
 */
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const ROOT = process.env.FASTRESERVE_ROOT ?? process.cwd()
const SRC = path.join(ROOT, 'src')

function resolveWithExt(basePath) {
  const candidates = [basePath + '.ts', basePath + '.tsx', path.join(basePath, 'index.ts')]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const rel = specifier.slice(2)
    const resolved = resolveWithExt(path.join(SRC, rel))
    if (resolved) return nextResolve(pathToFileURL(resolved).href, context)
    return nextResolve(specifier, context)
  }
  if (specifier.startsWith('.') && context.parentURL) {
    const parentPath = new URL(context.parentURL).pathname
    const baseDir = path.dirname(parentPath)
    const target = path.join(baseDir, specifier)
    const resolved = resolveWithExt(target)
    if (resolved) return nextResolve(pathToFileURL(resolved).href, context)
  }
  return nextResolve(specifier, context)
}
