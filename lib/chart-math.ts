export type ChartPoint = { x: number; y: number }

export function scaleLinear(d0: number, d1: number, r0: number, r1: number): (v: number) => number {
  return (v: number) => {
    if (d1 === d0) return (r0 + r1) / 2
    return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)
  }
}

export function linePath(points: ChartPoint[]): string {
  if (points.length === 0) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
}

export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1]
  const rawStep = max / count
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const candidates = [1, 2, 5, 10].map((m) => m * magnitude)
  const step = candidates.find((c) => c >= rawStep) ?? candidates[candidates.length - 1]
  const ticks: number[] = []
  for (let t = 0; t <= max + step * 0.999; t += step) ticks.push(Math.round(t * 100) / 100)
  return ticks
}
