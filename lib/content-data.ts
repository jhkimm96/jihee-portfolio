import {
  projects,
  troubleshootingPosts,
  studyPosts,
  decisions,
  reviews,
  quality,
  about,
  resume,
  resumeVariants
} from '#site/content'
import {
  sortProjects,
  findProjectBySlug,
  publishedOnly,
  sortByDateDesc,
  troubleshootingForProject,
  decisionsForProject,
  findDecisionTitle,
  groupByCategory,
  findBySlugPath,
  reviewsForProject,
  qualityScopes,
  qualityTrendForScope,
  qualityProjectGroups,
  qualityTrendFor,
  studyCategorySummaries,
  studyByGroup,
  groupByProject,
  orderedGroups
} from './content'
import type { QualityEntry } from './content'

export function getAllProjects() {
  return sortProjects(projects)
}

export function getProjectBySlug(slug: string) {
  return findProjectBySlug(projects, slug)
}

export function getPublishedTroubleshooting() {
  return sortByDateDesc(publishedOnly(troubleshootingPosts))
}

export function getTroubleshootingGrouped() {
  return orderedGroups(groupByProject(getPublishedTroubleshooting())).map(([project, posts]) => ({
    project,
    categories: orderedGroups(groupByCategory(posts))
  }))
}

export function getTroubleshootingForProject(projectSlug: string) {
  return troubleshootingForProject(troubleshootingPosts, projectSlug)
}

export function getTroubleshootingBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(troubleshootingPosts), slugParts)
}

export function getPublishedStudyByCategory() {
  return groupByCategory(publishedOnly(studyPosts))
}

export function getStudyCategorySummaries() {
  return studyCategorySummaries(publishedOnly(studyPosts))
}

export function getStudyCategories(): string[] {
  return [...new Set(publishedOnly(studyPosts).map((post) => post.category))]
}

export function getStudyCategoryGroups(category: string) {
  const posts = publishedOnly(studyPosts).filter((post) => post.category === category)
  return studyByGroup(posts)
}

export function getStudyBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(studyPosts), slugParts)
}

export function getAbout() {
  return about
}

export function getResume() {
  return resume
}

export function getResumeVariants() {
  return [...resumeVariants].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
}

export function getResumeVariantBySlug(slug: string) {
  return resumeVariants.find((variant) => variant.slug === slug)
}

/** picks의 {type, slug}를 실제 콘텐츠 항목의 링크·제목으로 변환한다. 없으면 null. */
export function getPickTarget(type: string, slug: string): { href: string; title: string } | null {
  const parts = slug.split('/')
  switch (type) {
    case 'project': {
      const entry = findProjectBySlug(projects, slug)
      return entry ? { href: `/projects/${entry.slug}`, title: entry.title } : null
    }
    case 'decision': {
      const entry = findBySlugPath(publishedOnly(decisions), parts)
      return entry ? { href: `/decisions/${entry.slug}`, title: entry.title } : null
    }
    case 'troubleshooting': {
      const entry = findBySlugPath(publishedOnly(troubleshootingPosts), parts)
      return entry ? { href: `/troubleshooting/${entry.slug}`, title: entry.title } : null
    }
    case 'study': {
      const entry = findBySlugPath(publishedOnly(studyPosts), parts)
      return entry ? { href: `/study/${entry.slug}`, title: entry.title } : null
    }
    case 'review': {
      const entry = findBySlugPath(publishedOnly(reviews), parts)
      return entry ? { href: `/reviews/${entry.slug}`, title: entry.title } : null
    }
    default:
      return null
  }
}

export function getProjectTitle(slug: string): string {
  return findProjectBySlug(projects, slug)?.title ?? slug
}

export function getPublishedStudy() {
  return sortByDateDesc(publishedOnly(studyPosts))
}

export function getPublishedDecisions() {
  return sortByDateDesc(publishedOnly(decisions))
}

export function getDecisionsGrouped() {
  return orderedGroups(groupByProject(getPublishedDecisions())).map(([project, entries]) => ({
    project,
    categories: orderedGroups(groupByCategory(entries))
  }))
}

export function getDecisionsForProject(projectSlug: string) {
  return decisionsForProject(decisions, projectSlug)
}

export function getDecisionBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(decisions), slugParts)
}

export function getDecisionTitle(fullSlug: string): string {
  return findDecisionTitle(decisions, fullSlug)
}

export function getPublishedReviews() {
  return sortByDateDesc(publishedOnly(reviews))
}

export function getReviewsGrouped() {
  return orderedGroups(groupByProject(getPublishedReviews()))
}

export function getReviewsForProject(projectSlug: string) {
  return reviewsForProject(reviews, projectSlug)
}

export function getReviewBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(reviews), slugParts)
}

export function getPublishedQuality() {
  return sortByDateDesc(publishedOnly(quality))
}

export function getQualityScopes() {
  return qualityScopes(quality)
}

export function getQualityTrend(scope: string) {
  return qualityTrendForScope(quality, scope)
}

export function getQualityProjectGroups() {
  return qualityProjectGroups(quality)
}

/** 한 프로젝트의 스코프별 최신 품질 스냅샷. 프로젝트 허브에서 요약 표시용. */
export function getQualityForProject(projectSlug: string): { scope: string; latest: QualityEntry }[] {
  const group = qualityProjectGroups(quality).find((entry) => entry.project === projectSlug)
  if (!group) return []
  const result: { scope: string; latest: QualityEntry }[] = []
  for (const scope of group.scopes) {
    const trend = qualityTrendFor(quality, projectSlug, scope)
    const latest = trend[trend.length - 1]
    if (latest) result.push({ scope, latest })
  }
  return result
}

export function getQualityTrendFor(project: string, scope: string) {
  return qualityTrendFor(quality, project, scope)
}

export function getQualityBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(quality), slugParts)
}
