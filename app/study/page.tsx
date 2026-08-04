import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedStudy, getStudyCategorySummaries } from '@/lib/content-data'
import { formatCategory, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Study',
  description: 'Spring, Kubernetes, Elasticsearch 등 백엔드/인프라 주제를 학습하며 정리한 노트입니다.'
}

export default async function StudyPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams
  const view = params.view === 'latest' ? 'latest' : 'category'
  const categories = getStudyCategorySummaries()
  const latest = getPublishedStudy()
  const total = latest.length

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Learning Notes"
        title="Study"
        description="주제별로 묶어 보거나 최신순으로 확인할 수 있습니다."
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
              { href: '/study?view=category', label: '주제별', value: 'category' },
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
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categories.map((cat) => (
                <Link
                  key={cat.category}
                  href={`/study/${cat.category}`}
                  className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/50"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-brand">
                      {formatCategory(cat.category)}
                    </h2>
                    <span className="font-mono text-xs text-muted-foreground">
                      {cat.count} notes · {formatDate(cat.latest)}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {cat.recent.map((post) => (
                      <li key={post.slug} className="truncate text-sm text-muted-foreground">
                        {post.title}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                    전체 보기
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
