import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Markdown } from '@/components/markdown'
import { TagList } from '@/components/content-badges'
import { formatCategory, formatDate } from '@/lib/format'

interface PostArticleProps {
  backHref: string
  backLabel: string
  title: string
  date: string
  content: string
  tags?: string[]
  badges?: { label: string; kind?: 'project' | 'category' }[]
  related?: { href: string; title: string }[]
  studyGuide?: {
    question?: string
    answer?: string
    prerequisites: { href: string; title: string }[]
    previous?: { href: string; title: string }
    next?: { href: string; title: string }
  }
  banner?: React.ReactNode
  studyCategories?: { category: string; count: number }[]
}

export function PostArticle({ backHref, backLabel, title, date, content, tags, badges, banner, related, studyGuide, studyCategories }: PostArticleProps) {
  const tableOfContents = studyCategories
    ? Array.from(content.matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)).map((match) => ({ id: match[2], title: match[3].replace(/<[^>]*>/g, '') }))
    : []
  return (
    <div className="ink-signal-page ink-signal-post-article mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {backLabel}
      </Link>

      <header className="ink-post-hero mt-6 space-y-4 border-b border-border pb-6">
        {badges && badges.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {badges.map((badge) => (
              <span
                key={`${badge.kind}-${badge.label}`}
                className={
                  badge.kind === 'project'
                    ? 'inline-flex items-center rounded-md bg-primary px-2 py-0.5 font-mono text-[0.7rem] font-medium text-primary-foreground'
                    : 'inline-flex items-center rounded-md border border-border px-2 py-0.5 font-mono text-[0.7rem] font-medium text-muted-foreground'
                }
              >
                {badge.kind === 'category' ? formatCategory(badge.label) : badge.label}
              </span>
            ))}
          </div>
        ) : null}

        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{title}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <time className="font-mono text-xs text-muted-foreground" dateTime={date}>
            {formatDate(date)}
          </time>
          <TagList tags={tags} />
        </div>
      </header>

      {banner ? <div className="mt-6">{banner}</div> : null}

      {studyGuide && (studyGuide.question || studyGuide.answer || studyGuide.prerequisites.length > 0) ? (
        <section className="mt-6 rounded-xl border border-brand/25 bg-brand/5 p-5" aria-label="이 글의 학습 안내">
          {studyGuide.question ? <p className="text-sm font-semibold text-brand">이 글이 답하는 질문 · {studyGuide.question}</p> : null}
          {studyGuide.answer ? <p className="mt-3 text-base font-medium leading-relaxed">{studyGuide.answer}</p> : null}
          {studyGuide.prerequisites.length > 0 ? (
            <div className="mt-4 border-t border-brand/15 pt-3">
              <p className="text-xs font-semibold text-muted-foreground">먼저 읽으면 좋은 글</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {studyGuide.prerequisites.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:border-brand/50 hover:text-foreground">
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {studyCategories ? <div className="mt-8 grid gap-8 lg:grid-cols-[170px_minmax(0,1fr)_170px]">
        <aside className="hidden lg:block" aria-label="기술 노트 주제">
          <div className="sticky top-28">
            <p className="mb-4 text-xs font-semibold text-brand">주제 탐색</p>
            <nav className="flex flex-col gap-1">
              {studyCategories.map((entry) => <Link key={entry.category} href={`/study/${entry.category}`} className="flex justify-between gap-2 rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-brand/5 hover:text-brand"><span>{formatCategory(entry.category)}</span><span>{entry.count}</span></Link>)}
            </nav>
          </div>
        </aside>
        <article className="min-w-0"><Markdown content={content} /></article>
        {tableOfContents.length > 0 ? <aside aria-label="이 글의 목차" className="order-first lg:order-none">
          <div className="rounded-lg border border-border p-4 lg:sticky lg:top-28 lg:border-0 lg:p-0">
            <p className="mb-3 text-xs font-semibold text-brand">이 글에서</p>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col">
              {tableOfContents.map((entry) => <a key={entry.id} href={`#${entry.id}`} className="text-xs leading-relaxed text-muted-foreground hover:text-brand">{entry.title}</a>)}
            </nav>
          </div>
        </aside> : null}
      </div> : <article className="mt-8"><Markdown content={content} /></article>}

      {related && related.length > 0 ? (
        <aside className="mt-10 border-t border-border pt-6" aria-labelledby="related-notes-title">
          <h2 id="related-notes-title" className="text-sm font-semibold">관련 노트</h2>
          <div className="mt-3 flex flex-col gap-2">
            {related.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground">
                {item.title} →
              </Link>
            ))}
          </div>
        </aside>
      ) : null}

      {studyGuide && (studyGuide.previous || studyGuide.next) ? (
        <nav className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2" aria-label="학습 순서 탐색">
          {studyGuide.previous ? (
            <Link href={studyGuide.previous.href} className="rounded-lg border border-border p-3 text-sm text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground">
              <span className="block text-xs text-brand">이전 Study</span>
              <span className="mt-1 block font-medium">← {studyGuide.previous.title}</span>
            </Link>
          ) : <div />}
          {studyGuide.next ? (
            <Link href={studyGuide.next.href} className="rounded-lg border border-border p-3 text-right text-sm text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground">
              <span className="block text-xs text-brand">다음 Study</span>
              <span className="mt-1 block font-medium">{studyGuide.next.title} →</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  )
}
