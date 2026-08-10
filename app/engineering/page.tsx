import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Gauge, MessageSquare, Scale, Wrench, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RECORD_TYPES, type RecordTypeKey } from '@/lib/record-types'
import { getAllProjects, getDecisionsForProject, getQualityForProject, getReviewsForProject, getTroubleshootingForProject } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Engineering',
  description: '프로젝트별 문제 해결, 설계 판단, 리뷰와 코드 품질 기록을 한곳에서 확인합니다.'
}

function countGroups(groups: Record<string, unknown[]>): number {
  return Object.values(groups).reduce((sum, entries) => sum + entries.length, 0)
}

// 이름·경로·설명은 lib/record-types.ts가 정본이다. 여기서는 아이콘만 붙인다.
const sectionIcons: Record<RecordTypeKey, LucideIcon> = {
  troubleshooting: Wrench,
  decisions: Scale,
  reviews: MessageSquare,
  quality: Gauge
}

const sections = RECORD_TYPES

export default function EngineeringPage() {
  const projects = getAllProjects().map((project) => ({
    project,
    counts: {
      troubleshooting: countGroups(getTroubleshootingForProject(project.slug)),
      decisions: countGroups(getDecisionsForProject(project.slug)),
      reviews: getReviewsForProject(project.slug).length,
      quality: getQualityForProject(project.slug).length
    }
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader title="Engineering" description="결과만 나열하지 않고, 어떤 문제를 풀고 어떤 판단을 했으며 코드가 어떻게 변했는지를 근거와 함께 모았습니다." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const total = projects.reduce((sum, item) => sum + item.counts[section.key], 0)
          const Icon = sectionIcons[section.key]
          return (
            <Link key={section.key} href={section.href} className="group rounded-xl border border-border bg-card p-5 shadow-e2 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-e3">
              <div className="flex items-start justify-between gap-4"><span className="flex size-10 items-center justify-center rounded-md bg-secondary"><Icon className="size-5 text-brand" /></span><span className="font-mono text-xs text-muted-foreground">{total} entries</span></div>
              <h2 className="mt-4 text-lg font-semibold">{section.label}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-foreground">전체 보기 <ArrowRight className="size-3.5" /></span>
            </Link>
          )
        })}
      </div>
      <section className="mt-12" aria-labelledby="engineering-projects-title">
        <h2 id="engineering-projects-title" className="text-xl font-semibold">프로젝트별 근거 보기</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {projects.map(({ project, counts }) => (
            <article key={project.slug} className="rounded-xl border border-border bg-card p-5">
              <Link href={`/projects/${project.slug}`} className="text-base font-semibold hover:text-brand">{project.title}</Link>
              <p className="mt-1 text-sm text-muted-foreground">{project.responsibility}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {sections.map((section) => <Link key={section.key} href={`${section.href}?project=${project.slug}`} className="flex items-center justify-between rounded-md border border-border px-3 py-2 hover:border-brand/50"><span>{section.label}</span><span className="font-mono text-xs text-muted-foreground">{counts[section.key]}</span></Link>)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
