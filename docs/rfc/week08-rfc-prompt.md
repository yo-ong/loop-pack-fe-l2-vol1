# Week-08 RFC 작성 세션 프롬프트

> 다음 세션 시작 시 이 파일을 읽게 하고 이어서 작업한다.
> 이 파일은 작업 메모다 — RFC 완성 후 삭제하고, 커밋에 포함하지 않는다.

## 작업 방식 (필수)

- **가이드 모드**: 과제는 사용자가 직접 구현하고, Claude는 단계별 가이드·리뷰만 한다.
- RFC의 "이유" 칸은 사용자 언어로 직접 쓴다. Claude 초안을 그대로 옮기지 않는다.
- 규칙: **RFC(`docs/rfc/week08-test-plan.md`)는 2단계 테스트 코드보다 먼저 커밋**한다.
- 과제 원문: `docs/assignments/week-08.md` / 진행 플레이북은 사용자가 별도 보유(r가이드).

## 현재 진행 상태 (2026-08-19 기준)

- **0단계 완료, 5커밋** (브랜치 `feat/week-08`):
  - 테스트 도구 설치 → vitest 환경 분리(projects) → MSW·setup·render 헬퍼 → Playwright 설정 → 스모크 테스트
- **측정 기록**: 전부 jsdom 시 environment **3.33s** → node/dom 분리 후 **590ms** (환경 분리 커밋 메시지에도 기록됨)
- `pnpm check`는 playwright(E2E 테스트 0개) 외 전부 통과
- 만든 파일: `src/test/msw/{handlers,server,fixtures}.ts`, `src/test/setup.dom.ts`,
  `src/test/render-with-providers.tsx`, `playwright.config.ts`,
  `src/widgets/header/ui/header-actions.dom.test.tsx`(스모크 — 검증 항목 아님, 0단계 완료조건용)
- 픽스처 설계: 5카테고리×5개=25개 결정적 카탈로그, `casual-1`식 구분 가능한 이름,
  price↑/createdAt↓/reviewCount↓로 어긋나게 두어 정렬별 순서가 실제로 달라짐

## 다음 할 일 (순서)

1. **선행 리팩토링**: `buildTitle`/`buildDescription`을 `src/app/products/page.tsx:27-46`에서
   `src/_pages/products/lib/`(예: `product-metadata.ts`)로 추출. page 파일은 임의 named export
   불가라 추출 없이는 테스트 불가. 추출 후 `pnpm check` → `refactor:` 커밋
2. **RFC 작성** (`docs/rfc/week08-test-plan.md`, RADIO 구조) → 커밋
3. 2단계 구현 (단위 → 통합 → E2E 순)

## RFC 구조 (RADIO 매핑 — 합의됨)

- **R — Requirements**: 지킬 것(15개 배치표 전체) / 순수 로직 선정 근거 / Non-goals(목록 밖 취사선택) / 비기능(기존 5개 무파괴, 격리, pnpm check)
- **A — Architecture**: 3층 구조(각 층이 유일하게 지키는 것) / projects+`*.dom.test.tsx` 분리 근거 / 모킹 경계(fetch 바꿔치기 아닌 네트워크 층, `onUnhandledRequest: "error"`) / **애매 판단 2개 문단**
- **D — Data model**: 픽스처 설계 / 상태 격리(afterEach: cleanup·핸들러 리셋·store 리셋) / 기본 핸들러 성공만+예외는 테스트 안 `server.use`
- **I — Interface**: 셀렉터 정책(role·label·텍스트, getByTestId 금지+예외 조건) / 테스트 이름 "조건 → 결과" / `renderWithProviders(ui, { searchParams, onUrlUpdate })`, retry 없는 QueryClient 주입 이유
- **O — Optimizations**: 3.33s→590ms 실측 / E2E는 check 끝(build 뒤), `pnpm test`는 vitest만 / 3단계 실험 후보·Stryker 범위 한정 방침

## 확정된 배치표 (단위 3 / 통합 9 / E2E 3)

