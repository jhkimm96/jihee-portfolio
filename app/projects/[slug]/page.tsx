import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Wrench, Scale, MessageSquare, Gauge, HelpCircle } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Markdown } from '@/components/markdown'
import { StatusBadge, TechChip } from '@/components/content-badges'
import { PostCard } from '@/components/post-card'
import { ScoreTrendChart } from '@/components/quality-charts'
import { formatCategory, formatDate } from '@/lib/format'
import {
  getAllProjects,
  getProjectBySlug,
  getTroubleshootingForProject,
  getDecisionsForProject,
  getReviewsForProject,
  getQualityForProject,
  getQualityTrendFor
} from '@/lib/content-data'

function previewGroups<T>(groups: Record<string, T[]>, limit: number): Record<string, T[]> {
  let remaining = limit
  return Object.fromEntries(
    Object.entries(groups)
      .map(([category, entries]) => {
        const preview = entries.slice(0, remaining)
        remaining -= preview.length
        return [category, preview]
      })
      .filter(([, entries]) => entries.length > 0)
  )
}

function countGroups<T>(groups: Record<string, T[]>): number {
  return Object.values(groups).reduce((total, entries) => total + entries.length, 0)
}

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

  const allTroubleshooting = getTroubleshootingForProject(project.slug)
  const troubleshootingCount = countGroups(allTroubleshooting)
  const troubleshooting = previewGroups(allTroubleshooting, 3)
  const categories = Object.keys(troubleshooting)

  const allDecisions = getDecisionsForProject(project.slug)
  const decisionsCount = countGroups(allDecisions)
  const decisions = previewGroups(allDecisions, 3)
  const decisionCategories = Object.keys(decisions)

  const allReviews = getReviewsForProject(project.slug)
  const reviews = allReviews.slice(0, 3)
  const quality = getQualityForProject(project.slug)
  const featuredQuality = quality[0]
  const qualityTrend = featuredQuality ? getQualityTrendFor(project.slug, featuredQuality.scope) : []

  const meta = [
    { label: '기간', value: project.period },
    { label: '팀', value: project.team },
    { label: '역할', value: project.role }
  ]

  const interviewPrompts = project.slug === 'prompthub'
    ? ['왜 PostgreSQL과 Elasticsearch를 원본·검색 사본으로 분리했나요?', 'RRF를 선택한 이유와 한계는 무엇인가요?', '검색·추천 장애가 상품 조회에 번지지 않게 어떻게 경계를 나눴나요?']
    : ['권한별 메뉴와 공통코드를 어떤 기준으로 공통화했나요?', '팀 프로젝트에서 본인 구현 범위와 공동 작업 범위를 어떻게 구분하나요?', '다시 구현한다면 어떤 도메인 경계를 먼저 바꾸겠나요?']

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
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
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">{project.description}</p>

        <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3">
          <p className="mb-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-brand">이 프로젝트에서 가장 보여주고 싶은 것</p>
          <p className="text-base font-semibold leading-relaxed">{project.highlight}</p>
        </div>

        <section aria-labelledby="project-contribution-title" className="rounded-xl border border-border bg-card p-5 shadow-e2">
          <h2 id="project-contribution-title" className="font-mono text-xs font-medium text-muted-foreground">담당 영역</h2>
          <p className="mt-1.5 text-lg font-semibold tracking-tight text-foreground text-pretty">
            {project.responsibility}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {project.contributions.map((contribution) => (
              <li key={contribution} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                <span>{contribution}</span>
              </li>
            ))}
          </ul>
        </section>

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
              <GithubIcon className="size-4" />
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

      <section className="grid gap-3 border-b border-border py-8 lg:grid-cols-[1.25fr_1fr]" aria-labelledby="case-study-title">
        <div className="rounded-lg border border-brand/30 bg-brand/5 p-5">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-brand">Case study lens</p>
          <h2 id="case-study-title" className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-balance">이 프로젝트는 무엇을 증명하나요?</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">결과보다 문제의 범위, 본인의 판단, 실패 조건과 검증 근거를 먼저 확인할 수 있도록 구성했습니다.</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground"><HelpCircle className="size-3.5 text-brand" /> Interview prompts</p>
          <ul className="mt-3 space-y-2">
            {interviewPrompts.map((prompt) => <li key={prompt} className="text-sm leading-relaxed text-muted-foreground">{prompt}</li>)}
          </ul>
        </div>
      </section>

      <nav className="sticky top-14 z-20 -mx-1 mt-6 overflow-x-auto rounded-lg border border-border bg-background/95 p-1.5 backdrop-blur" aria-label="프로젝트 상세 섹션">
        <div className="flex min-w-max gap-1">
          {[
            ['overview', '구현 개요'],
            ['troubleshooting', `문제 해결 ${troubleshootingCount}`],
            ['decisions', `설계 판단 ${decisionsCount}`],
            ['reviews', `리뷰 ${allReviews.length}`],
            ['quality', `코드 품질 ${quality.length}`]
          ].map(([id, label]) => (
            <Link key={id} href={`#${id}`} className="rounded-md px-3 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground">{label}</Link>
          ))}
        </div>
      </nav>

      {featuredQuality ? (
        <section className="mt-8 rounded-xl border border-brand/20 bg-brand/5 p-5" aria-labelledby="quality-summary-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="quality-summary-title" className="text-lg font-semibold tracking-tight">
                {featuredQuality.scope} 품질 추세
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">반복 측정한 코드 품질 점수와 개선 흐름입니다.</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl font-semibold tabular-nums">{featuredQuality.latest.score}</div>
              <div className="text-xs text-muted-foreground">최신 점수 / 100</div>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-md border border-border bg-background p-2">
            <ScoreTrendChart data={qualityTrend.map((entry) => ({ date: entry.date, score: entry.score }))} />
          </div>
          <Link href={`/quality?project=${project.slug}`} className="mt-3 inline-flex font-mono text-xs font-medium text-brand underline-offset-4 hover:underline">
            전체 품질 그래프와 분석 보기 →
          </Link>
        </section>
      ) : null}

      {project.thumbnail ? (
        <div className="relative mt-8 aspect-[1200/500] w-full overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.thumbnail} alt={`${project.title} 대표 이미지`} className="size-full object-cover" />
        </div>
      ) : null}

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article id="overview" className="scroll-mt-32 min-w-0">
          <Markdown content={project.content} />
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-lg border border-border bg-card p-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brand">Read this as</p>
            <ol className="mt-3 space-y-3 font-mono text-xs text-muted-foreground">
              <li>01 · 문제와 담당 범위</li>
              <li>02 · 설계 선택</li>
              <li>03 · 검증 기록</li>
              <li>04 · 남은 한계</li>
            </ol>
          </div>
        </aside>
      </div>

      <section id="troubleshooting" className="mt-12 scroll-mt-32 border-t border-border pt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight"><Wrench className="size-4 text-muted-foreground" />Troubleshooting</h2>
          {troubleshootingCount > 3 ? <Link href={`/troubleshooting?project=${project.slug}`} className="font-mono text-xs text-muted-foreground hover:text-foreground">전체 {troubleshootingCount}개 보기 →</Link> : null}
        </div>
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

      <section id="decisions" className="mt-12 scroll-mt-32 border-t border-border pt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight"><Scale className="size-4 text-muted-foreground" />Design Decisions</h2>
          {decisionsCount > 3 ? <Link href={`/decisions?project=${project.slug}`} className="font-mono text-xs text-muted-foreground hover:text-foreground">전체 {decisionsCount}개 보기 →</Link> : null}
        </div>
        {decisionCategories.length === 0 ? (
          <p className="mt-4 font-mono text-sm text-muted-foreground">아직 기록된 설계 판단이 없습니다.</p>
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

      <section id="reviews" className="mt-12 scroll-mt-32 border-t border-border pt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight"><MessageSquare className="size-4 text-muted-foreground" />Reviews</h2>
          {allReviews.length > 3 ? <Link href={`/reviews?project=${project.slug}`} className="font-mono text-xs text-muted-foreground hover:text-foreground">전체 {allReviews.length}개 보기 →</Link> : null}
        </div>
        {reviews.length === 0 ? (
          <p className="mt-4 font-mono text-sm text-muted-foreground">아직 기록된 리뷰가 없습니다.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3">
            {reviews.map((post) => (
              <PostCard
                key={post.slug}
                href={`/reviews/${post.slug}`}
                title={post.title}
                date={post.date}
                summary={post.summary}
                tags={post.tags}
              />
            ))}
          </div>
        )}
      </section>

      <section id="quality" className="mt-12 scroll-mt-32 border-t border-border pt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Gauge className="size-4 text-muted-foreground" />
            Quality
          </h2>
          {quality.length > 0 ? (
            <Link href={`/quality?project=${project.slug}`} className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              품질 그래프 보기
            </Link>
          ) : null}
        </div>
        {quality.length === 0 ? (
          <p className="mt-4 font-mono text-sm text-muted-foreground">아직 품질 스냅샷이 없습니다.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quality.map(({ scope, latest }) => (
              <Link
                key={scope}
                href={`/quality/${latest.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-e2 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-e3"
              >
                <div>
                  <div className="font-mono text-sm font-semibold">{scope}</div>
                  <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {formatDate(latest.date)} · 산식 v{latest.formulaVersion}
                  </div>
                </div>
                <span className="font-mono text-2xl font-semibold tabular-nums">{latest.score}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
