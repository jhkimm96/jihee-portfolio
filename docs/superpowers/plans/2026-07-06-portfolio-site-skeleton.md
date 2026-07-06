# 포트폴리오 사이트 뼈대 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Next.js + Velite 기반 정적 포트폴리오 사이트의 뼈대(라우팅, 콘텐츠 파이프라인, 네비게이션, SEO)를 만들고, prompthub 프로젝트 샘플 콘텐츠로 전체 파이프라인이 실제로 동작하는 것을 검증한다.

**Architecture:** Next.js (App Router) + TypeScript + Tailwind CSS v4가 화면을 그리고, Velite가 `content/**/*.mdx`를 컬렉션별 Zod 스키마로 검증해 빌드 타임에 타입이 있는 데이터로 변환한다. 페이지는 `lib/content-data.ts`를 통해서만 콘텐츠에 접근하며, 순수 로직(정렬/필터/그룹핑)은 `lib/content.ts`에 분리되어 있어 Velite 없이 단위 테스트가 가능하다.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Velite (콘텐츠 파이프라인), Vitest (단위 테스트), npm.

## Global Constraints

- 프로젝트 위치: `C:/cowork/portfolio` (git 저장소 초기화 완료, 기존에 `.mcp.json`/`node_modules`/`package.json`(shadcn devDependency만 있음) 존재).
- 패키지 매니저: npm.
- 이번 계획 범위는 스펙(`docs/superpowers/specs/2026-07-06-portfolio-site-skeleton-design.md`)의 1번 하위 프로젝트로 한정한다. shadcn/ui 스타일링, career-link 콘텐츠, 나머지 실제 콘텐츠 전량, Claude Skill, Vercel 배포, Google AdSense는 범위 밖이며 이 계획에서 다루지 않는다.
- 스타일은 최소한의 시맨틱 마크업만 사용한다 (className은 print CSS에 필요한 `no-print`만 사용, 그 외 비주얼 디자인은 다루지 않음).
- 본문 콘텐츠는 `s.markdown()`으로 HTML 문자열로 컴파일해 `dangerouslySetInnerHTML`로 렌더링한다 (MDX 런타임/커스텀 JSX 컴포넌트 임베드 없이 단순화; 필요해지면 이후 UI 하위 프로젝트에서 확장).
- 사이트 URL은 `NEXT_PUBLIC_SITE_URL` 환경 변수로 관리하고, 로컬 기본값은 `http://localhost:3000`으로 둔다 (실제 도메인은 Vercel 배포 단계에서 설정, 이번 계획 범위 밖).

---

### Task 1: Next.js + TypeScript + Tailwind CSS 프로젝트 스캐폴딩

