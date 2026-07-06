# 포트폴리오 사이트 뼈대 + 콘텐츠 구조 설계

- 날짜: 2026-07-06
- 위치: `C:/cowork/portfolio`
- 범위: 백엔드 개발자 포트폴리오 전체 기획 중 **1번 하위 프로젝트** (Next.js 사이트 뼈대 + 콘텐츠 구조).
  나머지 하위 프로젝트(실제 콘텐츠 작성, UI/디자인, Claude Skill)는 이 스펙 이후 별도로 진행한다.

## 배경 / 목적

Spring Boot 서버를 상시 운영하는 대신, AWS 배포가 끊기더라도 프로젝트 내용을 증명할 수 있는
문서 기반 정적 웹 포트폴리오를 만든다. 포트폴리오(career-link, prompthub 등)와 학습 기록(study)을
같은 사이트 안에서 함께 정리한다.

## 아키텍처

```
Next.js (App Router) + TypeScript + Tailwind CSS
        ↓
Velite (콘텐츠 파이프라인)
  - content/**/*.mdx 를 Zod 스키마로 검증
  - 빌드 타임에 타입까지 포함된 데이터 생성 (파일 경로에서 slug/project/category 자동 추출)
        ↓
app/ 라우트에서 타입 안전하게 import해서 렌더링
```

- 서버/DB 없음. 순수 정적 사이트 + 빌드 타임 콘텐츠 처리.
- 패키지 매니저: npm.
- Velite를 쓰는 이유: 콘텐츠 종류(project/troubleshooting/study/profile)마다 다른 스키마를 강제해서
  frontmatter 실수를 빌드 타임에 잡고, 폴더 경로에서 project/category/slug를 자동 추출해
  사람이 직접 이 필드를 적다가 실수할 여지를 없앤다. 유지보수가 중단된 Contentlayer의 활발한 후속 프로젝트.
- shadcn/ui MCP 서버가 이미 `C:/cowork/portfolio/.mcp.json`에 설정되어 있음
  (실제 컴포넌트 조합/디자인 적용은 4번 하위 프로젝트에서 진행).

## 폴더 구조

`content/`와 `public/`은 최상위 폴더명(career-link, prompthub, study, profile)을 공유한다.
포트폴리오 프로젝트와 학습 기록이 같은 뼈대 안에서 대등하게 공존하고, 새 프로젝트/주제가 생기면
폴더 하나만 추가하면 되는 구조다.

```
portfolio/
├── content/
│   ├── prompthub/
│   │   ├── project.mdx
│   │   └── troubleshooting/
│   │       └── {category}/*.mdx        # 예: security/403-error.mdx
│   ├── career-link/
│   │   ├── project.mdx
│   │   └── troubleshooting/
│   │       └── {category}/*.mdx
│   ├── study/
│   │   └── {category}/*.mdx            # 예: spring/spring-batch.mdx, es/es-mapping.mdx
│   └── profile/
│       └── about.mdx
│
├── public/
│   ├── prompthub/
│   │   ├── images/
│   │   └── videos/
│   ├── career-link/
│   │   ├── images/
│   │   └── videos/
│   ├── study/
│   │   └── images/
│   └── profile/
│       └── files/                       # resume.pdf, portfolio.pdf
│
├── app/                                  # Next.js App Router
│   ├── page.tsx                          # 홈 (featured 프로젝트 + 최근 트러블슈팅)
│   ├── projects/page.tsx
│   ├── projects/[slug]/page.tsx
│   ├── troubleshooting/page.tsx
│   ├── troubleshooting/[...slug]/page.tsx
│   ├── study/page.tsx
│   ├── study/[...slug]/page.tsx
│   └── about/page.tsx
│
├── components/                           # 스타일 없는 최소 뼈대 (카드, 배지 등)
├── velite.config.ts
└── package.json
```

새 프로젝트가 추가되면 `content/{new-project}/`와 `public/{new-project}/`를 그대로 추가하면 된다
(라우트나 스키마 코드 변경 불필요).

## 콘텐츠 스키마 (frontmatter)

**`project.mdx`** — `content/{project-slug}/project.mdx`
```yaml
title: string
description: string
period: string          # "2026.06 - 2026.07"
team: string            # "개인 프로젝트"
role: string            # "Backend / Frontend"
stack: string[]
github: string          # url
status: "live" | "archived" | "github-only"   # 배지용
statusNote: string      # "AWS 운영 기간 종료로 현재 서버 중단" 같은 상세 설명
thumbnail?: string      # public/{project}/images/... 경로
featured?: boolean      # 홈페이지 노출 여부 (기본 false)
```

