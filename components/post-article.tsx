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
  badges?: { label: string; kind: 'project' | 'category' }[]
  banner?: React.ReactNode
}

export function PostArticle({ backHref, backLabel, title, date, content, tags, badges, banner }: PostArticleProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {backLabel}
      </Link>

      <header className="mt-6 space-y-4 border-b border-border pb-6">
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

      <article className="mt-8">
        <Markdown content={content} />
      </article>
    </div>
  )
}
