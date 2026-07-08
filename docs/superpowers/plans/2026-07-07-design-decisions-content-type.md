# Design Decisions Content Type Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 4th content type, "Design Decisions" (ADR-style design decision records), to the portfolio site alongside project/troubleshooting/study, plus a `publish-decision` skill to publish them.

**Architecture:** Mirror the existing `troubleshootingPosts` collection exactly — same `{project}/{type}/{category}/{slug}.mdx` path shape, same Velite path-transform logic, same data-layer/page-layer split (`lib/content.ts` pure functions → `lib/content-data.ts` Velite-aware wrappers → App Router pages) — because decisions and troubleshooting share identical structural needs (project + category grouping, draft filtering, slug-path lookup). The only new concept is `status`/`supersededBy` for tracking when a decision replaces an earlier one, which is additive (an optional banner + badge), not a structural change.

**Tech Stack:** Next.js 15 (App Router), Velite content pipeline, Vitest, Tailwind CSS v4, lucide-react icons.

## Global Constraints

- Content path: `content/{project}/decisions/{category}/{slug}.mdx`, matched by Velite pattern `*/decisions/**/*.mdx` (identical shape to `troubleshootingPosts`).
- `decisionFrontmatterSchema` fields: `title: string`, `date: string`, `status: 'accepted' | 'superseded'` (default `'accepted'`), `supersededBy?: string` (full slug, e.g. `career-link/general/share-link-verify-with-redis-cache`), `summary?: string`, `tags?: string[]`, `draft: boolean` (default `false`).
- Body template (skill-enforced, not schema-validated): `## 배경` / `## 고려한 선택지` / `## 결정` / `## 결과`.
- `status: 'superseded'` is independent of `draft` — superseded (non-draft) decisions still appear in listings/sitemap. Never hide them.
- Navigation becomes 7 items in this exact order: `Home / Projects / Troubleshooting / Study / Decisions / About / Resume`.
- Single-service projects (e.g. `career-link`) use category folder `general` (matches the existing `troubleshooting` convention of not inventing a "no category" special case).
- `publish-decision` skill file location: `C:/Users/JIHEE/.claude/skills/publish-decision/SKILL.md`, following the exact structural pattern of `publish-study`/`publish-troubleshooting` (explicit trigger only, draft → approval → sensitive-info gate → file write → build verify → commit → report; never auto-triggers; never runs `git push`).

---

### Task 1: Decision schema, Velite collection, pure content logic, formatCategory fix

**Files:**
- Modify: `content/schemas.ts`
- Modify: `content/schemas.test.ts`
- Modify: `velite.config.ts`
- Modify: `lib/content.ts`
- Modify: `lib/content.test.ts`
- Modify: `lib/format.ts`
- Create: `lib/format.test.ts`

**Interfaces:**
- Produces: `decisionFrontmatterSchema` (from `content/schemas.ts`), `DecisionStatus`, `DecisionEntry`, `decisionsForProject(entries: DecisionEntry[], projectSlug: string): Record<string, DecisionEntry[]>`, `findDecisionTitle(entries: DecisionEntry[], fullSlug: string): string` (from `lib/content.ts`), improved `formatCategory(category: string): string` (from `lib/format.ts`).

- [ ] **Step 1: Add `decisionFrontmatterSchema` to `content/schemas.ts`**

Add this export after `studyFrontmatterSchema` (do not touch existing schemas):

```ts
export const decisionFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  status: s.enum(['accepted', 'superseded']).default('accepted'),
  supersededBy: s.string().optional(),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
})
```

- [ ] **Step 2: Write failing tests for `decisionFrontmatterSchema`**

Add to `content/schemas.test.ts` (add the import and the new `describe` block; do not touch existing tests):

```ts
import {
  projectFrontmatterSchema,
  troubleshootingFrontmatterSchema,
  studyFrontmatterSchema,
  decisionFrontmatterSchema,
  aboutFrontmatterSchema,
  resumeFrontmatterSchema
} from './schemas'
```

