import type {
  DecisionEntry,
  ProjectEntry,
  QualityEntry,
  ReviewEntry,
  StudyEntry,
  TroubleshootingEntry
} from '@/lib/content'
import {
  getAllProjects,
  getProjectTitle,
  getPublishedDecisions,
  getPublishedQuality,
  getPublishedReviews,
  getPublishedStudy,
  getPublishedTroubleshooting
} from '@/lib/content-data'

export type SearchResultType = 'Project' | 'Troubleshooting' | 'Decision' | 'Review' | 'Study' | 'Quality'

export type SearchResult = {
  type: SearchResultType
  href: string
  title: string
  date?: string
  summary?: string
  tags?: string[]
  project?: string
  category?: string
  searchableText: string
}

export const searchResultTypeLabels: Record<SearchResultType, string> = {
  Project: 'Projects',
  Troubleshooting: 'Troubleshooting',
  Decision: 'Design Decisions',
  Review: 'Reviews',
  Study: 'Study',
  Quality: 'Quality'
}

const resultOrder: SearchResultType[] = ['Project', 'Troubleshooting', 'Decision', 'Review', 'Study', 'Quality']

function stripHtml(value?: string): string {
  return value?.replace(/<[^>]*>/g, ' ') ?? ''
}

function compact(parts: (string | string[] | undefined)[]): string {
  return parts
    .flatMap((part) => (Array.isArray(part) ? part : [part]))
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function projectResult(project: ProjectEntry): SearchResult {
  return {
    type: 'Project',
    href: `/projects/${project.slug}`,
    title: project.title,
    summary: project.description,
    tags: project.stack,
    searchableText: compact([
      project.title,
      project.description,
      project.period,
      project.role,
      project.team,
      project.status,
      project.statusNote,
      project.stack,
      stripHtml(project.content)
    ])
  }
}

function troubleshootingResult(post: TroubleshootingEntry): SearchResult {
  const project = getProjectTitle(post.project)
  return {
    type: 'Troubleshooting',
    href: `/troubleshooting/${post.slug}`,
    title: post.title,
    date: post.date,
    summary: post.summary,
    tags: post.tags,
    project,
    category: post.category,
    searchableText: compact([post.title, post.summary, post.tags, project, post.category, stripHtml(post.content)])
  }
}

function decisionResult(entry: DecisionEntry): SearchResult {
  const project = getProjectTitle(entry.project)
  return {
    type: 'Decision',
    href: `/decisions/${entry.slug}`,
    title: entry.title,
    date: entry.date,
    summary: entry.summary,
    tags: entry.tags,
    project,
    category: entry.category,
    searchableText: compact([
      entry.title,
      entry.summary,
      entry.tags,
      entry.status,
      entry.supersededBy,
      project,
      entry.category,
      stripHtml(entry.content)
    ])
  }
}

function reviewResult(post: ReviewEntry): SearchResult {
  const project = getProjectTitle(post.project)
  return {
    type: 'Review',
    href: `/reviews/${post.slug}`,
    title: post.title,
    date: post.date,
    summary: post.summary,
    tags: post.tags,
    project,
    searchableText: compact([post.title, post.summary, post.tags, project, stripHtml(post.content)])
  }
}

function studyResult(post: StudyEntry): SearchResult {
  return {
    type: 'Study',
    href: `/study/${post.slug}`,
    title: post.title,
    date: post.date,
    summary: post.summary,
    tags: post.tags,
    category: post.category,
    searchableText: compact([post.title, post.summary, post.tags, post.category, stripHtml(post.content)])
  }
}

function qualityResult(entry: QualityEntry): SearchResult {
  const project = getProjectTitle(entry.project)
  return {
    type: 'Quality',
    href: `/quality/${entry.slug}`,
    title: entry.title,
    date: entry.date,
    summary: entry.summary,
    tags: entry.tags,
    project,
    category: entry.scope,
    searchableText: compact([
      entry.title,
      entry.summary,
      entry.tags,
      project,
      entry.scope,
      String(entry.score),
      entry.findings.map((finding) => finding.category),
      stripHtml(entry.content)
    ])
  }
}

export function getSearchIndex(): SearchResult[] {
  return [
    ...getAllProjects().map(projectResult),
    ...getPublishedTroubleshooting().map(troubleshootingResult),
    ...getPublishedDecisions().map(decisionResult),
    ...getPublishedReviews().map(reviewResult),
    ...getPublishedStudy().map(studyResult),
    ...getPublishedQuality().map(qualityResult)
  ]
}

export function searchContent(query: string): SearchResult[] {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  if (terms.length === 0) return []

  return getSearchIndex()
    .filter((result) => terms.every((term) => result.searchableText.includes(term)))
    .sort((a, b) => {
      if (a.type !== b.type) return resultOrder.indexOf(a.type) - resultOrder.indexOf(b.type)
      return (b.date ?? '').localeCompare(a.date ?? '')
    })
}

export function groupSearchResults(results: SearchResult[]): Record<SearchResultType, SearchResult[]> {
  return resultOrder.reduce<Record<SearchResultType, SearchResult[]>>(
    (groups, type) => ({
      ...groups,
      [type]: results.filter((result) => result.type === type)
    }),
    {
      Project: [],
      Troubleshooting: [],
      Decision: [],
      Review: [],
      Study: [],
      Quality: []
    }
  )
}
