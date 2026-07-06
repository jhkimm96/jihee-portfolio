# v0 디자인 통합 + career-link 콘텐츠 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** v0.app에서 사용자가 만든 디자인(`C:\Users\JIHEE\Downloads\portfolio-scaffold`)을 기존 Next.js/Velite 포트폴리오(`C:/cowork/portfolio`)에 이식하고, career-link 프로젝트 콘텐츠를 v0의 목업 데이터를 재료로 실제 작성한다.

**Architecture:** v0가 만든 JSX/Tailwind 스타일과 shadcn Button 컴포넌트만 가져오고, 데이터는 전부 기존 `lib/content-data.ts`(Velite 기반 실제 데이터)를 그대로 사용한다. 본문 렌더링은 기존처럼 Velite `s.markdown()` 컴파일 HTML을 `dangerouslySetInnerHTML`로 표시하며, `react-markdown`은 도입하지 않는다. 다크모드는 `next-themes`로 추가한다.

**Tech Stack:** Next.js 15.5.20, React 19.0, TypeScript, Tailwind CSS v4, Velite, next-themes, lucide-react, class-variance-authority, `@base-ui/react`(shadcn Button 기반), Vitest.

## Global Constraints

- 프로젝트 위치: `C:/cowork/portfolio`, 브랜치는 아직 정하지 않음 (구현 시작 전 사용자에게 확인).
- 패키지 매니저: npm.
- Next.js 15.5.20 / React 19.0을 유지한다. v0 원본은 Next 16 기준이므로 코드만 우리 버전에 맞게 조정한다 (업그레이드 금지).
- 본문 렌더링은 `dangerouslySetInnerHTML` 유지. `react-markdown`, `remark-gfm`은 추가하지 않는다.
- shadcn/ui 컴포넌트는 `components/ui/button.tsx` 하나만 이식한다. `components/demo.tsx`와 나머지 미사용 ui 컴포넌트는 가져오지 않는다.
- 프로젝트 썸네일 이미지는 `next/image`가 아니라 일반 `<img>` 태그로 렌더링한다 (로컬 placeholder SVG에 대해 `next/image`의 `dangerouslyAllowSVG` 설정을 추가하지 않기 위한 의도적 단순화 — 스펙에는 없던 세부 결정이지만 최소 변경으로 실용적인 선택).
- v0의 mock 데이터 계층(`lib/content.ts`, mock 버전)은 코드로 가져오지 않는다 — 콘텐츠 작성 참고 자료로만 사용했고 이미 반영 완료.
- `content/schemas.ts`에 다음 필드를 추가한다: `project.demo?`, `resume.summary?`, `resume.experience[].highlights?`, `resume.skills`(문자열 배열 → `{group, items}[]` 구조로 변경), `resume.certificates[].issuer?`, `about.location?`.

---

### Task 1: 의존성 추가 + `lib/utils.ts`

**Files:**
- Modify: `package.json`
- Create: `lib/utils.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` — 이후 모든 UI 컴포넌트가 클래스명 병합에 사용.

- [ ] **Step 1: package.json에 의존성 추가**

`dependencies`에 다음을 추가한다 (기존 `next`, `react`, `react-dom`, `velite`는 그대로 유지):

```json
"@base-ui/react": "latest",
"class-variance-authority": "latest",
"clsx": "^2.1.1",
"lucide-react": "latest",
"next-themes": "latest",
"tailwind-merge": "^3.3.1",
"tw-animate-css": "latest"
```

- [ ] **Step 2: 의존성 설치**

Run: `npm install`
Expected: exit code 0, 에러 없이 설치 완료.

- [ ] **Step 3: lib/utils.ts 작성**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: 빌드 확인**

Run: `npm run build`
Expected: 기존과 동일하게 성공 (아직 새 의존성을 쓰는 코드가 없으므로 이전과 같은 결과).

- [ ] **Step 5: 커밋**

```bash
git add package.json package-lock.json lib/utils.ts
git commit -m "Add UI dependencies for v0 design integration"
```

---

### Task 2: shadcn Button 컴포넌트 + components.json

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components.json`

**Interfaces:**
- Consumes: `cn` (Task 1).
- Produces: `Button`, `buttonVariants` — 이후 모든 페이지/컴포넌트가 임포트해서 사용.

- [ ] **Step 1: components/ui/button.tsx 작성**

```tsx
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-transparent dark:hover:bg-input/30',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        lg: 'h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-8',
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7',
        'icon-lg': 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
