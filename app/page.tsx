import Link from 'next/link'
import { ArrowRight, GitFork, FileText, Wrench, BookOpen, FolderGit2, GitBranch, Code2, Gauge } from 'lucide-react'
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

  const stats = [
    { label: 'Projects', value: getAllProjects().length, href: '/projects', icon: FolderGit2 },
    { label: 'Troubleshooting', value: getPublishedTroubleshooting().length, href: '/troubleshooting', icon: Wrench },
    { label: 'Study Notes', value: getPublishedStudy().length, href: '/study', icon: BookOpen }
  ]

  const intentLinks = [
    {
      href: '/projects',
      label: '대표 프로젝트',
      description: '구현 결과와 기술 스택',
      icon: FolderGit2
    },
    {
      href: '/troubleshooting',
      label: '문제 해결',
      description: '원인 분석과 해결 기록',
      icon: Wrench
    },
    {
      href: '/decisions',
      label: '설계 판단',
      description: '선택지와 결정 근거',
      icon: GitBranch
    },
    {
      href: '/reviews',
      label: '코드 리뷰',
      description: '개선점과 리팩터링 기록',
      icon: Code2
    },
    {
      href: '/quality',
      label: '품질 관리',
      description: '측정 지표와 변화 추세',
      icon: Gauge
    }
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

        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-tight">보고 싶은 내용</h2>
            <Link href="/search" className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
              검색으로 찾기
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {intentLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-border bg-card p-3 transition-colors hover:border-brand/50"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground transition-colors group-hover:text-brand">
                    <item.icon className="size-3.5" />
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
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
