import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import { getPublishedStudyByCategory, getStudyBySlugPath } from '@/lib/content-data'

export function generateStaticParams() {
  return Object.values(getPublishedStudyByCategory())
    .flat()
    .map((entry) => ({ slug: entry.slug.split('/') }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getStudyBySlugPath(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary ?? post.title
  }
}

export default async function StudyDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const post = getStudyBySlugPath(slug)
  if (!post) notFound()

  return (
    <PostArticle
      backHref="/study"
      backLabel="Study"
      title={post.title}
      date={post.date}
      content={post.content}
      tags={post.tags}
      badges={[{ label: post.category, kind: 'category' }]}
    />
  )
}
