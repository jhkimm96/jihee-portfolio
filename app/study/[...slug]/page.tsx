import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import { StudyCategory } from '@/components/study-category'
import { getPublishedStudy, getStudyBySlugPath, getStudyCategories } from '@/lib/content-data'
import { formatCategory } from '@/lib/format'

export function generateStaticParams() {
  const posts = getPublishedStudy().map((entry) => ({ slug: entry.slug.split('/') }))
  const categories = getStudyCategories().map((category) => ({ slug: [category] }))
  return [...posts, ...categories]
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getStudyBySlugPath(slug)
  if (post) {
    return { title: post.title, description: post.summary ?? post.title }
  }
  if (slug.length === 1 && getStudyCategories().includes(slug[0])) {
    return { title: `${formatCategory(slug[0])} — Study` }
  }
  return {}
}

export default async function StudyDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const post = getStudyBySlugPath(slug)

  if (post) {
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

  if (slug.length === 1 && getStudyCategories().includes(slug[0])) {
    const category = slug[0]
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/study"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Study
        </Link>
        <h1 className="mt-4 mb-8 text-2xl font-bold tracking-tight sm:text-3xl">{formatCategory(category)}</h1>
        <StudyCategory category={category} />
      </div>
    )
  }

  notFound()
}
