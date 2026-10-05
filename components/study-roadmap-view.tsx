'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { StudyEntry } from '@/lib/content'
import { formatCategory } from '@/lib/format'
import { orderStudyPosts, type StudyRoadmapTrack } from '@/lib/study-roadmap'

export function StudyRoadmapView({ tracks, posts }: { tracks: StudyRoadmapTrack[]; posts: StudyEntry[] }) {
  const [selectedStep, setSelectedStep] = useState(tracks[0]?.step ?? 1)
  const selectedTrack = tracks.find((track) => track.step === selectedStep) ?? tracks[0]

  if (!selectedTrack) return null

  const readingItems = selectedTrack.categories.flatMap((category) => {
    const categoryPosts = orderStudyPosts(posts.filter((post) => post.category === category), category)
    return categoryPosts.map((post, index) => ({ post, category, index }))
  })

  return (
    <div className="ink-roadmap-layout mt-10">
      <nav className="ink-roadmap-steps" aria-label="학습 단계">
        {tracks.map((track) => (
          <button
            key={track.step}
            type="button"
            aria-pressed={selectedTrack.step === track.step}
            onClick={() => setSelectedStep(track.step)}
          >
            <span>{String(track.step).padStart(2, '0')}</span>
            <strong>{track.title}</strong>
          </button>
        ))}
      </nav>

      <section className="ink-roadmap-content" aria-live="polite" aria-labelledby="roadmap-track-title">
        <p className="ink-roadmap-kicker">{selectedTrack.step} / {tracks.length} 단계 · 권장 읽기 순서</p>
        <h2 id="roadmap-track-title">{selectedTrack.title}</h2>
        <p className="ink-roadmap-description">{selectedTrack.description}</p>

        <ol className="ink-roadmap-reading-list">
          {readingItems.map(({ post, category, index }) => (
            <li key={post.slug}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <Link href={`/study/${post.slug}`}>{post.title}</Link>
                <small>{post.summary ?? `${formatCategory(category)} 개념부터 이어 읽기`}</small>
              </div>
              <ArrowRight aria-hidden="true" className="size-4" />
            </li>
          ))}
        </ol>

        {readingItems.length === 0 ? <p className="ink-roadmap-empty">이 단계의 노트가 쌓이면 추천 순서가 여기에 나타납니다.</p> : null}

        <p className="ink-roadmap-note">개인 학습 지도입니다. 완료율이나 읽음 상태는 공개하지 않습니다. 새 글은 해당 주제의 추천 순서 뒤에 추가됩니다.</p>
        <Link className="ink-roadmap-cta" href="/study/paths">프로젝트에 적용된 개념 따라가기 <ArrowRight aria-hidden="true" className="size-4" /></Link>
      </section>
    </div>
  )
}
