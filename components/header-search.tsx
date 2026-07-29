'use client'

import { Search } from 'lucide-react'

export function HeaderSearch() {
  return (
    <form action="/search" className="relative hidden w-44 lg:block">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        name="q"
        placeholder="검색"
        aria-label="사이트 검색"
        className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-2 font-mono text-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
      />
    </form>
  )
}