**Files:**
- Modify: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`
- Create: `app/layout.tsx` (임시, Task 6에서 교체)
- Create: `app/page.tsx` (임시, Task 7에서 교체)
- Create: `.gitignore`

**Interfaces:**
- Produces: `npm run dev` / `npm run build` / `npm run start` / `npm run test` 스크립트. 이후 모든 Task가 이 스크립트에 의존한다.

- [ ] **Step 1: package.json 작성 (기존 shadcn devDependency 유지)**

```json
{
  "name": "portfolio",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "velite": "^0.2.0"
  },
  "devDependencies": {
    "shadcn": "^4.13.0",
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: 의존성 설치**

Run: `npm install`
Expected: exit code 0, `node_modules`에 next/react/velite/tailwindcss/vitest 등이 설치됨.

- [ ] **Step 3: tsconfig.json 작성**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "#site/content": ["./.velite"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".velite/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: next.config.mjs 작성 (Velite 빌드 통합)**

```js
const isDev = process.argv.indexOf('dev') !== -1

if (!process.env.VELITE_STARTED) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
```

- [ ] **Step 5: postcss.config.mjs 작성 (Tailwind v4)**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

- [ ] **Step 6: app/globals.css 작성**

```css
@import "tailwindcss";
```

- [ ] **Step 7: app/layout.tsx 임시 작성**

```tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 8: app/page.tsx 임시 작성**

```tsx
export default function HomePage() {
  return <main>Portfolio scaffold ready</main>
}
```

- [ ] **Step 9: .gitignore 작성**

```
node_modules
.next
.velite
*.local
.env*.local
```

- [ ] **Step 10: 빌드 확인**

Run: `npm run build`
Expected: `next build` 성공 (경고는 있어도 되나 에러 없이 종료 코드 0). 이 시점엔 `velite.config.ts`가 없어서 Velite 빌드 단계가 실패할 수 있음 — 실패하면 다음 메시지를 확인: "velite.config.ts를 찾을 수 없습니다" 류의 에러가 나는 것이 정상이며, Task 3에서 해결된다. 에러 메시지가 이 내용이 맞는지만 확인하고 다음 Task로 진행한다.

- [ ] **Step 11: 커밋**

```bash
git add package.json package-lock.json tsconfig.json next.config.mjs postcss.config.mjs app/globals.css app/layout.tsx app/page.tsx .gitignore
git commit -m "Scaffold Next.js + TypeScript + Tailwind CSS project"
```

---

### Task 2: 콘텐츠 frontmatter 스키마 (`content/schemas.ts`)

**Files:**
- Create: `vitest.config.ts`
- Test: `content/schemas.test.ts`
- Create: `content/schemas.ts`

**Interfaces:**
- Produces: `projectFrontmatterSchema`, `troubleshootingFrontmatterSchema`, `studyFrontmatterSchema`, `aboutFrontmatterSchema`, `resumeFrontmatterSchema` (모두 Velite의 `s`를 기반으로 만든 스키마 객체, `.extend()`/`.safeParse()`/`.parse()` 사용 가능). Task 3의 `velite.config.ts`가 이 스키마들을 `import`해서 사용한다.

- [ ] **Step 1: vitest.config.ts 작성**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node'
  }
})
```

- [ ] **Step 2: 실패하는 테스트 작성 — content/schemas.test.ts**

```ts
import { describe, expect, it } from 'vitest'
import {
  projectFrontmatterSchema,
  troubleshootingFrontmatterSchema,
  studyFrontmatterSchema,
  aboutFrontmatterSchema,
  resumeFrontmatterSchema
} from './schemas'

describe('projectFrontmatterSchema', () => {
  it('accepts a valid project frontmatter', () => {
    const result = projectFrontmatterSchema.safeParse({
      title: 'Prompthub',
      description: 'AI 프롬프트 마켓플레이스',
      period: '2026.03 - 2026.05',
      team: '개인 프로젝트',
      role: 'Backend',
      stack: ['Spring Boot', 'MySQL'],
      github: 'https://github.com/example/prompthub',
      status: 'archived',
      statusNote: 'AWS 운영 기간 종료로 현재 서버 중단'
    })
    expect(result.success).toBe(true)
  })

  it('rejects a project missing the required github field', () => {
    const result = projectFrontmatterSchema.safeParse({
      title: 'Prompthub',
      description: 'AI 프롬프트 마켓플레이스',
      period: '2026.03 - 2026.05',
      team: '개인 프로젝트',
      role: 'Backend',
      stack: ['Spring Boot'],
      status: 'archived',
      statusNote: '중단됨'
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid status value', () => {
    const result = projectFrontmatterSchema.safeParse({
      title: 'Prompthub',
      description: 'AI 프롬프트 마켓플레이스',
      period: '2026.03 - 2026.05',
      team: '개인 프로젝트',
      role: 'Backend',
      stack: ['Spring Boot'],
      github: 'https://github.com/example/prompthub',
      status: 'not-a-real-status',
      statusNote: '중단됨'
    })
    expect(result.success).toBe(false)
  })
})

describe('troubleshootingFrontmatterSchema', () => {
  it('defaults draft to false when omitted', () => {
    const result = troubleshootingFrontmatterSchema.parse({
      title: '403 에러 해결',
      date: '2026-05-01'
    })
    expect(result.draft).toBe(false)
  })

  it('rejects tags that are not strings', () => {
    const result = troubleshootingFrontmatterSchema.safeParse({
      title: '403 에러 해결',
      date: '2026-05-01',
      tags: [123]
    })
    expect(result.success).toBe(false)
  })
})

describe('studyFrontmatterSchema', () => {
  it('accepts minimal valid study frontmatter', () => {
    const result = studyFrontmatterSchema.safeParse({
      title: 'Spring Batch 정리',
      date: '2026-05-01'
    })
    expect(result.success).toBe(true)
  })
})

describe('aboutFrontmatterSchema', () => {
  it('rejects an invalid email', () => {
    const result = aboutFrontmatterSchema.safeParse({
      name: '김지희',
      role: 'Backend Developer',
      email: 'not-an-email'
    })
    expect(result.success).toBe(false)
  })
})

describe('resumeFrontmatterSchema', () => {
  it('accepts empty experience/education/skills arrays', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [],
      education: [],
      skills: []
    })
    expect(result.success).toBe(true)
  })

  it('rejects malformed experience entries', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [{ company: '회사' }],
      education: [],
      skills: []
    })
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 3: 테스트 실패 확인**

Run: `npx vitest run content/schemas.test.ts`
Expected: FAIL — `Cannot find module './schemas'` (아직 `content/schemas.ts`가 없음).

- [ ] **Step 4: content/schemas.ts 구현**

```ts
import { s } from 'velite'

export const projectFrontmatterSchema = s.object({
  title: s.string(),
  description: s.string(),
  period: s.string(),
  team: s.string(),
  role: s.string(),
  stack: s.array(s.string()),
  github: s.string().url(),
  status: s.enum(['live', 'archived', 'github-only']),
  statusNote: s.string(),
  thumbnail: s.string().optional(),
  featured: s.boolean().default(false)
})

export const troubleshootingFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
})

export const studyFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
})

export const aboutFrontmatterSchema = s.object({
  name: s.string(),
  role: s.string(),
  email: s.string().email().optional(),
  github: s.string().url().optional(),
  portfolioFile: s.string().optional()
})

export const resumeFrontmatterSchema = s.object({
  experience: s.array(
    s.object({
      company: s.string(),
      period: s.string(),
      role: s.string(),
      description: s.string()
    })
  ),
  education: s.array(
    s.object({
      school: s.string(),
      period: s.string(),
      degree: s.string()
    })
  ),
  skills: s.array(s.string()),
  certificates: s
    .array(
      s.object({
        name: s.string(),
        date: s.string()
      })
    )
    .optional()
})
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run content/schemas.test.ts`
Expected: PASS — 9개 테스트 모두 통과.

- [ ] **Step 6: 커밋**

```bash
git add vitest.config.ts content/schemas.ts content/schemas.test.ts
git commit -m "Add per-collection frontmatter schemas with unit tests"
```

---

### Task 3: Velite 설정 (`velite.config.ts`)

**Files:**
- Create: `velite.config.ts`
- Modify: `package.json` (Velite 가상 모듈용 `imports` 필드 추가)
- Modify: `.gitignore` (이미 `.velite` 포함되어 있음 — 확인만)

**Interfaces:**
- Consumes: Task 2의 5개 frontmatter 스키마.
- Produces: `#site/content`에서 `import { projects, troubleshootingPosts, studyPosts, about, resume } from '#site/content'`로 접근 가능한 빌드 타임 데이터. 각 항목은 frontmatter 필드 + `path`(원본 상대경로) + `slug`(계산된 URL 슬러그) + (single 컬렉션 제외) `content`(HTML 문자열)를 가진다. Task 5가 이 모듈을 사용한다.

- [ ] **Step 1: velite.config.ts 작성**