**`troubleshooting/{category}/*.mdx`**
```yaml
title: string
date: string
summary?: string
tags?: string[]
```
- `project`, `category`는 frontmatter에 넣지 않고 파일 경로에서 자동 추출한다
  (`content/{project}/troubleshooting/{category}/{slug}.mdx`).
- 본문은 문제 / 원인 / 해결 / 결과 / 배운 점 형식의 마크다운(스키마 검증 대상 아님, 작성 템플릿으로만 안내).

**`study/{category}/*.mdx`**
```yaml
title: string
date: string
summary?: string
tags?: string[]
```
- `category`는 폴더 경로(`content/study/{category}/{slug}.mdx`)에서 자동 추출한다.

**`profile/about.mdx`**
```yaml
name: string
role: string            # "Backend Developer"
email?: string
github?: string
resumeFile?: string     # public/profile/files/resume.pdf
portfolioFile?: string  # public/profile/files/portfolio.pdf
```
- 본문은 자유 형식 자기소개 마크다운.

## 라우팅 / 데이터 흐름

- **프로젝트 상세** `/projects/[slug]`: `projects` 컬렉션에서 slug로 조회 → 같은 slug를 가진
  `troubleshooting` 항목만 필터링해 category별로 그룹핑하여 함께 표시 → 없으면 `notFound()`.
- **프로젝트 목록** `/projects`: featured 우선 정렬, 나머지는 period 최신순.
- **트러블슈팅 목록** `/troubleshooting`: 전체를 날짜 역순 나열, 프로젝트/카테고리 배지로 표시.
- **트러블슈팅 상세** `/troubleshooting/[...slug]` (catch-all): 경로 그대로 매칭
  (예: `career-link/security/403-error`).
- **study 목록** `/study`: 카테고리(폴더명)별로 그룹핑해 표시.
- **study 상세** `/study/[...slug]` (catch-all): 경로 그대로 매칭 (예: `spring/spring-batch`).
- **홈** `/`: featured 프로젝트 카드 2~3개 + 최근 트러블슈팅 미리보기.

## 에러 처리

- 존재하지 않는 slug 접근 → `notFound()` → 404.
- 아직 글이 없는 프로젝트/카테고리 → 목록 페이지에 "아직 작성된 글이 없습니다" 빈 상태 표시(정상 상태, 에러 아님).
- frontmatter가 스키마를 위반하면 `next build` 자체가 실패한다 — 이것이 이 구조의 핵심 안전장치이며,
  잘못된 콘텐츠가 배포되는 것을 빌드 타임에 막는다.

## 검증 방식

정적 사이트라 별도 유닛테스트 대신 다음으로 검증한다.
- `next build` 성공 = 모든 mdx가 스키마를 통과했다는 의미.
- 로컬 `next dev`로 브라우저에서 홈 / 프로젝트 목록 / 프로젝트 상세 / 트러블슈팅 목록 / 트러블슈팅 상세 /
  study 목록 / study 상세 페이지를 실제로 열어 확인한다.

## 샘플 콘텐츠 (파이프라인 검증용)

파이프라인이 실제로 동작하는지 확인하기 위한 최소 샘플만 작성한다 (본격적인 콘텐츠 작성은 2번
하위 프로젝트에서 진행).

- `content/prompthub/project.mdx` — prompthub 프로젝트 개요 1개
- `content/prompthub/troubleshooting/{category}/*.mdx` — 트러블슈팅 샘플 1~2개
- `content/study/{category}/*.mdx` — study 샘플 1~2개
- `content/profile/about.mdx` — 최소 프로필 정보
- `public/prompthub/images/`, `public/prompthub/videos/` — 플레이스홀더 이미지/영상 1개씩 (실제 자산은
  나중에 교체)

career-link는 이번 스펙에서는 폴더/샘플 없이, 구조상 확장 가능하다는 것만 확인한다
(2번 하위 프로젝트에서 실제 콘텐츠와 함께 채운다).

## 범위 밖 (다음 하위 프로젝트로)

- prompthub/career-link 나머지 실제 콘텐츠 전량 작성, study 전체 콘텐츠 → 2번 하위 프로젝트
- 비주얼 디자인 / shadcn 컴포넌트 적용 (이번 스펙에서는 스타일 없는 최소 마크업만) → 4번 하위 프로젝트
- Claude Skill (트러블슈팅/프로젝트 메모 → mdx 자동 생성) → 3번 하위 프로젝트
- Vercel 배포 및 도메인 연결 → 별도 진행
