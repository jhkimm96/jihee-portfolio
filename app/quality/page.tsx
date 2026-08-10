import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, EmptyState } from '@/components/page-header'
import { QualityDashboard } from '@/components/quality-dashboard'
import { getAllProjects, getQualityProjectGroups, getQualityTrendFor, getProjectTitle } from '@/lib/content-data'
import type { QualityEntry } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Quality',
  description: '프로젝트·서비스별 코드 품질 스냅샷과 추세 대시보드입니다.'
}

export default async function QualityPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const params = await searchParams
  const groups = getQualityProjectGroups()
  const dashGroups = groups.map((group) => ({
    project: group.project,
    projectTitle: getProjectTitle(group.project),
    scopes: group.scopes
  }))
  const trends: Record<string, QualityEntry[]> = {}
  for (const group of groups) {
    for (const scope of group.scopes) {
      trends[`${group.project}/${scope}`] = getQualityTrendFor(group.project, scope).map((entry) => ({
        ...entry,
        content: ''
      }))
    }
  }
  const totalScopes = groups.reduce((sum, group) => sum + group.scopes.length, 0)
  const measuredProjects = new Set(groups.map((group) => group.project))
  const unmeasuredProjects = getAllProjects().filter((project) => !measuredProjects.has(project.slug))

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Quality"
        description="같은 잣대(고정 루브릭·고정 산식)로 반복 측정한 프로젝트·서비스별 품질 스냅샷입니다. 점수와 카테고리별 발견 건수의 추세를 보여줍니다."
        count={totalScopes}
      />
      {totalScopes === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 품질 스냅샷이 없습니다." />
        </div>
      ) : (
        <QualityDashboard groups={dashGroups} trends={trends} initialProject={params.project} />
      )}
      {unmeasuredProjects.length > 0 ? (
        <section className="mt-10 rounded-lg border border-dashed border-border p-5">
          <h2 className="text-sm font-semibold">아직 품질 스냅샷이 없는 프로젝트</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">매일 측정하지 않습니다. 리팩토링·장애 수정·릴리스처럼 비교 가치가 있는 시점에 같은 기준으로 스냅샷을 추가합니다.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {unmeasuredProjects.map((project) => <Link key={project.slug} href={`/projects/${project.slug}`} className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-brand/50">{project.title}</Link>)}
          </div>
        </section>
      ) : null}
    </div>
  )
}
