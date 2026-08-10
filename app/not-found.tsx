import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const destinations = [
  { href: '/projects', label: 'Projects', description: '설계와 구현을 직접 맡은 프로젝트' },
  { href: '/engineering', label: 'Engineering', description: '문제 해결, 설계 판단, 리뷰, 코드 품질' },
  { href: '/study', label: 'Study Notes', description: '주제별로 정리한 학습 기록' },
  { href: '/resume', label: 'Resume', description: '지원 역할별로 구성한 이력서' }
]

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
      <h1 className="text-3xl font-bold tracking-[-0.02em] text-balance sm:text-4xl">찾으시는 페이지가 없습니다</h1>
      <p className="mt-3 font-mono text-sm text-muted-foreground">404 · Not Found</p>
      <p className="mt-5 max-w-[58ch] leading-relaxed text-muted-foreground text-pretty">
        주소가 바뀌었거나, 아직 공개하지 않은 글일 수 있습니다. 아래에서 원하는 곳으로 이동하거나 사이트 전체를
        검색해 보세요.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            홈으로
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">사이트 검색</Link>
        </Button>
      </div>

      <nav aria-label="주요 페이지" className="mt-14 border-t border-border pt-8">
        <p className="font-mono text-xs text-muted-foreground">자주 찾는 곳</p>
        <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {destinations.map((item) => (
            <li key={item.href} className="border-b border-border/70 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
              <Link
                href={item.href}
                className="group flex items-baseline justify-between gap-4 py-4 transition-colors hover:text-brand"
              >
                <span>
                  <span className="font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{item.description}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
