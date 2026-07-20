import { s } from 'velite'

export const projectFrontmatterSchema = s.object({
  title: s.string(),
  description: s.string(),
  period: s.string(),
  team: s.string(),
  role: s.string(),
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
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
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

const qualityCategoryEnum = s.enum([
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
  'service-boundary'
])

export const QUALITY_CATEGORIES = qualityCategoryEnum.options

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
    oversizedClasses: s.number().int().min(0)
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
    .length(11),
  summary: s.string().optional(),
  tags: s.array(s.string()).optional(),
  draft: s.boolean().default(false)
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
