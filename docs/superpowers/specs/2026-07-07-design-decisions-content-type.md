# "Design Decisions" 콘텐츠 타입 + publish-decision 스킬 설계

- 날짜: 2026-07-07
- 위치: `C:/cowork/portfolio` (콘텐츠/스키마/페이지), `C:/Users/JIHEE/.claude/skills/publish-decision/` (스킬)
- 범위: 기존 project/troubleshooting/study 3개 콘텐츠 타입에 **decisions**(설계 결정 기록, ADR 스타일)를
  4번째 타입으로 추가하고, 이를 발행하는 `publish-decision` 스킬을 `publish-study`/`publish-troubleshooting`과
  같은 패턴으로 사용자 스코프에 만든다.

## 배경 / 목적

트러블슈팅(문제→원인→해결→결과)과 "왜 이 설계를 선택했는지/왜 나중에 바꿨는지"는 서로 다른 서사이며
서로 다른 역량을 보여준다 — 전자는 장애 대응력, 후자는 트레이드오프 판단력이다. 업계에서 후자는
ADR(Architecture Decision Record)이라는 이름으로 이미 표준화된 관행이며, 이를 별도 콘텐츠 타입으로
분리해 명확히 드러내는 것이 시니어급 포트폴리오 신호로 유효하다.

Prompthub처럼 MSA 구조인 프로젝트는 서비스마다 설계 결정 이력이 다르게 쌓이므로, project.mdx 본문에
텍스트로 몰아넣기보다는 기존 troubleshooting과 동일한 `project + category(서비스명)` 구조를 재사용해
사이트에 통합한다.

## 콘텐츠 스키마 + Velite 컬렉션

경로: `content/{project}/decisions/{category}/{slug}.mdx` — `troubleshootingPosts`와 완전히 동일한
path 패턴(`*/decisions/**/*.mdx`)으로 `project`/`category`/`slug`를 폴더 경로에서 자동 추출한다.

```yaml
title: string
date: string
status: "accepted" | "superseded"     # 기본 accepted
supersededBy: string (optional)       # 대체한 새 결정의 전체 slug (예: "prompthub/order-service/event-driven-order-processing")
summary: string (optional)
tags: string[] (optional)
draft: boolean (기본 false)
```

- 단일 서비스 프로젝트(career-link)는 `content/career-link/decisions/general/{slug}.mdx`처럼 `general`
  카테고리 하나만 사용한다 — troubleshooting과 동일하게, category 폴더가 없는 특수 케이스는 만들지 않는다.
- 본문은 **고정 ADR 템플릿 4섹션**을 강제한다: `## 배경` / `## 고려한 선택지` / `## 결정` / `## 결과`.
  (troubleshooting의 5섹션 템플릿과 마찬가지로 스키마가 검증하는 대상은 아니고, 스킬이 작성 시 안내하는
  템플릿이다.)
- `supersededBy`는 **전체 slug**(project/category/file)를 저장한다 — 대체 관계가 다른 카테고리로도
  이어질 수 있어 모호함을 없애기 위함.

`velite.config.ts`에 `troubleshootingPosts`와 동일한 형태로 `decisions` 컬렉션을 추가한다
(`pattern: '*/decisions/**/*.mdx'`, 동일한 `path`→`project`/`category`/`slug` transform).

## 데이터 레이어 (`lib/content.ts`, `lib/content-data.ts`)

- `lib/content.ts`: `DecisionStatus = 'accepted' | 'superseded'` 타입, `DecisionEntry` 타입
  (`TroubleshootingEntry`와 동일한 필드 + `status`, `supersededBy?`), `decisionsForProject` 순수 함수
  (`troubleshootingForProject`와 동일한 로직: `publishedOnly` → 프로젝트 필터 → `groupByCategory`).
