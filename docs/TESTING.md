# Testing Conventions

PM 지시(Sprint 13, ⑦ 테스트 코드 정리)에 따라 정리한, 이후 Sprint에서 테스트를 쉽게
추가하기 위한 규칙이다. **기존 테스트는 삭제하지 않는다** — 이 문서 자체도 기존 테스트
파일을 옮기거나 지우지 않고, 공용 유틸만 추출하는 방식으로 적용했다.

## 실행 방법

```bash
npm run test          # 한 번 실행 (vitest run)
npm run test:watch    # watch 모드
```

이 개발 환경(샌드박스)은 npm 레지스트리에 접근할 수 없어 `vitest`를 실행하지 못한다.
**PM이 로컬에서 `npm install && npm test`로 실행해야 실제 결과를 볼 수 있다.**

## 파일 위치 규칙 (Colocation)

테스트 파일은 별도의 `tests/` 폴더에 모으지 않고, 테스트 대상 파일과 **같은 폴더에**
`<파일명>.test.ts`(또는 `.test.tsx`) 이름으로 둔다.

```
src/domain/discovery/model/discovery.model.ts
src/domain/discovery/model/discovery.model.test.ts   ← 같은 폴더
```

이유: Domain 폴더 구조(Repository/Manager/Model/...)가 이미 기능별로 잘 나뉘어 있어서,
테스트를 가까이 두면 "이 파일에 테스트가 있는지"를 폴더만 보고 바로 알 수 있다.
`vitest.config.ts`의 `include`가 `src/**/*.test.ts(x)` 패턴이라 위치와 무관하게 전부
수집되므로, 폴더 구조를 바꿔도 설정을 손댈 필요가 없다.

## 테스트 종류와 작성 기준

- **Unit Test**: 순수 함수(Model 계층 등 외부 상태에 의존하지 않는 함수)를 대상으로 한다.
  예: `discovery.model.test.ts`.
- **Integration Test**: Manager처럼 Repository/다른 Manager를 조합해 동작하는 계층을
  대상으로 한다. 실제 LocalStorage 대신 아래 "Fake Repository" 패턴을 사용한다.
  예: `discovery.manager.test.ts`.
- **Component/UI Test**: 이번 Sprint까지는 작성하지 않았다(jsdom/@testing-library 등
  추가 devDependency가 필요해서 "기존 기능 우선, 새 기능/도구 최소화" 원칙에 따라 보류했다).
  필요해지면 `vitest.config.ts`에 `// @vitest-environment jsdom` pragma를 테스트
  파일 상단에 추가하는 방식으로, 다른 테스트의 Node 환경(빠른 실행)에 영향 주지 않고
  개별 파일만 jsdom으로 전환할 수 있다.

## Fake Repository 패턴 (src/test-utils)

이 프로젝트의 모든 Manager는 처음부터 생성자 주입(constructor injection) 구조였다
(`SessionChecker`, `PluginFactory`, `DiscoveryManager`의 Repository/Provider 인자 등).
그 덕분에 테스트에서는 실제 `LocalStorage*Repository` 대신, 인터페이스만 구현한 메모리
기반 Fake를 주입해서 브라우저 없이도(Node 환경) Manager 로직을 검증할 수 있다.

`src/test-utils/`에 있는 공용 Fake:

- `FakeReservationRepository` — `ReservationRepository` 구현. `new ReservationManager(fake)`로 주입
- `FakeDiscoveryRepository` — `DiscoveryRepository` 구현. `new DiscoveryManager(fake, ...)`로 주입

새 Domain(Plugin/Session 등)의 Manager를 테스트할 때도 같은 패턴을 따른다:
1. 해당 Domain의 Repository 인터페이스를 구현하는 Fake 클래스를 만든다.
2. `src/test-utils/`에 추가하고 `src/test-utils/index.ts`에서 export한다(여러 테스트가 재사용할 수 있도록).
3. 테스트에서 `new XxxManager(fakeRepository, ...)`로 주입해 검증한다.

## 다음 Sprint에 테스트를 추가하는 방법(요약)

1. 대상 파일과 같은 폴더에 `<파일명>.test.ts` 생성
2. 순수 함수면 바로 `import`해서 테스트
3. Manager/Repository가 얽혀 있으면 `src/test-utils`의 Fake를 재사용하거나, 없으면 새로 추가
4. `npm run test`로 로컬에서 확인(이 환경에서는 실행 불가 — Python 병행 검증으로 대체 가능, Sprint 12 방식 참고)

