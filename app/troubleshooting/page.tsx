import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getPublishedTroubleshooting, getProjectTitle } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Troubleshooting',
  description: '실제 프로젝트에서 마주친 문제와 원인, 해결 과정을 기록한 트러블슈팅 로그입니다.'
}

export default function TroubleshootingPage() {
  const posts = getPublishedTroubleshooting()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Engineering Log"
        title="Troubleshooting"
        description="실제 프로젝트에서 마주친 문제 → 원인 → 해결 → 결과를 기록합니다. 최신순으로 정렬되며, 프로젝트와 카테고리로 분류됩니다."
        count={posts.length}
      />

      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 트러블슈팅 기록이 없습니다." />
        </div>
      ) : (
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
      )}
    </div>
  )
}
