export type ProjectStatus = 'live' | 'archived' | 'github-only'

export type ProjectEntry = {
  slug: string
  title: string
  description: string
  period: string
  team: string
  role: string
  highlight: string
  responsibility: string
  contributions: string[]
  stack: string[]
  github: string
  demo?: string
  status: ProjectStatus
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

export type DecisionStatus = 'accepted' | 'superseded'

export type DecisionEntry = {
  slug: string
  project: string
  category: string
  title: string
  date: string
  status: DecisionStatus
  supersededBy?: string
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
  updatedAt?: string
  status: 'seed' | 'growing' | 'evergreen' | 'archived'
  reviewAfter?: string
  related: string[]
  summary?: string
  tags?: string[]
  group?: string
  draft: boolean
  content: string
}

export type StudyCategorySummary = {
  category: string
  count: number
  latest: string
  recent: StudyEntry[]
}

export type LearningPathImportance = 'required' | 'deep-dive' | 'reference'

export type LearningPathEntry = {
  project: string
  title: string
  summary: string
  updatedAt: string
  status: 'draft' | 'growing' | 'ready'
  stages: {
    id: string
    title: string
    goal: string
    items: { type: string; slug: string; importance: LearningPathImportance }[]
  }[]
  content: string
}

const UNGROUPED = '기타'

export function studyCategorySummaries(entries: StudyEntry[]): StudyCategorySummary[] {
  const grouped = groupByCategory(entries)
  return Object.entries(grouped)
    .map(([category, posts]) => {
      const sorted = sortByDateDesc(posts)
      return {
        category,
        count: sorted.length,
        latest: sorted[0]?.date ?? '',
        recent: sorted.slice(0, 3)
      }
    })
    .sort((a, b) => b.latest.localeCompare(a.latest))
}

export function studyByGroup(entries: StudyEntry[]): Record<string, StudyEntry[]> {
  const grouped = sortByDateDesc(entries).reduce<Record<string, StudyEntry[]>>((groups, entry) => {
    const key = entry.group ?? UNGROUPED
    groups[key] = groups[key] ?? []
    groups[key].push(entry)
    return groups
  }, {})
  const keys = Object.keys(grouped).sort((a, b) => {
    if (a === UNGROUPED) return 1
    if (b === UNGROUPED) return -1
    return 0
  })
  return Object.fromEntries(keys.map((key) => [key, grouped[key]]))
}

export type ReviewEntry = {
  slug: string
  project: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  draft: boolean
  content: string
}

export type ResumePick = {
  type: string
  slug: string
  headline?: string
  summary: string
}

export type ResumeSkillGroup = {
  group: string
  items: string[]
}

export type ResumeVariantEntry = {
  slug: string
  label: string
  order: number
  headline?: string
  summary: string
  skills?: ResumeSkillGroup[]
  picks: ResumePick[]
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

export function groupByProject<T extends { project: string }>(entries: T[]): Record<string, T[]> {
  return entries.reduce<Record<string, T[]>>((groups, entry) => {
    groups[entry.project] = groups[entry.project] ?? []
    groups[entry.project].push(entry)
    return groups
  }, {})
}

/** Record를 [key, 최신순 정렬된 항목]의 배열로 펼치되, 그룹은 가장 최근 항목 날짜 기준 내림차순으로 정렬한다. */
export function orderedGroups<T extends { date: string }>(record: Record<string, T[]>): [string, T[]][] {
  return Object.entries(record)
    .map(([key, entries]) => [key, sortByDateDesc(entries)] as [string, T[]])
    .sort((a, b) => (b[1][0]?.date ?? '').localeCompare(a[1][0]?.date ?? ''))
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

export function decisionsForProject(
  entries: DecisionEntry[],
  projectSlug: string
): Record<string, DecisionEntry[]> {
  const published = publishedOnly(entries).filter((entry) => entry.project === projectSlug)
  return groupByCategory(published)
}

export function findDecisionTitle(entries: DecisionEntry[], fullSlug: string): string {
  return entries.find((entry) => entry.slug === fullSlug)?.title ?? fullSlug
}

export function reviewsForProject(entries: ReviewEntry[], projectSlug: string): ReviewEntry[] {
  return sortByDateDesc(publishedOnly(entries).filter((entry) => entry.project === projectSlug))
}

export const QUALITY_CATEGORIES = [
  'controller-thin',
  'entity-encapsulation',
  'http-semantics',
  'logging-quality',
  'exception-discipline',
  'layer-separation',
  'dead-code',
  'duplication-semantic',
  'diagnosability',
  'integration-robustness',
  'service-boundary',
  'value-object-design',
  'polymorphism-opportunity',
  'cohesion-coupling'
] as const

export type QualityCategory = (typeof QUALITY_CATEGORIES)[number]

export const QUALITY_CATEGORY_DESCRIPTIONS: Record<QualityCategory, string> = {
  'controller-thin': '컨트롤러에 비즈니스 로직 혼입 — 컨트롤러는 호출·위임만 해야 함',
  'entity-encapsulation': '엔티티 캡슐화 — setter 남발 대신 자기 상태 관리 (과도한 로직 집중도 위반)',
  'http-semantics': 'HTTP 상태코드를 의미에 맞게 반환하는지',
  'logging-quality': '원인 추적에 도움 되는 로그 — 필요한 곳에 있고, 무의미한 남발이 없는지',
  'exception-discipline': 'try-catch 남용 — 실제 예외가 날 만한 곳에만 써야 함',
  'layer-separation': '레이어 경계 위반 — 외부 기술(SDK·인프라)을 비즈니스 계층에 직접 혼입',
  'dead-code': '실질적 미사용 코드 — 안 쓰는 클라이언트·컨슈머·설정 잔재 포함',
  'duplication-semantic': '도구(jscpd)가 못 잡는 의미론적 중복 로직',
  diagnosability: '예외 삼킴·모호한 에러 메시지 등 오류 원인 추적을 방해하는 코드',
  'integration-robustness': '서비스 간 통신 견고성 — 타임아웃 없는 원격 호출·실패 무시·응답 무검증',
  'service-boundary': '서비스 경계 위반 — 타 서비스 DB 직접 접근·도메인 로직 중복·과도한 동기 호출 체인',
  'value-object-design': '문자열·원시값·긴 포지셔널 인자 대신 값객체/enum으로 도메인 제약을 표현하는지',
  'polymorphism-opportunity': '반복되는 타입 분기나 switch를 다형성/전략으로 모을 필요가 있는지',
  'cohesion-coupling': '한 클래스나 모듈이 여러 변경 이유를 떠안아 응집도와 결합도 문제가 생기는지'
}

export type QualityFinding = {
  category: string
  high: number
  medium: number
  low: number
}

export type QualityMetrics = {
  locTotal: number
  files: number
  duplicationBlocks: number
  duplicationPct: number
  oversizedClasses: number
  longMethods?: number
}

export type QualityEntry = {
  slug: string
  project: string
  scope: string
  title: string
  date: string
  score: number
  formulaVersion: number
  metrics: QualityMetrics
  findings: QualityFinding[]
  summary?: string
  tags?: string[]
  draft: boolean
  content: string
}

export function qualityScopes(entries: QualityEntry[]): string[] {
  return [...new Set(publishedOnly(entries).map((entry) => entry.scope))].sort()
}

export function qualityTrendForScope(entries: QualityEntry[], scope: string): QualityEntry[] {
  return publishedOnly(entries)
    .filter((entry) => entry.scope === scope)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export type QualityProjectGroup = { project: string; scopes: string[] }

/** 프로젝트별로 묶은 품질 스코프 목록. 같은 scope 이름이 여러 프로젝트에 있어도 project로 분리된다. */
export function qualityProjectGroups(entries: QualityEntry[]): QualityProjectGroup[] {
  return Object.entries(groupByProject(publishedOnly(entries)))
    .map(([project, list]) => ({
      project,
      scopes: [...new Set(list.map((entry) => entry.scope))].sort()
    }))
    .sort((a, b) => a.project.localeCompare(b.project))
}

export function qualityTrendFor(entries: QualityEntry[], project: string, scope: string): QualityEntry[] {
  return publishedOnly(entries)
    .filter((entry) => entry.project === project && entry.scope === scope)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function severityTotals(entry: QualityEntry): { high: number; medium: number; low: number } {
  return entry.findings.reduce(
    (totals, finding) => ({
      high: totals.high + finding.high,
      medium: totals.medium + finding.medium,
      low: totals.low + finding.low
    }),
    { high: 0, medium: 0, low: 0 }
  )
}