```ts
import { defineConfig, defineCollection, s } from 'velite'
import {
  projectFrontmatterSchema,
  troubleshootingFrontmatterSchema,
  studyFrontmatterSchema,
  aboutFrontmatterSchema,
  resumeFrontmatterSchema
} from './content/schemas'

const projects = defineCollection({
  name: 'Project',
  pattern: '*/project.mdx',
  schema: projectFrontmatterSchema
    .extend({ path: s.path(), content: s.markdown() })
    .transform((data) => ({ ...data, slug: data.path.split('/')[0] }))
})

const troubleshootingPosts = defineCollection({
  name: 'Troubleshooting',
  pattern: '*/troubleshooting/**/*.mdx',
  schema: troubleshootingFrontmatterSchema
    .extend({ path: s.path(), content: s.markdown() })
    .transform((data) => {
      const parts = data.path.split('/')
      const project = parts[0]
      const category = parts[2]
      const slug = [project, ...parts.slice(2)].join('/')
      return { ...data, project, category, slug }
    })
})

const studyPosts = defineCollection({
  name: 'Study',
  pattern: 'study/**/*.mdx',
  schema: studyFrontmatterSchema
    .extend({ path: s.path(), content: s.markdown() })
    .transform((data) => {
      const parts = data.path.split('/')
      const category = parts[1]
      const slug = parts.slice(1).join('/')
      return { ...data, category, slug }
    })
})

const about = defineCollection({
  name: 'About',
  pattern: 'profile/about.mdx',
  single: true,
  schema: aboutFrontmatterSchema.extend({ content: s.markdown() })
})

const resume = defineCollection({
  name: 'Resume',
  pattern: 'profile/resume.mdx',
  single: true,
  schema: resumeFrontmatterSchema
})

export default defineConfig({
  root: 'content',
  collections: { projects, troubleshootingPosts, studyPosts, about, resume }
})
```

- [ ] **Step 2: package.json에 velite 가상 모듈 imports 필드 추가**

`package.json`의 최상위에 다음을 추가한다 (scripts/dependencies와 같은 레벨):

```json
"imports": {
  "#site/content": "./.velite/index.js"
}
```

- [ ] **Step 3: .gitignore에 .velite 포함 확인**

`.gitignore`에 `.velite` 줄이 이미 있는지 확인한다 (Task 1에서 추가함). 없다면 추가한다.

- [ ] **Step 4: Velite 단독 빌드로 스키마 동작 확인**

Run: `npx velite build`
Expected: 에러 없이 종료. 이 시점엔 `content/` 아래 실제 mdx 파일이 없어 각 컬렉션이 0개 항목으로 빌드되지만, 스키마 자체는 에러 없이 로드되어야 한다. `s.object(...).extend(...)`나 `s.path()`/`s.markdown()` 관련 타입 에러가 나면, 설치된 velite 버전의 `node_modules/velite/dist/index.d.ts`에서 `s`(schemas) 네임스페이스에 정의된 실제 메서드 이름을 확인하고 맞춰 조정한다.

- [ ] **Step 5: next build로 통합 확인**

Run: `npm run build`
Expected: Task 1의 Step 10에서 났던 velite 관련 에러가 이제 사라지고, 빌드가 끝까지 성공한다 (콘텐츠가 없어 빈 페이지만 있는 상태).

- [ ] **Step 6: 커밋**

```bash
git add velite.config.ts package.json .gitignore
git commit -m "Wire up Velite content pipeline with per-collection schemas"
```

---

### Task 4: 샘플 콘텐츠 (prompthub, study, profile)

**Files:**
- Create: `content/prompthub/project.mdx`
- Create: `public/prompthub/images/thumbnail.svg`
- Create: `content/prompthub/troubleshooting/api/rate-limit-429.mdx`
- Create: `content/prompthub/troubleshooting/deployment/aws-archive.mdx` (draft 검증용)
- Create: `content/study/spring/spring-batch-chunk-processing.mdx`
- Create: `content/study/kubernetes/pod-lifecycle.mdx`
- Create: `content/profile/about.mdx`
- Create: `content/profile/resume.mdx`
- Create: `public/prompthub/videos/.gitkeep`

**Interfaces:**
- Produces: Task 3의 컬렉션이 실제로 채워지는 데이터. Task 5 이후 모든 페이지 Task가 이 콘텐츠로 동작을 검증한다.

- [ ] **Step 1: content/prompthub/project.mdx**

```mdx
---
title: "Prompthub"
description: "AI 프롬프트를 사고파는 마켓플레이스 서비스"
period: "2026.03 - 2026.05"
team: "개인 프로젝트"
role: "Backend"
stack: ["Spring Boot", "MySQL", "Redis", "AWS"]
github: "https://github.com/jihee/prompthub"
status: "archived"
statusNote: "AWS 운영 기간 종료로 현재 서버는 중단되었습니다. GitHub 코드와 아래 트러블슈팅 기록으로 구현 내용을 확인할 수 있습니다."
thumbnail: "/prompthub/images/thumbnail.svg"
featured: true
---

## 개요

Prompthub는 AI 프롬프트를 등록하고 거래할 수 있는 마켓플레이스 서비스입니다.

## 담당 역할

- REST API 설계 및 구현
- 결제 연동
- AWS 배포
```

- [ ] **Step 2: public/prompthub/images/thumbnail.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#111827"/>
  <text x="60" y="330" font-family="sans-serif" font-size="64" fill="#ffffff">Prompthub</text>
</svg>
```

- [ ] **Step 3: content/prompthub/troubleshooting/api/rate-limit-429.mdx**

```mdx
---
title: "외부 API 429 Rate Limit 대응"
date: "2026-04-12"
summary: "외부 결제 API 호출이 몰릴 때 429 에러가 발생하던 문제를 해결했다."
tags: ["Spring", "Resilience4j"]
---

## 문제

결제 API를 짧은 시간에 여러 번 호출하면 외부사에서 429 Too Many Requests를 반환했다.

## 원인

동시 요청에 대한 재시도/제한 로직이 없어 트래픽이 몰릴 때 그대로 외부 API에 전달되었다.

## 해결

Resilience4j RateLimiter를 도입해 초당 호출 수를 제한하고, 실패 시 지수 백오프로 재시도하도록 수정했다.

## 결과

트래픽이 몰리는 상황에서도 429 에러 없이 안정적으로 결제 요청이 처리되었다.
```

- [ ] **Step 4: content/prompthub/troubleshooting/deployment/aws-archive.mdx (draft 샘플)**

```mdx
---
title: "AWS 비용 절감을 위한 서버 아카이빙 절차 (초안)"
date: "2026-06-01"
summary: "운영 종료 시 EC2/RDS를 안전하게 스냅샷 후 종료하는 절차 정리 (작성 중)"
tags: ["AWS"]
draft: true
---

