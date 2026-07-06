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
