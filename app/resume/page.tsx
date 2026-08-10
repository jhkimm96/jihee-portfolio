import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/page-header'
import { getResumeVariants } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Resume',
  description: '지원 역할에 맞춰 요약과 대표 사례를 다르게 구성한 이력서입니다.'
}

export default function ResumePage() {
  const variants = getResumeVariants()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        title="지원 역할별 이력서"
        description="같은 사람, 다른 강조점. 역할에 맞춘 요약과 직접 고른 대표 사례로 구성했습니다. 각 버전은 그대로 PDF로 내보낼 수 있습니다."
        count={variants.length}
      />

      {variants.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 등록된 이력서 버전이 없습니다." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {variants.map((variant) => (
            <Link
              key={variant.slug}
              href={`/resume/${variant.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-e2 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-e3"
            >
              <p className="font-mono text-xs text-muted-foreground">{`--role ${variant.slug}`}</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">{variant.label}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">{variant.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                {variant.picks.length} cases · 보기
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
