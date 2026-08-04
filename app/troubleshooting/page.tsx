import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { ViewToggle } from '@/components/view-toggle'
import { getPublishedTroubleshooting, getTroubleshootingGrouped, getProjectTitle } from '@/lib/content-data'
import { formatCategory } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Troubleshooting',
  description: '실제 프로젝트에서 마주친 문제와 원인, 해결 과정을 기록한 트러블슈팅 로그입니다.'
}

export default async function TroubleshootingPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams
  const view = params.view === 'latest' ? 'latest' : 'category'
  const posts = getPublishedTroubleshooting()
  const grouped = getTroubleshootingGrouped()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Engineering Log"
        title="Troubleshooting"
        description="실제 프로젝트에서 마주친 문제 → 원인 → 해결 → 결과를 기록합니다. 프로젝트·카테고리로 묶어 보거나 최신순으로 확인할 수 있습니다."
        count={posts.length}
      />

      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 트러블슈팅 기록이 없습니다." />
        </div>
      ) : (
        <>
          <ViewToggle basePath="/troubleshooting" view={view} />

          {view === 'latest' ? (
            <div className="mt-8 flex flex-col gap-3">
              {posts.map((post) => (
                <PostCard
                  key={post.slug}
                  href={`/troubleshooting/${post.slug}`}
                  title={post.title}
                  date={post.date}
                  summary={post.summary}
                  tags={post.tags}
                  badges={[
                    { label: getProjectTitle(post.project), kind: 'project' },
                    { label: post.category, kind: 'category' }
                  ]}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 space-y-12">
              {grouped.map(({ project, categories }) => (
                <div key={project} className="space-y-8">
                  <h2 className="font-mono text-sm font-semibold tracking-tight">{getProjectTitle(project)}</h2>
                  {categories.map(([category, categoryPosts]) => (
                    <section key={category}>
                      <div className="mb-3 flex items-baseline gap-3">
                        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
                          {formatCategory(category)}
                        </h3>
                        <span className="font-mono text-xs text-muted-foreground">{categoryPosts.length}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {categoryPosts.map((post) => (
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
