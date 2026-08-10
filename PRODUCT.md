# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

주 방문자는 **국내 채용 담당자와 기술 면접관**이다. 서류 검토나 기술 면접 직전에 링크를 받아 짧은 시간 안에 "이 사람이 실제로 무엇을 설계했고 그 판단이 타당했는가"를 확인하려 한다. 진입 지점은 홈, 프로젝트 상세, 역할별 이력서 어느 쪽이든 될 수 있다.

두 번째 방문자는 **현업 개발자·동료 독자**다. 검색이나 공유 링크를 타고 특정 트러블슈팅·의사결정 글에 직접 진입하며, 사이트 전체가 아니라 그 글 하나를 읽으러 온다. 채용이 1순위지만 이 유입도 중요하게 다룬다.

작성자 본인(김지희, Backend Developer, Seoul)은 콘텐츠를 MDX로 직접 작성·유지하는 유일한 운영자다.

## Product Purpose

김지희의 개발 경력을 **결과물이 아니라 판단 과정 단위로** 공개하는 개인 기술 포트폴리오 사이트. 프로젝트 소개에서 끝나지 않고, 그 안에서 내린 설계 결정·해결한 장애·코드 리뷰·품질 측정을 각각 독립된 기록으로 남겨 서로 연결한다.

성공은 방문한 채용 담당자가 **추가 질문 없이 기술 수준과 판단 근거를 판별할 수 있는 상태**로 사이트를 떠나는 것이다.

## Positioning

두 가지가 함께 성립할 때만 이 포트폴리오가 다른 포트폴리오와 구별된다. 어느 한쪽만 남으면 포지셔닝이 무너진다.

1. **판단 근거를 추적 가능하게 남기는 구조.** Decision / Troubleshooting / Review / Quality를 프로젝트에 종속된 서술이 아니라 각자 URL을 가진 1급 콘텐츠 타입으로 운영한다. "왜 그렇게 했는지"를 결과물과 분리해 따라갈 수 있다.
2. **역할별로 재구성되는 이력.** 같은 경력을 지원 직무(backend / fullstack / architecture)에 맞춰 다른 순서와 다른 근거 링크로 제시한다. 각 변형은 헤드라인·요약과 함께 실제 기록을 `picks`로 직접 지목한다.

## Operating Context

- 방문자는 대개 **외부에서 받은 단일 링크**로 진입한다. 어떤 페이지든 첫 화면이 될 수 있으며, 상위 맥락(어떤 프로젝트의 어떤 결정인지)을 그 페이지 안에서 스스로 설명해야 한다.
- 채용 담당자의 열람 시간은 짧고, 개발자 독자의 열람은 길다. 같은 페이지가 훑기와 정독을 모두 견뎌야 한다.
- 콘텐츠는 저자가 MDX 파일로 직접 작성하며, 빌드 타임에 Velite로 수집된다. CMS나 런타임 편집 화면은 없다.
- 기록은 스냅샷 성격이다. 프로젝트가 종료된 뒤에도 후속 고도화가 계속 반영된다(예: PromptHub는 팀 발표 이후에도 검색 품질 측정과 개인화 추천을 계속 다듬는 중).

## Capabilities and Constraints

**콘텐츠 타입** (Velite 컬렉션, `velite.config.ts` / `content/schemas.ts`가 스키마 권위)

| 타입 | 경로 패턴 | 라우트 |
|---|---|---|
| Project | `<project>/project.mdx` | `/projects`, `/projects/[slug]` |
| Decision | `<project>/decisions/**` | `/decisions`, `/decisions/[...slug]` |
| Troubleshooting | `<project>/troubleshooting/**` | `/troubleshooting/...` |
| Review | `<project>/reviews/*` | `/reviews/...` |
| Quality | `<project>/quality/*` | `/quality/...` |
| Study | `study/**` | `/study/...` |
| LearningPath | `<project>/learning-path.mdx` | `/study/paths/[project]` |
| About / Resume / ResumeVariant | `profile/*` | `/about`, `/resume`, `/resume/[role]` |

- 그 외 라우트: `/engineering`, `/search`(클라이언트 검색), `/sitemap.ts`, `/opengraph-image.tsx`.
- 프로젝트는 `status`(`live` / `github-only` 등)와 `statusNote`로 현재 접근 가능 여부를 밝힌다. 데모가 없는 프로젝트를 있는 것처럼 보이게 하지 않는다.
- Decision·Troubleshooting·Review·Quality 목록은 프로젝트별 필터를 제공한다.
- 다이어그램은 Mermaid와 이미지 라이트박스로 제공한다.
- 다크/라이트 테마를 `next-themes`로 지원한다.
- 기술 스택: Next.js 15 (App Router, Turbopack, 포트 4000) · React 19 · TypeScript · Tailwind CSS v4 · shadcn 규약 + Base UI · Velite · Vitest. Vercel 배포.

