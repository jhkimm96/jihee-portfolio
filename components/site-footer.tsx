import Link from 'next/link'
import { GitFork, Mail } from 'lucide-react'
import { getAbout } from '@/lib/content-data'

export function SiteFooter() {
  const about = getAbout()

  return (
    <footer className="no-print border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p className="font-mono text-sm font-semibold">{about.name}</p>
          <p className="text-xs text-muted-foreground">{about.role} · 포트폴리오 · 트러블슈팅 · 학습 기록</p>
        </div>
        <div className="flex items-center gap-4">
          {about.github ? (
            <Link
              href={about.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitFork className="size-4" />
              GitHub
            </Link>
          ) : null}
          {about.email ? (
            <Link
              href={`mailto:${about.email}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4" />
              {about.email}
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