## Sprint 17: Node.js 실제 실행 기반 검증 (Vitest를 대체하지 않음, 보조 수단)

Sprint 8부터 이 샌드박스는 `npm install`이 막혀 있어 `vitest`/`tsc`/`vite`를 실행하지
못했다. Sprint 17에서 **Vitest 없이도 실제 Node.js 엔진으로 Domain 코드를 진짜 실행**할
방법을 찾아 적용했다. 이는 `npm test`를 대체하지 않으며(테스트 케이스가 아니라 "정말
문법이 맞고, import가 다 연결되고, 모듈 최상위 코드가 죽지 않고 실행되는가"만 확인하는
스모크 테스트다), PM이 로컬에서 `npm install && npm test`를 실행하기 전까지 신뢰도를
높이는 보조 수단이다.

### 원리

Node.js 22부터 `--experimental-transform-types` 플래그로 `.ts` 파일의 TypeScript 문법
(enum, interface, type, generic 등 포함)을 실제로 파싱해 실행할 수 있다(`tsc` 수준의
타입 오류 검사는 하지 않지만, 문법 오류/모듈 해석 오류/런타임 예외는 그대로 잡아낸다).
다만 Vite의 `@` alias(`vite.config.ts`)는 Node가 알지 못하므로, `@/foo` → `src/foo.ts`로
변환하는 최소한의 Node `--experimental-loader` 커스텀 리졸버(`/tmp`에서 임시로 작성,
저장소에는 포함하지 않음 — 재현 방법은 아래 참고)를 함께 사용했다.

이 방법은 **JSX를 지원하지 않는다**(Node의 타입 스트리퍼는 JSX 변환을 하지 않음).
따라서 `.tsx`(화면/컴포넌트) 파일에는 적용할 수 없고, `src/domain/`, `src/utils/`,
`src/types/`, `src/test-utils/`처럼 React를 import하지 않는 순수 TypeScript 레이어에만
적용된다 — 이 레이어가 이 프로젝트의 핵심 비즈니스 로직(Manager/Repository/Engine)
대부분을 차지한다.

### 재현 방법 (PM이 검증하고 싶을 때)

```bash
# 1) 리졸버는 scripts/alias-loader.mjs에 이미 포함되어 있다(vite.config.ts의
#    '@' -> './src' 매핑과 동일한 규칙, 프로덕션 빌드에는 전혀 관여하지 않음)

# 2) 실행
FASTRESERVE_ROOT="$(pwd)" node --experimental-transform-types \
  --experimental-loader=./scripts/alias-loader.mjs \
  --input-type=module -e "import('./src/domain/reservation/index.ts').then(() => console.log('OK'))"
```

### Sprint 17 실행 결과

`src/domain/**/*.ts`(테스트 파일 제외), `src/utils/*.ts`, `src/types/*.ts`,
`src/test-utils/*.ts` 총 79개 파일 중 78개가 실제로 import 성공(문법 오류 없음, 내부
import 전부 해석됨, 모듈 최상위 코드 정상 실행됨 — Manager 싱글턴 생성 포함). 나머지
1개(`src/utils/notification.ts`)는 `@capacitor/core`가 설치되어 있지 않아서 실패했을
뿐 코드 자체의 문제는 아니다(Sprint 15부터 알려진 제약과 동일).

추가로 8개 핵심 Manager/Engine의 대표 메서드(`reservationManager.list()`,
`discoveryManager.refresh()`, `readyEngine.getDashboardSummary()`,
`scheduler.getExecutionQueue()`, `healthCheckEngine.getReport()`,
`pluginManager.list()`/`isHealthy()`, `sessionManager.getSessionStatus()`,
`siteAccountManager.list()`)를 실제로 호출해 예외 없이 정상 값을 반환하는 것까지
확인했다(LocalStorage가 없는 Node 환경에서도 각 Repository의 `typeof window ===
'undefined'` 가드 덕분에 안전하게 빈 배열/기본값으로 동작함 — Sprint 3~11에 설계된
방어 코드가 실제로 유효함을 이번에 처음으로 실행 기반으로 확인했다).
