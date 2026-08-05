import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getLearningPaths, getPublishedStudy, getStudyCategorySummaries } from '@/lib/content-data'
import { formatCategory, formatDate } from '@/lib/format'
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
  const today = new Date().toISOString().slice(0, 10)
  const dueForReview = allPosts
    .filter((post) => post.status !== 'archived' && post.reviewAfter && post.reviewAfter <= today)
    .sort((a, b) => (a.reviewAfter ?? '').localeCompare(b.reviewAfter ?? ''))
    .slice(0, 5)
  const filtered = allPosts.filter((post) => {
    if (selectedCategory && post.category !== selectedCategory) return false
    if (!query) return true
    return [post.title, post.summary, post.category, ...(post.tags ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('ko')
      .includes(query)
  })
  const browsing = Boolean(query || selectedCategory)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Learning Notes"
        title="Study Notes"
        description="기억이 흐릿해졌을 때 키워드나 주제로 빠르게 다시 찾는 개인 기술 지식창고입니다."
        count={allPosts.length}
      />

      <section className="mt-6 rounded-lg border border-brand/25 bg-brand/5 p-5" aria-labelledby="learning-paths-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-brand">Guided path</p>
            <h2 id="learning-paths-title" className="mt-1 text-lg font-semibold">프로젝트 학습 경로</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">프로젝트가 늘어나도 경로 파일만 추가하면 단계와 연결 문서가 자동으로 표시됩니다. 현재 코드와 최신 근거를 기준으로 순서대로 읽습니다.</p>
          </div>
          <Link href="/study/paths" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">전체 경로 보기 <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {learningPaths.map((path) => (
            <Link key={path.project} href={`/study/paths/${path.project}`} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 text-sm hover:border-brand/50"><span className="font-medium">{path.title}</span><span className="font-mono text-xs text-muted-foreground">{path.stages.length}단계</span></Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Search className="size-4 text-brand" />
          <h2 className="text-sm font-semibold">나중에 다시 찾기</h2>
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

      {dueForReview.length > 0 ? (
        <section className="mt-6 rounded-lg border border-brand/20 bg-brand/5 p-4" aria-labelledby="review-notes-title">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-brand">Review queue</p>
              <h2 id="review-notes-title" className="mt-1 text-sm font-semibold">다시 볼 노트</h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{dueForReview.length}개</span>
          </div>
          <div className="mt-3 divide-y divide-border">
            {dueForReview.map((post) => (
              <Link key={post.slug} href={`/study/${post.slug}`} className="flex items-center justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0">
                <span className="font-medium hover:text-brand">{post.title}</span>
                <span className="shrink-0 font-mono text-[0.7rem] text-muted-foreground">{post.reviewAfter}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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
            <Link key={category.category} href={`/study/${category.category}`} className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/50">
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
