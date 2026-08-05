import { s } from 'velite'
import { QUALITY_CATEGORIES } from '../lib/content'

export { QUALITY_CATEGORIES }

export const projectFrontmatterSchema = s.object({
  title: s.string(),
  description: s.string(),
  period: s.string(),
  team: s.string(),
  role: s.string(),
  highlight: s.string(),
  responsibility: s.string(),
  contributions: s.array(s.string()).min(1),
  stack: s.array(s.string()),
  github: s.string().url(),
  demo: s.string().url().optional(),
  status: s.enum(['live', 'archived', 'github-only']),
  statusNote: s.string(),
  thumbnail: s.string().optional(),
  featured: s.boolean().default(false)
})

export const troubleshootingFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
})

export const studyFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  updatedAt: s.string().optional(),
  status: s.enum(['seed', 'growing', 'evergreen', 'archived']).default('growing'),
  reviewAfter: s.string().optional(),
  related: s.array(s.string()).default([]),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  group: s.string().optional(),
  draft: s.boolean().default(false)
})

const learningPathItemSchema = s.object({
  type: s.enum(['project', 'decision', 'troubleshooting', 'study', 'review']),
  slug: s.string(),
  importance: s.enum(['required', 'deep-dive', 'reference']).default('required')
})

export const learningPathFrontmatterSchema = s.object({
  title: s.string(),
  summary: s.string(),
  updatedAt: s.string(),
  status: s.enum(['draft', 'growing', 'ready']).default('growing'),
  stages: s.array(s.object({
    id: s.string(),
    title: s.string(),
    goal: s.string(),
    items: s.array(learningPathItemSchema).min(1)
  })).min(1)
})

export const decisionFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  status: s.enum(['accepted', 'superseded']).default('accepted'),
  supersededBy: s.string().optional(),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
})

export const reviewFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
})

const qualityCategoryEnum = s.enum(QUALITY_CATEGORIES)

export const qualityFrontmatterSchema = s.object({
  title: s.string(),
  date: s.string(),
  scope: s.string(),
  score: s.number().min(0).max(100),
  formulaVersion: s.number().int().min(1),
  metrics: s.object({
    locTotal: s.number().int().min(0),
    files: s.number().int().min(0),
    duplicationBlocks: s.number().int().min(0),
    duplicationPct: s.number().min(0),
    oversizedClasses: s.number().int().min(0),
    longMethods: s.number().int().min(0).default(0)
  }),
  findings: s
    .array(
      s.object({
        category: qualityCategoryEnum,
        high: s.number().int().min(0),
        medium: s.number().int().min(0),
        low: s.number().int().min(0)
      })
    )
    .min(1),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
})

const resumePickSchema = s.object({
  type: s.enum(['project', 'decision', 'troubleshooting', 'study', 'review']),
  slug: s.string(),
  headline: s.string().optional(),
  summary: s.string()
})

export const resumeVariantFrontmatterSchema = s.object({
  label: s.string(),
  order: s.number().default(0),
  headline: s.string().optional(),
  summary: s.string(),
  skills: s
    .array(
      s.object({
        group: s.string(),
        items: s.array(s.string())
      })
    )
    .optional(),
  picks: s.array(resumePickSchema).default([])
})

export const aboutFrontmatterSchema = s.object({
  name: s.string(),
  role: s.string(),
  location: s.string().optional(),
  email: s.string().email().optional(),
  github: s.string().url().optional(),
  portfolioFile: s.string().optional()
})

export const resumeFrontmatterSchema = s.object({
  summary: s.string().optional(),
  experience: s.array(
    s.object({
      company: s.string(),
      period: s.string(),
      role: s.string(),
      description: s.string(),
      highlights: s.array(s.string()).optional()
    })
  ),
  education: s.array(
    s.object({
      school: s.string(),
      period: s.string(),
      degree: s.string()
    })
  ),
  skills: s.array(
    s.object({
      group: s.string(),
      items: s.array(s.string())
    })
  ),
  certificates: s
    .array(
      s.object({
        name: s.string(),
        date: s.string(),
        issuer: s.string().optional()
      })
    )
    .optional()
})
