# publish-quality 스킬 + 포트폴리오 quality 대시보드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 서비스 단위 코드 품질 스냅샷을 분석·게시하는 `publish-quality` 사용자 스킬과, 스냅샷들을 추세 그래프로 보여주는 포트폴리오 `quality` 대시보드를 만든다.

**Architecture:** 포트폴리오(velite 기반 Next.js SSG)에 `quality` 컬렉션을 배선하고, frontmatter의 구조화 메트릭을 클라이언트 대시보드 컴포넌트(자체 SVG 차트, 의존성 추가 없음)가 읽는다. 스킬은 번들 Node 스크립트(정량 메트릭)와 고정 루브릭(정성 판단)으로 분석한 뒤 기존 publish-* 게이트 절차로 mdx를 게시한다.

**Tech Stack:** Next.js 15 · React 19 · Tailwind 4 · velite 0.2 · vitest 2 · Node(ESM) 스크립트 · jscpd(npx)

**스펙:** `docs/superpowers/specs/2026-07-20-publish-quality-design.md` (같은 저장소)

## Global Constraints

- **커밋 게이트**: 사용자 메모리 규칙상 명시적 요청 없이 git add/commit 금지. 실행 세션 시작 시 "플랜에 명시된 커밋 스텝을 그대로 실행해도 되는지" 1회 확인받고, 허용 시에만 커밋 스텝 수행. `git push`는 어떤 경우에도 금지.
- **커밋 컨벤션**: portfolio repo는 `<카테고리>: 한글설명` (배선 작업은 `site:`, 스냅샷 게시는 `품질:`).
- **작업 디렉토리**: Task 1~8은 `C:/cowork/portfolio`, Task 9~10은 `C:\Users\JIHEE\.claude\skills\publish-quality\` (git 저장소 아님 — 커밋 스텝 없음), Task 11은 양쪽.
- **신규 npm 의존성 금지**: 차트는 자체 SVG. jscpd는 스킬 실행 시 npx로만 사용(포트폴리오 의존성 아님).
- **고정 기준값 (스펙 §2-1, §4)**: jscpd `--min-tokens 70 --min-lines 5` / 비대 클래스 300 LOC 초과 또는 메서드 15개 초과 / 산식 v1 `score = max(0, 100 − 5H − 2M − 0.5L − oversized − max(0, ceil(dupPct − 3)))`.
- **루브릭 카테고리 11개 (스펙 §2-2, 순서 고정)**: controller-thin, entity-encapsulation, http-semantics, logging-quality, exception-discipline, layer-separation, dead-code, duplication-semantic, diagnosability, integration-robustness, service-boundary.
- **차트 색상**: dataviz 기본 팔레트 — 시리즈 blue(light `#2a78d6` / dark `#3987e5`), 심각도는 status 팔레트 High=critical `#d03b3b`, Medium=serious `#ec835a`, Low=warning `#fab219`(모드 불변). 텍스트·그리드는 사이트 토큰/명시 hex. 범례+테이블 병행으로 색상 단독 의미 전달 금지.
- 테마 전환은 next-themes `attribute="class"` — 다크 오버라이드는 `.dark` 클래스 스코프.

---

## Part A — 포트폴리오 배선 (Task 1~8)

### Task 1: quality frontmatter 스키마

**Files:**
- Modify: `content/schemas.ts` (파일 끝에 추가)
- Test: `content/schemas.test.ts` (파일 끝에 추가)

**Interfaces:**
- Produces: `QUALITY_CATEGORIES: readonly string[]` (11개, 순서 고정), `qualityFrontmatterSchema` — Task 2(타입), Task 3(velite), Task 6(테이블 순서)이 사용.

- [ ] **Step 1: 실패하는 테스트 작성** — `content/schemas.test.ts` 끝에 추가:

```ts
import { qualityFrontmatterSchema, QUALITY_CATEGORIES } from './schemas'

const validQualityFrontmatter = () => ({
  title: 'product-service 품질 스냅샷 (2026-07-20)',
  date: '2026-07-20',
  scope: 'product-service',
  score: 78.5,
  formulaVersion: 1,
  metrics: {
    locTotal: 12345,
    files: 180,
    duplicationBlocks: 14,
    duplicationPct: 4.2,
    oversizedClasses: 3
  },
  findings: QUALITY_CATEGORIES.map((category) => ({ category, high: 0, medium: 1, low: 2 }))
})

describe('qualityFrontmatterSchema', () => {
  it('accepts a valid quality frontmatter with all 11 categories', () => {
    expect(qualityFrontmatterSchema.safeParse(validQualityFrontmatter()).success).toBe(true)
  })

  it('rejects when a category is missing (findings must cover all categories)', () => {
    const data = validQualityFrontmatter()
    data.findings = data.findings.slice(1)
    expect(qualityFrontmatterSchema.safeParse(data).success).toBe(false)
  })

  it('rejects an unknown category', () => {
    const data = validQualityFrontmatter()
    data.findings[0] = { category: 'not-a-category' as never, high: 0, medium: 0, low: 0 }
    expect(qualityFrontmatterSchema.safeParse(data).success).toBe(false)
  })

  it('rejects a score above 100', () => {
    const data = { ...validQualityFrontmatter(), score: 101 }
    expect(qualityFrontmatterSchema.safeParse(data).success).toBe(false)
  })

  it('rejects negative finding counts', () => {
    const data = validQualityFrontmatter()
    data.findings[0] = { category: QUALITY_CATEGORIES[0], high: -1, medium: 0, low: 0 }
    expect(qualityFrontmatterSchema.safeParse(data).success).toBe(false)
  })

  it('exposes exactly 11 fixed categories', () => {
    expect(QUALITY_CATEGORIES).toHaveLength(11)
    expect(QUALITY_CATEGORIES[0]).toBe('controller-thin')
    expect(QUALITY_CATEGORIES[10]).toBe('service-boundary')
  })
})
```

(기존 import 문에 `qualityFrontmatterSchema, QUALITY_CATEGORIES`를 추가하는 형태로 합쳐도 된다.)

- [ ] **Step 2: 실패 확인**

Run: `cd C:/cowork/portfolio && npm test`
Expected: FAIL — `qualityFrontmatterSchema` export 없음.

- [ ] **Step 3: 스키마 구현** — `content/schemas.ts` 끝에 추가:

```ts
const qualityCategoryEnum = s.enum([
  'controller-thin',
  'entity-encapsulation',
  'http-semantics',
  'logging-quality',
  'exception-discipline',
  'layer-separation',
  'dead-code',
  'duplication-semantic',
  'diagnosability',
  'integration-robustness',
  'service-boundary'
])

export const QUALITY_CATEGORIES = qualityCategoryEnum.options

export const qualityFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  scope: s.string(),
  score: s.number().min(0).max(100),
  formulaVersion: s.number().int().min(1),
  metrics: s.object({
    locTotal: s.number().int().min(0),
    files: s.number().int().min(0),
    duplicationBlocks: s.number().int().min(0),
    duplicationPct: s.number().min(0),
    oversizedClasses: s.number().int().min(0)
  }),
  findings: s
    .array(
      s.object({
        category: qualityCategoryEnum,
        high: s.number().int().min(0),
        medium: s.number().int().min(0),
        low: s.number().int().min(0)
      })
    )
    .length(11),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
})
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS (기존 테스트 포함 전부).

- [ ] **Step 5: 커밋**

```bash
git add content/schemas.ts content/schemas.test.ts
git commit -m "site: quality 스냅샷 frontmatter 스키마 추가 (11개 고정 카테고리)"
```

### Task 2: lib/content.ts 품질 헬퍼

**Files:**
- Modify: `lib/content.ts` (파일 끝에 추가)
- Test: `lib/content.test.ts` (파일 끝에 추가)

**Interfaces:**
- Consumes: 기존 `publishedOnly`, `sortByDateDesc`.
- Produces: `QualityEntry`, `QualityFinding`, `QualityMetrics` 타입, `qualityScopes(entries): string[]`, `qualityTrendForScope(entries, scope): QualityEntry[]`(published + scope 필터 + 날짜 **오름차순** — 차트용), `severityTotals(entry): { high; medium; low }` — Task 4·5·6이 사용.

- [ ] **Step 1: 실패하는 테스트 작성** — `lib/content.test.ts` 끝에 추가:

```ts
import { qualityScopes, qualityTrendForScope, severityTotals, type QualityEntry } from './content'

