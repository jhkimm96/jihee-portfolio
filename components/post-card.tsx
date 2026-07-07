import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { formatCategory, formatDate } from '@/lib/format'
import { TagList } from '@/components/content-badges'

interface PostCardProps {
  href: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  badges?: { label: string; kind?: 'project' | 'category' }[]
}

export function PostCard({ href, title, date, summary, tags, badges }: PostCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2.5 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/50"
    >
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

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[0.95rem] font-semibold leading-snug tracking-tight text-pretty">{title}</h3>
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
      </div>

      {summary ? <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{summary}</p> : null}

      <div className="mt-1 flex items-center justify-between gap-3">
        <TagList tags={tags} />
        <time className="shrink-0 font-mono text-[0.7rem] text-muted-foreground" dateTime={date}>
          {formatDate(date)}
        </time>
      </div>
    </Link>
  )
}
