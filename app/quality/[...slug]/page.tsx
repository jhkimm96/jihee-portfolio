import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import { getPublishedQuality, getQualityBySlugPath, getProjectTitle } from '@/lib/content-data'

export function generateStaticParams() {
  return getPublishedQuality().map((entry) => ({ slug: entry.slug.split('/') }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getQualityBySlugPath(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary ?? post.title
  }
}

export default async function QualityDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const post = getQualityBySlugPath(slug)
  if (!post) notFound()

  return (
    <PostArticle
      backHref="/quality"
      backLabel="Quality"
      title={post.title}
      date={post.date}
      content={post.content}
      tags={post.tags}
      badges={[
        { label: getProjectTitle(post.project), kind: 'project' },
        { label: `${post.scope} · ${post.score}점`, kind: 'project' }
      ]}
    />
  )
}
