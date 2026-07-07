import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/post-article'
import {
  getPublishedDecisions,
  getDecisionBySlugPath,
  getDecisionTitle,
  getProjectTitle
} from '@/lib/content-data'

export function generateStaticParams() {
  return getPublishedDecisions().map((entry) => ({ slug: entry.slug.split('/') }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getDecisionBySlugPath(slug)
  if (!entry) return {}
  return {
    title: entry.title,
    description: entry.summary ?? entry.title
  }
}

export default async function DecisionDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const entry = getDecisionBySlugPath(slug)
  if (!entry) notFound()

  const banner =
    entry.status === 'superseded' && entry.supersededBy ? (
      <div className="rounded-md border border-border bg-secondary/50 px-4 py-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          이 결정은{' '}
          <Link
            href={`/decisions/${entry.supersededBy}`}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {getDecisionTitle(entry.supersededBy)}
          </Link>
          (으)로 대체되었습니다.
        </p>
      </div>
    ) : null

  return (
    <PostArticle
      backHref="/decisions"
      backLabel="Decisions"
      title={entry.title}
      date={entry.date}
      content={entry.content}
      tags={entry.tags}
      badges={[
        { label: getProjectTitle(entry.project), kind: 'project' },
        { label: entry.category, kind: 'category' }
      ]}
      banner={banner}
    />
  )
}
