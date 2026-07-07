import type { MetadataRoute } from 'next'
import {
  getAllProjects,
  getPublishedTroubleshooting,
  getPublishedStudyByCategory,
  getPublishedDecisions
} from '@/lib/content-data'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/projects', '/troubleshooting', '/study', '/decisions', '/about', '/resume'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date()
  }))

  const projectRoutes = getAllProjects().map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date()
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

  const decisionRoutes = getPublishedDecisions().map((entry) => ({
    url: `${SITE_URL}/decisions/${entry.slug}`,
    lastModified: new Date(entry.date)
  }))

  return [...staticRoutes, ...projectRoutes, ...troubleshootingRoutes, ...studyRoutes, ...decisionRoutes]
}