**용어** — 사이트 전반에서 프로젝트를 가리킬 때 `career-link`, `prompthub` 같은 슬러그가 아니라 표시 제목(`getProjectTitle`)을 쓴다.

## Brand Commitments

- 이름: 김지희 / Backend Developer / Seoul, KR. 연락은 이메일과 GitHub.
- **한국어 단독.** 본문·UI·내비게이션 모두 한국어이며 i18n 계획은 없다. 기술 용어와 섹션 라벨(`Selected work`, `Recent Activity` 등)에 한해 영문이 혼용된다.
- 목소리: 과장 없이 사실과 근거를 먼저 놓는 서술. 성과를 형용사로 부풀리지 않고 무엇을 왜 했는지로 설명한다.

## Evidence on Hand

**실제 프로젝트 2건** — 둘 다 `featured`.

- **PromptHub** (2026.07.07–07.30, 5인 백엔드 팀, Product Service / AI Recommendation 담당). 상품 도메인, PostgreSQL↔Elasticsearch 증분 색인, OpenAI text-embedding + pgvector 의미 검색, RRF 하이브리드 검색과 RDB 폴백, 인기 랭킹, 독립 ai-service 개인화 추천. `status: github-only`.
- **Career Link** (2026.06–07, 개인). JWT 인증 + 리프레시 토큰 로테이션·재사용 감지, 이력서 항목 버전 관리 도메인, 공유 링크 만료·권한 정책. `status: live`.

**보유 자산**

- 아키텍처 다이어그램 PNG 5장: `public/prompthub/images/search-recommendation/` (overview, indexing, search, ranking, recommendation)
- 프로젝트 썸네일 SVG: `public/{prompthub,career-link}/images/thumbnail.svg`
- 역할별 이력서 변형 3종: `content/profile/resumes/{backend,fullstack,architecture}.mdx`
- 자격증: 정보처리기사 (한국산업인력공단, 2024-06)

**없는 것 — 지어내지 말 것**

- 사진, 실사 이미지, 로고 없음. 썸네일은 SVG이며 프로젝트 영상 디렉터리(`public/*/videos/`)는 비어 있다.
- `content/profile/about.mdx`가 `/profile/files/portfolio.pdf`를 가리키지만 **해당 PDF는 저장소에 없다.** 다운로드 동선을 전제로 설계하기 전에 실제 파일 존재를 확인할 것.
- 추천사·고객사·언론 보도·사용자 수·매출 등 외부 검증 자료 없음.
- 학력의 학교명이 `OO대학교`로 비공개 처리되어 있다. 임의로 채우지 말 것.

## Product Principles

1. **측정하지 않은 수치는 쓰지 않는다.** 성능 개선율·처리량 같은 지표는 실제 측정한 것만 싣고, 측정하지 않은 항목은 "미측정"으로 명시한다. 설득을 위해 숫자를 만들어내지 않는다.
2. **모든 주장에 근거로 갈 수 있는 링크가 있다.** 이력서의 한 줄은 그것을 뒷받침하는 Decision·Troubleshooting·Quality 기록으로 연결된다.
3. **담당 범위를 정직하게 구분한다.** 팀 프로젝트에서 직접 구현한 것과 협업·관찰한 것을 섞지 않는다(`responsibility`, `contributions` 필드가 그 경계).
4. **모든 페이지가 진입점이다.** 어떤 문서든 단독으로 열려도 어느 프로젝트의 어떤 맥락인지 스스로 설명한다.
5. **한 페이지가 훑기와 정독을 동시에 견딘다.** 채용 담당자는 몇 분, 개발자 독자는 끝까지 읽는다.

## Accessibility & Inclusion

제품 차원에서 확정된 별도 요구 표준은 없다. 웹 표준 접근성(키보드 조작, 대비, 시맨틱 구조)을 기본으로 지킨다.

## Open Decisions

- **Career AI Platform 연동 예정.** `skills/build-career-platform`의 별도 제품(증거 기반 이력/지원 자동화 플랫폼)과 향후 연결될 예정이다. 콘텐츠 구조를 그 연동에 맞게 유지하되, 연동 시점·범위·이 사이트에 생길 화면은 아직 정해지지 않았다. 임의로 가정하지 말 것.
- 인터랙티브 데모·영상 게재 여부 미정(디렉터리만 존재).
