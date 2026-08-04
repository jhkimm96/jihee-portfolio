import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { ViewToggle } from '@/components/view-toggle'
import { getPublishedDecisions, getDecisionsGrouped, getProjectTitle } from '@/lib/content-data'
import { formatCategory } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Decisions',
  description: '프로젝트에서 내린 설계 결정과 그 배경, 이후 어떻게 바뀌었는지를 ADR 형식으로 기록합니다.'
}

export default async function DecisionsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams
  const view = params.view === 'latest' ? 'latest' : 'category'
  const decisions = getPublishedDecisions()
  const grouped = getDecisionsGrouped()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Architecture Log"
        title="Design Decisions"
        description="왜 이렇게 설계했는지, 이후 왜 바뀌었는지를 ADR(Architecture Decision Record) 형식으로 기록합니다. 프로젝트·서비스로 묶어 보거나 최신순으로 확인할 수 있습니다."
        count={decisions.length}
      />

      {decisions.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 설계 결정 기록이 없습니다." />
        </div>
      ) : (
        <>
          <ViewToggle basePath="/decisions" view={view} />

          {view === 'latest' ? (
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
          ) : (
            <div className="mt-8 space-y-12">
              {grouped.map(({ project, categories }) => (
                <div key={project} className="space-y-8">
                  <h2 className="font-mono text-sm font-semibold tracking-tight">{getProjectTitle(project)}</h2>
                  {categories.map(([category, categoryEntries]) => (
                    <section key={category}>
                      <div className="mb-3 flex items-baseline gap-3">
                        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
                          {formatCategory(category)}
                        </h3>
                        <span className="font-mono text-xs text-muted-foreground">{categoryEntries.length}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {categoryEntries.map((entry) => (
                          <PostCard
                            key={entry.slug}
                            href={`/decisions/${entry.slug}`}
                            title={entry.title}
                            date={entry.date}
                            summary={entry.summary}
                            tags={entry.tags}
                            badges={entry.status === 'superseded' ? [{ label: 'Superseded' }] : undefined}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