```ts
describe('decisionFrontmatterSchema', () => {
  it('defaults status to accepted and draft to false when omitted', () => {
    const result = decisionFrontmatterSchema.parse({
      title: '공유 링크 검증 방식 결정',
      date: '2026-07-02'
    })
    expect(result.status).toBe('accepted')
    expect(result.draft).toBe(false)
  })

  it('accepts a superseded decision with supersededBy', () => {
    const result = decisionFrontmatterSchema.safeParse({
      title: '공유 링크 검증을 매 요청마다 DB 조회로 처리',
      date: '2026-06-18',
      status: 'superseded',
      supersededBy: 'career-link/general/share-link-verify-with-redis-cache'
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid status value', () => {
    const result = decisionFrontmatterSchema.safeParse({
      title: '결정',
      date: '2026-07-02',
      status: 'proposed'
    })
    expect(result.success).toBe(false)
  })

  it('rejects tags that are not strings', () => {
    const result = decisionFrontmatterSchema.safeParse({
      title: '결정',
      date: '2026-07-02',
      tags: [123]
    })
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests to verify they pass (schema logic has no dependent code yet)**

Run: `cd C:/cowork/portfolio && npm run test -- content/schemas.test.ts`
Expected: all tests in the file PASS, including the 4 new `decisionFrontmatterSchema` tests.

- [ ] **Step 4: Add the `decisions` Velite collection to `velite.config.ts`**

Modify the import line to include `decisionFrontmatterSchema`, and add the `decisions` collection using the exact same path-transform shape as `troubleshootingPosts`:

```ts
import { defineConfig, defineCollection, s } from 'velite'
import {
  projectFrontmatterSchema,
  troubleshootingFrontmatterSchema,
  studyFrontmatterSchema,
  decisionFrontmatterSchema,
  aboutFrontmatterSchema,
  resumeFrontmatterSchema
} from './content/schemas'
```

```ts
const decisions = defineCollection({
  name: 'Decision',
  pattern: '*/decisions/**/*.mdx',
  schema: decisionFrontmatterSchema
    .extend({ path: s.path(), content: s.markdown() })
    .transform((data) => {
      const parts = data.path.split('/')
      const project = parts[0]
      const category = parts[2]
      const slug = [project, ...parts.slice(2)].join('/')
      return { ...data, project, category, slug }
    })
})
```

Update the final `defineConfig` call to register it:

```ts
export default defineConfig({
  root: 'content',
  collections: { projects, troubleshootingPosts, studyPosts, decisions, about, resume }
})
```

- [ ] **Step 5: Run the build to verify Velite accepts the new collection with zero matching files**

Run: `cd C:/cowork/portfolio && npm run build`
Expected: build succeeds (Velite treats a collection with zero matches as an empty array — this already holds for `troubleshootingPosts`/`studyPosts` in this repo, unlike `single: true` collections which throw on zero files).

- [ ] **Step 6: Add `DecisionStatus`, `DecisionEntry`, `decisionsForProject` to `lib/content.ts`**

Add after the `TroubleshootingEntry` type (do not modify existing types/functions):

```ts
export type DecisionStatus = 'accepted' | 'superseded'

export type DecisionEntry = {
  slug: string
  project: string
  category: string
  title: string
  date: string
  status: DecisionStatus
  supersededBy?: string
  summary?: string
  tags?: string[]
  draft: boolean
  content: string
}
```

Add after `troubleshootingForProject` (matches its exact structure — this codebase uses named per-type wrappers over the generic `groupByCategory`/`publishedOnly` rather than one generic function, so follow that convention):

```ts
export function decisionsForProject(
  entries: DecisionEntry[],
  projectSlug: string
): Record<string, DecisionEntry[]> {
  const published = publishedOnly(entries).filter((entry) => entry.project === projectSlug)
  return groupByCategory(published)
}
```

Add one more pure function after `decisionsForProject`, matching how `getProjectTitle` in `lib/content-data.ts` delegates to `findProjectBySlug` rather than doing an inline `.find()` — every `lib/content-data.ts` export in this codebase currently delegates to a pure function here, so this keeps that pattern instead of introducing the one exception:

```ts
export function findDecisionTitle(entries: DecisionEntry[], fullSlug: string): string {
  return entries.find((entry) => entry.slug === fullSlug)?.title ?? fullSlug
}
```

- [ ] **Step 7: Write failing tests for `decisionsForProject` and `findDecisionTitle` in `lib/content.test.ts`**

Add the import and a `decisionEntry` factory + `describe` block, following the exact pattern of the existing `troubleshootingEntry` factory and `troubleshootingForProject` tests:

```ts
import {
  sortProjects,
  findProjectBySlug,
  publishedOnly,
  sortByDateDesc,
  troubleshootingForProject,
  decisionsForProject,
  findDecisionTitle,
  groupByCategory,
  findBySlugPath,
  type ProjectEntry,
  type TroubleshootingEntry,
  type DecisionEntry
} from './content'
```

```ts
const decisionEntry = (overrides: Partial<DecisionEntry>): DecisionEntry => ({
  slug: 'demo/general/decision',
  project: 'demo',
  category: 'general',
  title: 'Decision',
  date: '2026-01-01',
  status: 'accepted',
  draft: false,
  content: '',
  ...overrides
})

