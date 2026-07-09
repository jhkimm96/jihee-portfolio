import { projects, troubleshootingPosts, studyPosts, decisions, reviews, about, resume } from '#site/content'
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
  reviewsForProject
} from './content'

export function getAllProjects() {
  return sortProjects(projects)
}

export function getProjectBySlug(slug: string) {
  return findProjectBySlug(projects, slug)
}

export function getPublishedTroubleshooting() {
  return sortByDateDesc(publishedOnly(troubleshootingPosts))
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

export function getStudyBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(studyPosts), slugParts)
}

export function getAbout() {
  return about
}

export function getResume() {
  return resume
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

export function getReviewsForProject(projectSlug: string) {
  return reviewsForProject(reviews, projectSlug)
}

export function getReviewBySlugPath(slugParts: string[]) {
  return findBySlugPath(publishedOnly(reviews), slugParts)
}
