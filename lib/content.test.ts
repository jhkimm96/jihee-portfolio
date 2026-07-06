import { describe, expect, it } from 'vitest'
import {
  sortProjects,
  findProjectBySlug,
  publishedOnly,
  sortByDateDesc,
  troubleshootingForProject,
  groupByCategory,
  findBySlugPath,
  type ProjectEntry,
  type TroubleshootingEntry
} from './content'

const project = (overrides: Partial<ProjectEntry>): ProjectEntry => ({
  slug: 'demo',
  title: 'Demo',
  description: 'desc',
  period: '2026.01 - 2026.02',
  team: '개인 프로젝트',
  role: 'Backend',
  stack: [],
  github: 'https://github.com/example/demo',
  status: 'archived',
  statusNote: '',
  featured: false,
  content: '',
  ...overrides
})

describe('sortProjects', () => {
  it('puts featured projects first', () => {
    const projects = [project({ slug: 'a', featured: false }), project({ slug: 'b', featured: true })]
    expect(sortProjects(projects).map((p) => p.slug)).toEqual(['b', 'a'])
  })

  it('sorts non-featured projects by period descending', () => {
    const projects = [
      project({ slug: 'old', period: '2025.01 - 2025.02' }),
      project({ slug: 'new', period: '2026.01 - 2026.02' })
    ]
    expect(sortProjects(projects).map((p) => p.slug)).toEqual(['new', 'old'])
  })
})

describe('findProjectBySlug', () => {
  it('returns the matching project', () => {
    const projects = [project({ slug: 'a' }), project({ slug: 'b' })]
    expect(findProjectBySlug(projects, 'b')?.slug).toBe('b')
  })

  it('returns undefined when no project matches', () => {
    expect(findProjectBySlug([project({ slug: 'a' })], 'missing')).toBeUndefined()
  })
})

const troubleshootingEntry = (overrides: Partial<TroubleshootingEntry>): TroubleshootingEntry => ({
  slug: 'demo/category/post',
  project: 'demo',
  category: 'category',
  title: 'Post',
  date: '2026-01-01',
  draft: false,
  content: '',
  ...overrides
})

describe('publishedOnly', () => {
  it('excludes draft entries', () => {
    const entries = [troubleshootingEntry({ slug: 'a', draft: false }), troubleshootingEntry({ slug: 'b', draft: true })]
    expect(publishedOnly(entries).map((e) => e.slug)).toEqual(['a'])
  })
})

describe('sortByDateDesc', () => {
  it('orders entries from newest to oldest', () => {
    const entries = [
      troubleshootingEntry({ slug: 'old', date: '2026-01-01' }),
      troubleshootingEntry({ slug: 'new', date: '2026-06-01' })
    ]
    expect(sortByDateDesc(entries).map((e) => e.slug)).toEqual(['new', 'old'])
  })
})

describe('troubleshootingForProject', () => {
  it('groups published entries for the given project by category, excluding drafts and other projects', () => {
    const entries = [
      troubleshootingEntry({ slug: 'a', project: 'demo', category: 'security' }),
      troubleshootingEntry({ slug: 'b', project: 'demo', category: 'security' }),
      troubleshootingEntry({ slug: 'c', project: 'demo', category: 'deployment', draft: true }),
      troubleshootingEntry({ slug: 'd', project: 'other', category: 'security' })
    ]
    const result = troubleshootingForProject(entries, 'demo')
    expect(Object.keys(result)).toEqual(['security'])
    expect(result.security.map((e) => e.slug)).toEqual(['a', 'b'])
  })
})

describe('groupByCategory', () => {
  it('groups entries by their category field', () => {
    const entries = [
      troubleshootingEntry({ slug: 'a', category: 'spring' }),
      troubleshootingEntry({ slug: 'b', category: 'es' }),
      troubleshootingEntry({ slug: 'c', category: 'spring' })
    ]
    const result = groupByCategory(entries)
    expect(result.spring.map((e) => e.slug)).toEqual(['a', 'c'])
    expect(result.es.map((e) => e.slug)).toEqual(['b'])
  })
})

describe('findBySlugPath', () => {
  it('finds the entry whose slug matches the joined path', () => {
    const entries = [troubleshootingEntry({ slug: 'demo/security/403' })]
    expect(findBySlugPath(entries, ['demo', 'security', '403'])?.slug).toBe('demo/security/403')
  })

  it('returns undefined when no entry matches', () => {
    const entries = [troubleshootingEntry({ slug: 'demo/security/403' })]
    expect(findBySlugPath(entries, ['nope'])).toBeUndefined()
  })
})