const qualityEntry = (overrides: Partial<QualityEntry>): QualityEntry => ({
  slug: 'prompthub/product-service-2026-07-20',
  project: 'prompthub',
  scope: 'product-service',
  title: '스냅샷',
  date: '2026-07-20',
  score: 80,
  formulaVersion: 1,
  metrics: { locTotal: 100, files: 10, duplicationBlocks: 0, duplicationPct: 0, oversizedClasses: 0 },
  findings: [
    { category: 'controller-thin', high: 1, medium: 2, low: 3 },
    { category: 'dead-code', high: 0, medium: 1, low: 0 }
  ],
  draft: false,
  content: '',
  ...overrides
})

describe('qualityScopes', () => {
  it('returns unique scopes sorted alphabetically', () => {
    const entries = [
      qualityEntry({ scope: 'user-service' }),
      qualityEntry({ scope: 'product-service' }),
      qualityEntry({ scope: 'product-service', date: '2026-07-01' })
    ]
    expect(qualityScopes(entries)).toEqual(['product-service', 'user-service'])
  })

  it('excludes drafts', () => {
    expect(qualityScopes([qualityEntry({ draft: true })])).toEqual([])
  })
})

describe('qualityTrendForScope', () => {
  it('filters by scope and sorts by date ascending', () => {
    const entries = [
      qualityEntry({ date: '2026-07-20', scope: 'product-service' }),
      qualityEntry({ date: '2026-07-01', scope: 'product-service' }),
      qualityEntry({ date: '2026-07-10', scope: 'user-service' })
    ]
    expect(qualityTrendForScope(entries, 'product-service').map((e) => e.date)).toEqual([
      '2026-07-01',
      '2026-07-20'
    ])
  })

  it('excludes drafts', () => {
    expect(qualityTrendForScope([qualityEntry({ draft: true })], 'product-service')).toEqual([])
  })
})

