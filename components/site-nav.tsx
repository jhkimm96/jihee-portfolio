'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { HeaderSearch } from '@/components/header-search'
import { getAbout } from '@/lib/content-data'

const navItems = [
  { href: '/projects', label: '프로젝트' },
  { href: '/study', label: '기술 노트' },
  { href: '/about', label: '소개' }
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
        <Link href="/" aria-label={`${about.name} 홈`} className="flex shrink-0 items-baseline gap-2 tracking-tight">
          <span className="text-2xl font-black text-foreground">JH</span><span className="text-sm font-medium text-muted-foreground">/ WORK</span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="주요 페이지">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'block border-b-2 px-3 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'border-brand text-brand'
                      : 'border-transparent text-foreground hover:text-brand'
                  )}
                >
                  {item.label}
                </Link>
            )
          })}
          {about.github ? <Link href={about.github} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold hover:text-brand">GitHub <ArrowUpRight className="size-4 text-brand" /></Link> : null}
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
                  <ArrowUpRight className="size-4" />
                </Link>
              )
            })}
            {about.github ? <Link href={about.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-2.5 text-sm font-medium">GitHub <ArrowUpRight className="size-4" /></Link> : null}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
