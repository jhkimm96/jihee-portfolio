# v0 디자인 통합 + career-link 콘텐츠 설계

- 날짜: 2026-07-06
- 위치: `C:/cowork/portfolio`
- 범위: 백엔드 개발자 포트폴리오 전체 기획 중 **4번 하위 프로젝트**(UI/디자인)의 첫 단계.
  디자인은 v0.app에서 사용자가 직접 만들어 `C:\Users\JIHEE\Downloads\portfolio-scaffold`로 export한 것을
  기존 Next.js/Velite 프로젝트에 통합한다. 동시에 원래 2번 하위 프로젝트(실제 콘텐츠 작성)의
  career-link 부분을 v0가 만든 목업 데이터를 재료 삼아 채운다.

## 배경

1번 하위 프로젝트(사이트 뼈대)는 완료되어 master에 병합된 상태다 (`content/prompthub/*` 샘플 1개만 존재,
스타일 없는 최소 마크업). 이번 작업은:
- v0.app에서 만든 전체 페이지 디자인(홈/Projects/Troubleshooting/Study/About/Resume, 다크모드 포함)을
  기존 아키텍처(Velite 콘텐츠 파이프라인, Next.js App Router 라우팅, `lib/content-data.ts` 데이터 계층)를
  유지한 채로 이식한다.
- career-link 프로젝트 콘텐츠를 v0가 만든 그럴듯한 목업 데이터(JWT 리프레시 토큰 레이스 컨디션 트러블슈팅 등)를
  기반으로 실제 `content/career-link/*.mdx`로 채운다.

## v0 export 분석 요약

`C:\Users\JIHEE\Downloads\portfolio-scaffold`는 Next.js 16.1.6 / React 19.2 기준으로 생성되었고,
자체 mock 데이터 계층(`lib/content.ts`)과 `react-markdown` 기반 렌더링을 사용한다. 실제로 사용되는
커스텀 컴포넌트는 `site-nav`, `site-footer`, `theme-provider`, `theme-toggle`, `project-card`,
`post-card`, `post-article`, `page-header`(PageHeader, EmptyState 포함), `content-badges`
(StatusBadge, TechChip, TechStack, TagList), `markdown`, `print-button` 뿐이며, shadcn/ui 컴포넌트는
**`button.tsx` 하나만** 실제로 임포트된다 (`components/demo.tsx`와 나머지 ui 컴포넌트들은 v0가 기본
스캐폴딩으로 만들어뒀지만 어떤 페이지에서도 쓰이지 않는 죽은 코드라 가져오지 않는다).

## 통합 원칙

- **Next.js 15.5.20 / React 19.0 유지.** v0 코드를 우리 버전에 맞게 조정해서 가져온다 (업그레이드하지 않음).
- **본문 렌더링은 기존 방식 유지.** Velite `s.markdown()`으로 빌드 타임에 컴파일된 HTML을
  `dangerouslySetInnerHTML`로 렌더링한다. v0의 `components/markdown.tsx`는 `react-markdown`/`remark-gfm`을
  걷어내고 `<div className="prose-content" dangerouslySetInnerHTML={{ __html: content }} />`로 단순화한다.
  `react-markdown`, `remark-gfm` 의존성은 추가하지 않는다.
- **데이터는 전부 `lib/content-data.ts`의 실제 함수를 사용.** v0의 `lib/content.ts`(mock 데이터 + 쿼리 함수)는
  콘텐츠 작성 참고 자료로만 쓰고 코드로는 가져오지 않는다.
- **shadcn/ui 컴포넌트는 실제 쓰이는 것만.** `components/ui/button.tsx` 하나만 이식한다. `components/demo.tsx`와
  나머지 ui 컴포넌트 50여 개는 가져오지 않는다 (YAGNI — 안 쓰는 코드를 프로젝트에 들이지 않는다).
- **다크모드를 채택한다.** `next-themes` 기반 `ThemeProvider` + `ThemeToggle`을 그대로 가져온다.

## 콘텐츠 스키마 확장 (하위 호환)

`content/schemas.ts`에 다음 optional 필드를 추가한다. 기존 프론트매터는 전부 그대로 유효하다.

```yaml
# projectFrontmatterSchema
demo: string (optional, url)   # 라이브 데모 링크. archived 프로젝트는 생략 가능

# resumeFrontmatterSchema
experience[].highlights: string[] (optional)   # 불릿 포인트
skills: { group: string, items: string[] }[]   # string[] → 그룹 구조로 변경 (resume.mdx가 1개뿐이라 바로 반영)
certificates[].issuer: string (optional)       # 발급 기관

# aboutFrontmatterSchema
location: string (optional)
```

`lib/content.ts`의 `ProjectEntry`/`StudyEntry`/`TroubleshootingEntry`는 이 필드를 반영해 갱신하고,
`ProjectStatus` 타입을 명시적으로 export해 `components/content-badges.tsx`가 재사용할 수 있게 한다.
`content/schemas.test.ts`, `lib/content.test.ts`에 새 필드에 대한 테스트 케이스를 추가한다
(예: `demo` 없이도 유효, `highlights` 없이도 유효, `skills`가 그룹 구조인지 검증).