- `lib/content-data.ts`: `getPublishedDecisions()`, `getDecisionsForProject(projectSlug)`,
  `getDecisionBySlugPath(slugParts)`, `getDecisionTitle(fullSlug)`(대체 배너에 새 결정 제목을 보여주기
  위한 헬퍼 — `getProjectTitle`과 동일한 패턴).
- `lib/format.ts`의 `formatCategory`를 개선한다: 지금은 케밥케이스를 첫 글자만 대문자화(`order-service`
  → `Order-service`)하는데, 단어별로 대문자화하도록 고친다(`order-service` → `Order Service`). 기존
  troubleshooting 카테고리에도 영향 없이 더 나은 표시를 준다(하드코딩된 매핑에 없는 케이스의 fallback만
  개선).

## 페이지 / 네비게이션

- **네비게이션**: `Home / Projects / Troubleshooting / Study / Decisions / About / Resume` (7개).
- **`/decisions`** (전체 목록): `troubleshootingPosts` 목록 페이지와 동일한 구조 — 최신순 나열,
  프로젝트+카테고리(서비스) 배지. `status: superseded`인 항목은 배지 목록에 "Superseded" 배지를
  추가로 표시한다.
- **`/decisions/{...slug}`** (상세): `PostArticle` 컴포넌트를 재사용해 ADR 4섹션을 렌더링한다.
  `status: superseded`면 본문 위에 안내 배너를 추가한다: "이 결정은 **{getDecisionTitle(supersededBy)}**
  으로 대체되었습니다 →" (새 결정 상세 페이지로 링크).
- **프로젝트 상세 페이지** (`app/projects/[slug]/page.tsx`): 기존 "Troubleshooting" 섹션 바로 아래에
  "Design Decisions" 섹션을 추가한다. `getDecisionsForProject(project.slug)`로 서비스(category)별
  그룹핑, Troubleshooting 섹션과 동일한 레이아웃(`PostCard` 재사용)을 쓴다. 결정이 없으면
  "아직 기록된 설계 결정이 없습니다" 빈 상태 메시지.
- **`app/sitemap.ts`**: `getPublishedDecisions()`로 decisions 라우트를 troubleshooting과 동일한 방식
  으로 sitemap에 포함한다.

## `publish-decision` 스킬

위치: `C:/Users/JIHEE/.claude/skills/publish-decision/SKILL.md` — `publish-study`/`publish-troubleshooting`
과 동일한 골격(명시적 트리거, 초안 추출 → 승인 → 민감정보 게이트 → 파일 작성 → 빌드 검증 → 커밋 →
결과 보고, 자동 트리거 금지, push 금지)을 따르되 다음이 다르다.

**트리거 문구**: "이 설계 결정 포트폴리오에 올려줘", "이거 ADR로 정리해줘", "왜 이렇게 바꿨는지 기록해줘",
"설계 바뀐 거 정리해줘". "포트폴리오에 올려줘"처럼 troubleshooting과 겹칠 수 있는 애매한 요청이면,
트러블슈팅으로 올릴지 설계 결정으로 올릴지 먼저 사용자에게 확인한다.

**1. 초안 추출**
1. `content/` 아래 기존 프로젝트 폴더를 확인하고, 지금 작업 중인 프로젝트에 맞는 걸 우선 제안한다
   (없으면 새 프로젝트명 확인 — troubleshooting 스킬과 동일).
2. 그 프로젝트의 `decisions/` 아래 기존 서비스(category) 폴더 목록을 확인해 적합한 것을 우선 제안한다
   (단일 서비스 프로젝트는 `general`).
3. **이 결정이 기존 결정을 대체하는지 사용자에게 확인한다** (대화 맥락으로 추측하지 않는다). 대체하는
   것이면 해당 프로젝트의 기존 decisions 목록(제목/slug)을 보여주고 정확히 어떤 걸 대체하는지 확인받는다.
