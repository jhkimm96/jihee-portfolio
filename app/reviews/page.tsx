import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedReviews, getProjectTitle } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Reviews',
  description: '프로젝트 전체를 분석한 코드 리뷰·리스크 레지스터 기록입니다.'
}

export default function ReviewsPage() {
  const posts = getPublishedReviews()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Project Review"
        title="Reviews"
        description="프로젝트 전체를 분석한 리뷰와 리스크 레지스터를 기록합니다. 최신순으로 정렬되며, 프로젝트로 분류됩니다."
        count={posts.length}
      />

      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 리뷰가 없습니다." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              href={`/reviews/${post.slug}`}
              title={post.title}
              date={post.date}
              summary={post.summary}
              tags={post.tags}
              badges={[{ label: getProjectTitle(post.project), kind: 'project' }]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
