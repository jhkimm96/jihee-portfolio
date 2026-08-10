import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { ViewToggle } from '@/components/view-toggle'
import { getPublishedReviews, getReviewsGrouped, getProjectTitle } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Reviews',
  description: '프로젝트 전체를 분석한 코드 리뷰·리스크 레지스터 기록입니다.'
}

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ view?: string; project?: string }> }) {
  const params = await searchParams
  const view = params.view === 'latest' ? 'latest' : 'category'
  const project = params.project
  const posts = getPublishedReviews().filter((post) => !project || post.project === project)
  const grouped = getReviewsGrouped().filter(([groupProject]) => !project || groupProject === project)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        title={project ? `${getProjectTitle(project)} Reviews` : 'Reviews'}
        description="프로젝트 전체를 분석한 리뷰와 리스크 레지스터를 기록합니다. 프로젝트로 묶어 보거나 최신순으로 확인할 수 있습니다."
        count={posts.length}
      />

      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 작성된 리뷰가 없습니다." />
        </div>
      ) : (
        <>
          <ViewToggle basePath="/reviews" view={view} project={project} />

          {view === 'latest' ? (
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
          ) : (
            <div className="mt-8 space-y-10">
              {grouped.map(([project, projectPosts]) => (
                <section key={project}>
                  <div className="mb-3 flex items-baseline gap-3">
                    <Link
                      href={`/projects/${project}`}
                      className="font-mono text-sm font-semibold tracking-tight transition-colors hover:text-brand"
                    >
                      {getProjectTitle(project)}
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground">{projectPosts.length}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {projectPosts.map((post) => (
                      <PostCard
                        key={post.slug}
                        href={`/reviews/${post.slug}`}
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