```

- [ ] **Step 2: components.json 작성**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-rhea",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 3: 타입 체크 + 빌드 확인**

Run: `npx tsc --noEmit`
Expected: 에러 없음 (아직 어디서도 import 안 하지만, 파일 자체는 독립적으로 타입 체크를 통과해야 함).

Run: `npm run build`
Expected: 성공.

- [ ] **Step 4: 커밋**

```bash
git add components/ui/button.tsx components.json
git commit -m "Add shadcn Button component (base-ui variant)"
```

---

### Task 3: 테마 토큰 + 다크모드 CSS (`app/globals.css`)

**Files:**
- Modify: `app/globals.css` (전체 교체)

**Interfaces:**
- Produces: `--color-brand`, `--color-status-live` 등 CSS 커스텀 프로퍼티, `.prose-content`(마크다운 본문 스타일), `.no-print`/`.print-container`/`.print-page`(인쇄 스타일 — 기존과 동일한 클래스명 유지).

- [ ] **Step 1: app/globals.css 전체 교체**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-sans);
  --font-heading: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --color-status-live: var(--status-live);
  --color-status-archived: var(--status-archived);
  --color-status-github: var(--status-github);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --background: oklch(0.992 0.001 260);
  --foreground: oklch(0.22 0.012 260);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.012 260);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.012 260);
  --primary: oklch(0.26 0.018 262);
  --primary-foreground: oklch(0.985 0.002 260);
  --secondary: oklch(0.965 0.003 260);
  --secondary-foreground: oklch(0.26 0.018 262);
  --muted: oklch(0.965 0.003 260);
  --muted-foreground: oklch(0.505 0.012 260);
  --accent: oklch(0.955 0.006 255);
  --accent-foreground: oklch(0.26 0.018 262);
  --destructive: oklch(0.577 0.222 27.2);
  --border: oklch(0.912 0.004 260);
  --input: oklch(0.912 0.004 260);
  --ring: oklch(0.55 0.13 255);
  --brand: oklch(0.55 0.13 255);
  --brand-foreground: oklch(0.985 0.002 260);
  --status-live: oklch(0.62 0.14 155);
  --status-archived: oklch(0.68 0.13 75);
  --status-github: oklch(0.55 0.01 260);
  --chart-1: oklch(0.55 0.13 255);
  --chart-2: oklch(0.62 0.14 155);
  --chart-3: oklch(0.68 0.13 75);
  --chart-4: oklch(0.505 0.012 260);
  --chart-5: oklch(0.26 0.018 262);
  --radius: 0.5rem;
  --sidebar: oklch(0.985 0.002 260);
  --sidebar-foreground: oklch(0.22 0.012 260);
  --sidebar-primary: oklch(0.26 0.018 262);
  --sidebar-primary-foreground: oklch(0.985 0.002 260);
  --sidebar-accent: oklch(0.965 0.003 260);
  --sidebar-accent-foreground: oklch(0.26 0.018 262);
  --sidebar-border: oklch(0.912 0.004 260);
  --sidebar-ring: oklch(0.55 0.13 255);
}

.dark {
  --background: oklch(0.17 0.008 260);
  --foreground: oklch(0.94 0.004 260);
  --card: oklch(0.205 0.009 260);
  --card-foreground: oklch(0.94 0.004 260);
  --popover: oklch(0.205 0.009 260);
  --popover-foreground: oklch(0.94 0.004 260);
  --primary: oklch(0.92 0.004 260);
  --primary-foreground: oklch(0.205 0.009 260);
  --secondary: oklch(0.255 0.01 260);
  --secondary-foreground: oklch(0.94 0.004 260);
  --muted: oklch(0.255 0.01 260);
  --muted-foreground: oklch(0.68 0.01 260);
  --accent: oklch(0.27 0.012 260);
  --accent-foreground: oklch(0.94 0.004 260);
  --destructive: oklch(0.704 0.191 22.2);
  --border: oklch(1 0 0 / 9%);
  --input: oklch(1 0 0 / 14%);
  --ring: oklch(0.68 0.12 255);
  --brand: oklch(0.72 0.12 255);
  --brand-foreground: oklch(0.17 0.008 260);
  --status-live: oklch(0.72 0.14 155);
  --status-archived: oklch(0.78 0.12 80);
  --status-github: oklch(0.7 0.01 260);
  --chart-1: oklch(0.72 0.12 255);
  --chart-2: oklch(0.72 0.14 155);
  --chart-3: oklch(0.78 0.12 80);
  --chart-4: oklch(0.68 0.01 260);
  --chart-5: oklch(0.92 0.004 260);
  --sidebar: oklch(0.205 0.009 260);
  --sidebar-foreground: oklch(0.94 0.004 260);
  --sidebar-primary: oklch(0.72 0.12 255);
  --sidebar-primary-foreground: oklch(0.17 0.008 260);
  --sidebar-accent: oklch(0.27 0.012 260);
  --sidebar-accent-foreground: oklch(0.94 0.004 260);
  --sidebar-border: oklch(1 0 0 / 9%);
  --sidebar-ring: oklch(0.68 0.12 255);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Markdown prose styling for post bodies */
.prose-content {
  @apply text-[0.95rem] leading-relaxed text-foreground/90;
}
.prose-content h2 {
  @apply mt-8 mb-3 border-b border-border pb-2 text-xl font-semibold tracking-tight text-foreground;
}
.prose-content h3 {
  @apply mt-6 mb-2 text-base font-semibold tracking-tight text-foreground;
}
.prose-content p {
  @apply my-4;
}
.prose-content ul {
  @apply my-4 list-disc space-y-1.5 pl-5;
}
.prose-content ol {
  @apply my-4 list-decimal space-y-1.5 pl-5;
}
.prose-content a {
  @apply font-medium text-brand underline underline-offset-4;
}
.prose-content code {
  @apply rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground;
}
.prose-content pre {
  @apply my-4 overflow-x-auto rounded-md border border-border bg-muted p-4 text-[0.85em] leading-relaxed;
}
.prose-content pre code {
  @apply bg-transparent p-0;
}
.prose-content blockquote {
  @apply my-4 border-l-2 border-brand pl-4 text-muted-foreground;
}
.prose-content strong {
  @apply font-semibold text-foreground;
}

/* Print styles for the resume page */
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: #fff !important;
    color: #000 !important;
  }
  .print-container {
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .print-page {
    box-shadow: none !important;
    border: none !important;
  }
}
```

Note: v0 원본에는 `@import "shadcn/tailwind.css";`가 있었지만, 필요한 모든 CSS 변수를 이 파일이 직접 정의하고 있어 제외했다 (검증되지 않은 외부 임포트에 의존하지 않기 위함).

- [ ] **Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공. `tw-animate-css` 패키지가 없으면 이 시점에 실패하므로, Task 1에서 설치가 잘 됐는지 재확인.

- [ ] **Step 3: 커밋**

```bash
git add app/globals.css
git commit -m "Add theme tokens, dark mode variables, and prose styles"
```

---

### Task 4: 콘텐츠 스키마 확장

**Files:**
- Modify: `content/schemas.ts`
- Modify: `lib/content.ts`
- Test: `content/schemas.test.ts`

**Interfaces:**
- Produces: `ProjectStatus` 타입(신규 export), `ProjectEntry.demo?: string`. `resumeFrontmatterSchema`에 `summary?`, `experience[].highlights?`, `skills: {group, items}[]`(구조 변경), `certificates[].issuer?`. `aboutFrontmatterSchema`에 `location?`.

- [ ] **Step 1: 실패하는 테스트 추가 — content/schemas.test.ts**

기존 `describe` 블록들 사이/뒤에 다음 `it` 케이스들을 추가한다.

`projectFrontmatterSchema` describe 블록 안에 추가:
```ts
  it('accepts a project with an optional demo url', () => {
    const result = projectFrontmatterSchema.safeParse({
      title: 'Career Link',
      description: '설명',
      period: '2026.06 - 2026.07',
      team: '개인 프로젝트',
      role: 'Backend',
      stack: ['Spring Boot'],
      github: 'https://github.com/example/career-link',
      demo: 'https://career-link.example.com',
      status: 'live',
      statusNote: '운영 중'
    })
    expect(result.success).toBe(true)
  })
```

`aboutFrontmatterSchema` describe 블록 안에 추가:
```ts
  it('accepts an optional location', () => {
    const result = aboutFrontmatterSchema.safeParse({
      name: '김지희',
      role: 'Backend Developer',
      location: 'Seoul, KR'
    })
    expect(result.success).toBe(true)
  })
```

`resumeFrontmatterSchema` describe 블록 안에 추가:
```ts
  it('accepts an optional summary', () => {
    const result = resumeFrontmatterSchema.safeParse({
      summary: '요약 문단',
      experience: [],
      education: [],
      skills: []
    })
    expect(result.success).toBe(true)
  })

  it('accepts experience with optional highlights', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [
        { company: 'A', period: '2024', role: 'Dev', description: 'desc', highlights: ['did X', 'did Y'] }
      ],
      education: [],
      skills: []
    })
    expect(result.success).toBe(true)
  })

  it('rejects skills expressed as flat strings (must be grouped)', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [],
      education: [],
      skills: ['Java', 'Spring Boot']
    })
    expect(result.success).toBe(false)
  })

  it('accepts skills grouped by category', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [],
      education: [],
      skills: [{ group: 'Language', items: ['Java', 'TypeScript'] }]
    })
    expect(result.success).toBe(true)
  })

  it('accepts certificates with an optional issuer', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [],
      education: [],
      skills: [],
      certificates: [{ name: '정보처리기사', date: '2024-06', issuer: '한국산업인력공단' }]
    })
    expect(result.success).toBe(true)
  })
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run content/schemas.test.ts`
Expected: FAIL — `rejects skills expressed as flat strings` 케이스가 현재 스키마(`skills: s.array(s.string())`)에서는 **통과**해버려서(즉 `success: true`인데 `false`를 기대) 실패. 나머지 새 필드 관련 케이스는 optional 필드라 이미 통과할 수도 있음 — 핵심은 skills 구조 테스트가 실패하는 것을 확인.

- [ ] **Step 3: content/schemas.ts 수정**

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
  demo: s.string().url().optional(),
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
  location: s.string().optional(),
  email: s.string().email().optional(),
  github: s.string().url().optional(),
  portfolioFile: s.string().optional()
})

