import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Wrench, Scale, MessageSquare, Gauge, BookOpen } from 'lucide-react'
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
  getQualityTrendFor,
  getPickTarget,
  getResumeVariants,
  getLearningPathByProject
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
  const learningPath = getLearningPathByProject(project.slug)
  const cases = getResumeVariants()
    .flatMap((variant) => variant.picks)
    .filter((pick) => pick.slug === project.slug || pick.slug.startsWith(`${project.slug}/`))
    .filter((pick) => pick.problem && pick.decision && pick.result)
    .filter((pick, index, all) => all.findIndex((entry) => entry.slug === pick.slug) === index)
    .slice(0, 4)

  const meta = [
    { label: '기간', value: project.period },
    { label: '팀', value: project.team },
    { label: '역할', value: project.role }
  ]

  return (
    <div className="ink-signal-page ink-signal-project-page mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Projects
      </Link>

      <header className="ink-project-hero mt-6 space-y-5 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-balance">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">{project.description}</p>

        <div className="ink-project-highlight rounded-xl border border-brand/20 bg-brand/5 px-4 py-3">
          <p className="mb-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-brand">이 프로젝트에서 가장 보여주고 싶은 것</p>
          <p className="text-base font-semibold leading-relaxed">{project.highlight}</p>
        </div>

        <section aria-labelledby="project-contribution-title" className="ink-project-contribution rounded-xl border border-border bg-card p-5 shadow-e2">
          <h2 id="project-contribution-title" className="font-mono text-xs font-medium text-muted-foreground">담당 영역</h2>
          <p className="mt-1.5 text-lg font-semibold tracking-tight text-foreground text-pretty">
            {project.responsibility}
          </p>
          <details className="mt-4"><summary className="cursor-pointer text-sm font-semibold text-brand">구현 범위 자세히 보기</summary><ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {project.contributions.map((contribution) => (
              <li key={contribution} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                <span>{contribution}</span>
              </li>
            ))}
          </ul></details>
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
          {project.github ? <Button asChild size="sm" variant="outline">
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-4" />
              GitHub
            </Link>
          </Button> : null}
          {project.demo ? (
            <Button asChild size="sm" variant="outline">
              <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Live Demo
              </Link>
            </Button>
          ) : null}
          {learningPath ? <Button asChild size="sm" variant="outline">
            <Link href={`/study/paths/${project.slug}`}>
              <BookOpen className="size-4" />
              프로젝트 학습 경로
            </Link>
          </Button> : null}
        </div>

        {project.statusNote ? (
          <div className="rounded-md border border-border bg-secondary/50 px-4 py-3">
            <p className="text-sm leading-relaxed text-muted-foreground">{project.statusNote}</p>
          </div>
        ) : null}
      </header>

      <nav className="ink-project-nav sticky top-14 z-20 -mx-1 mt-6 overflow-x-auto rounded-lg border border-border bg-background/95 p-1.5 backdrop-blur" aria-label="프로젝트 상세 섹션">
        <div className="flex min-w-max gap-1">
          {[
            ['overview', '구현 개요'],
            ...(cases.length > 0 || project.caseProblem ? [['cases', `대표 사례 ${cases.length || 1}`]] : []),
            ['troubleshooting', `문제 해결 ${troubleshootingCount}`],
            ['decisions', `설계 판단 ${decisionsCount}`],
            ['reviews', `리뷰 ${allReviews.length}`],
            ['quality', `코드 품질 ${quality.length}`]
          ].map(([id, label]) => (
            <Link key={id} href={`#${id}`} className="rounded-md px-3 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground">{label}</Link>
          ))}
        </div>
      </nav>

      {cases.length > 0 || project.caseProblem ? <section id="cases" className="scroll-mt-28 border-b border-border py-10" aria-labelledby="project-cases-title">
        <p className="text-xs font-semibold text-brand">대표 사례</p>
        <h2 id="project-cases-title" className="mt-2 text-2xl font-bold tracking-tight">문제에서 검증까지</h2>
        <div className="mt-6 grid gap-4">
          {project.caseProblem ? <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <h3 className="text-lg font-bold">{project.highlight}</h3>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              <div><dt className="text-xs font-semibold text-brand">문제</dt><dd className="mt-2 text-sm leading-relaxed">{project.caseProblem}</dd></div>
              <div><dt className="text-xs font-semibold text-brand">선택과 이유</dt><dd className="mt-2 text-sm leading-relaxed">{project.caseDecision}</dd></div>
              <div><dt className="text-xs font-semibold text-brand">확인한 결과</dt><dd className="mt-2 text-sm leading-relaxed">{project.caseResult}</dd></div>
            </dl>
            <p className="mt-5 text-xs text-muted-foreground">내부 시스템의 코드와 화면은 공개하지 않습니다.</p>
          </article> : null}
          {cases.map((caseItem) => {
            const target = getPickTarget(caseItem.type, caseItem.slug)
            return <article key={caseItem.slug} className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <h3 className="text-lg font-bold">{caseItem.headline ?? target?.title}</h3>
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                <div><dt className="text-xs font-semibold text-brand">문제</dt><dd className="mt-2 text-sm leading-relaxed">{caseItem.problem}</dd></div>
                <div><dt className="text-xs font-semibold text-brand">선택과 이유</dt><dd className="mt-2 text-sm leading-relaxed">{caseItem.decision}</dd></div>
                <div><dt className="text-xs font-semibold text-brand">확인한 결과</dt><dd className="mt-2 text-sm leading-relaxed">{caseItem.result}</dd></div>
              </dl>
              {target && target.href !== `/projects/${project.slug}` ? <Link href={target.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">근거 기록 보기 <ExternalLink className="size-3.5" /></Link> : null}
            </article>
          })}
        </div>
      </section> : null}

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
          <Image src={project.thumbnail} alt={`${project.title}의 데이터 흐름을 설명하는 그림`} fill sizes="(min-width: 1024px) 960px, 100vw" className="object-contain" />
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
