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
