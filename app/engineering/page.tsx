import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Gauge, MessageSquare, Scale, Wrench } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { getAllProjects, getDecisionsForProject, getQualityForProject, getReviewsForProject, getTroubleshootingForProject } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Engineering',
  description: '프로젝트별 문제 해결, 설계 판단, 리뷰와 코드 품질 기록을 한곳에서 확인합니다.'
}

function countGroups(groups: Record<string, unknown[]>): number {
  return Object.values(groups).reduce((sum, entries) => sum + entries.length, 0)
}

const sections = [
  { key: 'troubleshooting', title: '문제 해결', description: '증상부터 원인, 해결과 재발 방지까지 기록한 트러블슈팅', href: '/troubleshooting', icon: Wrench },
  { key: 'decisions', title: '설계 판단', description: '선택지와 트레이드오프, 변경 이유를 남긴 Architecture Decision Record', href: '/decisions', icon: Scale },
  { key: 'reviews', title: '리뷰', description: '구현을 다시 읽고 발견한 문제와 후속 개선 과제', href: '/reviews', icon: MessageSquare },
  { key: 'quality', title: '코드 품질', description: '의미 있는 변경 시점에 측정한 서비스별 품질 스냅샷과 추세', href: '/quality', icon: Gauge }
] as const

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
      <PageHeader eyebrow="Evidence Library" title="Engineering" description="결과만 나열하지 않고, 어떤 문제를 풀고 어떤 판단을 했으며 코드가 어떻게 변했는지를 근거와 함께 모았습니다." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const total = projects.reduce((sum, item) => sum + item.counts[section.key], 0)
          const Icon = section.icon
          return (
            <Link key={section.key} href={section.href} className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/50">
              <div className="flex items-start justify-between gap-4"><span className="flex size-10 items-center justify-center rounded-md bg-secondary"><Icon className="size-5 text-brand" /></span><span className="font-mono text-xs text-muted-foreground">{total} entries</span></div>
              <h2 className="mt-4 text-lg font-semibold">{section.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-foreground">전체 보기 <ArrowRight className="size-3.5" /></span>
            </Link>
          )
        })}
      </div>
      <section className="mt-12" aria-labelledby="engineering-projects-title">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand">By project</p>
        <h2 id="engineering-projects-title" className="mt-1 text-xl font-semibold">프로젝트별 근거 보기</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {projects.map(({ project, counts }) => (
            <article key={project.slug} className="rounded-lg border border-border bg-card p-5">
              <Link href={`/projects/${project.slug}`} className="text-base font-semibold hover:text-brand">{project.title}</Link>
              <p className="mt-1 text-sm text-muted-foreground">{project.responsibility}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {sections.map((section) => <Link key={section.key} href={`${section.href}?project=${project.slug}`} className="flex items-center justify-between rounded-md border border-border px-3 py-2 hover:border-brand/50"><span>{section.title}</span><span className="font-mono text-xs text-muted-foreground">{counts[section.key]}</span></Link>)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