작성 중인 초안입니다.
```

- [ ] **Step 5: content/study/spring/spring-batch-chunk-processing.mdx**

```mdx
---
title: "Spring Batch Chunk 처리 방식 정리"
date: "2026-05-20"
summary: "Chunk 기반 처리와 Tasklet 기반 처리의 차이를 정리했다."
tags: ["Spring Batch"]
---

## Chunk 지향 처리

Reader → Processor → Writer 단위로 일정 개수(chunk)씩 묶어 트랜잭션을 처리한다.

## Tasklet 지향 처리

단일 작업 단위를 한 번에 처리할 때 사용한다.
```

- [ ] **Step 6: content/study/kubernetes/pod-lifecycle.mdx**

```mdx
---
title: "Kubernetes Pod 라이프사이클 정리"
date: "2026-06-10"
summary: "Pod의 Pending/Running/Succeeded/Failed 상태 전이를 정리했다."
tags: ["Kubernetes"]
---

## Pod 상태

Pending, Running, Succeeded, Failed, Unknown 다섯 가지 상태를 가진다.
```

- [ ] **Step 7: content/profile/about.mdx**

```mdx
---
name: "김지희"
role: "Backend Developer"
email: "jhkimm96@gmail.com"
github: "https://github.com/jihee"
portfolioFile: "/profile/files/portfolio.pdf"
---

Spring Boot 기반 백엔드 개발을 중심으로, MSA/DDD, Redis, Kafka, Kubernetes를 학습하고 있습니다.
```

- [ ] **Step 8: content/profile/resume.mdx**

```mdx
---
experience:
  - company: "개인 프로젝트"
    period: "2026.03 - 2026.05"
    role: "Backend Developer"
    description: "Prompthub 백엔드 API 설계 및 AWS 배포"
education:
  - school: "OO대학교"
    period: "2019 - 2023"
    degree: "컴퓨터공학과 학사"
skills: ["Java", "Spring Boot", "MySQL", "Redis", "AWS"]
certificates:
  - name: "정보처리기사"
    date: "2024-06"
---
```

- [ ] **Step 9: public/prompthub/videos/.gitkeep**

```
실제 시연 영상은 나중에 이 폴더에 교체됩니다.
```

- [ ] **Step 10: Velite 빌드로 샘플 콘텐츠 검증**

Run: `npx velite build`
Expected: 에러 없이 종료. 콘솔 출력에 Project 1개, Troubleshooting 2개, Study 2개, About 1개, Resume 1개가 빌드되었다는 로그가 보인다 (draft 필터링은 여기서 하지 않으므로 troubleshooting은 2개 모두 포함되는 것이 정상 — draft 제외는 Task 5의 쿼리 함수에서 처리한다).

- [ ] **Step 11: 커밋**

```bash
git add content public
git commit -m "Add prompthub sample content and study/profile samples"
```

---

### Task 5: 콘텐츠 조회 유틸리티 (`lib/content.ts`, `lib/content-data.ts`)

**Files:**
- Test: `lib/content.test.ts`
- Create: `lib/content.ts`
- Create: `lib/content-data.ts`

**Interfaces:**
- Consumes: `#site/content`의 `projects`, `troubleshootingPosts`, `studyPosts`, `about`, `resume` (Task 3/4).
- Produces: `getAllProjects()`, `getProjectBySlug(slug)`, `getPublishedTroubleshooting()`, `getTroubleshootingForProject(projectSlug)`, `getTroubleshootingBySlugPath(slugParts)`, `getPublishedStudyByCategory()`, `getStudyBySlugPath(slugParts)`, `getAbout()`, `getResume()`. Task 7~12의 모든 페이지가 이 함수들만 사용한다.

- [ ] **Step 1: 실패하는 테스트 작성 — lib/content.test.ts**