| #   | 검증 대상                                             | 방법론         | 이유(코드 근거)                                                                                                                                                                                                                                                                                                                       | 빨간불이 알려주는 것                                             |
| --- | ----------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | 장바구니·위시리스트 개수 파생                         | 단위           | `create-selection-store.ts:11-20` toggle이 순수 상태 전이. 테스트마다 `createSelectionStore()` 새로 생성해 격리                                                                                                                                                                                                                       | 개수 계산 자체가 틀림                                            |
| 2   | URL 조건 → query key                                  | 단위           | `queries.ts:6`의 `q.trim()` 정규화. 동기 함수라 queryKey 비교로 완결                                                                                                                                                                                                                                                                  | `" 셔츠 "`/`"셔츠"`가 다른 캐시를 봄                             |
| 3   | 목록 metadata 문구 (`buildTitle`, `buildDescription`) | 단위           | 입력이 다른 두 순수 함수(URL 상태만 / +응답) — 합치지 않고 파일 하나·describe 둘. 경계: 빈 q·공백 q·`page>=2` / `totalCount===0`·카테고리 id 폴백                                                                                                                                                                                     | 검색·페이지가 title에 미반영, 0건 문구 오류 → 공유 미리보기 오도 |
| 4   | 로딩 → 성공                                           | 통합           | `product-list-content.tsx:30-33`(isPending)→`product-list-results.tsx:19`(`총 {n}개`) — Query+컴포넌트 협업                                                                                                                                                                                                                           | 스켈레톤만 보이고 목록 못 봄                                     |
| 5   | 빈 결과                                               | 통합           | `product-list-results.tsx:20`(`totalCount===0`)과 `:25`(`products.length===0` 범위 밖 페이지)는 **다른 분기** — 둘 다 검증                                                                                                                                                                                                            | 빈 결과/범위 밖 안내가 뒤바뀜                                    |
| 6   | 에러                                                  | 통합           | 세 변형 전부: ⓐmessage 있는 500(서버 문구) ⓑmessage 없는 500(`commerce-client.ts:22`의 `??` → "요청을 처리하지 못했습니다.") ⓒfetch 실패(`product-list-content.tsx:22` instanceof → "잠시 후 다시 시도해 주세요."). MSW: `HttpResponse.json({message},{status:500})` / `new HttpResponse(null,{status:500})` / `HttpResponse.error()` | 장애 시 안내 없는 빈 화면 / 서버 문구 미도달                     |
| 7   | 에러 → 재시도 복구                                    | 통합           | `:40` refetch 배선. MSW `{ once: true }` 실패 핸들러. wrapper `retry: false` 전제                                                                                                                                                                                                                                                     | 다시 시도 버튼이 장식                                            |
| 8   | 카테고리 → 목록 변경                                  | 통합           | `product-filters.tsx:26-29` — category와 **`page: 1` 동시 패치**가 곁다리 경계                                                                                                                                                                                                                                                        | 필터 미동작 / page 2에서 변경 시 빈 페이지                       |
| 9   | 정렬 → 순서 변경                                      | 통합           | 8과 동형. 단언은 heading **순서 배열** 비교(포함 여부 X)                                                                                                                                                                                                                                                                              | 정렬 바꿔도 순서 그대로                                          |
| 10  | 페이지 이동                                           | 통합           | `product-list-results.tsx:48`(`page<=1` 이전 disabled), `:56`(`page>=totalPages` 다음 disabled), `:15`(`Math.max(1,ceil)`)                                                                                                                                                                                                            | 이동/경계 오작동                                                 |
| 11  | 조작 → URL 반영·재진입                                | **통합(확정)** | `useQueryStates`가 URL 유일 통로 → `NuqsTestingAdapter`의 `onUrlUpdate`(반영)·`searchParams`(재진입)로 양방향 완결. 히스토리 스택·reload만 13·14 담당                                                                                                                                                                                 | 공유 URL이 다른 화면 / 기본값이 URL에 쌓임                       |
| 12  | 담기 → 헤더 · 다시 → 빠짐                             | 통합           | zustand 모듈 싱글턴이라 한 render에 `<HeaderActions />`+`<ProductListContent />` 넣으면 자동 공유. 1번이 못 잡는 **구독 배선**(`header-actions.tsx:7` `ids.size`) 검증                                                                                                                                                                | 스토어는 맞는데 화면이 안 바뀜                                   |
| 13  | 뒤로·앞으로 필터 복원                                 | E2E            | `product-list-content.tsx:15` `history: "push"`의 대상인 진짜 히스토리 스택은 브라우저에만                                                                                                                                                                                                                                            | push→replace 퇴화를 통합은 못 잡음                               |
| 14  | 새로고침 필터 유지                                    | E2E            | 진짜 reload + 서버 렌더(`loadProductSearchParams`, search-params.ts:59). persist 없으니 URL이 유일 생존처임의 증명                                                                                                                                                                                                                    | 새로고침 시 조건 초기화                                          |
| 15  | 진입 → 담기 → 헤더                                    | E2E            | 핵심 여정 스모크. production build + 500ms 지연 실경로                                                                                                                                                                                                                                                                                | 배포 불가 상태                                                   |

## 애매 판단 2개 (문단 소재 — 사용자 언어로 재작성)

1. **11번 통합 vs E2E**: 테스트 어댑터로 반영·재진입 양방향 가능함을 코드로 확인 → E2E로 보내면 production build+500ms 비용에 13·14와 중복만 추가. E2E를 골랐다면: 어댑터 신뢰 문제는 해소되지만 느린 피드백.
2. **1번 단위 vs 12번 통합 중복**: 단위는 "계산"을, 통합은 "배선"을 지킴. `header-actions.tsx:7`이 `ids.size` 구독 대신 고정값을 렌더해도 단위는 전부 통과 → 12번만 잡음. 그럼에도 단위를 두는 이유: 실패 시 원인 위치(계산 vs 배선)를 즉시 분리.

## 목록 밖 취사선택 (가이드 추천 — 사용자가 근거 재작성)

- 다음에 할 것: `ProductSearchInput` 디바운스·Enter flush·IME composing (`src/_pages/products/ui/product-search-input.tsx`) — 로직 복잡, 회귀 잦음
- 앞으로도 안 할 것: `Placeholder`·`ToggleButton` 표시 전용 공통 컴포넌트 단독 테스트 — 변경 빈도·실패 비용 낮고 통합이 간접 검증

## 기타 합의·주의

- 스모크 테스트(0-7)는 15개 항목이 아니라 0단계 완료조건 — RFC에 한 줄 명시해 "RFC 먼저" 규칙 오해 방지
- 3단계 뮤테이션 실험 유력 후보: `create-selection-store.ts:13`의 `new Set(state.ids)` 제거(단위 생존 가능성 높음 → 최고의 기록 소재), `product-filters.tsx`의 `page: 1` 삭제, `history: "push"`→`"replace"`(E2E 전용)
- 커밋: lint-staged 필수, `--no-verify` 금지. 명시적 요청 없이 파일/문서 생성 금지
