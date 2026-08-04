import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { QualityDashboard } from '@/components/quality-dashboard'
import { getQualityProjectGroups, getQualityTrendFor, getProjectTitle } from '@/lib/content-data'
import type { QualityEntry } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Quality',
  description: '프로젝트·서비스별 코드 품질 스냅샷과 추세 대시보드입니다.'
}

export default function QualityPage() {
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Code Quality"
        title="Quality"
        description="같은 잣대(고정 루브릭·고정 산식)로 반복 측정한 프로젝트·서비스별 품질 스냅샷입니다. 점수와 카테고리별 발견 건수의 추세를 보여줍니다."
        count={totalScopes}
      />
      {totalScopes === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 품질 스냅샷이 없습니다." />
        </div>
      ) : (
        <QualityDashboard groups={dashGroups} trends={trends} />
      )}
    </div>
  )
}
