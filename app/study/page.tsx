import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getLearningPaths, getPublishedStudy, getStudyCategorySummaries } from '@/lib/content-data'
import { formatCategory, formatDate } from '@/lib/format'
import { studyRoadmap } from '@/lib/study-roadmap'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Study Notes',
  description: '다시 찾아보기 쉽도록 주제별로 정리한 학습 노트입니다.'
}

export default async function StudyPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string; q?: string; category?: string }>
}) {
  const params = await searchParams
  const query = params.q?.trim().toLocaleLowerCase('ko') ?? ''
  const selectedCategory = params.category ?? ''
  const view = params.view === 'latest' ? 'latest' : 'category'
  const categories = getStudyCategorySummaries()
  const allPosts = getPublishedStudy()
  const learningPaths = getLearningPaths()
  const filtered = allPosts.filter((post) => {
    if (selectedCategory && post.category !== selectedCategory) return false
    if (!query) return true
    return [post.title, post.summary, post.content, post.category, ...(post.tags ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('ko')
      .includes(query)
  })
  const browsing = Boolean(query || selectedCategory)

  const categoryCounts = new Map(categories.map((category) => [category.category, category.count]))

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Study Notes"
        description="프로젝트에서 발견한 질문과 개발자로서 쌓아갈 개념을 순서와 맥락이 보이게 정리한 개인 기술창고입니다."
        count={allPosts.length}
      />

      <section className="mt-8 rounded-xl border border-border bg-card p-5 shadow-e1 sm:p-6" aria-labelledby="study-roadmap-title">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Personal learning map</p>
            <h2 id="study-roadmap-title" className="mt-2 text-xl font-semibold tracking-tight">프로젝트를 넘어, 기술을 쌓는 순서</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">현재 노트를 무작정 최신순으로 읽지 않고, 기반 개념에서 설계와 운영으로 넘어가도록 추천 순서를 만들었습니다. 각 단계의 노트 수는 새 글을 추가하면 자동으로 갱신됩니다.</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">기반 → 설계 → 분산 → 운영</span>
        </div>
        <ol className="mt-5 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {studyRoadmap.map((track) => {
            const noteCount = track.categories.reduce((total, category) => total + (categoryCounts.get(category) ?? 0), 0)
            const firstCategory = track.categories.find((category) => categoryCounts.has(category))
            const href = firstCategory ? `/study?view=latest&category=${encodeURIComponent(firstCategory)}` : '/study?view=latest'

            return (
              <li key={track.step} className="flex min-h-48 flex-col bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-brand">0{track.step}</span>
                  <span className="font-mono text-xs text-muted-foreground">{noteCount} notes</span>
                </div>
                <h3 className="mt-5 text-base font-semibold">{track.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{track.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {track.categories.map((category) => (
                    <Link key={category} href={`/study?view=latest&category=${encodeURIComponent(category)}`} className={cn('rounded-full border px-2 py-0.5 font-mono text-[0.68rem] transition-colors hover:border-brand/50', categoryCounts.has(category) ? 'border-border text-muted-foreground' : 'border-dashed border-border text-muted-foreground/60')}>
                      {formatCategory(category)}
                    </Link>
                  ))}
                </div>
                <Link href={href} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-foreground">이 단계 노트 보기 <ArrowRight className="size-3.5" /></Link>
              </li>
            )
          })}
        </ol>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">읽은 뒤에는 프로젝트 경로에서 같은 개념이 실제 코드와 설계에 어떻게 적용됐는지 확인합니다. React, 브라우저, 풀스택 주제는 관련 노트가 쌓이는 시점에 다음 트랙으로 확장할 수 있습니다.</p>
      </section>

      <section className="mt-6 rounded-xl border border-brand/25 bg-brand/5 p-5 sm:p-6" aria-labelledby="project-paths-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Project verification paths</p>
            <h2 id="project-paths-title" className="mt-2 text-lg font-semibold">프로젝트별로 다시 연결하기</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">개인 학습 지도에서 익힌 개념을 PromptHub 같은 실제 프로젝트의 데이터 흐름, 선택, 장애 상황과 연결해 확인합니다. 프로젝트가 늘어나면 프로젝트별 경로를 추가합니다.</p>
          </div>
          <Link href="/study/paths" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">프로젝트 경로 모아보기 <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {learningPaths.map((path) => (
            <Link key={path.project} href={`/study/paths/${path.project}`} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 text-sm hover:border-brand/50"><span className="font-medium">{path.title}</span><span className="font-mono text-xs text-muted-foreground">{path.stages.length}단계</span></Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Search className="size-4 text-brand" />
          <h2 className="text-sm font-semibold">기술창고에서 다시 찾기</h2>
        </div>
        <form action="/study" className="flex gap-2">
          <input type="hidden" name="view" value="latest" />
          {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="예: 트랜잭션, HNSW, Kubernetes"
            aria-label="학습 노트 검색"
            className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand"
          />
          <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
            검색
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Link href="/study?view=latest" className={cn('rounded-full border px-2.5 py-1 text-xs', !selectedCategory ? 'border-brand bg-brand/5 text-brand' : 'border-border text-muted-foreground')}>
            전체
          </Link>
          {categories.map((category) => (
            <Link
              key={category.category}
              href={`/study?view=latest&category=${encodeURIComponent(category.category)}`}
              className={cn('rounded-full border px-2.5 py-1 text-xs transition-colors hover:border-brand/50', selectedCategory === category.category ? 'border-brand bg-brand/5 text-brand' : 'border-border text-muted-foreground')}
            >
              {formatCategory(category.category)} {category.count}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-6 inline-flex rounded-md border border-border bg-card p-1">
        {[{ value: 'category', label: '주제별' }, { value: 'latest', label: '최신순' }].map((item) => (
          <Link key={item.value} href={`/study?view=${item.value}`} className={cn('rounded-sm px-3 py-1.5 text-sm font-medium', view === item.value && !browsing ? 'bg-secondary text-foreground' : 'text-muted-foreground')}>
            {item.label}
          </Link>
        ))}
      </div>

      {browsing || view === 'latest' ? (
        filtered.length === 0 ? <div className="mt-8"><EmptyState message="조건에 맞는 학습 노트가 없습니다." /></div> :
        <div className="mt-8 grid grid-cols-1 gap-3">
          {filtered.map((post) => <PostCard key={post.slug} href={`/study/${post.slug}`} title={post.title} date={post.updatedAt ?? post.date} summary={post.summary} tags={post.tags} badges={[{ label: post.category, kind: 'category' }, { label: post.status }]} />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-8"><EmptyState message="아직 작성한 학습 노트가 없습니다." /></div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <Link key={category.category} href={`/study/${category.category}`} className="group flex flex-col rounded-xl border border-border bg-card p-4 shadow-e2 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-e3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-brand">{formatCategory(category.category)}</h2>
                <span className="font-mono text-xs text-muted-foreground">{category.count} notes · {formatDate(category.latest)}</span>
              </div>
              <ul className="mt-3 space-y-1.5">{category.recent.map((post) => <li key={post.slug} className="truncate text-sm text-muted-foreground">{post.title}</li>)}</ul>
              <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-foreground">전체 보기 <ArrowRight className="size-3.5" /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
