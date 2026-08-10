import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/project-card'
import { PostCard } from '@/components/post-card'
import {
  getAbout,
  getAllProjects,
  getPublishedDecisions,
  getPublishedQuality,
  getPublishedReviews,
  getPublishedTroubleshooting,
  getPublishedStudy,
  getProjectTitle,
  getResumeVariants
} from '@/lib/content-data'
import { withCounts } from '@/lib/record-types'

export default function HomePage() {
  const about = getAbout()
  const featured = getAllProjects().filter((project) => project.featured)
  const resumeVariants = getResumeVariants()

  const troubleshooting = getPublishedTroubleshooting()
  const decisions = getPublishedDecisions()
  const reviews = getPublishedReviews()
  const quality = getPublishedQuality()

  const evidence = withCounts({
    troubleshooting: troubleshooting.length,
    decisions: decisions.length,
    reviews: reviews.length,
    quality: quality.length
  })

  const recentActivity = [
    ...troubleshooting.map((post) => ({
      href: `/troubleshooting/${post.slug}`,
      type: 'Troubleshooting',
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      badges: [
        { label: 'Troubleshooting' },
        { label: getProjectTitle(post.project), kind: 'project' as const },
        { label: post.category, kind: 'category' as const }
      ]
    })),
    ...getPublishedDecisions().map((entry) => ({
      href: `/decisions/${entry.slug}`,
      type: 'Decision',
      title: entry.title,
      date: entry.date,
      summary: entry.summary,
      tags: entry.tags,
      badges: [
        { label: 'Decision' },
        { label: getProjectTitle(entry.project), kind: 'project' as const },
        { label: entry.category, kind: 'category' as const }
      ]
    })),
    ...getPublishedReviews().map((post) => ({
      href: `/reviews/${post.slug}`,
      type: 'Review',
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      badges: [{ label: 'Review' }, { label: getProjectTitle(post.project), kind: 'project' as const }]
    })),
    ...getPublishedStudy().map((post) => ({
      href: `/study/${post.slug}`,
      type: 'Study',
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      badges: [{ label: 'Study' }, { label: post.category, kind: 'category' as const }]
    })),
    ...getPublishedQuality().map((entry) => ({
      href: `/quality/${entry.slug}`,
      type: 'Quality',
      title: entry.title,
      date: entry.date,
      summary: entry.summary,
      tags: entry.tags,
      badges: [
        { label: 'Quality' },
        { label: getProjectTitle(entry.project), kind: 'project' as const },
        { label: entry.scope, kind: 'category' as const }
      ]
    }))
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="relative isolate border-b border-border pt-16 pb-20 sm:pt-20 sm:pb-28">
        <div className="hero-ambient" aria-hidden="true" />
        <h1 className="max-w-[16ch] text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">
          {about.name}의 개발 포트폴리오
        </h1>
        <p className="mt-4 font-mono text-sm text-brand">{about.role}</p>
        {/* 스택 나열이 아니라 이 사이트가 무엇을 하는 곳인지를 먼저 말한다.
            개인 소개는 /about이 맡는다. */}
        <p className="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground text-pretty">
          결과만 나열하지 않고, 어떤 문제를 풀고 어떤 판단을 했으며 코드가 어떻게 변했는지를 근거와 함께 남깁니다.
          이 사이트의 모든 주장에는 눌러서 확인할 수 있는 기록이 붙어 있습니다.
        </p>

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
                <GithubIcon className="size-4" />
                GitHub
              </Link>
            </Button>
          ) : null}
        </div>

        {resumeVariants.length > 0 ? (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            지원 직무별 이력서{' '}
            {resumeVariants.map((variant, index) => (
              <span key={variant.slug}>
                {index > 0 ? (
                  <span className="mx-1.5 text-border" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                <Link
                  href={`/resume/${variant.slug}`}
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-brand"
                >
                  {variant.label}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        {/* 포지셔닝을 세는 단위로 바꾼다. 개수는 콘텐츠에서 파생되므로 썩지 않는다. */}
        {evidence.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5">
            {evidence.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group/ev inline-flex items-baseline gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 rounded-sm"
              >
                <span className="underline-offset-4 group-hover/ev:underline">{item.label}</span>
                <span className="text-sm font-medium tabular-nums text-foreground">{item.count}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">어떤 프로젝트를 살펴볼까요?</h2>
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

      <section className="border-t border-border py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
          <Link href="/search" className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
            전체 검색
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {recentActivity.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">아직 작성된 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {recentActivity.map((item) => (
              <PostCard
                key={`${item.type}-${item.href}`}
                href={item.href}
                title={item.title}
                date={item.date}
                summary={item.summary}
                tags={item.tags}
                badges={item.badges}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
