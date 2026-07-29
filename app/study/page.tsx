import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedStudy, getPublishedStudyByCategory } from '@/lib/content-data'
import { formatCategory } from '@/lib/format'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Study',
  description: 'Spring, Kubernetes, Elasticsearch 등 백엔드/인프라 주제를 학습하며 정리한 노트입니다.'
}

export default async function StudyPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams
  const view = params.view === 'latest' ? 'latest' : 'category'
  const grouped = getPublishedStudyByCategory()
  const categories = Object.keys(grouped).sort()
  const latest = getPublishedStudy()
  const total = categories.reduce((sum, c) => sum + grouped[c].length, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Learning Notes"
        title="Study"
        description="꾸준히 학습한 내용을 최신순 또는 카테고리별로 확인할 수 있습니다."
        count={total}
      />

      {categories.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 학습 노트가 없습니다." />
        </div>
      ) : (
        <>
          <div className="mt-6 inline-flex rounded-md border border-border bg-card p-1">
            {[
              { href: '/study?view=category', label: '카테고리별', value: 'category' },
              { href: '/study?view=latest', label: '최신순', value: 'latest' }
            ].map((item) => (
              <Link
                key={item.value}
                href={item.href}
                className={cn(
                  'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
                  view === item.value ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {view === 'latest' ? (
            <div className="mt-8 grid grid-cols-1 gap-3">
              {latest.map((post) => (
                <PostCard
                  key={post.slug}
                  href={`/study/${post.slug}`}
                  title={post.title}
                  date={post.date}
                  summary={post.summary}
                  tags={post.tags}
                  badges={[{ label: post.category, kind: 'category' }]}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {categories.map((category) => (
                <section key={category}>
                  <div className="mb-4 flex items-baseline gap-3">
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-brand">
                      {formatCategory(category)}
                    </h2>
                    <span className="font-mono text-xs text-muted-foreground">{grouped[category].length}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {grouped[category].map((post) => (
                      <PostCard
                        key={post.slug}
                        href={`/study/${post.slug}`}
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
          )}
        </>
      )}
    </div>
  )
}