export const resumeFrontmatterSchema = s.object({
  summary: s.string().optional(),
  experience: s.array(
    s.object({
      company: s.string(),
      period: s.string(),
      role: s.string(),
      description: s.string(),
      highlights: s.array(s.string()).optional()
    })
  ),
  education: s.array(
    s.object({
      school: s.string(),
      period: s.string(),
      degree: s.string()
    })
  ),
  skills: s.array(
    s.object({
      group: s.string(),
      items: s.array(s.string())
    })
  ),
  certificates: s
    .array(
      s.object({
        name: s.string(),
        date: s.string(),
        issuer: s.string().optional()
      })
    )
    .optional()
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run content/schemas.test.ts`
Expected: PASS — 모든 케이스 통과.

- [ ] **Step 5: lib/content.ts에 ProjectStatus 타입 추가 및 ProjectEntry 확장**

`lib/content.ts`의 `ProjectEntry` 정의를 다음으로 교체 (다른 타입/함수는 그대로 유지):

```ts
export type ProjectStatus = 'live' | 'archived' | 'github-only'

export type ProjectEntry = {
  slug: string
  title: string
  description: string
  period: string
  team: string
  role: string
  stack: string[]
  github: string
  demo?: string
  status: ProjectStatus
  statusNote: string
  thumbnail?: string
  featured: boolean
  content: string
}
```

- [ ] **Step 6: lib/content.test.ts 확인 (변경 불필요, 회귀 확인용)**

Run: `npx vitest run lib/content.test.ts`
Expected: PASS — `project()` 픽스처 헬퍼는 `demo`를 옵션으로 다루므로 기존 테스트에 영향 없음.

- [ ] **Step 7: velite 빌드로 스키마 실제 적용 확인**

Run: `npx velite build`
Expected: 성공 (기존 콘텐츠 파일들의 frontmatter가 새 스키마와도 호환되는지 확인 — `content/profile/resume.mdx`의 `skills: ["Java", ...]`가 이제 구조 위반이라 **이 시점에는 실패해야 정상**이다. 실패 메시지에 `skills`가 배열의 원소 타입 불일치라는 내용이 있는지 확인하고, Task 5에서 콘텐츠를 수정하면 해결됨을 인지한 채 다음 태스크로 넘어간다).

- [ ] **Step 8: 커밋**

```bash
git add content/schemas.ts content/schemas.test.ts lib/content.ts
git commit -m "Extend content schemas: project demo link, resume highlights/skill groups/certificate issuer, about location"
```

---

### Task 5: 콘텐츠 재작성 — about/resume 확장 + career-link 신규 + study 추가

**Files:**
- Modify: `content/profile/about.mdx`
- Modify: `content/profile/resume.mdx`
- Create: `content/career-link/project.mdx`
- Create: `content/career-link/troubleshooting/security/jwt-refresh-race.mdx`
- Create: `content/study/es/es-mapping.mdx`
- Create: `public/career-link/images/thumbnail.svg`
- Create: `public/career-link/videos/.gitkeep`

**Interfaces:**
- Consumes: Task 4의 확장된 스키마.
- Produces: Velite `projects`(2개), `troubleshootingPosts`(3개, draft 1개 포함), `studyPosts`(3개), `about`, `resume` 컬렉션 데이터. 이후 모든 페이지 태스크가 이 콘텐츠로 동작을 검증한다.

- [ ] **Step 1: content/profile/about.mdx 교체**

```mdx
---
name: "김지희"
role: "Backend Developer"
location: "Seoul, KR"
email: "jhkimm96@gmail.com"
github: "https://github.com/jihee"
portfolioFile: "/profile/files/portfolio.pdf"
---

Spring Boot 기반 백엔드 개발을 중심으로 REST API 설계, 인증/인가, 결제 연동, 그리고 AWS 배포까지 서비스의 전 구간을 책임지는 것을 좋아합니다. 최근에는 MSA/DDD, Redis, Kafka, Kubernetes 같은 분산 시스템 주제를 꾸준히 학습하며 기록으로 남기고 있습니다.
```

- [ ] **Step 2: content/profile/resume.mdx 교체**

```mdx
---
summary: "REST API 설계부터 AWS 배포까지 백엔드 서비스의 전 구간을 다루는 개발자입니다. 안정적인 트랜잭션 설계와 외부 시스템 연동, 그리고 학습 내용을 기록으로 남기는 습관을 중요하게 생각합니다."
experience:
  - company: "개인 프로젝트 — Prompthub"
    period: "2026.03 - 2026.05"
    role: "Backend Developer"
    description: "AI 프롬프트 마켓플레이스 백엔드 API 설계 및 AWS 배포"
    highlights:
      - "주문/결제 상태 머신 설계로 중복 결제 및 실패 복구 처리"
      - "Redis Sorted Set 기반 인기 프롬프트 랭킹 캐시 구현"
      - "Resilience4j로 외부 결제 API 429 대응"
  - company: "개인 프로젝트 — Career Link"
    period: "2026.06 - 2026.07"
    role: "Backend / Frontend Developer"
    description: "이력서 관리·공유 서비스 인증 모델 및 프론트엔드 구현"
    highlights:
      - "JWT 인증 + 리프레시 토큰 로테이션 및 재사용 감지"
      - "이력서 항목 버전 관리 도메인 설계"
education:
  - school: "OO대학교"
    period: "2019 - 2023"
    degree: "컴퓨터공학과 학사"
skills:
  - group: "Language"
    items: ["Java", "Kotlin", "TypeScript", "SQL"]
  - group: "Backend"
    items: ["Spring Boot", "Spring Batch", "JPA", "Resilience4j"]
  - group: "Data"
    items: ["MySQL", "PostgreSQL", "Redis", "Elasticsearch"]
  - group: "Infra"
    items: ["AWS", "Docker", "Kubernetes", "GitHub Actions"]
certificates:
  - name: "정보처리기사"
    issuer: "한국산업인력공단"
    date: "2024-06"
---
```

- [ ] **Step 3: content/career-link/project.mdx 생성**

```mdx
---
title: "Career Link"
description: "이력서·경력 기술서를 구조화해 관리하고 공유 링크로 내보내는 서비스. 인증과 권한 모델 설계에 집중했습니다."
period: "2026.06 - 2026.07"
team: "개인 프로젝트"
role: "Backend / Frontend"
stack: ["Spring Boot", "PostgreSQL", "JWT", "Next.js"]
github: "https://github.com/jihee/career-link"
demo: "https://career-link.example.com"
status: "live"
statusNote: "현재 데모 서버가 운영 중입니다."
thumbnail: "/career-link/images/thumbnail.svg"
featured: true
---

## 개요

Career Link는 이력서와 경력 기술서를 항목 단위로 관리하고, 원하는 항목만 골라 공유용 링크로 내보낼 수 있는 서비스입니다.

## 담당 역할

- JWT 기반 인증/인가 및 리프레시 토큰 로테이션
- 이력서 항목 버전 관리 도메인 설계
- 공유 링크 만료/권한 정책 구현

## 아키텍처 포인트

- 공유 링크는 서명된 토큰으로 발급하고, 만료·회수 상태를 서버에서 검증합니다.
- 도메인 로직과 인프라 계층을 분리해 테스트 가능한 구조를 유지했습니다.
```

- [ ] **Step 4: content/career-link/troubleshooting/security/jwt-refresh-race.mdx 생성**

```mdx
---
title: "리프레시 토큰 동시 재발급 레이스 컨디션"
date: "2026-06-22"
summary: "탭 여러 개에서 동시에 토큰을 갱신할 때 로그아웃되는 문제를 토큰 로테이션 + 유예 시간으로 해결했습니다."
tags: ["JWT", "Redis", "동시성"]
---

## 문제

여러 탭을 열어둔 사용자가 동시에 토큰을 갱신하면 한쪽 요청이 무효화된 토큰을 사용하게 되어 예기치 않게 로그아웃되는 현상이 있었습니다.

## 원인

리프레시 토큰을 1회용으로 즉시 폐기하면서, 거의 동시에 도착한 두 번째 요청이 이미 폐기된 토큰을 들고 오는 레이스 컨디션이 발생했습니다.

## 해결

- 재발급 시 이전 토큰을 즉시 삭제하지 않고 짧은 유예 시간(grace period) 동안 유효 처리
- 토큰 패밀리 단위로 재사용 감지 → 진짜 탈취 상황만 전체 무효화

## 결과

정상 사용자의 다중 탭 시나리오에서 로그아웃이 사라졌고, 토큰 재사용 공격 탐지 기능은 그대로 유지되었습니다.
```

- [ ] **Step 5: content/study/es/es-mapping.mdx 생성**

```mdx
---
title: "Elasticsearch 매핑과 분석기 기초"
date: "2026-06-28"
summary: "text vs keyword 타입 선택과 분석기(analyzer) 동작을 정리했습니다."
tags: ["Elasticsearch", "검색"]
---

## text vs keyword

- **text**: 전문 검색용. 분석기를 거쳐 토큰으로 쪼개져 색인됩니다.
- **keyword**: 정확 일치/집계/정렬용. 값 전체가 하나의 토큰으로 저장됩니다.

## 분석기

색인 시점과 검색 시점에 동일한 분석기를 적용해야 기대한 검색 결과가 나옵니다. 한글은 nori 같은 형태소 분석기를 함께 고려합니다.
```

- [ ] **Step 6: public/career-link/images/thumbnail.svg 생성**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#1e293b"/>
  <text x="60" y="330" font-family="sans-serif" font-size="64" fill="#ffffff">Career Link</text>
</svg>
```

- [ ] **Step 7: public/career-link/videos/.gitkeep 생성**

```
실제 시연 영상은 나중에 이 폴더에 교체됩니다.
```

- [ ] **Step 8: velite 빌드로 전체 콘텐츠 검증**

Run: `npx velite build`
Expected: 성공. Projects 2개(prompthub, career-link), Troubleshooting 3개(prompthub/api 비draft, prompthub/deployment draft, career-link/security 비draft), Study 3개(spring, kubernetes, es) 빌드됨.

- [ ] **Step 9: 전체 테스트 확인**

Run: `npm run test`
Expected: 기존 19개 테스트 + Task 4에서 추가한 케이스 모두 통과.

- [ ] **Step 10: 커밋**

```bash
git add content public
git commit -m "Expand about/resume content and add career-link project, troubleshooting, and study entries"
```

---

### Task 6: 공용 표시 컴포넌트 — format, content-badges, page-header

**Files:**
- Create: `lib/format.ts`
- Create: `components/content-badges.tsx`
- Create: `components/page-header.tsx`

**Interfaces:**
- Consumes: `ProjectStatus` (`lib/content.ts`, Task 4), `cn` (`lib/utils.ts`, Task 1).
- Produces: `formatCategory(category): string`, `formatDate(iso): string`, `StatusBadge`, `TechChip`, `TechStack`, `TagList`, `PageHeader`, `EmptyState`.

- [ ] **Step 1: lib/format.ts 작성**

```ts
const categoryLabels: Record<string, string> = {
  api: 'API',
  security: 'Security',
  deployment: 'Deployment',
  database: 'Database',
  performance: 'Performance',
  spring: 'Spring',
  kubernetes: 'Kubernetes',
  elasticsearch: 'Elasticsearch',
  es: 'Elasticsearch',
  redis: 'Redis',
  kafka: 'Kafka',
  network: 'Network'
}

export function formatCategory(category: string): string {
  return categoryLabels[category] ?? category.charAt(0).toUpperCase() + category.slice(1)
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
```

- [ ] **Step 2: components/content-badges.tsx 작성**

```tsx
import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/content'

const statusConfig: Record<ProjectStatus, { label: string; dot: string; text: string }> = {
  live: {
    label: 'Live',
    dot: 'bg-status-live',
    text: 'text-status-live'
  },
  archived: {
    label: 'Archived',
    dot: 'bg-status-archived',
    text: 'text-status-archived'
  },
  'github-only': {
    label: 'GitHub Only',
    dot: 'bg-status-github',
    text: 'text-status-github'
  }
}

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] font-medium',
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dot)} aria-hidden />
      <span className={config.text}>{config.label}</span>
    </span>
  )
}

export function TechChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 font-mono text-[0.7rem] font-medium text-secondary-foreground">
      {children}
    </span>
  )
}

export function TechStack({ items, max, className }: { items: string[]; max?: number; className?: string }) {
  const shown = max ? items.slice(0, max) : items
  const rest = max ? items.length - shown.length : 0
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {shown.map((item) => (
        <TechChip key={item}>{item}</TechChip>
      ))}
      {rest > 0 ? <TechChip>+{rest}</TechChip> : null}
    </div>
  )
}

export function TagList({ tags, className }: { tags?: string[]; className?: string }) {
  if (!tags || tags.length === 0) return null
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <span key={tag} className="font-mono text-[0.7rem] text-muted-foreground">
          #{tag}
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: components/page-header.tsx 작성**

```tsx
export function PageHeader({
  eyebrow,
  title,
  description,
  count
}: {
  eyebrow?: string
  title: string
  description?: string
  count?: number
}) {
  return (
    <div className="space-y-3 border-b border-border pb-6">
      {eyebrow ? <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand">{eyebrow}</p> : null}
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{title}</h1>
        {typeof count === 'number' ? <span className="font-mono text-sm text-muted-foreground">{count} entries</span> : null}
      </div>
      {description ? <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p> : null}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
      <p className="font-mono text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
```

- [ ] **Step 4: 타입 체크 + 빌드 확인**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

Run: `npm run build`
Expected: 성공.

- [ ] **Step 5: 커밋**

```bash
git add lib/format.ts components/content-badges.tsx components/page-header.tsx
git commit -m "Add format helpers and shared content-badge/page-header components"
```

---

### Task 7: Markdown 렌더러 교체 + PostCard + PostArticle

**Files:**
- Create: `components/markdown.tsx`
- Create: `components/post-card.tsx`
- Create: `components/post-article.tsx`

**Interfaces:**
- Consumes: `formatCategory`, `formatDate` (Task 6), `TagList` (Task 6).
- Produces: `Markdown({ content })`, `PostCard(props)`, `PostArticle(props)` — `content` prop 이름 사용(= Velite가 컴파일한 HTML 문자열).

- [ ] **Step 1: components/markdown.tsx 작성 (react-markdown 없이 단순화)**

```tsx
export function Markdown({ content }: { content: string }) {
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: content }} />
}
```

- [ ] **Step 2: components/post-card.tsx 작성**

```tsx
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { formatCategory, formatDate } from '@/lib/format'
import { TagList } from '@/components/content-badges'

interface PostCardProps {
  href: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  badges?: { label: string; kind?: 'project' | 'category' }[]
}

export function PostCard({ href, title, date, summary, tags, badges }: PostCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2.5 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/50"
    >
      {badges && badges.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {badges.map((badge) => (
            <span
              key={`${badge.kind}-${badge.label}`}
              className={
                badge.kind === 'project'
                  ? 'inline-flex items-center rounded-md bg-primary px-2 py-0.5 font-mono text-[0.7rem] font-medium text-primary-foreground'
                  : 'inline-flex items-center rounded-md border border-border px-2 py-0.5 font-mono text-[0.7rem] font-medium text-muted-foreground'
              }
            >
              {badge.kind === 'category' ? formatCategory(badge.label) : badge.label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[0.95rem] font-semibold leading-snug tracking-tight text-pretty">{title}</h3>
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
      </div>

      {summary ? <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{summary}</p> : null}

      <div className="mt-1 flex items-center justify-between gap-3">
        <TagList tags={tags} />
        <time className="shrink-0 font-mono text-[0.7rem] text-muted-foreground" dateTime={date}>
          {formatDate(date)}
        </time>
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: components/post-article.tsx 작성**

```tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Markdown } from '@/components/markdown'
import { TagList } from '@/components/content-badges'
import { formatCategory, formatDate } from '@/lib/format'

interface PostArticleProps {
  backHref: string
  backLabel: string
  title: string
  date: string
  content: string
  tags?: string[]
  badges?: { label: string; kind: 'project' | 'category' }[]
}

export function PostArticle({ backHref, backLabel, title, date, content, tags, badges }: PostArticleProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {backLabel}
      </Link>

      <header className="mt-6 space-y-4 border-b border-border pb-6">
        {badges && badges.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {badges.map((badge) => (
              <span
                key={`${badge.kind}-${badge.label}`}
                className={
                  badge.kind === 'project'
                    ? 'inline-flex items-center rounded-md bg-primary px-2 py-0.5 font-mono text-[0.7rem] font-medium text-primary-foreground'
                    : 'inline-flex items-center rounded-md border border-border px-2 py-0.5 font-mono text-[0.7rem] font-medium text-muted-foreground'
                }
              >
                {badge.kind === 'category' ? formatCategory(badge.label) : badge.label}
              </span>
            ))}
          </div>
        ) : null}

        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{title}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <time className="font-mono text-xs text-muted-foreground" dateTime={date}>
            {formatDate(date)}
          </time>
          <TagList tags={tags} />
        </div>
      </header>

      <article className="mt-8">
        <Markdown content={content} />
      </article>
    </div>
  )
}
```

- [ ] **Step 4: 타입 체크 + 빌드 확인**

Run: `npx tsc --noEmit && npm run build`
Expected: 둘 다 성공.

- [ ] **Step 5: 커밋**

```bash
git add components/markdown.tsx components/post-card.tsx components/post-article.tsx
git commit -m "Add simplified Markdown renderer, PostCard, and PostArticle components"
```

---

### Task 8: 다크모드 + 네비게이션/푸터 + 루트 레이아웃 교체

**Files:**
- Create: `components/theme-provider.tsx`
- Create: `components/theme-toggle.tsx`
- Create: `components/site-nav.tsx`
- Create: `components/site-footer.tsx`
- Modify: `app/layout.tsx` (전체 교체)
- Delete: `components/nav.tsx` (site-nav.tsx로 대체됨)

**Interfaces:**
- Consumes: `Button` (Task 2), `getAbout` (`lib/content-data.ts`), `SITE_URL` (`lib/site.ts`).
- Produces: 다크모드가 적용된 공통 레이아웃. 이후 모든 페이지가 이 레이아웃 아래에서 렌더링된다.

- [ ] **Step 1: components/theme-provider.tsx 작성**

```tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'

function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== 'd') {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
```

- [ ] **Step 2: components/theme-toggle.tsx 작성**

```tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9"
      aria-label="테마 전환"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="size-4.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
```

- [ ] **Step 3: components/site-nav.tsx 작성**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { getAbout } from '@/lib/content-data'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/troubleshooting', label: 'Troubleshooting' },
  { href: '/study', label: 'Study' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' }
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const about = getAbout()

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Terminal className="size-4" />
          </span>
          <span>{about.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 font-mono text-[0.8rem] font-medium transition-colors',
                  active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-9 md:hidden"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2.5 font-mono text-sm font-medium transition-colors',
                    active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
```

- [ ] **Step 4: components/site-footer.tsx 작성**

```tsx
import Link from 'next/link'
import { GitFork, Mail } from 'lucide-react'
import { getAbout } from '@/lib/content-data'

export function SiteFooter() {
  const about = getAbout()

  return (
    <footer className="no-print border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p className="font-mono text-sm font-semibold">{about.name}</p>
          <p className="text-xs text-muted-foreground">{about.role} · 포트폴리오 · 트러블슈팅 · 학습 기록</p>
        </div>
        <div className="flex items-center gap-4">
          {about.github ? (
            <Link
              href={about.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitFork className="size-4" />
              GitHub
            </Link>
          ) : null}
          {about.email ? (
            <Link
              href={`mailto:${about.email}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4" />
              {about.email}
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: app/layout.tsx 전체 교체**

```tsx
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { getAbout } from '@/lib/content-data'
import { SITE_URL } from '@/lib/site'

const fontSans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const fontMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

const about = getAbout()

export const metadata: Metadata = {
  title: {
    default: `${about.name} — ${about.role}`,
    template: `%s — ${about.name}`
  },
  description: `${about.name}의 포트폴리오, 트러블슈팅 기록, 학습 노트, 이력서를 한 곳에서 관리하는 사이트입니다.`,
  metadataBase: new URL(SITE_URL)
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#181a20' }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: 이전 nav.tsx 삭제**

```bash
rm components/nav.tsx
```

- [ ] **Step 7: 빌드 확인**

Run: `npm run build`
Expected: 성공 (이 시점에는 다른 페이지들이 아직 예전 마크업이라 스타일이 안 맞을 수 있으나, 레이아웃/빌드 자체는 에러 없이 성공해야 함).

- [ ] **Step 8: 브라우저 확인 (다크모드 핵심 마일스톤)**

`npm run dev`로 개발 서버를 띄우고 브라우저로:
- 홈 화면에서 상단 네비게이션 6개 링크 확인
- 우측 상단 해/달 아이콘 클릭 → 다크모드 전환 확인
- `d` 키를 누르면(입력창 포커스가 아닐 때) 테마가 토글되는지 확인
- 모바일 너비로 리사이즈 → 햄버거 메뉴 열고 닫기 확인

- [ ] **Step 9: 커밋**

```bash
git add components/theme-provider.tsx components/theme-toggle.tsx components/site-nav.tsx components/site-footer.tsx app/layout.tsx
git rm components/nav.tsx
git commit -m "Add dark mode, site nav/footer, and rewire root layout"
```

---

### Task 9: 홈 페이지 + ProjectCard (+ content-data 헬퍼 추가)

**Files:**
- Modify: `lib/content-data.ts` (함수 추가)
- Create: `components/project-card.tsx`
- Modify: `app/page.tsx` (전체 교체)

**Interfaces:**
- Produces: `getProjectTitle(slug): string`, `getPublishedStudy(): StudyEntry[]` (`lib/content-data.ts`에 추가, 이후 troubleshooting/study 페이지에서도 사용).

- [ ] **Step 1: lib/content-data.ts에 함수 추가**

기존 함수들 뒤에 다음을 추가한다 (import 구문에 이미 있는 `findProjectBySlug`, `sortByDateDesc`, `publishedOnly`를 재사용):

```ts
export function getProjectTitle(slug: string): string {
  return findProjectBySlug(projects, slug)?.title ?? slug
}

export function getPublishedStudy() {
  return sortByDateDesc(publishedOnly(studyPosts))
}
```

- [ ] **Step 2: components/project-card.tsx 작성 (썸네일은 next/image 대신 일반 img 사용)**

```tsx
import Link from 'next/link'
import { ArrowUpRight, Calendar, Users } from 'lucide-react'
import type { ProjectEntry } from '@/lib/content'
import { StatusBadge, TechStack } from '@/components/content-badges'

export function ProjectCard({ project }: { project: ProjectEntry }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-brand/50"
    >
      {project.thumbnail ? (
        <div className="relative aspect-[1200/500] w-full overflow-hidden border-b border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnail}
            alt={`${project.title} 프로젝트 대표 이미지`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="flex items-center gap-1 text-base font-semibold tracking-tight">
              {project.title}
              <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-brand" />
            </h3>
            <p className="font-mono text-xs text-muted-foreground">{project.role}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-auto space-y-3 pt-1">
          <TechStack items={project.stack} max={4} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 font-mono text-[0.7rem] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {project.period}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" />
              {project.team}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: app/page.tsx 전체 교체**

```tsx
import Link from 'next/link'
import { ArrowRight, GitFork, FileText, Wrench, BookOpen, FolderGit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/project-card'
import { PostCard } from '@/components/post-card'
import {
  getAbout,
  getAllProjects,
  getPublishedTroubleshooting,
  getPublishedStudy,
  getProjectTitle
} from '@/lib/content-data'

export default function HomePage() {
  const about = getAbout()
  const featured = getAllProjects().filter((project) => project.featured)
  const recentTs = getPublishedTroubleshooting().slice(0, 3)
  const recentStudy = getPublishedStudy().slice(0, 3)

  const stats = [
    { label: 'Projects', value: getAllProjects().length, href: '/projects', icon: FolderGit2 },
    { label: 'Troubleshooting', value: getPublishedTroubleshooting().length, href: '/troubleshooting', icon: Wrench },
    { label: 'Study Notes', value: getPublishedStudy().length, href: '/study', icon: BookOpen }
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="border-b border-border py-14 sm:py-20">
        <p className="font-mono text-sm text-brand">{`// ${about.role}`}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{about.name}의 개발 포트폴리오</h1>
        <div
          className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty"
          dangerouslySetInnerHTML={{ __html: about.content }}
        />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/projects">
              프로젝트 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/resume">
              <FileText className="size-4" />
              이력서
            </Link>
          </Button>
          {about.github ? (
            <Button asChild variant="ghost">
              <Link href={about.github} target="_blank" rel="noopener noreferrer">
                <GitFork className="size-4" />
                GitHub
              </Link>
            </Button>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 border-b border-border py-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-muted-foreground transition-colors group-hover:text-brand">
                <stat.icon className="size-4.5" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <span className="font-mono text-2xl font-semibold tabular-nums">{stat.value}</span>
          </Link>
        ))}
      </section>

      <section className="py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Featured Projects</h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            전체 보기
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">아직 대표로 지정된 프로젝트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-8 border-t border-border py-10 md:grid-cols-2">
        <div>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Wrench className="size-4 text-muted-foreground" />
              Recent Troubleshooting
            </h2>
            <Link
              href="/troubleshooting"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              더 보기
            </Link>
          </div>
          {recentTs.length === 0 ? (
            <p className="font-mono text-sm text-muted-foreground">아직 작성된 글이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentTs.map((post) => (
                <PostCard
                  key={post.slug}
                  href={`/troubleshooting/${post.slug}`}
                  title={post.title}
                  date={post.date}
                  summary={post.summary}
                  badges={[
                    { label: getProjectTitle(post.project), kind: 'project' },
                    { label: post.category, kind: 'category' }
                  ]}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <BookOpen className="size-4 text-muted-foreground" />
              Recent Study
            </h2>
            <Link href="/study" className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
              더 보기
            </Link>
          </div>
          {recentStudy.length === 0 ? (
            <p className="font-mono text-sm text-muted-foreground">아직 작성된 글이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentStudy.map((post) => (
                <PostCard
                  key={post.slug}
                  href={`/study/${post.slug}`}
                  title={post.title}
                  date={post.date}
                  summary={post.summary}
                  badges={[{ label: post.category, kind: 'category' }]}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: 빌드 확인**

Run: `npm run build`
Expected: 성공.

- [ ] **Step 5: 브라우저 확인**

`npm run dev`로 홈 화면을 열어 featured 프로젝트 카드 2개(prompthub, career-link)가 나오는지, 통계(Projects 2 / Troubleshooting 2 / Study Notes 3 — draft 제외)가 맞는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add lib/content-data.ts components/project-card.tsx app/page.tsx
git commit -m "Rebuild home page with v0 design: stats bar, featured projects, recent activity"
```

---

### Task 10: 프로젝트 목록/상세 페이지 재작성

**Files:**
- Modify: `app/projects/page.tsx` (전체 교체)
- Modify: `app/projects/[slug]/page.tsx` (전체 교체)

**Interfaces:**
- Consumes: `PageHeader`, `EmptyState` (Task 6), `ProjectCard` (Task 9), `Markdown` (Task 7), `StatusBadge`, `TechChip` (Task 6), `PostCard` (Task 7).

- [ ] **Step 1: app/projects/page.tsx 전체 교체**

```tsx
import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { ProjectCard } from '@/components/project-card'
import { getAllProjects } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Projects',
  description: '설계와 구현을 맡은 백엔드 프로젝트 모음입니다.'
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        description="설계와 구현을 직접 맡은 백엔드 중심 프로젝트입니다. Featured 프로젝트를 먼저, 이후 최신순으로 정렬됩니다."
        count={projects.length}
      />

      {projects.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 등록된 프로젝트가 없습니다." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: app/projects/[slug]/page.tsx 전체 교체**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, GitFork, ExternalLink, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Markdown } from '@/components/markdown'
import { StatusBadge, TechChip } from '@/components/content-badges'
import { PostCard } from '@/components/post-card'
import { formatCategory } from '@/lib/format'
import { getAllProjects, getProjectBySlug, getTroubleshootingForProject } from '@/lib/content-data'

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
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

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const troubleshooting = getTroubleshootingForProject(project.slug)
  const categories = Object.keys(troubleshooting)

  const meta = [
    { label: '기간', value: project.period },
    { label: '팀', value: project.team },
    { label: '역할', value: project.role }
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Projects
      </Link>

      <header className="mt-6 space-y-5 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-balance">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-base leading-relaxed text-muted-foreground text-pretty">{project.description}</p>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3">
          {meta.map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">{item.label}</dt>
              <dd className="font-mono text-sm">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <TechChip key={item}>{item}</TechChip>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm" variant="outline">
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <GitFork className="size-4" />
              GitHub
            </Link>
          </Button>
          {project.demo ? (
            <Button asChild size="sm" variant="outline">
              <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Live Demo
              </Link>
            </Button>
          ) : null}
        </div>

        {project.statusNote ? (
          <div className="rounded-md border border-border bg-secondary/50 px-4 py-3">
            <p className="text-sm leading-relaxed text-muted-foreground">{project.statusNote}</p>
          </div>
        ) : null}
      </header>

      {project.thumbnail ? (
        <div className="relative mt-8 aspect-[1200/500] w-full overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.thumbnail} alt={`${project.title} 대표 이미지`} className="size-full object-cover" />
        </div>
      ) : null}

      <article className="mt-8">
        <Markdown content={project.content} />
      </article>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Wrench className="size-4 text-muted-foreground" />
          Troubleshooting
        </h2>
        {categories.length === 0 ? (
          <p className="mt-4 font-mono text-sm text-muted-foreground">이 프로젝트에 연결된 트러블슈팅 기록이 아직 없습니다.</p>
        ) : (
          <div className="mt-6 space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-brand">
                  {formatCategory(category)}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {troubleshooting[category].map((post) => (
                    <PostCard
                      key={post.slug}
                      href={`/troubleshooting/${post.slug}`}
                      title={post.title}
                      date={post.date}
                      summary={post.summary}
                      tags={post.tags}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 3: 빌드 확인**

Run: `npm run build`
Expected: 성공. `/projects/prompthub`, `/projects/career-link` 둘 다 생성.

- [ ] **Step 4: 브라우저 확인**

`/projects/career-link`에서 Live Demo 버튼이 보이고, `/projects/prompthub`에서는 안 보이는지 확인 (archived 프로젝트라 demo 없음).

- [ ] **Step 5: 커밋**

```bash
git add app/projects
git commit -m "Rebuild project list and detail pages with v0 design"
```

---

### Task 11: 트러블슈팅 목록/상세 페이지 재작성

**Files:**
- Modify: `app/troubleshooting/page.tsx` (전체 교체)
- Modify: `app/troubleshooting/[...slug]/page.tsx` (전체 교체)

**Interfaces:**
- Consumes: `PageHeader`, `EmptyState` (Task 6), `PostCard` (Task 7), `PostArticle` (Task 7), `getProjectTitle` (Task 9).

- [ ] **Step 1: app/troubleshooting/page.tsx 전체 교체**

```tsx
import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedTroubleshooting, getProjectTitle } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Troubleshooting',
  description: '실제 프로젝트에서 마주친 문제와 원인, 해결 과정을 기록한 트러블슈팅 로그입니다.'
}

export default function TroubleshootingPage() {
  const posts = getPublishedTroubleshooting()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Engineering Log"
        title="Troubleshooting"
        description="실제 프로젝트에서 마주친 문제 → 원인 → 해결 → 결과를 기록합니다. 최신순으로 정렬되며, 프로젝트와 카테고리로 분류됩니다."
        count={posts.length}
      />

      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 트러블슈팅 기록이 없습니다." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              href={`/troubleshooting/${post.slug}`}
              title={post.title}
              date={post.date}
              summary={post.summary}
              tags={post.tags}
              badges={[
                { label: getProjectTitle(post.project), kind: 'project' },
                { label: post.category, kind: 'category' }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: app/troubleshooting/[...slug]/page.tsx 전체 교체**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import { getPublishedTroubleshooting, getTroubleshootingBySlugPath, getProjectTitle } from '@/lib/content-data'

export function generateStaticParams() {
  return getPublishedTroubleshooting().map((entry) => ({ slug: entry.slug.split('/') }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getTroubleshootingBySlugPath(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary ?? post.title
  }
}

export default async function TroubleshootingDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const post = getTroubleshootingBySlugPath(slug)
  if (!post) notFound()

  return (
    <PostArticle
      backHref="/troubleshooting"
      backLabel="Troubleshooting"
      title={post.title}
      date={post.date}
      content={post.content}
      tags={post.tags}
      badges={[
        { label: getProjectTitle(post.project), kind: 'project' },
        { label: post.category, kind: 'category' }
      ]}
    />
  )
}
```

- [ ] **Step 3: 빌드 확인**

Run: `npm run build`
Expected: 성공. `/troubleshooting/prompthub/api/rate-limit-429`, `/troubleshooting/career-link/security/jwt-refresh-race` 생성, draft(`prompthub/deployment/aws-archive`)는 제외.

- [ ] **Step 4: 커밋**

```bash
git add app/troubleshooting
git commit -m "Rebuild troubleshooting list and detail pages with v0 design"
```

---

### Task 12: Study 목록/상세 페이지 재작성

**Files:**
- Modify: `app/study/page.tsx` (전체 교체)
- Modify: `app/study/[...slug]/page.tsx` (전체 교체)

**Interfaces:**
- Consumes: `PageHeader`, `EmptyState` (Task 6), `PostCard` (Task 7), `PostArticle` (Task 7), `formatCategory` (Task 6).

- [ ] **Step 1: app/study/page.tsx 전체 교체**

```tsx
import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedStudyByCategory } from '@/lib/content-data'
import { formatCategory } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Study',
  description: 'Spring, Kubernetes, Elasticsearch 등 백엔드/인프라 주제를 학습하며 정리한 노트입니다.'
}

export default function StudyPage() {
  const grouped = getPublishedStudyByCategory()
  const categories = Object.keys(grouped).sort()
  const total = categories.reduce((sum, c) => sum + grouped[c].length, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Learning Notes"
        title="Study"
        description="꾸준히 학습한 내용을 주제별로 정리합니다. 카테고리(폴더)별로 그룹핑되어 한눈에 분류를 확인할 수 있습니다."
        count={total}
      />

      {categories.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 학습 노트가 없습니다." />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {categories.map((category) => (
            <section key={category}>
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-brand">
                  {formatCategory(category)}
                </h2>
                <span className="font-mono text-xs text-muted-foreground">{grouped[category].length}</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {grouped[category].map((post) => (
                  <PostCard
                    key={post.slug}
                    href={`/study/${post.slug}`}
                    title={post.title}
                    date={post.date}
                    summary={post.summary}
                    tags={post.tags}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: app/study/[...slug]/page.tsx 전체 교체**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import { getPublishedStudyByCategory, getStudyBySlugPath } from '@/lib/content-data'

export function generateStaticParams() {
  return Object.values(getPublishedStudyByCategory())
    .flat()
    .map((entry) => ({ slug: entry.slug.split('/') }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getStudyBySlugPath(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary ?? post.title
  }
}

export default async function StudyDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const post = getStudyBySlugPath(slug)
  if (!post) notFound()

  return (
    <PostArticle
      backHref="/study"
      backLabel="Study"
      title={post.title}
      date={post.date}
      content={post.content}
      tags={post.tags}
      badges={[{ label: post.category, kind: 'category' }]}
    />
  )
}
```

- [ ] **Step 3: 빌드 확인**

Run: `npm run build`
Expected: 성공. `/study/spring/spring-batch-chunk-processing`, `/study/kubernetes/pod-lifecycle`, `/study/es/es-mapping` 3개 생성.

- [ ] **Step 4: 커밋**

```bash
git add app/study
git commit -m "Rebuild study list and detail pages with v0 design"
```

---

### Task 13: About + Resume 페이지 재작성 (+ PrintButton 교체)

**Files:**
- Modify: `components/print-button.tsx` (전체 교체)
- Modify: `app/about/page.tsx` (전체 교체)
- Modify: `app/resume/page.tsx` (전체 교체)

**Interfaces:**
- Consumes: `Button` (Task 2), `PageHeader` (Task 6), `formatDate` (Task 6), `getAbout`/`getResume` (`lib/content-data.ts`).

- [ ] **Step 1: components/print-button.tsx 전체 교체**

```tsx
'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    <Button size="sm" variant="outline" onClick={() => window.print()}>
      <Printer className="size-4" />
      PDF로 저장 / 인쇄
    </Button>
  )
}
```

- [ ] **Step 2: app/about/page.tsx 전체 교체**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GitFork, Mail, MapPin, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { getAbout } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'About'
}

export default function AboutPage() {
  const about = getAbout()

  const contacts = [
    about.location ? { icon: MapPin, label: about.location, href: undefined } : null,
    about.email ? { icon: Mail, label: about.email, href: `mailto:${about.email}` } : null,
    about.github ? { icon: GitFork, label: 'GitHub', href: about.github } : null
  ].filter(Boolean) as { icon: typeof MapPin; label: string; href?: string }[]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow="Profile" title="About" />

      <div className="mt-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            {about.name}
            <span className="ml-2 font-mono text-sm font-normal text-brand">{about.role}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {contacts.map((contact) =>
              contact.href ? (
                <Link
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <contact.icon className="size-3.5" />
                  {contact.label}
                </Link>
              ) : (
                <span key={contact.label} className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <contact.icon className="size-3.5" />
                  {contact.label}
                </span>
              )
            )}
          </div>
        </div>

        <div
          className="text-base leading-relaxed text-foreground/90 text-pretty"
          dangerouslySetInnerHTML={{ __html: about.content }}
        />

        <div className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button asChild>
            <Link href="/resume">
              이력서 자세히 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          {about.portfolioFile ? (
            <Button asChild variant="outline">
              <Link href={about.portfolioFile} target="_blank" rel="noopener noreferrer">
                <Download className="size-4" />
                포트폴리오 PDF
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: app/resume/page.tsx 전체 교체**

```tsx
import type { Metadata } from 'next'
import { GitFork, Mail, MapPin } from 'lucide-react'
import { PrintButton } from '@/components/print-button'
import { formatDate } from '@/lib/format'
import { getAbout, getResume } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Resume'
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-brand">{children}</h2>
}

export default function ResumePage() {
  const about = getAbout()
  const resume = getResume()

  return (
    <div className="print-container mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="no-print mb-8 flex items-center justify-between border-b border-border pb-4">
        <p className="font-mono text-xs text-muted-foreground">
          브라우저 인쇄에서 &ldquo;PDF로 저장&rdquo;을 선택하면 최신 이력서를 내보낼 수 있습니다.
        </p>
        <PrintButton />
      </div>

      <div className="print-page">
        <header className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight">{about.name}</h1>
          <p className="mt-1 font-mono text-sm text-brand">{about.role}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
            {about.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {about.location}
              </span>
            ) : null}
            {about.email ? (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {about.email}
              </span>
            ) : null}
            {about.github ? (
              <span className="inline-flex items-center gap-1.5">
                <GitFork className="size-3.5" />
                {about.github.replace('https://', '')}
              </span>
            ) : null}
          </div>
          {resume.summary ? (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">{resume.summary}</p>
          ) : null}
        </header>

        <section className="py-6">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
              <div key={`${exp.company}-${exp.period}`} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <p className="font-mono text-xs text-muted-foreground sm:pt-0.5">{exp.period}</p>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-sm font-semibold">{exp.company}</h3>
                    <span className="font-mono text-xs text-muted-foreground">· {exp.role}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                  {exp.highlights && exp.highlights.length > 0 ? (
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-foreground/80">
                      {exp.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border py-6">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-3">
            {resume.skills.map((skill) => (
              <div key={skill.group} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <p className="font-mono text-xs text-muted-foreground">{skill.group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 font-mono text-[0.7rem] font-medium text-secondary-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border py-6">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.school} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <p className="font-mono text-xs text-muted-foreground sm:pt-0.5">{edu.period}</p>
                <div>
                  <h3 className="text-sm font-semibold">{edu.school}</h3>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {resume.certificates && resume.certificates.length > 0 ? (
          <section className="border-t border-border py-6">
            <SectionTitle>Certificates</SectionTitle>
            <div className="space-y-3">
              {resume.certificates.map((cert) => (
                <div key={cert.name} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <p className="font-mono text-xs text-muted-foreground sm:pt-0.5">{formatDate(cert.date)}</p>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-sm font-semibold">{cert.name}</h3>
                    {cert.issuer ? <span className="font-mono text-xs text-muted-foreground">· {cert.issuer}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 빌드 확인**

Run: `npm run build`
Expected: 성공.

- [ ] **Step 5: 브라우저 확인**

`/about`, `/resume` 열어서 스킬 그룹, highlights 불릿, 자격증 발급기관이 보이는지 확인. 인쇄 미리보기(Ctrl+P)에서 `no-print` 영역이 숨겨지는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add components/print-button.tsx app/about/page.tsx app/resume/page.tsx
git commit -m "Rebuild about and resume pages with v0 design, skill groups, and highlights"
```

---

### Task 14: 최종 전체 검증

**Files:** 없음 (검증 전용, 코드 변경 없음)

- [ ] **Step 1: 전체 테스트**

Run: `npm run test`
Expected: 모든 테스트 통과 (Task 4에서 추가한 케이스 포함).

- [ ] **Step 2: 타입 체크 + 프로덕션 빌드**

Run: `npx tsc --noEmit && npm run build`
Expected: 에러 없이 성공. 라우트 목록에 `/`, `/projects`, `/projects/prompthub`, `/projects/career-link`, `/troubleshooting`, `/troubleshooting/prompthub/api/rate-limit-429`, `/troubleshooting/career-link/security/jwt-refresh-race`, `/study`, `/study/spring/spring-batch-chunk-processing`, `/study/kubernetes/pod-lifecycle`, `/study/es/es-mapping`, `/about`, `/resume`, `/sitemap.xml`이 전부 포함되어야 한다.

- [ ] **Step 3: 브라우저 전체 워크스루**

`npm run dev`로 개발 서버를 띄우고 프리뷰 브라우저 도구로:
- 홈: featured 카드 2개, 통계 정확, 최근 트러블슈팅/스터디 각 위젯 확인
- Projects 목록 → 상세(career-link: Live Demo 버튼 있음, prompthub: 없음)
- Troubleshooting 목록(2개, draft 제외) → 상세 2개 모두 정상 렌더링
- Study 목록(spring/kubernetes/es 3개 카테고리) → 상세 3개 모두 정상 렌더링
- About, Resume(스킬 그룹, highlights, 자격증 발급기관, 인쇄 미리보기)
- 다크모드 토글 + `d` 단축키, 모바일 너비 햄버거 메뉴
- 존재하지 않는 slug(`/projects/no-such-project`) → 404

- [ ] **Step 4: sitemap.xml 확인**

브라우저에서 `http://localhost:3000/sitemap.xml`을 열어 career-link 관련 URL이 포함되고 draft 트러블슈팅 URL은 없는지 확인.

- [ ] **Step 5: 문제 발견 시 수정 후 커밋**

검증 중 문제를 발견해 수정했다면:

```bash
git add -A
git commit -m "Fix issues found during v0 integration verification"
```

문제가 없었다면 이 태스크는 커밋 없이 종료한다.

---

## Self-Review 결과

- **스펙 커버리지:** 통합 원칙(Next 15 유지·렌더링 방식 유지·실제 데이터 계층 사용·shadcn button만 이식) — Task 1,2,7,9~13에 반영. 스키마 확장 5개 필드(+summary 1개 추가 발견분) — Task 4. 콘텐츠 작업(about/resume 확장, career-link 신규, es study) — Task 5. 페이지/컴포넌트 이식 전체 목록 — Task 6~13. 검증 방식 — Task 14. 스펙의 모든 섹션에 대응하는 태스크가 있다.
- **플레이스홀더 스캔:** "TBD"/"나중에" 형태 문구 없음. `shadcn/tailwind.css` 임포트 제외는 명시적 근거와 함께 확정된 결정이지 미해결 사항이 아니다.
- **타입 일관성:** `ProjectEntry.demo?`, `ProjectStatus`, `content`(모든 엔트리 공통), `resume.summary/experience[].highlights/skills[].group,items/certificates[].issuer`, `about.location` — 스키마(Task 4) → 콘텐츠(Task 5) → 컴포넌트/페이지(Task 6~13)까지 필드명이 동일하게 유지된다.
- **범위 확인:** `react-markdown`, Next 16 업그레이드, 미사용 shadcn 컴포넌트 전체, `components/demo.tsx`는 어떤 태스크에도 포함되지 않았다 (Global Constraints에 명시).
