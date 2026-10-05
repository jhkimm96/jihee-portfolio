import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { getAbout, getResume, getResumeVariantBySlug, getPickTarget } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Resume',
  description: '백엔드를 중심으로 프론트엔드, 데이터, 인프라, 아키텍처까지 연결해 설명하는 이력서입니다.'
}

export default function ResumePage() {
  const about = getAbout()
  const resume = getResume()
  const primaryVariant = getResumeVariantBySlug('backend')
  const fullstackVariant = getResumeVariantBySlug('fullstack')
  const architectureVariant = getResumeVariantBySlug('architecture')
  const representativePicks = [
    ...(primaryVariant?.picks.slice(0, 3) ?? []),
    ...(fullstackVariant?.picks.filter((pick) => pick.slug === 'career-link').slice(0, 1) ?? []),
    ...(architectureVariant?.picks.filter((pick) => pick.slug === 'prompthub/product-service/ai-recommendation-independent-service').slice(0, 1) ?? [])
  ]

  return (
    <div className="ink-signal-page ink-signal-resume mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        title="이력서"
        description="백엔드를 중심으로 문제의 범위를 넓혀가며, 프론트엔드와 데이터, 인프라, 아키텍처까지 연결해 일해온 경험을 정리했습니다."
      />

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-lg border border-brand/30 bg-brand/5 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Profile</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em]">{about.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{about.role} · {about.location}</p>
          <p className="mt-6 text-sm leading-relaxed text-foreground/80">{resume.summary}</p>
          <Link href="/resume/backend" className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-brand underline-offset-4 hover:underline">
            대표 이력서 자세히 보기 <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Capabilities</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {resume.skills.map((skill) => (
              <div key={skill.group}>
                <h3 className="font-mono text-xs text-muted-foreground">{skill.group}</h3>
                <p className="mt-1.5 text-sm leading-relaxed">{skill.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {representativePicks.length > 0 ? (
        <section className="mt-8 border-t border-border pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Selected evidence</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">이력서에서 바로 확인할 수 있는 대표 사례</h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{representativePicks.length} records</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {representativePicks.map((pick) => (
              (() => {
                const target = getPickTarget(pick.type, pick.slug)
                if (!target) return null
                return (
                  <Link key={`${pick.type}-${pick.slug}`} href={target.href} className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/50 hover:bg-brand/5">
                    <p className="font-mono text-xs text-brand">{pick.type}</p>
                    <p className="mt-2 text-sm font-semibold group-hover:text-brand">{pick.headline}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pick.summary}</p>
                    {pick.problem || pick.decision || pick.evidence ? (
                      <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                        {pick.problem ? <p><span className="font-mono text-brand">문제</span> {pick.problem}</p> : null}
                        {pick.decision ? <p><span className="font-mono text-brand">선택</span> {pick.decision}</p> : null}
                        {pick.evidence ? <p><span className="font-mono text-brand">검증</span> {pick.evidence}</p> : null}
                      </div>
                    ) : null}
                    <p className="mt-3 font-mono text-[0.7rem] text-muted-foreground">상세 기록 보기 →</p>
                  </Link>
                )
              })()
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
