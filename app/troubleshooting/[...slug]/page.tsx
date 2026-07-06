import { notFound } from 'next/navigation'
import { getPublishedTroubleshooting, getTroubleshootingBySlugPath } from '@/lib/content-data'

export function generateStaticParams() {
  return getPublishedTroubleshooting().map((entry) => ({ slug: entry.slug.split('/') }))
}

export default async function TroubleshootingDetailPage({
  params
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const entry = getTroubleshootingBySlugPath(slug)
  if (!entry) notFound()

  return (
    <main>
      <h1>{entry.title}</h1>
      <p>
        {entry.date} · {entry.project} · {entry.category}
      </p>
      <article dangerouslySetInnerHTML={{ __html: entry.content }} />
    </main>
  )
}