describe('severityTotals', () => {
  it('sums finding counts across categories', () => {
    expect(severityTotals(qualityEntry({}))).toEqual({ high: 1, medium: 3, low: 3 })
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL — export 없음.

- [ ] **Step 3: 구현** — `lib/content.ts` 끝에 추가:

```ts
export type QualityFinding = {
  category: string
  high: number
  medium: number
  low: number
}

export type QualityMetrics = {
  locTotal: number
  files: number
  duplicationBlocks: number
  duplicationPct: number
  oversizedClasses: number
}

export type QualityEntry = {
  slug: string
  project: string
  scope: string
  title: string
  date: string
  score: number
  formulaVersion: number
  metrics: QualityMetrics
  findings: QualityFinding[]
  summary?: string
  tags?: string[]
  draft: boolean
  content: string
}

export function qualityScopes(entries: QualityEntry[]): string[] {
  return [...new Set(publishedOnly(entries).map((entry) => entry.scope))].sort()
}

export function qualityTrendForScope(entries: QualityEntry[], scope: string): QualityEntry[] {
  return publishedOnly(entries)
    .filter((entry) => entry.scope === scope)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function severityTotals(entry: QualityEntry): { high: number; medium: number; low: number } {
  return entry.findings.reduce(
    (totals, finding) => ({
      high: totals.high + finding.high,
      medium: totals.medium + finding.medium,
      low: totals.low + finding.low
    }),
    { high: 0, medium: 0, low: 0 }
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: 커밋**

```bash
git add lib/content.ts lib/content.test.ts
git commit -m "site: quality 엔트리 타입·스코프/추세/심각도 헬퍼 추가"
```

### Task 3: velite 컬렉션 + 빌드 검증

**Files:**
- Modify: `velite.config.ts`
- (임시) Create→Delete: `content/prompthub/quality/product-service-2026-01-01.mdx` (fixture, 커밋 금지)

**Interfaces:**
- Consumes: Task 1의 `qualityFrontmatterSchema`.
- Produces: velite 컬렉션 `quality` — `#site/content`에서 `quality` 배열 export. 엔트리 shape은 Task 2의 `QualityEntry`와 일치 (project = 경로 1번째 세그먼트, slug = `{project}/{파일명}`).

- [ ] **Step 1: velite.config.ts 수정** — import에 `qualityFrontmatterSchema` 추가, `reviews` 컬렉션 아래에 추가, `collections`에 `quality` 등록:

```ts
const quality = defineCollection({
  name: 'Quality',
  pattern: '*/quality/*.mdx',
  schema: qualityFrontmatterSchema
    .extend({ path: s.path(), content: s.markdown() })
    .transform((data) => {
      const parts = data.path.split('/')
      const project = parts[0]
      const slug = [project, ...parts.slice(2)].join('/')
      return { ...data, project, slug }
    })
})
```

```ts
collections: { projects, troubleshootingPosts, studyPosts, decisions, reviews, quality, about, resume }
```

- [ ] **Step 2: fixture 생성** — `content/prompthub/quality/product-service-2026-01-01.mdx` (**임시 파일 — 이 태스크 안에서 삭제**):

```mdx
---
title: "product-service 품질 스냅샷 (fixture)"
date: "2026-01-01"
scope: "product-service"
score: 72.5
formulaVersion: 1
metrics:
  locTotal: 10000
  files: 150
  duplicationBlocks: 10
  duplicationPct: 4.5
  oversizedClasses: 2
findings:
  - { category: "controller-thin", high: 1, medium: 2, low: 1 }
  - { category: "entity-encapsulation", high: 0, medium: 3, low: 2 }
  - { category: "http-semantics", high: 0, medium: 1, low: 2 }
  - { category: "logging-quality", high: 0, medium: 2, low: 4 }
  - { category: "exception-discipline", high: 1, medium: 1, low: 0 }
  - { category: "layer-separation", high: 0, medium: 2, low: 0 }
  - { category: "dead-code", high: 0, medium: 1, low: 3 }
  - { category: "duplication-semantic", high: 0, medium: 2, low: 1 }
  - { category: "diagnosability", high: 1, medium: 0, low: 1 }
  - { category: "integration-robustness", high: 1, medium: 1, low: 0 }
  - { category: "service-boundary", high: 0, medium: 1, low: 0 }
summary: "빌드 검증용 fixture"
tags: ["code-quality"]
draft: false
---

## 범위

fixture 본문.
```

- [ ] **Step 3: 빌드로 컬렉션 검증**

Run: `npm run build`
Expected: 빌드 성공. 이어서 확인:

Run: `node -e "const q = require('./.velite/quality.json'); if (q.length !== 1 || q[0].scope !== 'product-service' || q[0].slug !== 'prompthub/product-service-2026-01-01' || q[0].findings.length !== 11) { throw new Error('unexpected: ' + JSON.stringify(q[0], null, 2).slice(0, 400)) } console.log('quality collection OK:', q[0].slug)"`
Expected: `quality collection OK: prompthub/product-service-2026-01-01`

- [ ] **Step 4: 스키마 위반 fixture로 거부 확인** — fixture의 `findings`에서 마지막 항목(`service-boundary`) 한 줄을 지우고:

Run: `npm run build`
Expected: FAIL — findings length 오류. 확인 후 **지운 줄을 복원**한다.

- [ ] **Step 5: fixture 삭제 후 커밋**

```bash
rm content/prompthub/quality/product-service-2026-01-01.mdx
npm run build   # 빈 컬렉션으로도 빌드 성공해야 함
git add velite.config.ts
git commit -m "site: velite quality 컬렉션 배선"
```

### Task 4: content-data 접근자

**Files:**
- Modify: `lib/content-data.ts`

**Interfaces:**
- Consumes: Task 2 헬퍼, Task 3 컬렉션(`quality` from `#site/content`).
- Produces: `getPublishedQuality(): QualityEntry[]`(날짜 내림차순), `getQualityScopes(): string[]`, `getQualityTrend(scope: string): QualityEntry[]`(오름차순), `getQualityBySlugPath(slugParts: string[]): QualityEntry | undefined` — Task 6·7이 사용.

- [ ] **Step 1: 구현** — `lib/content-data.ts`의 첫 import에 `quality`를, `./content` import에 `qualityScopes, qualityTrendForScope`를 추가하고, 파일 끝에:

```ts
export function getPublishedQuality() {
  return sortByDateDesc(publishedOnly(quality))
}

export function getQualityScopes() {
  return qualityScopes(quality)
}

export function getQualityTrend(scope: string) {
  return qualityTrendForScope(quality, scope)
}

export function getQualityBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(quality), slugParts)
}
```

(순수 로직은 Task 2에서 테스트됨 — 이 파일은 기존 패턴대로 얇은 위임 계층이라 별도 테스트 없음.)

- [ ] **Step 2: 타입 체크 겸 빌드**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: 커밋**

```bash
git add lib/content-data.ts
git commit -m "site: quality 콘텐츠 접근자 추가"
```

### Task 5: 차트 수학 헬퍼 + SVG 차트 컴포넌트

**Files:**
- Create: `lib/chart-math.ts`
- Test: `lib/chart-math.test.ts`
- Create: `components/quality-charts.tsx`
- Modify: `app/globals.css` (차트 색상 변수)

**Interfaces:**
- Produces: `scaleLinear(d0, d1, r0, r1): (v: number) => number`, `linePath(points: {x;y}[]): string`, `niceTicks(max: number, count?): number[]` (lib/chart-math.ts) · `ScoreTrendChart({ data: { date; score }[] })`, `SeverityTrendChart({ data: { date; high; medium; low }[] })`, `MetricSparkline({ data: { date; value }[], label, format? })` (components/quality-charts.tsx, 전부 client) — Task 6이 사용.

- [ ] **Step 1: 실패하는 테스트 작성** — `lib/chart-math.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { scaleLinear, linePath, niceTicks } from './chart-math'

describe('scaleLinear', () => {
  it('maps domain endpoints to range endpoints', () => {
    const scale = scaleLinear(0, 100, 0, 640)
    expect(scale(0)).toBe(0)
    expect(scale(100)).toBe(640)
    expect(scale(50)).toBe(320)
  })

  it('maps a degenerate domain to the range midpoint', () => {
    const scale = scaleLinear(5, 5, 0, 640)
    expect(scale(5)).toBe(320)
  })
})

describe('linePath', () => {
  it('builds an SVG path from points', () => {
    expect(linePath([{ x: 0, y: 10 }, { x: 20, y: 30 }])).toBe('M0,10 L20,30')
  })

  it('handles a single point', () => {
    expect(linePath([{ x: 5, y: 5 }])).toBe('M5,5')
  })

  it('returns empty string for no points', () => {
    expect(linePath([])).toBe('')
  })
})

describe('niceTicks', () => {
  it('returns rounded ticks from 0 covering max', () => {
    expect(niceTicks(23, 4)).toEqual([0, 10, 20, 30])
  })

  it('handles max 0 with a single step', () => {
    expect(niceTicks(0, 4)).toEqual([0, 1])
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL — 모듈 없음.

- [ ] **Step 3: 구현** — `lib/chart-math.ts`:

```ts
export type ChartPoint = { x: number; y: number }

export function scaleLinear(d0: number, d1: number, r0: number, r1: number): (v: number) => number {
  return (v: number) => {
    if (d1 === d0) return (r0 + r1) / 2
    return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)
  }
}

export function linePath(points: ChartPoint[]): string {
  if (points.length === 0) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
}

export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1]
  const rawStep = max / count
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const candidates = [1, 2, 5, 10].map((m) => m * magnitude)
  const step = candidates.find((c) => c >= rawStep) ?? candidates[candidates.length - 1]
  const ticks: number[] = []
  for (let t = 0; t <= max + step * 0.999; t += step) ticks.push(Math.round(t * 100) / 100)
  return ticks
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: 차트 색상 변수 추가** — `app/globals.css` 끝에 (dataviz 기본 팔레트, 사이트 카드 배경이 차트 표면):

```css
.viz-root {
  --viz-series: #2a78d6;
  --viz-sev-high: #d03b3b;
  --viz-sev-medium: #ec835a;
  --viz-sev-low: #fab219;
  --viz-grid: #e1e0d9;
  --viz-axis: #c3c2b7;
  --viz-delta-good: #006300;
  --viz-delta-bad: #d03b3b;
}

.dark .viz-root {
  --viz-series: #3987e5;
  --viz-grid: #2c2c2a;
  --viz-axis: #383835;
  --viz-delta-good: #0ca30c;
  --viz-delta-bad: #e66767;
}
```

- [ ] **Step 6: 팔레트 검증 실행** — dataviz 스킬(현재 세션에 로드된 base directory)의 `scripts/validate_palette.js`로, 사이트 실제 표면(light 카드 `#ffffff`, dark 카드는 `oklch(0.205 0.009 260)` — 브라우저 devtools 계산값으로 hex 확인, 근사 `#22242a`) 대상:

Run: `node <dataviz-base>/scripts/validate_palette.js "#2a78d6" --mode light --surface "#ffffff"`
Run: `node <dataviz-base>/scripts/validate_palette.js "#3987e5" --mode dark --surface "#22242a"`
Expected: PASS (단일 시리즈라 인접쌍 검사는 없음 — 대비 체크 목적). WARN이 나오면 규칙대로 직접 라벨/테이블 병행이 이미 설계에 있으므로 기록만 하고 진행. FAIL이면 시리즈 hex를 blue 램프의 인접 스텝(§sequential 표)으로 교체 후 재검증.

- [ ] **Step 7: 차트 컴포넌트 구현** — `components/quality-charts.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { linePath, niceTicks, scaleLinear } from '@/lib/chart-math'

const W = 640
const H = 220
const PAD = { top: 12, right: 16, bottom: 26, left: 36 }

function formatDate(date: string): string {
  return date.slice(5).replace('-', '/')
}

type Tooltip = { x: number; y: number; lines: string[] }

function TooltipBox({ tip }: { tip: Tooltip | null }) {
  if (!tip) return null
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-sm"
      style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }}
    >
      {tip.lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  )
}

export function ScoreTrendChart({ data }: { data: { date: string; score: number }[] }) {
  const [tip, setTip] = useState<Tooltip | null>(null)
  const x = scaleLinear(0, Math.max(data.length - 1, 1), PAD.left, W - PAD.right)
  const y = scaleLinear(0, 100, H - PAD.bottom, PAD.top)
  const points = data.map((d, i) => ({ x: x(i), y: y(d.score) }))

  return (
    <div className="viz-root relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="종합 점수 추세">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(tick)} y2={y(tick)} stroke="var(--viz-grid)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(tick) + 3} textAnchor="end" fontSize="10" fill="var(--color-muted-foreground)">
              {tick}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="var(--viz-axis)" strokeWidth="1" />
        <path d={linePath(points)} fill="none" stroke="var(--viz-series)" strokeWidth="2" />
        {points.map((p, i) => (
          <g key={data[i].date}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--viz-series)" />
            <circle
              cx={p.x}
              cy={p.y}
              r="12"
              fill="transparent"
              onMouseEnter={() => setTip({ x: p.x, y: p.y - 8, lines: [data[i].date, `점수 ${data[i].score}`] })}
              onMouseLeave={() => setTip(null)}
            />
            <text x={p.x} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted-foreground)">
              {formatDate(data[i].date)}
            </text>
          </g>
        ))}
      </svg>
      <TooltipBox tip={tip} />
    </div>
  )
}

const SEVERITIES = [
  { key: 'high', label: 'High', color: 'var(--viz-sev-high)' },
  { key: 'medium', label: 'Medium', color: 'var(--viz-sev-medium)' },
  { key: 'low', label: 'Low', color: 'var(--viz-sev-low)' }
] as const

export function SeverityTrendChart({ data }: { data: { date: string; high: number; medium: number; low: number }[] }) {
  const [tip, setTip] = useState<Tooltip | null>(null)
  const maxTotal = Math.max(...data.map((d) => d.high + d.medium + d.low), 0)
  const ticks = niceTicks(maxTotal)
  const tickMax = ticks[ticks.length - 1]
  const x = scaleLinear(0, Math.max(data.length - 1, 1), PAD.left + 24, W - PAD.right - 24)
  const y = scaleLinear(0, tickMax, H - PAD.bottom, PAD.top)
  const barWidth = Math.min(40, Math.max(12, (W - PAD.left - PAD.right) / Math.max(data.length, 1) - 16))

  return (
    <div className="viz-root relative">
      <div className="mb-1 flex items-center gap-4 text-xs text-muted-foreground">
        {SEVERITIES.map((sev) => (
          <span key={sev.key} className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-[2px]" style={{ background: sev.color }} />
            {sev.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="심각도별 발견 건수 추세">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(tick)} y2={y(tick)} stroke="var(--viz-grid)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(tick) + 3} textAnchor="end" fontSize="10" fill="var(--color-muted-foreground)">
              {tick}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="var(--viz-axis)" strokeWidth="1" />
        {data.map((d, i) => {
          const cx = x(i)
          let stackBase = 0
          return (
            <g key={d.date}>
              {SEVERITIES.map((sev) => {
                const value = d[sev.key]
                const yTop = y(stackBase + value)
                const yBottom = y(stackBase)
                stackBase += value
                if (value === 0) return null
                return (
                  <rect
                    key={sev.key}
                    x={cx - barWidth / 2}
                    y={yTop}
                    width={barWidth}
                    height={Math.max(yBottom - yTop - 2, 1)}
                    rx="2"
                    fill={sev.color}
                    onMouseEnter={() => setTip({ x: cx, y: yTop - 4, lines: [d.date, `${sev.label} ${value}건`] })}
                    onMouseLeave={() => setTip(null)}
                  />
                )
              })}
              <text x={cx} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted-foreground)">
                {formatDate(d.date)}
              </text>
            </g>
          )
        })}
      </svg>
      <TooltipBox tip={tip} />
    </div>
  )
}

const SPARK_W = 280
const SPARK_H = 72
const SPARK_PAD = { top: 8, right: 10, bottom: 8, left: 10 }

export function MetricSparkline({
  data,
  label,
  format = (v: number) => String(v)
}: {
  data: { date: string; value: number }[]
  label: string
  format?: (v: number) => string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const x = scaleLinear(0, Math.max(data.length - 1, 1), SPARK_PAD.left, SPARK_W - SPARK_PAD.right)
  const y = scaleLinear(0, max, SPARK_H - SPARK_PAD.bottom, SPARK_PAD.top)
  const points = data.map((d, i) => ({ x: x(i), y: y(d.value) }))
  const latest = data[data.length - 1]

  return (
    <div className="viz-root rounded-lg border border-border p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-sm font-semibold">{latest ? format(latest.value) : '-'}</span>
      </div>
      <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} className="mt-1 w-full" role="img" aria-label={label}>
        <path d={linePath(points)} fill="none" stroke="var(--viz-series)" strokeWidth="2" />
        {points.length > 0 ? <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="var(--viz-series)" /> : null}
      </svg>
    </div>
  )
}
```

- [ ] **Step 8: 타입 체크 겸 빌드**

Run: `npm run build`
Expected: PASS (컴포넌트는 아직 미사용 — Task 6에서 연결).

- [ ] **Step 9: 커밋**

```bash
git add lib/chart-math.ts lib/chart-math.test.ts components/quality-charts.tsx app/globals.css
git commit -m "site: quality 대시보드용 SVG 차트 컴포넌트·차트 수학 헬퍼 추가"
```

### Task 6: 대시보드 페이지 + 내비게이션

**Files:**
- Create: `components/quality-dashboard.tsx`
- Create: `app/quality/page.tsx`
- Modify: `components/site-nav.tsx:12-21` (navItems)

**Interfaces:**
- Consumes: Task 4 접근자, Task 5 차트, Task 1 `QUALITY_CATEGORIES`, Task 2 `severityTotals`·`QualityEntry`, 기존 `PageHeader`/`EmptyState`.
- Produces: `/quality` 라우트. `QualityDashboard({ scopes, trends })` — `trends: Record<string, QualityEntry[]>`(scope별 날짜 오름차순).

- [ ] **Step 1: 대시보드 클라이언트 컴포넌트** — `components/quality-dashboard.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QUALITY_CATEGORIES } from '@/content/schemas'
import { severityTotals, type QualityEntry } from '@/lib/content'
import { ScoreTrendChart, SeverityTrendChart, MetricSparkline } from '@/components/quality-charts'
import { cn } from '@/lib/utils'

function Delta({ diff, downIsGood = true }: { diff: number; downIsGood?: boolean }) {
  if (diff === 0) return <span className="text-muted-foreground">—</span>
  const good = downIsGood ? diff < 0 : diff > 0
  return (
    <span className="viz-root font-mono text-xs" style={{ color: good ? 'var(--viz-delta-good)' : 'var(--viz-delta-bad)' }}>
      {diff > 0 ? '▲' : '▼'} {Math.abs(diff)}
    </span>
  )
}

export function QualityDashboard({ scopes, trends }: { scopes: string[]; trends: Record<string, QualityEntry[]> }) {
  const [scope, setScope] = useState(scopes[0])
  const trend = trends[scope] ?? []
  const latest = trend[trend.length - 1]
  const previous = trend[trend.length - 2]
  const mixedFormula = new Set(trend.map((e) => e.formulaVersion)).size > 1

  if (!latest) return null

  const findingsByCategory = new Map(latest.findings.map((f) => [f.category, f]))
  const prevByCategory = new Map((previous?.findings ?? []).map((f) => [f.category, f]))

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2">
        {scopes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScope(s)}
            className={cn(
              'rounded-md border border-border px-3 py-1.5 font-mono text-xs transition-colors',
              s === scope ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground">종합 점수 (100점 만점)</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-semibold">{latest.score}</span>
            {previous ? <Delta diff={Math.round((latest.score - previous.score) * 10) / 10} downIsGood={false} /> : null}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {latest.date} · 산식 v{latest.formulaVersion}
            {mixedFormula ? ' · 이 스코프에 산식 버전이 다른 스냅샷이 섞여 있어 추세 비교에 주의' : ''}
          </div>
        </div>
        <MetricSparkline
          label="중복률 (%)"
          data={trend.map((e) => ({ date: e.date, value: e.metrics.duplicationPct }))}
          format={(v) => `${v}%`}
        />
        <MetricSparkline
          label="비대 클래스 수"
          data={trend.map((e) => ({ date: e.date, value: e.metrics.oversizedClasses }))}
        />
      </div>

      <section>
        <h2 className="mb-2 font-mono text-sm font-semibold">종합 점수 추세</h2>
        <ScoreTrendChart data={trend.map((e) => ({ date: e.date, score: e.score }))} />
      </section>

      <section>
        <h2 className="mb-2 font-mono text-sm font-semibold">심각도별 발견 건수</h2>
        <SeverityTrendChart data={trend.map((e) => ({ date: e.date, ...severityTotals(e) }))} />
      </section>

      <section>
        <h2 className="mb-2 font-mono text-sm font-semibold">카테고리별 최신 현황</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">카테고리</th>
                <th className="px-3 py-2 text-right font-medium">High</th>
                <th className="px-3 py-2 text-right font-medium">Medium</th>
                <th className="px-3 py-2 text-right font-medium">Low</th>
                <th className="px-3 py-2 text-right font-medium">Δ 전회</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs [font-variant-numeric:tabular-nums]">
              {QUALITY_CATEGORIES.map((category) => {
                const current = findingsByCategory.get(category) ?? { high: 0, medium: 0, low: 0 }
                const prev = prevByCategory.get(category)
                const total = current.high + current.medium + current.low
                const prevTotal = prev ? prev.high + prev.medium + prev.low : null
                return (
                  <tr key={category} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">{category}</td>
                    <td className="px-3 py-2 text-right">{current.high}</td>
                    <td className="px-3 py-2 text-right">{current.medium}</td>
                    <td className="px-3 py-2 text-right">{current.low}</td>
                    <td className="px-3 py-2 text-right">
                      {prevTotal === null ? <span className="text-muted-foreground">—</span> : <Delta diff={total - prevTotal} />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div>
        <Link href={`/quality/${latest.slug}`} className="font-mono text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          최신 스냅샷 상세 보기 →
        </Link>
      </div>
    </div>
  )
}
```

주의: `@/content/schemas` import가 tsconfig paths로 해석되는지 확인 — 안 되면 `../content/schemas` 상대 경로 사용.

- [ ] **Step 2: 서버 페이지** — `app/quality/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { QualityDashboard } from '@/components/quality-dashboard'
import { getQualityScopes, getQualityTrend } from '@/lib/content-data'
import type { QualityEntry } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Quality',
  description: '서비스별 코드 품질 스냅샷과 추세 대시보드입니다.'
}

export default function QualityPage() {
  const scopes = getQualityScopes()
  const trends: Record<string, QualityEntry[]> = {}
  for (const scope of scopes) {
    trends[scope] = getQualityTrend(scope).map((entry) => ({ ...entry, content: '' }))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Code Quality"
        title="Quality"
        description="같은 잣대(고정 루브릭·고정 산식)로 반복 측정한 서비스별 품질 스냅샷입니다. 점수와 카테고리별 발견 건수의 추세를 보여줍니다."
        count={scopes.length}
      />
      {scopes.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 품질 스냅샷이 없습니다." />
        </div>
      ) : (
        <QualityDashboard scopes={scopes} trends={trends} />
      )}
    </div>
  )
}
```

(`content: ''`로 본문을 비워 클라이언트로 안 보냄 — 대시보드는 frontmatter 데이터만 쓴다.)

- [ ] **Step 3: 내비게이션 추가** — `components/site-nav.tsx`의 `navItems`에서 `Reviews` 다음에:

```ts
  { href: '/quality', label: 'Quality' },
```

- [ ] **Step 4: 빌드 확인**

Run: `npm run build`
Expected: PASS — `/quality` 라우트 생성, 스냅샷 0개라 EmptyState 렌더.

- [ ] **Step 5: 커밋**

```bash
git add components/quality-dashboard.tsx app/quality/page.tsx components/site-nav.tsx
git commit -m "site: quality 대시보드 페이지·내비게이션 추가"
```

### Task 7: 스냅샷 상세 페이지

**Files:**
- Create: `app/quality/[...slug]/page.tsx`

**Interfaces:**
- Consumes: Task 4의 `getPublishedQuality`, `getQualityBySlugPath`, 기존 `PostArticle`, `getProjectTitle`.

- [ ] **Step 1: 구현** — `app/quality/[...slug]/page.tsx` (reviews 상세 페이지와 동일 패턴):

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import { getPublishedQuality, getQualityBySlugPath, getProjectTitle } from '@/lib/content-data'

export function generateStaticParams() {
  return getPublishedQuality().map((entry) => ({ slug: entry.slug.split('/') }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getQualityBySlugPath(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary ?? post.title
  }
}

export default async function QualityDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const post = getQualityBySlugPath(slug)
  if (!post) notFound()

  return (
    <PostArticle
      backHref="/quality"
      backLabel="Quality"
      title={post.title}
      date={post.date}
      content={post.content}
      tags={post.tags}
      badges={[
        { label: getProjectTitle(post.project), kind: 'project' },
        { label: `${post.scope} · ${post.score}점`, kind: 'project' }
      ]}
    />
  )
}
```

주의: `PostArticle`/`badges`의 실제 prop 시그니처는 `components/post-article.tsx`를 열어 확인하고 맞춘다(`kind` 허용값 포함). reviews 상세와 동일하게 동작하면 된다.

- [ ] **Step 2: 빌드 확인**

Run: `npm run build`
Expected: PASS (스냅샷 0개 — 상세 페이지는 params 없이 스킵됨).

- [ ] **Step 3: 커밋**

```bash
git add "app/quality/[...slug]/page.tsx"
git commit -m "site: quality 스냅샷 상세 페이지 추가"
```

### Task 8: fixture 2개로 대시보드 시각 검증

**Files:**
- (임시) Create→Delete: `content/prompthub/quality/product-service-2026-01-01.mdx`, `content/prompthub/quality/product-service-2026-01-15.mdx` (커밋 금지)

- [ ] **Step 1: fixture 2개 생성** — Task 3 Step 2의 fixture를 그대로 재생성하고, 두 번째 파일은 같은 내용에서 `title` 날짜 표기·`date: "2026-01-15"`·`score: 84.0`·`duplicationPct: 3.1`·`oversizedClasses: 1`로, findings의 `controller-thin`을 `{ high: 0, medium: 1, low: 1 }`로, `exception-discipline`을 `{ high: 0, medium: 1, low: 0 }`으로 바꿔 "개선된" 스냅샷을 만든다.

- [ ] **Step 2: dev 서버로 시각 확인**

Run: `npm run dev` (port 4000)
확인 항목 (light/dark 모두 — `d` 키로 토글):
- `/quality`: scope 버튼(product-service), 점수 스탯 타일 72.5→84 (▲ 11.5, 초록), 점수 추세선 2점, 심각도 스택 바 2개(범례 High/Medium/Low), 카테고리 테이블 11행 + Δ(controller-thin ▼2 초록), 스파크라인 2개
- 점 hover 시 툴팁, 바 hover 시 툴팁
- `/quality/prompthub/product-service-2026-01-15` 상세 렌더
- 내비게이션 Quality 활성 표시
- 라벨 겹침·오버플로 없는지 (dataviz 절차 7: 렌더해서 직접 본다)

- [ ] **Step 3: 문제 수정** — 겹침/색상/레이아웃 문제가 보이면 이 자리에서 고치고 다시 확인한다.

- [ ] **Step 4: fixture 삭제 + 빌드 재확인 + 수정분 커밋**

```bash
rm content/prompthub/quality/product-service-2026-01-01.mdx content/prompthub/quality/product-service-2026-01-15.mdx
npm run build
git add -u
git commit -m "site: quality 대시보드 시각 검증 후 마감 수정"   # 수정이 있었던 경우에만
```

---

## Part B — publish-quality 스킬 (Task 9~10)

작업 디렉토리: `C:\Users\JIHEE\.claude\skills\publish-quality\` (git 아님 — 커밋 스텝 없음).

### Task 9: 정량 메트릭 스캔 스크립트

**Files:**
- Create: `C:\Users\JIHEE\.claude\skills\publish-quality\scripts\scan-metrics.mjs`

**Interfaces:**
- Produces: CLI `node scan-metrics.mjs <service-dir>` → stdout에 JSON `{ locTotal, files, duplicationBlocks, duplicationPct, oversizedClasses, oversized: [{ file, loc, methods }] }`. 실패 시 exit 1 + stderr 원인 (부분 결과 금지 — 스펙 §2-1). SKILL.md(Task 10)가 이 계약을 사용.

- [ ] **Step 1: 스크립트 작성**:

```js
#!/usr/bin/env node
// publish-quality 정량 메트릭 스캔 (v1 고정 기준 — 값 변경 시 SKILL.md의 formulaVersion도 올릴 것)
// 사용법: node scan-metrics.mjs <service-dir>
// 대상: <service-dir>/src/main/java 의 *.java (테스트 제외)
// 실패 시 exit 1 — 부분 결과로 진행하지 않는다 (회차 간 비교성 보호).
import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const OVERSIZE_LOC = 300
const OVERSIZE_METHODS = 15
const JSCPD_MIN_TOKENS = 70
const JSCPD_MIN_LINES = 5

function fail(message) {
  console.error(`[scan-metrics] ${message}`)
  process.exit(1)
}

function listJavaFiles(dir) {
  const result = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...listJavaFiles(full))
    else if (entry.name.endsWith('.java')) result.push(full)
  }
  return result
}

// 블록/라인 주석 제거 (문자열 리터럴 안의 주석 기호는 오탐 가능 — 고정 휴리스틱)
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

function countLoc(strippedSource) {
  return strippedSource.split('\n').filter((line) => line.trim().length > 0).length
}

const CONTROL_KEYWORDS = /^\s*(if|for|while|switch|catch|do|else|try|return|new|synchronized\s*\()/

// 메서드/생성자 선언 휴리스틱: 수식어* [제네릭] 반환타입? 이름( ... ) [throws ...] {
const METHOD_RE = /^\s*(?:(?:public|protected|private|static|final|abstract|synchronized|native|default)\s+)*(?:<[^>]+>\s+)?[\w<>[\],.?\s]*?\b\w+\s*\([^;{)]*\)\s*(?:throws\s+[\w.,\s]+)?\s*\{/

function countMethods(strippedSource) {
  return strippedSource
    .split('\n')
    .filter((line) => !CONTROL_KEYWORDS.test(line) && METHOD_RE.test(line)).length
}

function runJscpd(srcDir) {
  const outDir = mkdtempSync(join(tmpdir(), 'jscpd-'))
  try {
    execSync(
      `npx --yes jscpd "${srcDir}" --min-tokens ${JSCPD_MIN_TOKENS} --min-lines ${JSCPD_MIN_LINES} --reporters json --output "${outDir}" --silent`,
      { stdio: ['ignore', 'ignore', 'pipe'] }
    )
    const report = JSON.parse(readFileSync(join(outDir, 'jscpd-report.json'), 'utf8'))
    const total = report.statistics?.total
    if (!total || typeof total.percentage !== 'number') fail('jscpd 리포트 형식이 예상과 다릅니다')
    return {
      duplicationBlocks: total.clones ?? 0,
      duplicationPct: Math.round(total.percentage * 100) / 100
    }
  } catch (error) {
    fail(`jscpd 실행 실패 — 메트릭 없이 진행 금지: ${error.message}`)
  } finally {
    rmSync(outDir, { recursive: true, force: true })
  }
}

const serviceDir = process.argv[2]
if (!serviceDir) fail('사용법: node scan-metrics.mjs <service-dir>')
const srcDir = join(serviceDir, 'src', 'main', 'java')
if (!existsSync(srcDir)) fail(`src/main/java 없음: ${srcDir}`)

const files = listJavaFiles(srcDir)
if (files.length === 0) fail(`.java 파일이 없습니다: ${srcDir}`)

let locTotal = 0
const oversized = []
for (const file of files) {
  const stripped = stripComments(readFileSync(file, 'utf8'))
  const loc = countLoc(stripped)
  const methods = countMethods(stripped)
  locTotal += loc
  if (loc > OVERSIZE_LOC || methods > OVERSIZE_METHODS) {
    oversized.push({ file: file.replaceAll('\\', '/').split('/src/main/java/')[1] ?? file, loc, methods })
  }
}

const dup = runJscpd(srcDir)

console.log(
  JSON.stringify(
    {
      locTotal,
      files: files.length,
      duplicationBlocks: dup.duplicationBlocks,
      duplicationPct: dup.duplicationPct,
      oversizedClasses: oversized.length,
      oversized
    },
    null,
    2
  )
)
```

- [ ] **Step 2: 픽스처로 검증** — 스크래치패드에 픽스처 서비스 생성 후 실행:

```bash
FIX="$CLAUDE_SCRATCHPAD/quality-fixture"   # 스크래치패드 경로 사용
mkdir -p "$FIX/src/main/java/com/example"
```

`Big.java`: `class Big {` + `public void m1() { ... }` 형태 메서드 16개(각 3줄) — 메서드 15개 초과로 oversized 판정 확인용. `DupA.java` / `DupB.java`: 동일한 20줄짜리 메서드 본문(식별자 길게, 예: `orderRepository.findByCustomerIdAndStatusAndCreatedAtBetween(...)` 반복)을 서로 복사 — jscpd 탐지 확인용. 파일은 Write 도구로 생성한다.

Run: `node "C:\Users\JIHEE\.claude\skills\publish-quality\scripts\scan-metrics.mjs" "$FIX"`
Expected: JSON 출력 — `files: 3`, `oversizedClasses: 1`(Big.java, methods 16), `duplicationBlocks >= 1`, `duplicationPct > 0`, `locTotal > 0`.

- [ ] **Step 3: 실패 경로 검증**

Run: `node .../scan-metrics.mjs "$FIX/없는경로"`
Expected: exit 1 + `src/main/java 없음` stderr.

- [ ] **Step 4: 실제 서비스로 스모크 테스트**

Run: `node .../scan-metrics.mjs "C:/programmers_prj/beadv6_6_3JMT_BE/product-service"`
Expected: JSON 정상 출력 (수치는 실제값 — 눈으로 타당성만 확인: locTotal 수천~수만, files 수십~수백).

- [ ] **Step 5: 픽스처 삭제**

```bash
rm -rf "$FIX"
```

### Task 10: SKILL.md 작성

**Files:**
- Create: `C:\Users\JIHEE\.claude\skills\publish-quality\SKILL.md`

**Interfaces:**
- Consumes: Task 9 스크립트 계약, Part A 배선(경로·frontmatter 스키마).

- [ ] **Step 1: SKILL.md 작성** — 아래 전문 그대로 (스펙 §1~§5·§7·§8을 스킬 절차로 옮긴 것):

````markdown
---
name: publish-quality
description: 어떤 프로젝트에서 작업하든, 서비스 단위 코드 품질 스냅샷(리팩토링 대상 점검)을 사용자가 명시적으로 요청했을 때 동작한다. 번들 스크립트(중복·비대 클래스·LOC)와 고정 루브릭 11개 카테고리(컨트롤러 위임, 엔티티 캡슐화, HTTP 의미, 로그, 예외, 레이어 분리, 미사용 코드, 의미론적 중복, 진단성, 서비스 간 통신 견고성, 서비스 경계)로 분석하고, 고정 산식 점수와 함께 포트폴리오(C:/cowork/portfolio)의 content/{project}/quality/에 날짜별 mdx 스냅샷으로 게시해 대시보드 추세 그래프에 쌓는다. "품질 점검", "품질 스냅샷", "리팩토링 대상 찾아줘" 같은 요청에 사용한다. 자동으로 트리거되지 않으며, 승인·민감정보 게이트를 반드시 거친다. 분석 중 설계 의문 지점은 질문하고 기록 가치가 있으면 publish-decision으로 연계한다.
---

# Publish Quality Skill

서비스 단위 코드 품질 스냅샷을 **같은 잣대로 반복 측정**해 포트폴리오 대시보드에 추세로
쌓는다. "품질 점검해줘", "품질 스냅샷 올려줘", "리팩토링 대상 찾아줘" 같은 **명시적** 요청에만
동작한다. 점검만 원하면 5단계(승인)에서 게시를 건너뛰고 결과 보고로 끝낸다.

산문 리뷰·리스크 레지스터가 목적이면 이 스킬이 아니다. 애매하면 사용자에게 확인한다.

## 선행 조건

포트폴리오에 `quality` 타입이 배선돼 있어야 한다(velite 컬렉션 `quality`,
`qualityFrontmatterSchema`, `app/quality/` 라우트). 없으면 사용자에게 알리고 중단한다 —
이 스킬은 포트폴리오 코드를 절대 수정하지 않는다.

## 1. 스코프 선택

분석할 서비스 하나를 사용자에게 확인한다(예: product-service). 사용자가 이미 지정했으면
그대로 쓴다. 이 값이 frontmatter `scope`이자 대시보드 추세선의 그룹 키다 — 같은 서비스는
항상 같은 slug로 쓴다.

## 2. 정량 메트릭 (스크립트 — 기준 고정)

```bash
node "C:\Users\JIHEE\.claude\skills\publish-quality\scripts\scan-metrics.mjs" "<서비스 디렉토리 절대경로>"
```

- 출력 JSON의 `locTotal, files, duplicationBlocks, duplicationPct, oversizedClasses`를
  frontmatter `metrics`에 그대로 쓴다. `oversized` 목록은 본문 발견 정리에 참고한다.
- **스크립트가 실패(exit 1)하면 여기서 중단하고 원인을 보고한다.** 일부 메트릭만으로
  진행하면 회차 간 비교가 깨진다. 기준값(jscpd min-tokens 70/min-lines 5, 비대 기준
  300 LOC 또는 메서드 15개)은 스크립트에 고정돼 있다 — 실행 시 바꾸지 않는다.

## 3. 루브릭 분석 (Claude — 11개 카테고리 고정)

서비스의 `src/main/java` 코드를 실제로 읽고, 카테고리별 위반을
`심각도 / 파일:라인 / 근거 / 권장 수정 방향`으로 기록한다. **11개 전부** 건수를 산출한다
(위반 없으면 0 — 추세 비교를 위해 누락 금지).

| 카테고리 | 판정 내용 |
|---|---|
| `controller-thin` | 컨트롤러에는 호출·위임 로직만. 비즈니스 로직 혼입 금지 |
| `entity-encapsulation` | 엔티티는 setter 반복이 아닌 자기 상태 관리. 단, 과도한 로직 집중도 위반 |
| `http-semantics` | HTTP 상태코드를 의미에 맞게 반환 |
| `logging-quality` | 원인 추적에 도움 되는 좋은 로그 (필요한 곳에 있고, 무의미한 남발 없음) |
| `exception-discipline` | try-catch는 실제 예외가 날 만한 곳에만. 무분별한 감싸기 금지 |
| `layer-separation` | 외부 기술(인프라 클라이언트·SDK)을 비즈니스 서비스에 직접 혼입 금지 |
| `dead-code` | 실질적 미사용 코드. 미사용 외부 연동 코드 포함(안 쓰는 클라이언트·죽은 토픽 컨슈머·설정 잔재) |
| `duplication-semantic` | jscpd가 못 잡는 의미론적 중복 로직 |
| `diagnosability` | 예외 삼킴·모호한 에러 메시지 등 원인 추적 방해 요소 |
| `integration-robustness` | 서비스 간 통신(gRPC·Kafka·REST)의 실패 처리 — 타임아웃 없는 원격 호출, 실패 무시, 컨슈머 예외 삼킴, 응답 무검증 |
| `service-boundary` | 경계 위반 — 다른 서비스 DB/스키마 직접 접근, 타 도메인 로직 중복 구현, 순환 호출 유발, 이벤트가 자연스러운 곳의 동기 호출 체인 |

**심각도 (고정)** — High: 동작·운영 실제 리스크(예외 삼킴으로 원인 소실, 원격 호출 실패
무시로 데이터 불일치, 타 서비스 DB 직접 조작) / Medium: 유지보수성 명백히 저해(setter 남발,
서비스에 SDK 직접 사용, 타임아웃 미설정, 도메인 로직 중복) / Low: 사소한 개선 여지(로그 레벨
부적절, 불필요한 try 하나, 장황한 연동 코드).

**판정 원칙**:
- 테스트 커버리지 부족 자체를 위반으로 지적하지 않는다 (억지 테스트 금지 원칙).
- 실제 파일:라인을 확인한 것만 기록한다. 추측 금지.
- 통신·경계 판정은 이 서비스 쪽 코드만 대상 (상대 서비스는 검사 안 함 — 본문 "한계"에 명시).
- 루브릭·심각도 기준을 실행 시 임의로 바꾸지 않는다.

## 4. 점수 계산 (산식 v1 고정)

```
score = max(0, 100 − 5×High − 2×Medium − 0.5×Low
              − oversizedClasses − max(0, ceil(duplicationPct − 3)))
```

소수 첫째 자리까지. frontmatter에 `formulaVersion: 1`. 산식·스크립트 기준을 바꾸면
버전을 올린다(임의 변경 금지 — 사용자와 합의 후).

## 5. 결과 제시 + 설계 질문

1. 초안 전체(frontmatter + 본문)를 사용자에게 보여준다. 이전 스냅샷이 있으면 점수 변화와
   해소된 위반을 "개선된 항목"에 정리한다(같은 프로젝트의 troubleshooting/decision으로
   해결·결정된 건은 링크 — 같은 {project} 글만, 명백한 매칭만, 애매하면 확인).
2. **설계 질문**: 분석 중 "보통 X 패턴을 쓰는데 여긴 다르다" 싶었던 지점을 하나씩 질문한다.
   실제로 더 나은 대안이 알려진 지점만 — 트집·취향 질문 금지. 답이 기록할 가치가 있는
   결정이면 publish-decision 스킬로 게시를 제안한다. 문답 결과는 **점수에 반영하지 않는다**
   — 의도된 결정으로 확인된 발견도 점수에서 빼지 않고, 해당 발견에 "의도된 결정 → decision
   링크"만 단다. 질문에 답하지 않아도 게시는 진행 가능.
3. 수정 요청을 반영해 승인받는다. 승인 전에는 어떤 파일도 쓰지 않는다.
   **점검만 원하면 여기서 종료** (결과 보고만).

### mdx 형식

- 경로: `C:/cowork/portfolio/content/{project}/quality/{scope}-{YYYY-MM-DD}.mdx`
  ({project}는 content/ 아래 기존 폴더에서 확인, 없으면 사용자에게. 같은 경로가 이미 있으면
  자동 덮어쓰기 금지 — 사용자 확인 후 구분자 추가)
- `date`: 게시 시점의 **실제 오늘 날짜** (추측·과거 날짜 금지)
- frontmatter: `title`(한글) · `date` · `scope` · `score` · `formulaVersion` ·
  `metrics{locTotal, files, duplicationBlocks, duplicationPct, oversizedClasses}` ·
  `findings`(11개 카테고리 전부 `{category, high, medium, low}`) · `summary` · `tags` · `draft`
- 본문 (고정 템플릿):

```
## 범위
어느 서비스, 어느 커밋/브랜치 기준, 무엇을 봤는지.

## 요약
총평 한 단락. 이전 스냅샷이 있으면 점수 변화 언급.

## 카테고리별 발견
카테고리마다 위반 목록 (심각도 · 파일:라인 · 근거 · 권장 수정 방향).
의도된 결정으로 확인된 발견은 decision 링크 표기.

## 개선된 항목
이전 스냅샷 대비 해소된 위반 (troubleshooting/decision 링크 포함).

## 한계
안 본 것 명시. 정적 스냅샷·서비스 단위 한계(상대 서비스 미검사) 명시.
```

## 6. 민감정보 확인 게이트 — 필수, 생략 불가

승인과 **별개 단계**. 체크리스트로 제시: 회사/조직 실명 · 내부 도메인/URL ·
자격증명/키/토큰 · 팀원 실명 · 고객사/미공개 사업 정보 — 다섯 항목은 사용자가 **명시적으로
"없음"**이라고 답해야 통과. **미조치 보안 취약점 상세**는 일반화하거나 제외하거나
`draft: true`로 남긴다. 게이트 통과 전에는 파일을 쓰지 않는다.

## 7. 파일 작성 → 빌드 → 커밋

```bash
cd C:/cowork/portfolio
npm run build
```

- 실패 → mdx는 워킹트리에 두고(커밋 금지) 에러를 보여주고 수정 후 재시도.
- 성공 → 커밋 (형식: `품질: {scope} 품질 스냅샷 추가`). **push 금지.**

```bash
git add content/{project}/quality/{scope}-{date}.mdx
git commit -m "품질: {scope} 품질 스냅샷 추가"
```

## 8. 결과 보고

파일 경로 · 커밋 해시 · 점수(이전 대비 변화) · 연계한 decision 링크 · 다음 단계 안내
("`npm run dev` 후 /quality 대시보드에서 확인 가능", "push는 직접").

## 금지 사항

- 명시적 요청 없이 트리거 금지. 승인·민감정보 게이트 생략 금지.
- 스크립트 실패 시 부분 메트릭으로 진행 금지. 루브릭·산식·기준값 임의 변경 금지.
- findings 11개 카테고리 누락 금지 (0도 기록).
- 문답으로 확인된 "의도된 결정"을 점수에서 빼지 않는다 — 링크만 단다.
- 포트폴리오 코드 수정 금지, push 금지, 분석 대상 레포 코드 수정 금지(리팩토링 실행은 별도 요청).
- 리뷰를 지어내지 않는다 — 실제 읽은 코드의 발견만 기록한다.
````

- [ ] **Step 2: 스킬 인식 확인** — 새 Claude Code 세션(또는 `claude -p`)에서 스킬 목록에 `publish-quality`가 보이는지, 트리거 문구("product-service 품질 점검해줘")로 스킬이 선택되는지 확인한다:

Run: `claude -p "사용 가능한 스킬 중 publish-quality가 있는지, 어떤 설명인지 알려줘" --max-turns 1`
Expected: publish-quality가 목록에 있고 설명이 출력됨.

---

## Part C — 엔드투엔드 검증 (Task 11)

### Task 11: product-service 첫 실제 스냅샷

**Files:**
- Create: `C:/cowork/portfolio/content/prompthub/quality/product-service-{오늘날짜}.mdx` (스킬 절차로 생성)

- [ ] **Step 1: 스킬 실제 실행** — 사용자와 함께 publish-quality 스킬을 product-service 대상으로 실행한다 (스코프 확인 → 스크립트 → 루브릭 분석 → 설계 질문 → 승인 → 민감정보 게이트 → 게시·커밋 `품질: product-service 품질 스냅샷 추가`). 인터랙티브 절차이므로 서브에이전트가 아닌 **메인 세션에서** 진행한다.

- [ ] **Step 2: 대시보드 확인**

Run: `cd C:/cowork/portfolio && npm run dev`
Expected: `/quality`에 product-service 스코프, 스탯 타일·점 1개 추세·심각도 바 1개·카테고리 테이블 11행 렌더. 상세 페이지 본문 렌더.

- [ ] **Step 3: 마무리 보고** — 파일 경로·커밋 해시·점수·대시보드 확인 결과를 사용자에게 보고. 이후 리팩토링 → 재스냅샷을 반복하면 추세선이 쌓인다는 안내. (선택) skill-creator의 description 최적화 루프는 스킬을 몇 번 실제 사용해본 뒤 별도 요청으로.

---

## Self-Review 결과

- **스펙 커버리지**: §1 흐름→T10, §2-1 스크립트→T9, §2-2 루브릭→T10, §3 설계 질문→T10 §5, §4 산식→T10 §4, §5 스키마→T1·T3, §6 배선→T4~T7, §7 게이트→T10 §5~§7, §8 에러 처리→T9(실패 exit 1)·T10(선행 조건·slug 충돌), §9 순서→Part A→B→C. 대시보드 "산식 버전 다름 주석"(스펙 §4)→T6 `mixedFormula`. 누락 없음.
- **플레이스홀더**: 코드 스텝 전부 전문 포함. T7의 PostArticle prop 확인, T6의 import 경로 확인은 "열어서 맞춘다"로 명시된 검증 행위이지 미정 사항 아님.
- **타입 일관성**: `QualityEntry`(T2) ↔ velite transform(T3) ↔ 접근자(T4) ↔ 대시보드 props(T6) 필드 일치 확인. `severityTotals` 명칭 T2/T6 일치. `QUALITY_CATEGORIES` T1/T6/T10 일치 (11개, 같은 순서).