describe('decisionsForProject', () => {
  it('groups published decisions for the given project by category, excluding drafts and other projects', () => {
    const entries = [
      decisionEntry({ slug: 'a', project: 'demo', category: 'general' }),
      decisionEntry({ slug: 'b', project: 'demo', category: 'general', status: 'superseded', supersededBy: 'demo/general/a' }),
      decisionEntry({ slug: 'c', project: 'demo', category: 'general', draft: true }),
      decisionEntry({ slug: 'd', project: 'other', category: 'general' })
    ]
    const result = decisionsForProject(entries, 'demo')
    expect(Object.keys(result)).toEqual(['general'])
    expect(result.general.map((e) => e.slug)).toEqual(['a', 'b'])
  })
})

describe('findDecisionTitle', () => {
  it('returns the title of the matching decision', () => {
    const entries = [decisionEntry({ slug: 'demo/general/a', title: '결정 A' })]
    expect(findDecisionTitle(entries, 'demo/general/a')).toBe('결정 A')
  })

  it('falls back to the slug itself when no decision matches', () => {
    expect(findDecisionTitle([], 'demo/general/missing')).toBe('demo/general/missing')
  })
})
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `cd C:/cowork/portfolio && npm run test -- lib/content.test.ts`
Expected: all tests PASS, including the new `decisionsForProject` test.

- [ ] **Step 9: Fix `formatCategory` fallback in `lib/format.ts` to capitalize word-by-word**

Replace the `formatCategory` function body (keep `categoryLabels` untouched):

```ts
export function formatCategory(category: string): string {
  if (categoryLabels[category]) return categoryLabels[category]
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
```

- [ ] **Step 10: Create `lib/format.test.ts` with failing tests, then verify they pass**

This file does not exist yet — create it:

```ts
import { describe, expect, it } from 'vitest'
import { formatCategory, formatDate } from './format'

describe('formatCategory', () => {
  it('uses the hardcoded label when the category is known', () => {
    expect(formatCategory('es')).toBe('Elasticsearch')
    expect(formatCategory('api')).toBe('API')
  })

  it('capitalizes a single unknown word', () => {
    expect(formatCategory('general')).toBe('General')
  })

  it('capitalizes each word of an unknown kebab-case category', () => {
    expect(formatCategory('order-service')).toBe('Order Service')
  })
})

describe('formatDate', () => {
  it('formats an ISO date as YYYY.MM.DD', () => {
    expect(formatDate('2026-07-02')).toBe('2026.07.02')
  })

  it('returns the original string when the date is invalid', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})
```

Run: `cd C:/cowork/portfolio && npm run test -- lib/format.test.ts`
Expected: all 5 tests PASS.

- [ ] **Step 11: Run the full test suite and build to confirm nothing broke**

Run: `cd C:/cowork/portfolio && npm run test && npm run build`
Expected: all tests PASS, build succeeds.

- [ ] **Step 12: Commit**

```bash
cd C:/cowork/portfolio
git add content/schemas.ts content/schemas.test.ts velite.config.ts lib/content.ts lib/content.test.ts lib/format.ts lib/format.test.ts
git commit -m "Add decision content schema, Velite collection, and content logic"
```

---

### Task 2: Data layer additions + /decisions list and detail pages

**Files:**
- Modify: `lib/content-data.ts`
- Modify: `components/post-article.tsx`
- Create: `app/decisions/page.tsx`
- Create: `app/decisions/[...slug]/page.tsx`

**Interfaces:**
- Consumes: `DecisionEntry`, `decisionsForProject` from `lib/content.ts` (Task 1); `PostCard`, `PageHeader`, `EmptyState` from existing components; `PostArticle` from `components/post-article.tsx` (extended in this task).
- Produces: `getPublishedDecisions()`, `getDecisionsForProject(projectSlug: string)`, `getDecisionBySlugPath(slugParts: string[])`, `getDecisionTitle(fullSlug: string): string` (from `lib/content-data.ts`) — consumed by Task 3.
- Produces: `PostArticle`'s new optional `banner?: React.ReactNode` prop — renders between the header and the article body when provided; existing callers (`troubleshooting`, `study` detail pages) are unaffected since the prop is optional.

- [ ] **Step 1: Add decision data-layer functions to `lib/content-data.ts`**