```ts
import { describe, expect, it } from 'vitest'
import {
  sortProjects,
  findProjectBySlug,
  publishedOnly,
  sortByDateDesc,
  troubleshootingForProject,
  groupByCategory,
  findBySlugPath,
  type ProjectEntry,
  type TroubleshootingEntry
} from './content'

const project = (overrides: Partial<ProjectEntry>): ProjectEntry => ({
  slug: 'demo',
  title: 'Demo',
  description: 'desc',
  period: '2026.01 - 2026.02',
  team: '개인 프로젝트',
  role: 'Backend',
  stack: [],
  github: 'https://github.com/example/demo',
  status: 'archived',
  statusNote: '',
  featured: false,
  content: '',
  ...overrides
})

describe('sortProjects', () => {
  it('puts featured projects first', () => {
    const projects = [project({ slug: 'a', featured: false }), project({ slug: 'b', featured: true })]
    expect(sortProjects(projects).map((p) => p.slug)).toEqual(['b', 'a'])
  })

  it('sorts non-featured projects by period descending', () => {
    const projects = [
      project({ slug: 'old', period: '2025.01 - 2025.02' }),
      project({ slug: 'new', period: '2026.01 - 2026.02' })
    ]
    expect(sortProjects(projects).map((p) => p.slug)).toEqual(['new', 'old'])
  })
})

describe('findProjectBySlug', () => {
  it('returns the matching project', () => {
    const projects = [project({ slug: 'a' }), project({ slug: 'b' })]
    expect(findProjectBySlug(projects, 'b')?.slug).toBe('b')
  })

  it('returns undefined when no project matches', () => {
    expect(findProjectBySlug([project({ slug: 'a' })], 'missing')).toBeUndefined()
  })
})

const troubleshootingEntry = (overrides: Partial<TroubleshootingEntry>): TroubleshootingEntry => ({
  slug: 'demo/category/post',
  project: 'demo',
  category: 'category',
  title: 'Post',
  date: '2026-01-01',
  draft: false,
  content: '',
  ...overrides
})

describe('publishedOnly', () => {
  it('excludes draft entries', () => {
    const entries = [troubleshootingEntry({ slug: 'a', draft: false }), troubleshootingEntry({ slug: 'b', draft: true })]
    expect(publishedOnly(entries).map((e) => e.slug)).toEqual(['a'])
  })
})

describe('sortByDateDesc', () => {
  it('orders entries from newest to oldest', () => {
    const entries = [
      troubleshootingEntry({ slug: 'old', date: '2026-01-01' }),
      troubleshootingEntry({ slug: 'new', date: '2026-06-01' })
    ]
    expect(sortByDateDesc(entries).map((e) => e.slug)).toEqual(['new', 'old'])
  })
})

describe('troubleshootingForProject', () => {
  it('groups published entries for the given project by category, excluding drafts and other projects', () => {
    const entries = [
      troubleshootingEntry({ slug: 'a', project: 'demo', category: 'security' }),
      troubleshootingEntry({ slug: 'b', project: 'demo', category: 'security' }),
      troubleshootingEntry({ slug: 'c', project: 'demo', category: 'deployment', draft: true }),
      troubleshootingEntry({ slug: 'd', project: 'other', category: 'security' })
    ]
    const result = troubleshootingForProject(entries, 'demo')
    expect(Object.keys(result)).toEqual(['security'])
    expect(result.security.map((e) => e.slug)).toEqual(['a', 'b'])
  })
})

describe('groupByCategory', () => {
  it('groups entries by their category field', () => {
    const entries = [
      troubleshootingEntry({ slug: 'a', category: 'spring' }),
      troubleshootingEntry({ slug: 'b', category: 'es' }),
      troubleshootingEntry({ slug: 'c', category: 'spring' })
    ]
    const result = groupByCategory(entries)
    expect(result.spring.map((e) => e.slug)).toEqual(['a', 'c'])
    expect(result.es.map((e) => e.slug)).toEqual(['b'])
  })
})

describe('findBySlugPath', () => {
  it('finds the entry whose slug matches the joined path', () => {
    const entries = [troubleshootingEntry({ slug: 'demo/security/403' })]
    expect(findBySlugPath(entries, ['demo', 'security', '403'])?.slug).toBe('demo/security/403')
  })

  it('returns undefined when no entry matches', () => {
    const entries = [troubleshootingEntry({ slug: 'demo/security/403' })]
    expect(findBySlugPath(entries, ['nope'])).toBeUndefined()
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run lib/content.test.ts`
Expected: FAIL — `Cannot find module './content'`.

- [ ] **Step 3: lib/content.ts 구현 (순수 함수, Velite 의존 없음)**

```ts
export type ProjectEntry = {
  slug: string
  title: string
  description: string
  period: string
  team: string
  role: string
  stack: string[]
  github: string
  status: 'live' | 'archived' | 'github-only'
  statusNote: string
  thumbnail?: string
  featured: boolean
  content: string
}

export type TroubleshootingEntry = {
  slug: string
  project: string
  category: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  draft: boolean
  content: string
}

export type StudyEntry = {
  slug: string
  category: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  draft: boolean
  content: string
}

export function sortProjects(projects: ProjectEntry[]): ProjectEntry[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.period.localeCompare(a.period)
  })
}

export function findProjectBySlug(projects: ProjectEntry[], slug: string): ProjectEntry | undefined {
  return projects.find((project) => project.slug === slug)
}

export function publishedOnly<T extends { draft: boolean }>(entries: T[]): T[] {
  return entries.filter((entry) => !entry.draft)
}

export function sortByDateDesc<T extends { date: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date))
}

export function groupByCategory<T extends { category: string }>(entries: T[]): Record<string, T[]> {
  return entries.reduce<Record<string, T[]>>((groups, entry) => {
    groups[entry.category] = groups[entry.category] ?? []
    groups[entry.category].push(entry)
    return groups
  }, {})
}

export function troubleshootingForProject(
  entries: TroubleshootingEntry[],
  projectSlug: string
): Record<string, TroubleshootingEntry[]> {
  const published = publishedOnly(entries).filter((entry) => entry.project === projectSlug)
  return groupByCategory(published)
}

export function findBySlugPath<T extends { slug: string }>(entries: T[], slugParts: string[]): T | undefined {
  const slug = slugParts.join('/')
  return entries.find((entry) => entry.slug === slug)
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run lib/content.test.ts`
Expected: PASS — 9개 테스트 모두 통과.

- [ ] **Step 5: lib/content-data.ts 작성 (Velite 데이터를 연결하는 얇은 래퍼, 별도 단위 테스트 없음 — Task 8의 `generateStaticParams`가 빌드 시점에 실제 데이터로 검증한다)**

```ts
import { projects, troubleshootingPosts, studyPosts, about, resume } from '#site/content'
import {
  sortProjects,
  findProjectBySlug,
  publishedOnly,
  sortByDateDesc,
  troubleshootingForProject,
  groupByCategory,
  findBySlugPath
} from './content'

export function getAllProjects() {
  return sortProjects(projects)
}

export function getProjectBySlug(slug: string) {
  return findProjectBySlug(projects, slug)
}

export function getPublishedTroubleshooting() {
  return sortByDateDesc(publishedOnly(troubleshootingPosts))
}

export function getTroubleshootingForProject(projectSlug: string) {
  return troubleshootingForProject(troubleshootingPosts, projectSlug)
}

export function getTroubleshootingBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(troubleshootingPosts), slugParts)
}

export function getPublishedStudyByCategory() {
  return groupByCategory(publishedOnly(studyPosts))
}

export function getStudyBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(studyPosts), slugParts)
}

export function getAbout() {
  return about
}

export function getResume() {
  return resume
}
```

- [ ] **Step 6: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음 (`#site/content`가 Task 3/4에서 생성된 `.velite` 출력과 맞아야 함. 타입 에러가 나면 `.velite/index.d.ts`를 열어 실제 필드명을 확인하고 `lib/content.ts`의 타입과 맞춘다).

- [ ] **Step 7: 커밋**

```bash
git add lib/content.ts lib/content.test.ts lib/content-data.ts
git commit -m "Add content query utilities with unit-tested pure logic"
```

---

### Task 6: 루트 레이아웃 + 공통 네비게이션

