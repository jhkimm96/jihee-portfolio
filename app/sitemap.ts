import type { MetadataRoute } from 'next'
import {
  getAllProjects,
  getPublishedTroubleshooting,
  getPublishedStudyByCategory,
  getStudyCategories,
  getPublishedDecisions,
  getPublishedReviews,
  getLearningPaths,
  getResumeVariants
} from '@/lib/content-data'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/projects',
    '/engineering',
    '/troubleshooting',
    '/study',
    '/study/paths',
    '/decisions',
    '/reviews',
    '/quality',
    '/search',
    '/about',
    '/resume'
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date()
  }))

  const projectRoutes = getAllProjects().map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date()
  }))

  const learningPathRoutes = getLearningPaths().map((path) => ({
    url: `${SITE_URL}/study/paths/${path.project}`,
    lastModified: new Date(path.updatedAt)
  }))

  const troubleshootingRoutes = getPublishedTroubleshooting().map((entry) => ({
    url: `${SITE_URL}/troubleshooting/${entry.slug}`,
    lastModified: new Date(entry.date)
  }))

  const studyRoutes = Object.values(getPublishedStudyByCategory())
    .flat()
    .map((entry) => ({
      url: `${SITE_URL}/study/${entry.slug}`,
      lastModified: new Date(entry.date)
    }))

  const studyCategoryRoutes = getStudyCategories().map((category) => ({
    url: `${SITE_URL}/study/${category}`,
    lastModified: new Date()
  }))

  const decisionRoutes = getPublishedDecisions().map((entry) => ({
    url: `${SITE_URL}/decisions/${entry.slug}`,
    lastModified: new Date(entry.date)
  }))

  const reviewRoutes = getPublishedReviews().map((entry) => ({
    url: `${SITE_URL}/reviews/${entry.slug}`,
    lastModified: new Date(entry.date)
  }))

  const resumeRoutes = getResumeVariants().map((variant) => ({
    url: `${SITE_URL}/resume/${variant.slug}`,
    lastModified: new Date()
  }))

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...learningPathRoutes,
    ...troubleshootingRoutes,
    ...studyRoutes,
    ...studyCategoryRoutes,
    ...decisionRoutes,
    ...reviewRoutes,
    ...resumeRoutes
  ]
}