Update the `#site/content` import and the `./content` import, then add four functions (do not modify existing exports):

```ts
import { projects, troubleshootingPosts, studyPosts, decisions, about, resume } from '#site/content'
import {
  sortProjects,
  findProjectBySlug,
  publishedOnly,
  sortByDateDesc,
  troubleshootingForProject,
  decisionsForProject,
  findDecisionTitle,
  groupByCategory,
  findBySlugPath
} from './content'
```

```ts
export function getPublishedDecisions() {
  return sortByDateDesc(publishedOnly(decisions))
}

export function getDecisionsForProject(projectSlug: string) {
  return decisionsForProject(decisions, projectSlug)
}

export function getDecisionBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(decisions), slugParts)
}

export function getDecisionTitle(fullSlug: string): string {
  return findDecisionTitle(decisions, fullSlug)
}
```

- [ ] **Step 2: Add an optional `banner` prop to `components/post-article.tsx`**

Update the props interface and render the banner between the header and the article:

```tsx
interface PostArticleProps {
  backHref: string
  backLabel: string
  title: string
  date: string
  content: string
  tags?: string[]
  badges?: { label: string; kind: 'project' | 'category' }[]
  banner?: React.ReactNode
}

export function PostArticle({ backHref, backLabel, title, date, content, tags, badges, banner }: PostArticleProps) {
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

      {banner ? <div className="mt-6">{banner}</div> : null}

      <article className="mt-8">
        <Markdown content={content} />
      </article>
    </div>
  )
}
```

(Only the interface, the function signature/destructure, and the new `{banner ? ... : null}` block change — the rest of the file is unchanged.)

- [ ] **Step 3: Create `app/decisions/page.tsx` (list page)**

```tsx
import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedDecisions, getProjectTitle } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Decisions',
  description: '프로젝트에서 내린 설계 결정과 그 배경, 이후 어떻게 바뀌었는지를 ADR 형식으로 기록합니다.'
}

export default function DecisionsPage() {
  const decisions = getPublishedDecisions()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Architecture Log"
        title="Design Decisions"
        description="왜 이렇게 설계했는지, 이후 왜 바뀌었는지를 ADR(Architecture Decision Record) 형식으로 기록합니다. 최신순으로 정렬됩니다."
        count={decisions.length}
      />

      {decisions.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 설계 결정 기록이 없습니다." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {decisions.map((entry) => (
            <PostCard
              key={entry.slug}
              href={`/decisions/${entry.slug}`}
              title={entry.title}
              date={entry.date}
              summary={entry.summary}
              tags={entry.tags}
              badges={[
                { label: getProjectTitle(entry.project), kind: 'project' },
                { label: entry.category, kind: 'category' },
                ...(entry.status === 'superseded' ? [{ label: 'Superseded' }] : [])
              ]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `app/decisions/[...slug]/page.tsx` (detail page with superseded banner)**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import {
  getPublishedDecisions,
  getDecisionBySlugPath,
  getDecisionTitle,
  getProjectTitle
} from '@/lib/content-data'

export function generateStaticParams() {
  return getPublishedDecisions().map((entry) => ({ slug: entry.slug.split('/') }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getDecisionBySlugPath(slug)
  if (!entry) return {}
  return {
    title: entry.title,
    description: entry.summary ?? entry.title
  }
}

export default async function DecisionDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const entry = getDecisionBySlugPath(slug)
  if (!entry) notFound()

  const banner =
    entry.status === 'superseded' && entry.supersededBy ? (
      <div className="rounded-md border border-border bg-secondary/50 px-4 py-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          이 결정은{' '}
          <Link
            href={`/decisions/${entry.supersededBy}`}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {getDecisionTitle(entry.supersededBy)}
          </Link>
          (으)로 대체되었습니다.
        </p>
      </div>
    ) : null

  return (
    <PostArticle
      backHref="/decisions"
      backLabel="Decisions"
      title={entry.title}
      date={entry.date}
      content={entry.content}
      tags={entry.tags}
      badges={[
        { label: getProjectTitle(entry.project), kind: 'project' },
        { label: entry.category, kind: 'category' }
      ]}
      banner={banner}
    />
  )
}
```

- [ ] **Step 5: Run the build to verify the new pages compile**

Run: `cd C:/cowork/portfolio && npm run build`
Expected: build succeeds. `/decisions` and its detail route appear in the build output route list. Since no `decisions` content exists yet, `/decisions` will statically render the empty state — that's expected until Task 5 adds sample content.

- [ ] **Step 6: Run the full test suite to confirm no regressions**

