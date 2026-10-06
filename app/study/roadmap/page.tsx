import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPublishedStudy } from '@/lib/content-data'
import { studyRoadmap } from '@/lib/study-roadmap'
import { StudyRoadmapView } from '@/components/study-roadmap-view'

export const metadata: Metadata = {
  title: '기술 노트 학습 순서',
  description: '기반 개념부터 설계와 운영까지 기술 노트를 순서대로 읽는 개인 학습 지도입니다.'
}

export default function StudyRoadmapPage() {
  const posts = getPublishedStudy()

  return (
    <main className="ink-signal-page ink-signal-roadmap-page mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/study" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> 기술 노트
      </Link>
      <header className="mt-6 border-b border-border pb-8">
        <p className="text-sm font-semibold text-brand">Personal learning map</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">기술 노트, 순서대로 읽기</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          CS와 Java 기반부터 애플리케이션, 데이터, 분산 시스템, 운영으로 이어집니다.
          번호는 추천 순서이며 읽음 여부를 공개하거나 추적하지 않습니다.
        </p>
      </header>

      <StudyRoadmapView tracks={studyRoadmap} posts={posts} />
      <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
        새 글은 순서를 검토한 뒤 로드맵에 추가합니다. 프로젝트 전체 흐름을 복습할 때는 <Link href="/study/paths" className="text-brand underline underline-offset-2">프로젝트 학습 경로</Link>를 이용하세요.
      </p>
    </main>
  )
}
