import type { Metadata } from 'next'
import { EmptyState, PageHeader } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { groupSearchResults, searchContent, searchResultTypeLabels } from '@/lib/search'

export const metadata: Metadata = {
  title: 'Search',
  description: '프로젝트, 문제 해결 기록, 설계 판단, 리뷰, 학습 노트를 한 번에 검색합니다.'
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const query = params.q?.trim() ?? ''
  const results = searchContent(query)
  const grouped = groupSearchResults(results)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Search"
        description="프로젝트, 문제 해결, 설계 판단, 리뷰, 학습 노트, 코드 품질을 타입별로 나누어 보여줍니다."
        count={query ? results.length : undefined}
      />

      <form action="/search" className="mt-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="예: Elasticsearch, JPA, Kubernetes"
          aria-label="검색어"
          className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
        />
        <button
          type="submit"
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          검색
        </button>
      </form>

      {!query ? (
        <div className="mt-8">
          <EmptyState message="검색어를 입력하면 타입별 결과가 표시됩니다." />
        </div>
      ) : results.length === 0 ? (
        <div className="mt-8">
          <EmptyState message={`"${query}"에 대한 검색 결과가 없습니다.`} />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {Object.entries(grouped).map(([type, entries]) =>
            entries.length > 0 ? (
              <section key={type}>
                <div className="mb-4 flex items-baseline gap-3">
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-brand">
                    {searchResultTypeLabels[type as keyof typeof searchResultTypeLabels]}
                  </h2>
                  <span className="font-mono text-xs text-muted-foreground">{entries.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {entries.map((result) => (
                    <PostCard
                      key={`${result.type}-${result.href}`}
                      href={result.href}
                      title={result.title}
                      date={result.date ?? ''}
                      summary={result.summary}
                      tags={result.tags}
                      badges={[
                        { label: result.type },
                        ...(result.project ? [{ label: result.project, kind: 'project' as const }] : []),
                        ...(result.category ? [{ label: result.category, kind: 'category' as const }] : [])
                      ]}
                    />
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