4. title/slug/summary/tags 초안을 만든다. `status`는 기본 `accepted`.
5. 본문은 고정 ADR 템플릿(`## 배경` / `## 고려한 선택지` / `## 결정` / `## 결과`)으로 작성한다. 과장 없이
   담백하게(다른 두 스킬과 동일한 톤 기준).

**2. 내용 승인** — 새 결정 초안 전체(frontmatter + 본문)를 보여주고 승인받는다. 대체하는 경우, **기존
결정 파일에 적용할 변경사항**(`status: superseded`, `supersededBy: {새 slug}`로 갱신)도 별도로 보여주고
승인받는다.

**3. 민감정보 확인 게이트** — 기존 두 스킬과 동일한 체크리스트(회사/조직 실명, 내부 도메인·URL, 자격증명,
팀원 실명, 고객사명·미공개 사업 정보), "없음"이라는 명시적 답변이 있어야 통과한다.

**4. 파일 작성**
- 새 결정: `content/{project}/decisions/{category}/{slug}.mdx`
- 대체하는 경우에만 추가로: 기존 결정 파일의 frontmatter를 수정한다(`status`, `supersededBy`). 사용자가
  2단계에서 명시적으로 확인하지 않은 대체 관계로는 기존 파일을 절대 수정하지 않는다.
- slug 충돌 시 기존 두 스킬과 동일하게 자동 덮어쓰지 않고 사용자에게 확인한다.

**5. 빌드 검증** — `npm run build`. 실패 시 파일은 워킹트리에 남기고(커밋 안 함) 에러를 보여준다.

**6. 커밋** — 대체하는 경우 새 파일과 수정된 기존 파일을 **하나의 커밋**으로 묶는다:
`git commit -m "Add design decision: {title} (supersedes {old title})"`. 대체가 아니면
`git commit -m "Add design decision: {title}"`. `push`는 하지 않는다.

**7. 결과 보고** — 파일 경로(들), 커밋 해시(성공 시) 또는 에러(실패 시), 다음 단계 안내.

**금지 사항** (기존 두 스킬의 금지 사항 + 아래 추가):
- 사용자가 명시적으로 확인하지 않은 대체 관계를 추측해서 기존 결정 파일을 수정하지 않는다.
- 대체 여부를 미리 판단해서 항상 물어보지 않고 넘어가지 않는다 — 매번 확인한다.

## 에러 처리 / 아키텍처 보존

기존 스펙에서 확정된 draft 제외 로직(`publishedOnly`), catch-all 라우팅, Next.js 15 비동기 `params`,
sitemap.xml 자동 생성 방식은 decisions에도 동일하게 적용한다. `status: superseded`는 draft와 별개
개념이다 — superseded 결정도 draft가 아니면 목록/상세/sitemap에 정상적으로 노출된다(과거 결정이었다는
사실 자체가 유효한 기록이므로 숨기지 않는다).

## 검증 방식

- `content/schemas.test.ts`에 `decisionFrontmatterSchema` 테스트 추가(status enum, supersededBy optional,
  기본값 등)
- `npm run test`, `npm run build`
- 브라우저로 `/decisions` 목록, 상세 페이지(대체 배너 포함), 프로젝트 상세 페이지의 "Design Decisions"
  섹션, 네비게이션 7개 링크, sitemap.xml에 decisions 라우트 포함 확인
- 샘플 콘텐츠로 최소 2개 결정(하나는 다른 하나를 대체하는 관계)을 만들어 대체 배너/링크가 실제로 동작
  하는지 검증

## 범위 밖

- decisions 발행 후 study/troubleshooting으로 자동 이어서 제안하는 것 (`publish-troubleshooting`의
  8단계 같은 체이닝은 decisions에는 만들지 않는다 — 대화가 너무 많아지는 것을 피함)
- 2단계 이상의 카테고리 계층(서비스 안에 하위 주제 폴더 등)
- `status`에 `proposed`/`deprecated` 같은 추가 상태값 (지금은 `accepted`/`superseded` 2가지로 충분)
