import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedDecisions, getProjectTitle } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Decisions',
  description: '프로젝트에서 내린 설계 결정과 그 배경, 이후 어떻게 바뀌었는지를 ADR 형식으로 기록합니다.'
}

export default function DecisionsPage() {
  const decisions = getPublishedDecisions()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Architecture Log"
        title="Design Decisions"
        description="왜 이렇게 설계했는지, 이후 왜 바뀌었는지를 ADR(Architecture Decision Record) 형식으로 기록합니다. 최신순으로 정렬됩니다."
        count={decisions.length}
      />

      {decisions.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 설계 결정 기록이 없습니다." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {decisions.map((entry) => (
            <PostCard
              key={entry.slug}
              href={`/decisions/${entry.slug}`}
              title={entry.title}
              date={entry.date}
              summary={entry.summary}
              tags={entry.tags}
              badges={[
                { label: getProjectTitle(entry.project), kind: 'project' },
                { label: entry.category, kind: 'category' },
                ...(entry.status === 'superseded' ? [{ label: 'Superseded' }] : [])
              ]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
