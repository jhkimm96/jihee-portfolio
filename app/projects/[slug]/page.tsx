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
