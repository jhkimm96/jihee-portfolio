'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { StudyEntry } from '@/lib/content'
import { formatCategory } from '@/lib/format'
import { getTrackRoadmapPosts, type StudyRoadmapTrack } from '@/lib/study-roadmap'

export function StudyRoadmapView({ tracks, posts }: { tracks: StudyRoadmapTrack[]; posts: StudyEntry[] }) {
  const [selectedStep, setSelectedStep] = useState(tracks[0]?.step ?? 1)
  const selectedTrack = tracks.find((track) => track.step === selectedStep) ?? tracks[0]

  if (!selectedTrack) return null

  const readingItems = getTrackRoadmapPosts(posts, selectedTrack)

  return (
    <div className="ink-roadmap-layout mt-10">
      <nav className="ink-roadmap-steps" aria-label="학습 단계">
        {tracks.map((track) => (
          <button
            key={track.step}
            id={`step-${track.step}`}
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
          {readingItems.map((post, index) => (
            <li key={post.slug}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                {post.question ? <p className="mb-1 text-xs text-brand">{post.question}</p> : null}
                <Link href={`/study/${post.slug}`}>{post.title}</Link>
                <small>{post.summary ?? `${formatCategory(post.category)} 개념부터 이어 읽기`}</small>
              </div>
              <ArrowRight aria-hidden="true" className="size-4" />
            </li>
          ))}
        </ol>

        {readingItems.length === 0 ? <p className="ink-roadmap-empty">이 단계의 노트가 쌓이면 추천 순서가 여기에 나타납니다.</p> : null}

        <p className="ink-roadmap-note">완료율이나 읽음 상태는 공개하지 않습니다. 공개 로드맵에는 순서가 검토된 노트만 표시합니다.</p>
        <Link className="ink-roadmap-cta" href="/study/paths">프로젝트에 적용된 개념 따라가기 <ArrowRight aria-hidden="true" className="size-4" /></Link>
      </section>
    </div>
  )
}
