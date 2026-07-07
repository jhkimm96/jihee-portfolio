import { describe, expect, it } from 'vitest'
import { formatCategory, formatDate } from './format'

describe('formatCategory', () => {
  it('uses the hardcoded label when the category is known', () => {
    expect(formatCategory('es')).toBe('Elasticsearch')
    expect(formatCategory('api')).toBe('API')
  })

  it('capitalizes a single unknown word', () => {
    expect(formatCategory('general')).toBe('General')
  })

  it('capitalizes each word of an unknown kebab-case category', () => {
    expect(formatCategory('order-service')).toBe('Order Service')
  })
})

describe('formatDate', () => {
  it('formats an ISO date as YYYY.MM.DD', () => {
    expect(formatDate('2026-07-02')).toBe('2026.07.02')
  })

  it('returns the original string when the date is invalid', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})
