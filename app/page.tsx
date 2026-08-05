import Link from 'next/link'
import { ArrowRight, GitFork, FileText } from 'lucide-react'
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
  getProjectTitle
} from '@/lib/content-data'

export default function HomePage() {
  const about = getAbout()
  const featured = getAllProjects().filter((project) => project.featured)
  const recentActivity = [
    ...getPublishedTroubleshooting().map((post) => ({
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

      <section className="py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand">Selected work</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">어떤 프로젝트를 살펴볼까요?</h2>
          </div>
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
