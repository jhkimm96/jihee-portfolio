'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { HeaderSearch } from '@/components/header-search'
import { getAbout } from '@/lib/content-data'

const navItems = [
  { href: '/projects', label: 'Projects', caption: '작업과 결과' },
  { href: '/engineering', label: 'Engineering', caption: '판단과 개선' },
  { href: '/study', label: 'Study Notes', caption: '개념과 회상' },
  { href: '/quality', label: 'Quality', caption: '측정과 추세' },
  { href: '/about', label: 'About', caption: '일하는 기준' },
  { href: '/resume', label: 'Resume', caption: '지원용 요약' }
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const about = getAbout()

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${about.name} 홈`}
          className="group relative flex shrink-0 items-center gap-2.5 font-mono tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Terminal className="size-4" />
          </span>
          <span className="text-[0.78rem] font-semibold tracking-[0.08em] text-foreground">
            JH / ENGINEERING
          </span>
          <span className="pointer-events-none absolute left-0 top-[calc(100%+0.7rem)] z-50 whitespace-nowrap rounded-md border border-border bg-foreground px-2.5 py-1.5 text-[0.65rem] font-medium tracking-[0.04em] text-background opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
            {about.name} · Backend / Systems
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="주요 페이지">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <span key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'block rounded-md px-3 py-2 font-mono text-[0.78rem] font-medium transition-colors',
                    active
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
                <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.65rem)] z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background px-2.5 py-1.5 text-[0.65rem] font-medium tracking-[0.04em] text-muted-foreground opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                  {item.caption}
                </span>
              </span>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <HeaderSearch />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-9 md:hidden"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background md:hidden" aria-label="모바일 주요 페이지">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-baseline justify-between rounded-md px-3 py-2.5 font-mono text-sm font-medium transition-colors',
                    active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-[0.65rem] font-normal tracking-[0.04em] text-muted-foreground/80">
                    {item.caption}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
