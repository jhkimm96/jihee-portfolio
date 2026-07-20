'use client'

import { useState } from 'react'
import { linePath, niceTicks, scaleLinear } from '@/lib/chart-math'

const W = 640
const H = 220
const PAD = { top: 12, right: 16, bottom: 26, left: 36 }

function formatDate(date: string): string {
  return date.slice(5).replace('-', '/')
}

type Tooltip = { x: number; y: number; lines: string[] }

function TooltipBox({ tip }: { tip: Tooltip | null }) {
  if (!tip) return null
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-sm"
      style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }}
    >
      {tip.lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  )
}

export function ScoreTrendChart({ data }: { data: { date: string; score: number }[] }) {
  const [tip, setTip] = useState<Tooltip | null>(null)
  const x = scaleLinear(0, Math.max(data.length - 1, 1), PAD.left, W - PAD.right)
  const y = scaleLinear(0, 100, H - PAD.bottom, PAD.top)
  const points = data.map((d, i) => ({ x: x(i), y: y(d.score) }))

  return (
    <div className="viz-root relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="종합 점수 추세">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(tick)} y2={y(tick)} stroke="var(--viz-grid)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(tick) + 3} textAnchor="end" fontSize="10" fill="var(--color-muted-foreground)">
              {tick}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="var(--viz-axis)" strokeWidth="1" />
        <path d={linePath(points)} fill="none" stroke="var(--viz-series)" strokeWidth="2" />
        {points.map((p, i) => (
          <g key={data[i].date}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--viz-series)" />
            <circle
              cx={p.x}
              cy={p.y}
              r="12"
              fill="transparent"
              onMouseEnter={() => setTip({ x: p.x, y: p.y - 8, lines: [data[i].date, `점수 ${data[i].score}`] })}
              onMouseLeave={() => setTip(null)}
            />
            <text x={p.x} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted-foreground)">
              {formatDate(data[i].date)}
            </text>
          </g>
        ))}
      </svg>
      <TooltipBox tip={tip} />
    </div>
  )
}

const SEVERITIES = [
  { key: 'high', label: 'High', color: 'var(--viz-sev-high)' },
  { key: 'medium', label: 'Medium', color: 'var(--viz-sev-medium)' },
  { key: 'low', label: 'Low', color: 'var(--viz-sev-low)' }
] as const

export function SeverityTrendChart({ data }: { data: { date: string; high: number; medium: number; low: number }[] }) {
  const [tip, setTip] = useState<Tooltip | null>(null)
  const maxTotal = Math.max(...data.map((d) => d.high + d.medium + d.low), 0)
  const ticks = niceTicks(maxTotal)
  const tickMax = ticks[ticks.length - 1]
  const x = scaleLinear(0, Math.max(data.length - 1, 1), PAD.left + 24, W - PAD.right - 24)
  const y = scaleLinear(0, tickMax, H - PAD.bottom, PAD.top)
  const barWidth = Math.min(40, Math.max(12, (W - PAD.left - PAD.right) / Math.max(data.length, 1) - 16))

  return (
    <div className="viz-root relative">
      <div className="mb-1 flex items-center gap-4 text-xs text-muted-foreground">
        {SEVERITIES.map((sev) => (
          <span key={sev.key} className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-[2px]" style={{ background: sev.color }} />
            {sev.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="심각도별 발견 건수 추세">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(tick)} y2={y(tick)} stroke="var(--viz-grid)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(tick) + 3} textAnchor="end" fontSize="10" fill="var(--color-muted-foreground)">
              {tick}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="var(--viz-axis)" strokeWidth="1" />
        {data.map((d, i) => {
          const cx = x(i)
          let stackBase = 0
          return (
            <g key={d.date}>
              {SEVERITIES.map((sev) => {
                const value = d[sev.key]
                const yTop = y(stackBase + value)
                const yBottom = y(stackBase)
                stackBase += value
                if (value === 0) return null
                return (
                  <rect
                    key={sev.key}
                    x={cx - barWidth / 2}
                    y={yTop}
                    width={barWidth}
                    height={Math.max(yBottom - yTop - 2, 1)}
                    rx="2"
                    fill={sev.color}
                    onMouseEnter={() => setTip({ x: cx, y: yTop - 4, lines: [d.date, `${sev.label} ${value}건`] })}
                    onMouseLeave={() => setTip(null)}
                  />
                )
              })}
              <text x={cx} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted-foreground)">
                {formatDate(d.date)}
              </text>
            </g>
          )
        })}
      </svg>
      <TooltipBox tip={tip} />
    </div>
  )
}

const SPARK_W = 280
const SPARK_H = 72
const SPARK_PAD = { top: 8, right: 10, bottom: 8, left: 10 }

export function MetricSparkline({
  data,
  label,
  format = (v: number) => String(v)
}: {
  data: { date: string; value: number }[]
  label: string
  format?: (v: number) => string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const x = scaleLinear(0, Math.max(data.length - 1, 1), SPARK_PAD.left, SPARK_W - SPARK_PAD.right)
  const y = scaleLinear(0, max, SPARK_H - SPARK_PAD.bottom, SPARK_PAD.top)
  const points = data.map((d, i) => ({ x: x(i), y: y(d.value) }))
  const latest = data[data.length - 1]

  return (
    <div className="viz-root rounded-lg border border-border p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-sm font-semibold">{latest ? format(latest.value) : '-'}</span>
      </div>
      <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} className="mt-1 w-full" role="img" aria-label={label}>
        <path d={linePath(points)} fill="none" stroke="var(--viz-series)" strokeWidth="2" />
        {points.length > 0 ? (
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="var(--viz-series)" />
        ) : null}
      </svg>
    </div>
  )
}
