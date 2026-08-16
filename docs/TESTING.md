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
