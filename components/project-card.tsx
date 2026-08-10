import Link from 'next/link'
import { ArrowUpRight, Calendar, Users } from 'lucide-react'
import type { ProjectEntry } from '@/lib/content'
import { StatusBadge, TechStack } from '@/components/content-badges'
import {
  getDecisionsForProject,
  getQualityForProject,
  getReviewsForProject,
  getTroubleshootingForProject
} from '@/lib/content-data'
import { withCounts } from '@/lib/record-types'

function countGroups(groups: Record<string, unknown[]>): number {
  return Object.values(groups).reduce((total, entries) => total + entries.length, 0)
}

export function ProjectCard({ project }: { project: ProjectEntry }) {
  const evidence = withCounts({
    troubleshooting: countGroups(getTroubleshootingForProject(project.slug)),
    decisions: countGroups(getDecisionsForProject(project.slug)),
    reviews: getReviewsForProject(project.slug).length,
    quality: getQualityForProject(project.slug).length
  })

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-e2 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand/40 hover:shadow-e3"
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
              <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
            </h3>
            <p className="font-mono text-xs text-muted-foreground">{project.role}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{project.responsibility}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div className="rounded-md border border-brand/20 bg-brand/5 px-3 py-2.5">
          <p className="mb-1 font-mono text-[0.68rem] font-medium text-brand">Key outcome</p>
          <p className="text-sm font-medium leading-relaxed text-foreground">{project.highlight}</p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        {evidence.length > 0 ? (
          <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-3 font-mono text-[0.7rem] text-muted-foreground">
            {evidence.map((item) => (
              <span key={item.label}>{item.label} {item.count}</span>
            ))}
          </div>
        ) : null}

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