**Files:**
- Create: `lib/site.ts`
- Create: `.env.example`
- Create: `components/nav.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `SITE_URL` 상수, `<Nav />` 컴포넌트. 모든 페이지가 공통 레이아웃을 통해 네비게이션을 갖는다.

- [ ] **Step 1: lib/site.ts 작성**

```ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
```

- [ ] **Step 2: .env.example 작성**

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

- [ ] **Step 3: components/nav.tsx 작성**

```tsx
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/troubleshooting', label: 'Troubleshooting' },
  { href: '/study', label: 'Study' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' }
]

export function Nav() {
  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 4: app/layout.tsx 교체**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/nav'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '김지희 | Backend Developer',
  description: 'Spring Boot 기반 백엔드 개발자 포트폴리오'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: 빌드 확인**

Run: `npm run build`
Expected: 성공. 임시 홈페이지(`app/page.tsx`)를 포함한 모든 페이지 상단에 6개 네비게이션 링크가 렌더링될 준비가 된 상태.

- [ ] **Step 6: 커밋**

```bash
git add lib/site.ts .env.example components/nav.tsx app/layout.tsx
git commit -m "Add shared layout with site-wide navigation"
```

---

### Task 7: 홈 페이지

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getAllProjects()`, `getPublishedTroubleshooting()` (Task 5).

- [ ] **Step 1: app/page.tsx 작성**

```tsx
import Link from 'next/link'
import { getAllProjects, getPublishedTroubleshooting } from '@/lib/content-data'

export default function HomePage() {
  const featuredProjects = getAllProjects().filter((project) => project.featured)
  const recentTroubleshooting = getPublishedTroubleshooting().slice(0, 3)

  return (
    <main>
      <h1>김지희 — Backend Developer</h1>
      <p>Spring Boot 기반 백엔드 개발을 중심으로 MSA, DDD, Redis, Kafka, Kubernetes를 학습하고 구현합니다.</p>

      <section>
        <h2>대표 프로젝트</h2>
        {featuredProjects.length === 0 ? (
          <p>아직 대표로 지정된 프로젝트가 없습니다.</p>
        ) : (
          <ul>
            {featuredProjects.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>최근 트러블슈팅</h2>
        {recentTroubleshooting.length === 0 ? (
          <p>아직 작성된 글이 없습니다.</p>
        ) : (
          <ul>
            {recentTroubleshooting.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/troubleshooting/${entry.slug}`}>{entry.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
```

- [ ] **Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공. prompthub가 `featured: true`이므로 대표 프로젝트 섹션에 노출되어야 한다 (이 시점엔 브라우저 확인은 Task 13에서 종합적으로 진행).

- [ ] **Step 3: 커밋**

```bash
git add app/page.tsx
git commit -m "Implement home page with featured projects and recent troubleshooting"
```

---

### Task 8: 프로젝트 목록/상세 페이지

**Files:**
- Create: `app/projects/page.tsx`
- Create: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllProjects()`, `getProjectBySlug(slug)`, `getTroubleshootingForProject(projectSlug)` (Task 5).

- [ ] **Step 1: app/projects/page.tsx 작성**

```tsx
import Link from 'next/link'
import { getAllProjects } from '@/lib/content-data'

export default function ProjectsPage() {
  const projects = getAllProjects()

  if (projects.length === 0) {
    return (
      <main>
        <h1>Projects</h1>
        <p>아직 작성된 프로젝트가 없습니다.</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            <p>{project.description}</p>
            <span>{project.status}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

- [ ] **Step 2: app/projects/[slug]/page.tsx 작성**

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllProjects, getProjectBySlug, getTroubleshootingForProject } from '@/lib/content-data'

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [project.thumbnail] : []
    }
  }
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const troubleshootingByCategory = getTroubleshootingForProject(project.slug)
  const categories = Object.keys(troubleshootingByCategory)

  return (
    <main>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>
        {project.period} · {project.team} · {project.role}
      </p>
      <ul>
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <p>
        Status: {project.status} — {project.statusNote}
      </p>
      <a href={project.github}>GitHub</a>

      <section dangerouslySetInnerHTML={{ __html: project.content }} />

      <section>
        <h2>트러블슈팅</h2>
        {categories.length === 0 ? (
          <p>아직 작성된 트러블슈팅이 없습니다.</p>
        ) : (
          categories.map((category) => (
            <div key={category}>
              <h3>{category}</h3>
              <ul>
                {troubleshootingByCategory[category].map((entry) => (
                  <li key={entry.slug}>
                    <a href={`/troubleshooting/${entry.slug}`}>{entry.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </main>
  )
}
```

- [ ] **Step 3: 빌드 확인 (실질적으로 lib/content-data.ts를 실제 데이터로 검증하는 단계)**

Run: `npm run build`
Expected: 성공. `generateStaticParams`가 prompthub 하나를 정적 경로로 생성하고, `/projects/prompthub`가 빌드된다. `troubleshootingByCategory`에는 `api` 카테고리만 나타나야 한다 (`deployment` 카테고리 글은 `draft: true`라 제외됨).

- [ ] **Step 4: 커밋**

```bash
git add app/projects
git commit -m "Implement project list and detail pages with OG metadata"
```

---

### Task 9: 트러블슈팅 목록/상세 페이지

**Files:**
- Create: `app/troubleshooting/page.tsx`
- Create: `app/troubleshooting/[...slug]/page.tsx`

**Interfaces:**
- Consumes: `getPublishedTroubleshooting()`, `getTroubleshootingBySlugPath(slugParts)` (Task 5).

- [ ] **Step 1: app/troubleshooting/page.tsx 작성**

```tsx
import Link from 'next/link'
import { getPublishedTroubleshooting } from '@/lib/content-data'

export default function TroubleshootingPage() {
  const entries = getPublishedTroubleshooting()

  if (entries.length === 0) {
    return (
      <main>
        <h1>Troubleshooting</h1>
        <p>아직 작성된 글이 없습니다.</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Troubleshooting</h1>
      <ul>
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/troubleshooting/${entry.slug}`}>{entry.title}</Link>
            <span>
              {entry.project} · {entry.category}
            </span>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

- [ ] **Step 2: app/troubleshooting/[...slug]/page.tsx 작성**

```tsx
import { notFound } from 'next/navigation'
import { getPublishedTroubleshooting, getTroubleshootingBySlugPath } from '@/lib/content-data'

export function generateStaticParams() {
  return getPublishedTroubleshooting().map((entry) => ({ slug: entry.slug.split('/') }))
}

export default function TroubleshootingDetailPage({ params }: { params: { slug: string[] } }) {
  const entry = getTroubleshootingBySlugPath(params.slug)
  if (!entry) notFound()

  return (
    <main>
      <h1>{entry.title}</h1>
      <p>
        {entry.date} · {entry.project} · {entry.category}
      </p>
      <article dangerouslySetInnerHTML={{ __html: entry.content }} />
    </main>
  )
}
```

- [ ] **Step 3: 빌드 확인**

Run: `npm run build`
Expected: 성공. `/troubleshooting/prompthub/api/rate-limit-429`만 정적 경로로 생성되고, draft인 `deployment/aws-archive`는 목록/라우트 어디에도 나타나지 않아야 한다.

- [ ] **Step 4: 커밋**

```bash
git add app/troubleshooting
git commit -m "Implement troubleshooting list and catch-all detail pages"
```

---

### Task 10: Study 목록/상세 페이지

**Files:**
- Create: `app/study/page.tsx`
- Create: `app/study/[...slug]/page.tsx`

**Interfaces:**
- Consumes: `getPublishedStudyByCategory()`, `getStudyBySlugPath(slugParts)` (Task 5).

- [ ] **Step 1: app/study/page.tsx 작성**

```tsx
import Link from 'next/link'
import { getPublishedStudyByCategory } from '@/lib/content-data'

export default function StudyPage() {
  const grouped = getPublishedStudyByCategory()
  const categories = Object.keys(grouped)

  if (categories.length === 0) {
    return (
      <main>
        <h1>Study</h1>
        <p>아직 작성된 글이 없습니다.</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Study</h1>
      {categories.map((category) => (
        <section key={category}>
          <h2>{category}</h2>
          <ul>
            {grouped[category].map((entry) => (
              <li key={entry.slug}>
                <Link href={`/study/${entry.slug}`}>{entry.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
```

- [ ] **Step 2: app/study/[...slug]/page.tsx 작성**

```tsx
import { notFound } from 'next/navigation'
import { getPublishedStudyByCategory, getStudyBySlugPath } from '@/lib/content-data'

export function generateStaticParams() {
  return Object.values(getPublishedStudyByCategory())
    .flat()
    .map((entry) => ({ slug: entry.slug.split('/') }))
}

export default function StudyDetailPage({ params }: { params: { slug: string[] } }) {
  const entry = getStudyBySlugPath(params.slug)
  if (!entry) notFound()

  return (
    <main>
      <h1>{entry.title}</h1>
      <p>
        {entry.date} · {entry.category}
      </p>
      <article dangerouslySetInnerHTML={{ __html: entry.content }} />
    </main>
  )
}
```

- [ ] **Step 3: 빌드 확인**

Run: `npm run build`
Expected: 성공. `spring`, `kubernetes` 두 카테고리가 목록에 나타나고, `/study/spring/spring-batch-chunk-processing`, `/study/kubernetes/pod-lifecycle` 두 경로가 정적으로 생성된다.

- [ ] **Step 4: 커밋**

```bash
git add app/study
git commit -m "Implement study list and catch-all detail pages grouped by category"
```

---

### Task 11: About / Resume 페이지 (print CSS 포함)

**Files:**
- Create: `app/about/page.tsx`
- Create: `components/print-button.tsx`
- Create: `app/resume/page.tsx`
- Modify: `app/globals.css` (print 스타일 추가)

**Interfaces:**
- Consumes: `getAbout()`, `getResume()` (Task 5).

- [ ] **Step 1: app/about/page.tsx 작성**

```tsx
import Link from 'next/link'
import { getAbout } from '@/lib/content-data'

export default function AboutPage() {
  const about = getAbout()

  return (
    <main>
      <h1>{about.name}</h1>
      <p>{about.role}</p>
      {about.email && <p>{about.email}</p>}
      {about.github && <a href={about.github}>GitHub</a>}
      <article dangerouslySetInnerHTML={{ __html: about.content }} />
      <Link href="/resume">이력서 자세히 보기</Link>
      {about.portfolioFile && <a href={about.portfolioFile}>포트폴리오 PDF 다운로드</a>}
    </main>
  )
}
```

- [ ] **Step 2: components/print-button.tsx 작성 (Client Component)**

```tsx
'use client'

export function PrintButton() {
  return (
    <button type="button" className="no-print" onClick={() => window.print()}>
      PDF로 저장
    </button>
  )
}
```

- [ ] **Step 3: app/resume/page.tsx 작성**

```tsx
import { getResume } from '@/lib/content-data'
import { PrintButton } from '@/components/print-button'

export default function ResumePage() {
  const resume = getResume()

  return (
    <main>
      <PrintButton />

      <section>
        <h1>Experience</h1>
        {resume.experience.map((item) => (
          <div key={`${item.company}-${item.period}`}>
            <h2>{item.company}</h2>
            <p>
              {item.period} · {item.role}
            </p>
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h1>Education</h1>
        {resume.education.map((item) => (
          <div key={`${item.school}-${item.period}`}>
            <h2>{item.school}</h2>
            <p>
              {item.period} · {item.degree}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h1>Skills</h1>
        <ul>
          {resume.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      {resume.certificates && resume.certificates.length > 0 && (
        <section>
          <h1>Certificates</h1>
          {resume.certificates.map((cert) => (
            <p key={cert.name}>
              {cert.name} · {cert.date}
            </p>
          ))}
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 4: app/globals.css에 print 스타일 추가**

```css
@import "tailwindcss";

@media print {
  .no-print {
    display: none;
  }
}
```

- [ ] **Step 5: 빌드 확인**

Run: `npm run build`
Expected: 성공. `/about`, `/resume` 페이지가 정적으로 생성된다.

- [ ] **Step 6: 커밋**

```bash
git add app/about app/resume components/print-button.tsx app/globals.css
git commit -m "Implement about page and print-friendly resume page"
```

---

### Task 12: sitemap.xml

**Files:**
- Create: `app/sitemap.ts`

**Interfaces:**
- Consumes: `getAllProjects()`, `getPublishedTroubleshooting()`, `getPublishedStudyByCategory()` (Task 5), `SITE_URL` (Task 6).

- [ ] **Step 1: app/sitemap.ts 작성**

```ts
import type { MetadataRoute } from 'next'
import { getAllProjects, getPublishedTroubleshooting, getPublishedStudyByCategory } from '@/lib/content-data'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/projects', '/troubleshooting', '/study', '/about', '/resume'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date()
  }))

  const projectRoutes = getAllProjects().map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date()
  }))

  const troubleshootingRoutes = getPublishedTroubleshooting().map((entry) => ({
    url: `${SITE_URL}/troubleshooting/${entry.slug}`,
    lastModified: new Date(entry.date)
  }))

  const studyRoutes = Object.values(getPublishedStudyByCategory())
    .flat()
    .map((entry) => ({
      url: `${SITE_URL}/study/${entry.slug}`,
      lastModified: new Date(entry.date)
    }))

  return [...staticRoutes, ...projectRoutes, ...troubleshootingRoutes, ...studyRoutes]
}
```

- [ ] **Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공. `/sitemap.xml` 라우트가 생성된다.

- [ ] **Step 3: 커밋**

```bash
git add app/sitemap.ts
git commit -m "Generate sitemap.xml from Velite collections"
```

---

### Task 13: 최종 수동 검증 (스펙의 "검증 방식" 전체 확인)

**Files:** 없음 (검증 전용 태스크, 코드 변경 없음)

**Interfaces:** 없음 (앞선 모든 Task의 산출물을 브라우저로 확인)

- [ ] **Step 1: 전체 유닛 테스트 실행**

Run: `npm run test`
Expected: `content/schemas.test.ts`, `lib/content.test.ts`의 모든 테스트 통과.

- [ ] **Step 2: 프로덕션 빌드**

Run: `npm run build`
Expected: 에러/경고 없이 성공.

- [ ] **Step 3: 개발 서버 기동**

Run: `npm run dev`
Expected: `http://localhost:3000`에서 서버 기동.

- [ ] **Step 4: 브라우저로 전 페이지 순회 확인**

프리뷰 브라우저 도구로 다음을 확인한다:
- `/` — 대표 프로젝트(Prompthub)와 최근 트러블슈팅이 보인다.
- 네비게이션의 6개 링크(Home/Projects/Troubleshooting/Study/About/Resume)가 모두 클릭되어 정상 이동한다.
- `/projects` — Prompthub 카드가 보인다.
- `/projects/prompthub` — 개요, 스택, GitHub 링크, 본문, "트러블슈팅 > api" 섹션이 보이고 `deployment` 카테고리(draft)는 보이지 않는다.
- `/troubleshooting` — `rate-limit-429` 글만 보이고 `aws-archive`(draft)는 보이지 않는다.
- `/troubleshooting/prompthub/api/rate-limit-429` — 본문이 정상 렌더링된다.
- `/study` — `spring`, `kubernetes` 두 카테고리가 보인다.
- `/study/spring/spring-batch-chunk-processing` — 본문이 정상 렌더링된다.
- `/about` — 이름/역할/이메일/GitHub 링크와 "이력서 자세히 보기" 링크가 보인다.
- `/resume` — 경력/학력/스킬/자격증이 보이고 "PDF로 저장" 버튼이 있다.
- 존재하지 않는 경로(`/projects/no-such-project`)에 접근하면 404 페이지가 뜬다.

- [ ] **Step 5: 인쇄 미리보기 확인**

`/resume` 페이지에서 브라우저 인쇄 미리보기(Ctrl+P 또는 Cmd+P)를 열어 "PDF로 저장" 버튼(`no-print` 클래스)이 인쇄 미리보기에서 보이지 않는지 확인한다.

- [ ] **Step 6: sitemap 확인**

브라우저에서 `http://localhost:3000/sitemap.xml`을 열어 정적 라우트 6개 + `/projects/prompthub` + `/troubleshooting/prompthub/api/rate-limit-429` + study 2개 경로가 모두 포함되어 있는지 확인한다 (draft 글의 경로는 포함되지 않아야 한다).

- [ ] **Step 7: 최종 커밋 (검증 완료 기록, 코드 변경이 있었다면 포함)**

이 태스크에서 코드 수정이 없었다면 커밋은 생략한다. 검증 중 문제를 발견해 수정했다면:

```bash
git add -A
git commit -m "Fix issues found during full-site manual verification"
```

---

## Self-Review 결과

- **스펙 커버리지:** 아키텍처(Task 1,3) / 폴더 구조(Task 1,3,4) / 콘텐츠 스키마(Task 2) / 네비게이션(Task 6) / 라우팅·데이터 흐름(Task 7~11) / Resume 처리 방식(Task 11) / 에러 처리(Task 8~10의 `notFound()`와 빈 상태, Task 3의 스키마 빌드 실패) / SEO·메타데이터(Task 6,8) / sitemap.xml(Task 12) / 검증 방식(Task 13) / 샘플 콘텐츠(Task 4) — 스펙의 모든 섹션에 대응하는 Task가 있다.
- **플레이스홀더 스캔:** "TBD"/"나중에 구현" 형태의 문구 없음. `SITE_URL`의 로컬 기본값은 플레이스홀더가 아니라 명시된 폴백 동작이다.
- **타입 일관성:** `ProjectEntry`/`TroubleshootingEntry`/`StudyEntry`의 필드명이 Task 2 스키마 → Task 3 transform → Task 5 타입/함수 → Task 7~12 페이지까지 동일하게 사용된다.
- **범위 확인:** shadcn 스타일링, career-link 콘텐츠, 실제 콘텐츠 전량, Claude Skill, Vercel 배포, AdSense는 어떤 Task에도 포함되지 않았다 (Global Constraints에 명시).
