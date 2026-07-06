import Link from 'next/link'
import { getPublishedTroubleshooting } from '@/lib/content-data'

export default function TroubleshootingPage() {
  const entries = getPublishedTroubleshooting()

  if (entries.length === 0) {
    return (
      <main>
        <h1>Troubleshooting</h1>
        <p>아직 작성된 글이 없습니다.</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Troubleshooting</h1>
      <ul>
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/troubleshooting/${entry.slug}`}>{entry.title}</Link>
            <span>
              {entry.project} · {entry.category}
            </span>
          </li>
        ))}
      </ul>
    </main>
  )
}
