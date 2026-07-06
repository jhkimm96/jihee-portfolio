import Link from 'next/link'
import { getPublishedStudyByCategory } from '@/lib/content-data'

export default function StudyPage() {
  const grouped = getPublishedStudyByCategory()
  const categories = Object.keys(grouped)

  if (categories.length === 0) {
    return (
      <main>
        <h1>Study</h1>
        <p>아직 작성된 글이 없습니다.</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Study</h1>
      {categories.map((category) => (
        <section key={category}>
          <h2>{category}</h2>
          <ul>
            {grouped[category].map((entry) => (
              <li key={entry.slug}>
                <Link href={`/study/${entry.slug}`}>{entry.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
