'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QUALITY_CATEGORIES, QUALITY_CATEGORY_DESCRIPTIONS, severityTotals, type QualityEntry } from '@/lib/content'
import { ScoreTrendChart, SeverityTrendChart, MetricSparkline } from '@/components/quality-charts'
import { cn } from '@/lib/utils'

function Delta({ diff, downIsGood = true, title }: { diff: number; downIsGood?: boolean; title?: string }) {
  if (diff === 0) return <span className="text-muted-foreground">—</span>
  const good = downIsGood ? diff < 0 : diff > 0
  return (
    <span
      className={cn('viz-root font-mono text-xs', title && 'cursor-help')}
      style={{ color: good ? 'var(--viz-delta-good)' : 'var(--viz-delta-bad)' }}
      title={title}
    >
      {diff > 0 ? '▲' : '▼'} {Math.abs(diff)}
    </span>
  )
}

export function QualityDashboard({ scopes, trends }: { scopes: string[]; trends: Record<string, QualityEntry[]> }) {
  const [scope, setScope] = useState(scopes[0])
  const trend = trends[scope] ?? []
  const latest = trend[trend.length - 1]
  const previous = trend[trend.length - 2]
  const mixedFormula = new Set(trend.map((e) => e.formulaVersion)).size > 1

  if (!latest) return null

  const findingsByCategory = new Map(latest.findings.map((f) => [f.category, f]))
  const prevByCategory = new Map((previous?.findings ?? []).map((f) => [f.category, f]))

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2">
        {scopes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScope(s)}
            className={cn(
              'rounded-md border border-border px-3 py-1.5 font-mono text-xs transition-colors',
              s === scope ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground">종합 점수 (100점 만점)</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-semibold">{latest.score}</span>
            {previous ? (
              <Delta
                diff={Math.round((latest.score - previous.score) * 10) / 10}
                downIsGood={false}
                title="직전 스냅샷 대비 점수 변화 — ▲ 상승(개선) · ▼ 하락(악화)"
              />
            ) : null}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {latest.date} · 산식 v{latest.formulaVersion}
            {mixedFormula ? ' · 이 스코프에 산식 버전이 다른 스냅샷이 섞여 있어 추세 비교에 주의' : ''}
          </div>
        </div>
        <MetricSparkline
          label="중복률 (%)"
          data={trend.map((e) => ({ date: e.date, value: e.metrics.duplicationPct }))}
          format={(v) => `${v}%`}
        />
        <MetricSparkline
          label="비대 클래스 수"
          data={trend.map((e) => ({ date: e.date, value: e.metrics.oversizedClasses }))}
        />
      </div>

      <section>
        <h2 className="mb-2 font-mono text-sm font-semibold">종합 점수 추세</h2>
        <ScoreTrendChart data={trend.map((e) => ({ date: e.date, score: e.score }))} />
      </section>

      <section>
        <h2 className="mb-2 font-mono text-sm font-semibold">심각도별 발견 건수</h2>
        <SeverityTrendChart data={trend.map((e) => ({ date: e.date, ...severityTotals(e) }))} />
      </section>

      <section>
        <h2 className="mb-2 font-mono text-sm font-semibold">카테고리별 최신 현황</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">카테고리</th>
                <th className="px-3 py-2 text-right font-medium">High</th>
                <th className="px-3 py-2 text-right font-medium">Medium</th>
                <th className="px-3 py-2 text-right font-medium">Low</th>
                <th
                  className="cursor-help px-3 py-2 text-right font-medium"
                  title="직전 스냅샷 대비 이 카테고리의 총 위반 건수 증감 — ▼ 줄었음(개선) · ▲ 늘었음(악화)"
                >
                  전회 대비
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs [font-variant-numeric:tabular-nums]">
              {QUALITY_CATEGORIES.map((category) => {
                const current = findingsByCategory.get(category) ?? { high: 0, medium: 0, low: 0 }
                const prev = prevByCategory.get(category)
                const total = current.high + current.medium + current.low
                const prevTotal = prev ? prev.high + prev.medium + prev.low : null
                return (
                  <tr key={category} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">
                      <span
                        className="cursor-help underline decoration-border decoration-dotted underline-offset-4"
                        title={QUALITY_CATEGORY_DESCRIPTIONS[category]}
                      >
                        {category}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">{current.high}</td>
                    <td className="px-3 py-2 text-right">{current.medium}</td>
                    <td className="px-3 py-2 text-right">{current.low}</td>
                    <td className="px-3 py-2 text-right">
                      {prevTotal === null ? (
                        <span className="cursor-help text-muted-foreground" title="비교할 이전 스냅샷이 아직 없습니다">
                          —
                        </span>
                      ) : (
                        <Delta diff={total - prevTotal} title="직전 스냅샷 대비 이 카테고리의 총 위반 건수 변화" />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          카테고리명에 마우스를 올리면 무엇을 점검하는지 설명이 표시됩니다. 전회 대비: 직전 스냅샷과 비교한 총 위반
          건수 변화 — ▼ 감소(개선) · ▲ 증가(악화).
        </p>
      </section>

      <div>
        <Link
          href={`/quality/${latest.slug}`}
          className="font-mono text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          최신 스냅샷 상세 보기 →
        </Link>
      </div>
    </div>
  )
}
