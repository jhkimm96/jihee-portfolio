import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedStudyByCategory } from '@/lib/content-data'
import { formatCategory } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Study',
  description: 'Spring, Kubernetes, Elasticsearch 등 백엔드/인프라 주제를 학습하며 정리한 노트입니다.'
}

export default function StudyPage() {
  const grouped = getPublishedStudyByCategory()
  const categories = Object.keys(grouped).sort()
  const total = categories.reduce((sum, c) => sum + grouped[c].length, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Learning Notes"
        title="Study"
        description="꾸준히 학습한 내용을 주제별로 정리합니다. 카테고리(폴더)별로 그룹핑되어 한눈에 분류를 확인할 수 있습니다."
        count={total}
      />

      {categories.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 학습 노트가 없습니다." />
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
    </div>
  )
}
