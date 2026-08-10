import Link from 'next/link'
import { Mail } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { getAbout } from '@/lib/content-data'

const footerNav = [
  { href: '/projects', label: 'Projects' },
  { href: '/engineering', label: 'Engineering' },
  { href: '/study', label: 'Study Notes' },
  { href: '/quality', label: 'Quality' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/search', label: 'Search' }
]

export function SiteFooter() {
  const about = getAbout()

  return (
    <footer className="no-print mt-16 border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold">{about.name}</p>
            <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground text-pretty">
              {about.role} · 프로젝트와 그 근거가 되는 기록을 함께 남깁니다.
            </p>
          </div>

          <nav aria-label="사이트 링크">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-1 sm:justify-items-end">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} {about.name}
          </p>
          <div className="flex items-center gap-5">
            {about.github ? (
              <Link
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon className="size-4" />
                GitHub
              </Link>
            ) : null}
            {about.email ? (
              <Link
                href={`mailto:${about.email}`}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4" />
                {about.email}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