## 콘텐츠 작업

v0의 mock 데이터(`lib/content.ts`)에 있는 career-link 관련 내용을 실제 mdx로 옮긴다 (문구는 그대로 활용,
필요시 다듬음).

- `content/career-link/project.mdx` — Career Link (이력서 공유 서비스), `status: "live"`, `demo` 필드 포함,
  `featured: true`
- `content/career-link/troubleshooting/security/jwt-refresh-race.mdx` — 리프레시 토큰 동시 재발급
  레이스 컨디션 (문제/원인/해결/결과/배운 점 구조)
- `content/study/es/es-mapping.mdx` — Elasticsearch 매핑과 분석기 기초 (v0가 제안한 3번째 study 카테고리)
- `content/profile/about.mdx` — `location` 필드 추가, 본문을 v0의 더 풍부한 bio로 교체
- `content/profile/resume.mdx` — v0 데이터 기반으로 재작성: `experience[].highlights`, `skills`를
  그룹(Language/Backend/Data/Infra)으로, `certificates[].issuer` 반영
- `public/career-link/images/thumbnail.svg` — prompthub와 동일한 방식의 플레이스홀더
- `public/career-link/videos/.gitkeep`

## 페이지/컴포넌트 이식

v0의 각 파일을 아래와 같이 우리 프로젝트에 이식하되, import를 `@/lib/content`(v0 mock) →
`@/lib/content-data`(우리 실제 데이터)로 바꾸고, 필드명 차이(`body` → `content` 등)를 맞춘다.

**새로 추가하는 컴포넌트** (v0에서 이식, import만 조정):
`components/site-nav.tsx`, `components/site-footer.tsx`, `components/theme-provider.tsx`,
`components/theme-toggle.tsx`, `components/project-card.tsx`, `components/post-card.tsx`,
`components/post-article.tsx`, `components/page-header.tsx`, `components/content-badges.tsx`,
`components/ui/button.tsx`

**교체하는 컴포넌트**: `components/markdown.tsx`(신규 — react-markdown 제거 버전),
`components/print-button.tsx`(v0 버전으로 교체 — shadcn `Button` + 아이콘 사용, `no-print`는 버튼이 아니라
resume 페이지의 툴바 wrapper `<div>`에 적용하는 방식으로 바뀜),
`components/nav.tsx`는 `site-nav.tsx`로 대체되므로 제거

**교체하는 페이지**: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/projects/page.tsx`,
`app/projects/[slug]/page.tsx`, `app/troubleshooting/page.tsx`, `app/troubleshooting/[...slug]/page.tsx`,
`app/study/page.tsx`, `app/study/[...slug]/page.tsx`, `app/about/page.tsx`, `app/resume/page.tsx`
(전부 v0 버전의 JSX/스타일을 가져오되 데이터 소스와 라우팅 로직은 기존 것 유지 — `notFound()`,
`generateStaticParams`, Next 15 비동기 `params` 패턴, draft 제외 로직은 모두 그대로 보존)

**패키지 의존성 추가**: `next-themes`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`,
`tw-animate-css`. `shadcn` 패키지의 `tailwind.css`(`@import "shadcn/tailwind.css"`)를 쓰는지, 혹은 직접
CSS 변수만 이식할지는 구현 단계에서 실제 설치 후 확인한다. `react-markdown`, `remark-gfm`,
`@vercel/analytics`, `@base-ui/react`(데모 컴포넌트 전용) 등 실제로 안 쓰는 의존성은 추가하지 않는다.

## 에러 처리 / 아키텍처 보존

기존 스펙(`2026-07-06-portfolio-site-skeleton-design.md`)에서 확정된 다음 사항은 이번 통합에서도
그대로 유지한다: `notFound()` 기반 404 처리, draft 제외 로직(`publishedOnly`), catch-all 라우팅,
Next.js 15 비동기 `params`, print CSS(`@media print { .no-print }`), sitemap.xml 자동 생성,
`SITE_URL`(`lib/site.ts`) 기반 metadataBase.

## 검증 방식

- `npm run test` — 스키마 확장분 포함 전체 단위 테스트 통과
- `npm run build` — 모든 라우트(홈, projects 목록/상세×2, troubleshooting 목록/상세, study 목록/상세,
  about, resume, sitemap) 정상 생성, draft 제외 확인
- 브라우저로 라이트/다크 모드 전환, 모바일 네비게이션(햄버거 메뉴), 인쇄 미리보기(`.no-print`) 확인
- career-link가 홈 화면 대표 프로젝트 카드, 프로젝트 목록에 정상적으로 나타나는지 확인

## 범위 밖

- v0에 있던 미사용 shadcn 컴포넌트 전체(`components/ui/*` 대부분)와 `components/demo.tsx`
- `react-markdown` 기반 렌더링으로의 전환
- Next.js 16 업그레이드
- Claude Skill, Vercel 배포, Google AdSense (기존 스펙과 동일하게 범위 밖 유지)
