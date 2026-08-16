# 로컬 PC 실행 가이드 (Sprint 18)

## 왜 이 문서가 필요한가

이 프로젝트는 개발 샌드박스(현재 코드를 작성하는 환경)에서 `npm install`을 실행할 수
없다. Sprint 8부터 반복 확인된 사실이며, Sprint 18에서 마지막으로 한 번 더 확정했다:

- `npm install`(FastReserve 프로젝트) → `403 Forbidden`
- 완전히 새로운 빈 프로젝트에서 FastReserve와 무관한 패키지(`react`) 하나만 설치 →
  **동일하게 `403 Forbidden`**

두 번째 테스트가 핵심이다. FastReserve의 `package.json`과 전혀 상관없는 요청도 막힌다는
뜻이므로, 이건 이 프로젝트의 의존성 설정 문제가 아니라 **이 샌드박스 자체가 npm
레지스트리(및 GitHub/PyPI 등 외부 전체)에 네트워크 접근을 할 수 없도록 막혀 있는 것**이다.
`package.json`을 아무리 고쳐도 이 환경에서는 절대 해결되지 않는다.

그래서 Sprint 18부터는 **PM이 로컬 PC에서 직접 실행**하고, 그 결과(특히 실제 오류
메시지)를 알려주시면, 다음 Sprint에서 그 오류를 실제로 수정하는 방식으로 진행한다.

## 실행 절차

```bash
# 1) 압축 해제한 fastreserve 폴더로 이동
cd fastreserve

# 2) 의존성 설치
npm install

# 3) 개발 서버 실행
npm run dev
```

터미널에 아래와 비슷한 메시지가 뜨면 성공이다.

```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

`http://localhost:5173/`을 Chrome(또는 Edge)으로 열면 FastReserve 홈 화면이 보여야 한다.

## 빌드 확인

```bash
npm run build
```

`dist/` 폴더가 생성되고 에러 없이 끝나면 성공이다.

## 문제가 생기면 이렇게 알려주세요

아래 중 해당하는 것을 그대로 붙여넣거나 스크린샷으로 보내주시면, 다음 Sprint에서
정확히 그 오류를 재현/수정하는 데 사용한다.

1. **`npm install` 중 에러** — 터미널에 출력된 전체 에러 메시지(빨간 글씨 부분)
2. **`npm run dev` 중 에러** — 터미널 출력 전체
3. **브라우저 화면이 하얗게 뜨거나 깨진 경우** — 브라우저에서 F12(개발자 도구) →
   Console 탭 스크린샷(빨간 에러 메시지가 보이는 부분)
4. **특정 버튼/화면에서만 문제가 생기는 경우** — 어떤 화면에서 어떤 동작을 했는지
   (예: "예약 추가 화면에서 저장 버튼을 눌렀더니 에러가 났다") + Console 탭 스크린샷
5. **`npm run build` 중 에러** — 터미널 출력 전체(특히 TypeScript 타입 에러는 파일명과
   줄 번호가 함께 나온다)

## Chrome 기준 기능 점검 체크리스트 (Sprint 18 PM 지시 ⑨)

로컬에서 실행한 뒤, 아래 항목을 하나씩 눌러보고 결과(정상/에러)를 알려주시면 된다.

- [ ] 예약 생성 (홈 → 예약 추가 → 저장)
- [ ] 예약 수정 (예약 상세 → 수정 → 저장)
- [ ] 예약 삭제 (예약 상세 → 삭제)
- [ ] Discovery Center (홈 → 🔍 공연 찾기)
- [ ] Ready Screen (예약 상세 → 준비 화면 이동, 또는 홈의 "예매 준비 점수" 카드)
- [ ] Simulation (홈 → Simulation 관련 버튼, 또는 `/simulation` 직접 이동)
- [ ] Countdown (Ready Screen에서 남은 시간이 1초마다 갱신되는지)
- [ ] Notification (Ready Screen 진입 시 브라우저가 알림 권한을 요청하는지, 허용 시
      실제 알림이 뜨는지 — 단, PC 브라우저에서는 Web Notification API로 동작하며
      Android APK 전용 알림은 Sprint 15에서 별도 도입한 것이라 PC에서는 확인 대상이
      아니다)
- [ ] History — **아직 구현되지 않은 기능이다**(Sprint 13부터 계속 보고된 사항). 하단
      메뉴에 비활성 상태로만 표시되며 클릭해도 아무 화면도 없다. 이건 버그가 아니라
      "미구현"이다
- [ ] LocalStorage (예약을 하나 등록한 뒤, F12 → Application 탭 → Local Storage →
      `http://localhost:5173` → `fastreserve:reservations` 키에 데이터가 저장되는지)
- [ ] 새로고침 이후 데이터 유지 (예약을 등록한 상태에서 브라우저를 새로고침(F5)해도
      예약 목록이 그대로 남아있는지)

이 체크리스트 결과를 다음 Sprint 시작 메시지에 포함해주시면, 발견된 버그를
`docs/BUG_TRACKER.md`에 등록하고 우선순위대로 수정하겠다.
