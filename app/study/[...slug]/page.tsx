import { notFound } from 'next/navigation'
import { getPublishedStudyByCategory, getStudyBySlugPath } from '@/lib/content-data'

export function generateStaticParams() {
  return Object.values(getPublishedStudyByCategory())
    .flat()
    .map((entry) => ({ slug: entry.slug.split('/') }))
}

export default async function StudyDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const entry = getStudyBySlugPath(slug)
  if (!entry) notFound()

  return (
    <main>
      <h1>{entry.title}</h1>
      <p>
        {entry.date} · {entry.category}
      </p>
      <article dangerouslySetInnerHTML={{ __html: entry.content }} />
    </main>
  )
}
