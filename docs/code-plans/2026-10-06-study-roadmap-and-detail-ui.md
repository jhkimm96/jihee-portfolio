---
status: approved
approved_at: 2026-10-06T07:52:32+09:00
files:
  - content/schemas.ts
  - lib/content.ts
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
  - components/study-roadmap-view.tsx
  - app/study/page.tsx
  - app/study/[...slug]/page.tsx
  - components/post-article.tsx
  - app/globals.css
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

# Study 로드맵과 상세 학습 진입부

## 1. 변경 파일

- `content/schemas.ts`, `lib/content.ts`: 기존 Study를 깨지지 않게 `question`, `prerequisites` 선택
  메타데이터를 추가한다.
- `lib/study-roadmap.ts`: 명시된 순서만 공개 로드맵에 노출하고, 이전·다음 Study와 선수 Study를
  계산하는 함수를 추가한다.
- `lib/study-roadmap.test.ts`: 명시된 글만 노출, 중복·누락 방지, 이전·다음과 선수 관계를 테스트한다.
- `components/study-roadmap-view.tsx`, `app/study/page.tsx`: 자동 추가 문구를 없애고 질문과 한 줄 답이
  보이는 명시적 로드맵으로 렌더링한다.
- `app/study/[...slug]/page.tsx`, `components/post-article.tsx`, `app/globals.css`: 상세 상단의 질문·한 줄
  답·선수 Study와 하단의 이전·다음 Study를 렌더링한다.

## 2. 흐름과 책임

`getStudyRoadmapContext(posts, slug)`은 명시적인 읽기 순서에서 현재 글의 선수, 이전, 다음 글을
찾는다. 목록에 없는 새 글은 일반 Study 목록에는 나타나지만 공개 로드맵에는 자동으로 넣지 않는다.

상세 페이지는 해당 컨텍스트와 기존 `summary`를 `PostArticle`에 전달한다. `PostArticle`은 범용
본문 렌더링을 유지하고 선택적인 학습 진입부와 탐색만 렌더링한다.

## 3. 기존 구조와의 관계

- 기존 `studyReadingOrder`의 실제 slug 목록을 재사용한다.
- 기존 `summary`는 한 줄 답의 fallback으로 사용한다.
- `question`과 `prerequisites`가 없는 76개 글도 계속 빌드되고 기존 제목·summary로 표시된다.
- 프로젝트 Learning Path와 공개 Study 로드맵을 합치지 않는다.

## 4. 제외할 것

- 기존 Study MDX 일괄 수정
- 로그인, 완료율, 공개 일정
- 새 CMS와 데이터베이스
- 강제 scroll snap과 새 카드 시스템
- 미작성 백로그의 공개 링크

## 5. 읽기 쉬운 코드

`getStudyRoadmapContext`, `getExplicitRoadmapPosts`, `StudyNavigation`처럼 역할이 드러나는 이름을
사용한다. 순서 계산은 `lib/study-roadmap.ts`에 모으고, 페이지와 컴포넌트는 결과를 렌더링만 한다.

## 6. 루브릭 예측

| 항목 | 예상 | 이유 |
|---|---|---|
| controller-thin | 해당 없음 | 서버 컨트롤러를 수정하지 않는다. |
| entity-encapsulation | 해당 없음 | 엔티티를 수정하지 않는다. |
| http-semantics | 해당 없음 | HTTP 계약을 바꾸지 않는다. |
| logging-quality | 해당 없음 | 런타임 로그를 추가하지 않는다. |
| exception-discipline | 해당 없음 | 예외 처리 경로를 추가하지 않는다. |
| layer-separation | 괜찮음 | 순서 계산은 lib, 렌더링은 page/component에 둔다. |
| dead-code | 괜찮음 | 기존 로드맵 순서와 PostArticle을 재사용한다. |
| duplication-semantic | 개선 | 로드맵 순서와 이전·다음 계산을 한 모듈에 둔다. |
| diagnosability | 해당 없음 | 런타임 진단 코드를 수정하지 않는다. |
| integration-robustness | 해당 없음 | 외부 통신을 수정하지 않는다. |
| service-boundary | 해당 없음 | 서비스 경계를 수정하지 않는다. |
| value-object-design | 해당 없음 | 도메인 값 객체를 추가하지 않는다. |
| polymorphism-opportunity | 해당 없음 | 타입별 반복 분기를 추가하지 않는다. |
| cohesion-coupling | 개선 | 화면은 순서 규칙을 직접 해석하지 않는다. |

## 7. 테스트 계획

구현 전에 `lib/study-roadmap.test.ts`에 다음 규칙을 추가한다.

- 공개 로드맵은 명시된 slug만 포함한다.
- 전체 순서에 중복 slug가 없다.
- 현재 글은 올바른 이전·다음 Study를 계산한다.
- 선수 Study가 실제 글을 가리키고 자기 자신을 참조하지 않는다.
- 목록 밖 Study는 로드맵 컨텍스트를 만들지 않는다.

테스트가 실패하는 것을 확인한 뒤 `lib/study-roadmap.ts`와 관련 화면을 구현한다. 이후
`npm test`, `npx tsc --noEmit`, `npm run build`와 데스크톱·390px 렌더링을 확인한다.
