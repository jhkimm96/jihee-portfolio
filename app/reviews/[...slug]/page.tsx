import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import { getPublishedReviews, getReviewBySlugPath, getProjectTitle } from '@/lib/content-data'

export function generateStaticParams() {
  return getPublishedReviews().map((entry) => ({ slug: entry.slug.split('/') }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getReviewBySlugPath(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary ?? post.title
  }
}

export default async function ReviewDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const post = getReviewBySlugPath(slug)
  if (!post) notFound()

  return (
    <PostArticle
      backHref="/reviews"
      backLabel="Reviews"
      title={post.title}
      date={post.date}
      content={post.content}
      tags={post.tags}
      badges={[{ label: getProjectTitle(post.project), kind: 'project' }]}
    />
  )
}
