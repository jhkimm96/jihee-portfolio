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

/** 산식 v3 가중치. 히스토리의 점수 분해 표시에 쓴다 — 산식을 올리면 여기도 함께 고친다. */
const SCORE_WEIGHTS = { high: 8, medium: 1, low: 0.5, oversized: 1, longMethod: 1 } as const

function signed(n: number): string {
  const v = Number.isInteger(n) ? String(n) : n.toFixed(1)
  return n > 0 ? `+${v}` : v
}

/**
 * 직전 스냅샷 대비 점수 변화를 항목별로 분해한다. High 변화만 보여주면 다른 항목이 함께
 * 움직인 구간에서 "High 1건 = −14점"처럼 잘못 읽히므로, 점수를 움직인 항목을 전부 나열한다.
 */
function historyNote(entry: QualityEntry, prevEntry: QualityEntry | undefined): string {
  if (!prevEntry) return '최초 측정'
  const curr = severityTotals(entry)
  const prev = severityTotals(prevEntry)
  const parts: string[] = []
  const add = (label: string, diff: number, weight: number) => {
    if (diff === 0) return
    parts.push(`${label} ${signed(diff)}건 (${signed(-diff * weight)})`)
  }
  add('High', curr.high - prev.high, SCORE_WEIGHTS.high)
  add('Medium', curr.medium - prev.medium, SCORE_WEIGHTS.medium)
  add('Low', curr.low - prev.low, SCORE_WEIGHTS.low)
  add('비대', entry.metrics.oversizedClasses - prevEntry.metrics.oversizedClasses, SCORE_WEIGHTS.oversized)
  // longMethods는 v2에서 추가된 항목이라 이전 스냅샷에는 없을 수 있다.
  add('긴메서드', (entry.metrics.longMethods ?? 0) - (prevEntry.metrics.longMethods ?? 0), SCORE_WEIGHTS.longMethod)
  // 중복률은 3% 초과분만 감점된다. 초과 구간에 들어간 적이 없어도 합계가 어긋나지 않도록 함께 계산한다.
  const dupPenalty = (pct: number) => Math.max(0, Math.ceil(pct - 3))
  const dupDiff = dupPenalty(entry.metrics.duplicationPct) - dupPenalty(prevEntry.metrics.duplicationPct)
  if (dupDiff !== 0) parts.push(`중복률 ${signed(dupDiff)}%p (${signed(-dupDiff)})`)
  return parts.length > 0 ? parts.join(' · ') : '변화 없음'
}

export function QualityDashboard({
  groups,
  trends,
  initialProject
}: {
  groups: { project: string; projectTitle: string; scopes: string[] }[]
  trends: Record<string, QualityEntry[]>
  initialProject?: string
}) {
  const initialGroup = groups.find((group) => group.project === initialProject) ?? groups[0]
  const firstKey = initialGroup ? `${initialGroup.project}/${initialGroup.scopes[0]}` : ''
  const [selected, setSelected] = useState(firstKey)
  const trend = trends[selected] ?? []
  const latest = trend[trend.length - 1]
  const previous = trend[trend.length - 2]
  const mixedFormula = new Set(trend.map((e) => e.formulaVersion)).size > 1

  if (!latest) return null

  const findingsByCategory = new Map(latest.findings.map((f) => [f.category, f]))
  const prevByCategory = new Map((previous?.findings ?? []).map((f) => [f.category, f]))

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <div key={group.project} className="rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">Project</span>
              <span className="text-sm font-semibold">{group.projectTitle}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">Scope</span>
              {group.scopes.map((s) => {
                const key = `${group.project}/${s}`
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    className={cn(
                      'rounded-md border border-border px-3 py-1.5 font-mono text-xs transition-colors',
                      key === selected ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
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
            {latest.date} · 산식 v{latest.formulaVersion}{latest.commit ? ` · ${latest.commit}` : ''}
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
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          5개 회차를 각 측정 커밋 소스로 재확인해 루브릭 폭을 통일하고, 산식 v3로 다시 계산한 점수입니다. 최초 게시 점수와 정정 사유는 각 스냅샷에 남겼습니다.
        </p>
        <ScoreTrendChart data={trend.map((e) => ({ date: e.date, score: e.score }))} />
      </section>

      <section>
        <h2 className="mb-2 font-mono text-sm font-semibold">심각도별 발견 건수</h2>
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          매일 수집하는 모니터링 지표가 아니라, 코드 품질을 점검한 날짜별 스냅샷을 비교합니다.
        </p>
        <SeverityTrendChart data={trend.map((e) => ({ date: e.date, ...severityTotals(e) }))} />
      </section>

      <section>
        <h2 className="mb-2 font-mono text-sm font-semibold">품질 스냅샷 히스토리</h2>
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          이 스코프에서 지금까지 측정한 스냅샷 {trend.length}개입니다. 항목을 누르면 그 날짜의 전체 발견 내용으로 이동합니다.
        </p>
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {[...trend].reverse().map((entry, i) => {
            const prevEntry = trend[trend.length - 1 - i - 1]
            const scoreDiff = prevEntry ? Math.round((entry.score - prevEntry.score) * 10) / 10 : null
            const note = historyNote(entry, prevEntry)
            return (
              <li key={entry.slug}>
                <Link
                  href={`/quality/${entry.slug}`}
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span className="font-mono text-xs text-muted-foreground">{entry.date}</span>
                    <span className="font-mono text-sm font-semibold">{entry.score}점</span>
                    {scoreDiff !== null ? <Delta diff={scoreDiff} downIsGood={false} /> : (
                      <span className="font-mono text-xs text-muted-foreground">최초 측정</span>
                    )}
                  </div>
                  <span className="pl-[1.125rem] font-mono text-xs text-muted-foreground sm:pl-0 sm:text-right">
                    {note}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
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