Run: `cd C:/cowork/portfolio && npm run test`
Expected: all tests PASS (this task added no new automated tests — pages are verified via build + later manual browser check in Task 5/6, matching this repo's existing convention where `troubleshooting`/`study` pages have no dedicated test files).

- [ ] **Step 7: Commit**

```bash
cd C:/cowork/portfolio
git add lib/content-data.ts components/post-article.tsx app/decisions
git commit -m "Add decisions data layer and list/detail pages"
```

---

### Task 3: Project detail page — Design Decisions section

**Files:**
- Modify: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getDecisionsForProject(projectSlug: string)` from `lib/content-data.ts` (Task 2), `PostCard`, `formatCategory` (already imported in this file).

- [ ] **Step 1: Add the Design Decisions section**

Update the import lines at the top of `app/projects/[slug]/page.tsx`:

```tsx
import { ArrowLeft, GitFork, ExternalLink, Wrench, Scale } from 'lucide-react'
```

```tsx
import { getAllProjects, getProjectBySlug, getTroubleshootingForProject, getDecisionsForProject } from '@/lib/content-data'
```

Inside `ProjectDetailPage`, add after the `troubleshooting`/`categories` declarations:

```tsx
const decisions = getDecisionsForProject(project.slug)
const decisionCategories = Object.keys(decisions)
```

Add a new `<section>` immediately after the existing Troubleshooting `</section>` (before the closing `</div>` of the page):

```tsx
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Scale className="size-4 text-muted-foreground" />
          Design Decisions
        </h2>
        {decisionCategories.length === 0 ? (
          <p className="mt-4 font-mono text-sm text-muted-foreground">아직 기록된 설계 결정이 없습니다.</p>
        ) : (
          <div className="mt-6 space-y-8">
            {decisionCategories.map((category) => (
              <div key={category}>
                <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-brand">
                  {formatCategory(category)}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {decisions[category].map((entry) => (
                    <PostCard
                      key={entry.slug}
                      href={`/decisions/${entry.slug}`}
                      title={entry.title}
                      date={entry.date}
                      summary={entry.summary}
                      tags={entry.tags}
                      badges={entry.status === 'superseded' ? [{ label: 'Superseded' }] : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
```

- [ ] **Step 2: Run the build to verify**

Run: `cd C:/cowork/portfolio && npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 3: Commit**

```bash
cd C:/cowork/portfolio
git add app/projects/[slug]/page.tsx
git commit -m "Add Design Decisions section to project detail page"
```

---

### Task 4: Navigation + sitemap

**Files:**
- Modify: `components/site-nav.tsx`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `getPublishedDecisions()` from `lib/content-data.ts` (Task 2).

- [ ] **Step 1: Add "Decisions" to the nav items in `components/site-nav.tsx`**

Update the `navItems` array to insert Decisions between Study and About:

```tsx
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/troubleshooting', label: 'Troubleshooting' },
  { href: '/study', label: 'Study' },
  { href: '/decisions', label: 'Decisions' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' }
]
```

- [ ] **Step 2: Add decisions routes to `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import {
  getAllProjects,
  getPublishedTroubleshooting,
  getPublishedStudyByCategory,
  getPublishedDecisions
} from '@/lib/content-data'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/projects', '/troubleshooting', '/study', '/decisions', '/about', '/resume'].map((path) => ({
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

  const decisionRoutes = getPublishedDecisions().map((entry) => ({
    url: `${SITE_URL}/decisions/${entry.slug}`,
    lastModified: new Date(entry.date)
  }))

  return [...staticRoutes, ...projectRoutes, ...troubleshootingRoutes, ...studyRoutes, ...decisionRoutes]
}
```

- [ ] **Step 3: Run the build to verify**

Run: `cd C:/cowork/portfolio && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
cd C:/cowork/portfolio
git add components/site-nav.tsx app/sitemap.ts
git commit -m "Add Decisions to navigation and sitemap"
```

---

### Task 5: Sample content — career-link decision pair with a supersession relationship

**Files:**
- Create: `content/career-link/decisions/general/share-link-verify-on-every-request.mdx`
- Create: `content/career-link/decisions/general/share-link-verify-with-redis-cache.mdx`

**Interfaces:**
- Consumes: `decisionFrontmatterSchema` (Task 1), the `decisions` Velite collection (Task 1) which will now pick up these two files.

- [ ] **Step 1: Create the first (superseded) decision**

`content/career-link/decisions/general/share-link-verify-on-every-request.mdx`:

```mdx
---
title: "공유 링크 검증을 매 요청마다 DB 조회로 처리"
date: "2026-06-18"
status: "superseded"
supersededBy: "career-link/general/share-link-verify-with-redis-cache"
summary: "공유 링크 유효성을 단순하게 DB 조회로 검증하기로 결정했으나, 트래픽이 늘며 캐싱 구조로 대체되었습니다."
tags: ["공유 링크", "PostgreSQL"]
---

## 배경

공유 링크는 만료·회수 여부를 매번 서버에서 검증해야 합니다. 초기 단계에서는 트래픽이 적고 정확성이 최우선이었습니다.

## 고려한 선택지

- **DB 조회**: 요청마다 PostgreSQL에서 링크 상태를 조회. 구현이 단순하고 상태 변경이 즉시 반영됨.
- **인메모리 캐시**: 조회 속도는 빠르지만 서버 인스턴스 간 상태 동기화가 필요해 초기 단계에는 과한 복잡도.

## 결정

매 요청마다 DB에서 공유 링크 상태를 조회하기로 했습니다. 구현이 단순하고, 이 시점에는 트래픽 규모상 성능이 문제 되지 않았습니다.

## 결과

기능은 정상 동작했지만, 이후 트래픽이 늘면서 매 요청마다의 DB 조회가 지연 시간에 영향을 주기 시작해 캐싱 구조로 대체했습니다.
```

- [ ] **Step 2: Create the second (accepted, superseding) decision**

`content/career-link/decisions/general/share-link-verify-with-redis-cache.mdx`:

```mdx
---
title: "공유 링크 검증 결과를 Redis에 캐싱"
date: "2026-07-02"
status: "accepted"
summary: "공유 링크 상태를 Redis에 캐싱해 DB 조회 부하를 줄이고, 상태 변경 시 캐시를 무효화하는 방식으로 바꿨습니다."
tags: ["공유 링크", "Redis", "캐싱"]
---

## 배경

트래픽이 늘면서 매 요청마다 PostgreSQL을 조회하던 방식이 응답 지연에 영향을 주기 시작했습니다. 공유 링크 상태(유효/만료/회수)는 자주 바뀌지 않는데도 매번 DB를 왕복하고 있었습니다.

## 고려한 선택지

- **DB 조회 유지**: 인덱스 튜닝으로 버티는 방법. 근본적인 조회 횟수 자체는 줄지 않음.
- **Redis 캐싱**: 링크 상태를 TTL과 함께 캐싱하고, 회수·만료 시점에 캐시를 명시적으로 무효화.

## 결정

공유 링크 상태를 Redis에 캐싱하기로 했습니다. 캐시 TTL은 링크 만료 시각보다 짧게 잡고, 회수 API 호출 시 해당 캐시를 즉시 삭제해 정합성을 맞췄습니다.

## 결과

동일 링크에 대한 반복 조회의 DB 부하가 크게 줄었고, 응답 지연도 개선되었습니다. 캐시 무효화 로직이 늘어난 만큼 회수 플로우 테스트를 보강했습니다.
```

- [ ] **Step 3: Run the build**

Run: `cd C:/cowork/portfolio && npm run build`
Expected: build succeeds; both decisions are picked up by the `decisions` Velite collection.

- [ ] **Step 4: Manually verify in the browser**

Run: `cd C:/cowork/portfolio && npm run dev`

Check:
- `/decisions` lists both entries, newest first (Redis caching decision on top), with a "Superseded" badge on the DB-only decision.
- `/decisions/career-link/general/share-link-verify-on-every-request` shows the superseded banner linking to `/decisions/career-link/general/share-link-verify-with-redis-cache`, and the link navigates correctly.
- `/decisions/career-link/general/share-link-verify-with-redis-cache` shows no banner (it's the current accepted decision).
- `/projects/career-link` shows a "Design Decisions" section listing both entries under the "General" category heading.
- Nav shows all 7 items in order; `/sitemap.xml` includes both `/decisions/...` URLs.

- [ ] **Step 5: Commit**

```bash
cd C:/cowork/portfolio
git add content/career-link/decisions
git commit -m "Add sample career-link design decisions with a supersession pair"
```

---

### Task 6: Create the `publish-decision` skill

**Files:**
- Create: `C:/Users/JIHEE/.claude/skills/publish-decision/SKILL.md`

**Interfaces:**
- None (standalone skill file, not part of the Next.js build). Follows the same frontmatter/structure contract as `C:/Users/JIHEE/.claude/skills/publish-troubleshooting/SKILL.md` and `publish-study/SKILL.md`.

- [ ] **Step 1: Create the skill file**

`C:/Users/JIHEE/.claude/skills/publish-decision/SKILL.md`:

```markdown
---
name: publish-decision
description: 어떤 프로젝트에서 작업하든, 설계 결정(왜 이렇게 설계했는지, 혹은 왜 바뀌었는지)을 사용자가 명시적으로 요청했을 때 대화 맥락에서 초안을 추출해 포트폴리오 저장소(C:/cowork/portfolio)의 content/{project}/decisions/에 ADR 스타일 mdx로 작성하고 커밋한다. 자동으로 트리거되지 않으며, 민감정보 확인 게이트를 반드시 거친다. 기존 결정을 대체하는 경우 사용자에게 명시적으로 확인한 뒤에만 기존 파일을 함께 수정한다.
---

# Publish Decision Skill

어떤 프로젝트에서 작업하든, 설계 결정을 포트폴리오 사이트에 ADR(Architecture Decision Record)
형식으로 기록하고 싶다는 **명시적** 요청을 받으면 이 절차를 따른다. "이 설계 결정 포트폴리오에
올려줘", "이거 ADR로 정리해줘", "왜 이렇게 바꿨는지 기록해줘", "설계 바뀐 거 정리해줘" 같은
직접적인 요청이 있을 때만 동작한다. 코드 작성, 리팩터링 완료 등 다른 이벤트에 자동으로
반응하지 않는다.

"포트폴리오에 올려줘"처럼 트러블슈팅과 겹칠 수 있는 애매한 요청이면, 트러블슈팅으로 올릴지
설계 결정으로 올릴지 먼저 사용자에게 확인한다.

## 1. 초안 추출

1. `C:/cowork/portfolio/content/` 아래 기존 프로젝트 폴더 목록을 확인하고, 지금 작업 중인
   프로젝트에 맞는 폴더를 우선 제안한다. 없으면 새 프로젝트 폴더명을 사용자에게 확인한다.
2. 그 프로젝트의 `decisions/` 아래 기존 서비스(category) 폴더 목록을 확인해 적합한 것을
   우선 제안한다. 단일 서비스 프로젝트는 `general`을 제안한다.
3. **이 결정이 기존 결정을 대체하는지 사용자에게 확인한다** — 대화 맥락만으로 추측하지 않는다.
   대체하는 것이면 해당 프로젝트의 기존 decisions 목록(제목/slug)을 보여주고 정확히 어떤 걸
   대체하는지 확인받는다.
4. 아래 항목의 초안을 만든다.
   - `title`: 한글, 사람이 읽는 제목
   - `slug`: 영문 kebab-case (예: `share-link-verify-with-redis-cache`)
   - `date`: 오늘 날짜
   - `status`: 기본 `accepted`
   - `summary`: 1~2문장
   - `tags`: 기술 키워드 기반 추론
   - `draft`: 기본 `false`
   - 본문: 고정 ADR 템플릿 `## 배경` / `## 고려한 선택지` / `## 결정` / `## 결과` 4개 섹션.
     과장 없이 담백하게(사실 위주, 수식어 최소화).

## 2. 내용 승인

새 결정 초안 전체(frontmatter + 본문)를 사용자에게 보여주고 승인을 받는다. 대체하는
경우, **기존 결정 파일에 적용할 변경사항**(`status: superseded`로 변경, `supersededBy:
{새 결정의 전체 slug}` 추가)도 별도로 보여주고 승인받는다. 수정 요청이 있으면 반영하고
다시 보여준다. 승인 전까지 다음 단계로 넘어가지 않는다.

## 3. 민감정보 확인 게이트 — 필수, 생략 불가

2단계와 **별개의 단계**로 반드시 거친다. 초안에 아래 항목이 있는지 명시적 체크리스트로
제시한다.

- 회사/조직 실명
- 내부 도메인·URL
- DB 자격증명·API 키·토큰
- 팀원 실명
- 고객사명·미공개 사업 정보

사용자가 **명시적으로 "없음"**이라고 답해야만 통과한다. 무응답, "아마도", "글쎄" 같은
애매한 답변으로는 통과시키지 않고 다시 확인한다. 이 게이트를 통과하기 전에는 어떤
경우에도 파일을 쓰지 않는다.

의심되는 내용이 대화에 있었다면, 1단계에서 이미 일반화하거나 제외해서 애초에 체크리스트에
걸릴 항목을 줄인다(예: 실제 사내 도메인 → "내부 API 서버"). 그래도 확신이 없는 내용은
초안에 넣지 않고 사용자 판단에 맡긴다.

## 4. 파일 작성

- 새 결정: `C:/cowork/portfolio/content/{project}/decisions/{category}/{slug}.mdx`
- 대체하는 경우에만 추가로: 기존 결정 파일의 frontmatter를 수정한다(`status`,
  `supersededBy`). 사용자가 2단계에서 명시적으로 확인하지 않은 대체 관계로는 기존 파일을
  절대 수정하지 않는다.
- **slug 충돌 시**: 같은 경로에 파일이 이미 있으면 자동으로 덮어쓰지 않는다. 기존 파일을
  덮어쓸지, 다른 slug를 쓸지 사용자에게 확인한다.
- 프로젝트/카테고리 폴더가 없으면 새로 생성한다(파일 쓰기 시 자동 생성).

## 5. 빌드 검증

```bash
cd C:/cowork/portfolio
npm run build
```

- **성공** → 6단계로 진행.
- **실패** → mdx 파일은 워킹트리에 그대로 두고(커밋하지 않음) 에러 메시지를 사용자에게
  보여준다. 수정 후 재시도한다. 실패한 채로 커밋하지 않는다.

## 6. 커밋

빌드 성공 시에만 커밋한다. `push`는 하지 않는다.

대체가 아닌 경우:

```bash
cd C:/cowork/portfolio
git add content/{project}/decisions/{category}/{slug}.mdx
git commit -m "Add design decision: {title}"
```

대체하는 경우, 새 파일과 수정된 기존 파일을 **하나의 커밋**으로 묶는다:

```bash
cd C:/cowork/portfolio
git add content/{project}/decisions/{category}/{new-slug}.mdx content/{project}/decisions/{category}/{old-slug}.mdx
git commit -m "Add design decision: {title} (supersedes {old title})"
```

커밋 메시지는 portfolio repo의 기존 커밋 스타일(영어 명령형: `Add implementation plan
for...`)을 따른다.

## 7. 결과 보고

- 파일 경로(들)
- 커밋 해시(성공 시) 또는 에러 내용(실패 시)
- 다음 단계 안내(예: "로컬에서 `npm run dev`로 확인 가능", "push는 직접 하셔야 합니다")

## 금지 사항

- 명시적 요청 없이 스스로 트리거하지 않는다.
- 3단계 민감정보 게이트를 생략하거나 건너뛰지 않는다.
- 사용자 승인 없이 파일을 쓰거나 커밋하지 않는다.
- portfolio repo에서 `git push`를 실행하지 않는다.
- 존재하지 않는 프로젝트/카테고리 폴더를 매번 새로 만들지 않는다 — 기존 폴더를 우선 확인한다.
- 사용자가 명시적으로 확인하지 않은 대체 관계를 추측해서 기존 결정 파일을 수정하지 않는다.
- 대체 여부를 미리 판단해서 항상 물어보지 않고 넘어가지 않는다 — 매번 확인한다.
```

- [ ] **Step 2: Verify the file was written correctly**

Read back `C:/Users/JIHEE/.claude/skills/publish-decision/SKILL.md` and confirm:
- Frontmatter has `name: publish-decision` and a `description:` matching the pattern of the other two skills (mentions explicit-trigger-only and the sensitive-info gate).
- All 7 numbered sections plus "금지 사항" are present.
- No placeholder text remains (e.g. no literal `{project}`/`{title}` left unexplained — those are intentional template placeholders for the skill to fill in at runtime, consistent with `publish-troubleshooting`/`publish-study`).

No build/test step applies — this file lives outside the Next.js project and is not part of `npm run build`/`npm run test`.

- [ ] **Step 3: Report completion**

Report to the user: skill file path, and that it will be picked up in any Claude Code session started after this point (a session already running before this file was created will not see it until restarted — the same session-scope caveat that applies to `publish-study`/`publish-troubleshooting`).

---

## Post-Plan Verification (whole-feature check)

After all 6 tasks are complete, verify end-to-end:

- `npm run test` — all tests pass (schemas, content logic, format).
- `npm run build` — succeeds, `/decisions` and `/decisions/[...slug]` routes present.
- Browser check: nav has 7 items in order; `/decisions` list shows both sample entries with correct badges; supersession banner renders and links correctly; `/projects/career-link` shows the Design Decisions section; `/sitemap.xml` includes decision URLs.
- `C:/Users/JIHEE/.claude/skills/publish-decision/SKILL.md` exists and mirrors the other two skills' structure.
