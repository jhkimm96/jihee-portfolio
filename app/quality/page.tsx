import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { QualityDashboard } from '@/components/quality-dashboard'
import { getQualityScopes, getQualityTrend } from '@/lib/content-data'
import type { QualityEntry } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Quality',
  description: '서비스별 코드 품질 스냅샷과 추세 대시보드입니다.'
}

export default function QualityPage() {
  const scopes = getQualityScopes()
  const trends: Record<string, QualityEntry[]> = {}
  for (const scope of scopes) {
    trends[scope] = getQualityTrend(scope).map((entry) => ({ ...entry, content: '' }))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Code Quality"
        title="Quality"
        description="같은 잣대(고정 루브릭·고정 산식)로 반복 측정한 서비스별 품질 스냅샷입니다. 점수와 카테고리별 발견 건수의 추세를 보여줍니다."
        count={scopes.length}
      />
      {scopes.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 품질 스냅샷이 없습니다." />
        </div>
      ) : (
        <QualityDashboard scopes={scopes} trends={trends} />
      )}
    </div>
  )
}
