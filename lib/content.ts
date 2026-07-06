export type ProjectEntry = {
  slug: string
  title: string
  description: string
  period: string
  team: string
  role: string
  stack: string[]
  github: string
  status: 'live' | 'archived' | 'github-only'
  statusNote: string
  thumbnail?: string
  featured: boolean
  content: string
}

export type TroubleshootingEntry = {
  slug: string
  project: string
  category: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  draft: boolean
  content: string
}

export type StudyEntry = {
  slug: string
  category: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  draft: boolean
  content: string
}

export function sortProjects(projects: ProjectEntry[]): ProjectEntry[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.period.localeCompare(a.period)
  })
}

export function findProjectBySlug(projects: ProjectEntry[], slug: string): ProjectEntry | undefined {
  return projects.find((project) => project.slug === slug)
}

export function publishedOnly<T extends { draft: boolean }>(entries: T[]): T[] {
  return entries.filter((entry) => !entry.draft)
}

export function sortByDateDesc<T extends { date: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date))
}

export function groupByCategory<T extends { category: string }>(entries: T[]): Record<string, T[]> {
  return entries.reduce<Record<string, T[]>>((groups, entry) => {
    groups[entry.category] = groups[entry.category] ?? []
    groups[entry.category].push(entry)
    return groups
  }, {})
}

export function troubleshootingForProject(
  entries: TroubleshootingEntry[],
  projectSlug: string
): Record<string, TroubleshootingEntry[]> {
  const published = publishedOnly(entries).filter((entry) => entry.project === projectSlug)
  return groupByCategory(published)
}

export function findBySlugPath<T extends { slug: string }>(entries: T[], slugParts: string[]): T | undefined {
  const slug = slugParts.join('/')
  return entries.find((entry) => entry.slug === slug)
}
