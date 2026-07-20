import { describe, expect, it } from 'vitest'
import { scaleLinear, linePath, niceTicks } from './chart-math'

describe('scaleLinear', () => {
  it('maps domain endpoints to range endpoints', () => {
    const scale = scaleLinear(0, 100, 0, 640)
    expect(scale(0)).toBe(0)
    expect(scale(100)).toBe(640)
    expect(scale(50)).toBe(320)
  })

  it('maps a degenerate domain to the range midpoint', () => {
    const scale = scaleLinear(5, 5, 0, 640)
    expect(scale(5)).toBe(320)
  })
})

describe('linePath', () => {
  it('builds an SVG path from points', () => {
    expect(linePath([{ x: 0, y: 10 }, { x: 20, y: 30 }])).toBe('M0,10 L20,30')
  })

  it('handles a single point', () => {
    expect(linePath([{ x: 5, y: 5 }])).toBe('M5,5')
  })

  it('returns empty string for no points', () => {
    expect(linePath([])).toBe('')
  })
})

describe('niceTicks', () => {
  it('returns rounded ticks from 0 covering max', () => {
    expect(niceTicks(23, 4)).toEqual([0, 10, 20, 30])
  })

  it('handles max 0 with a single step', () => {
    expect(niceTicks(0, 4)).toEqual([0, 1])
  })
})
