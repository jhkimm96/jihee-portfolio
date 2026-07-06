import { describe, expect, it } from 'vitest'
import {
  projectFrontmatterSchema,
  troubleshootingFrontmatterSchema,
  studyFrontmatterSchema,
  aboutFrontmatterSchema,
  resumeFrontmatterSchema
} from './schemas'

describe('projectFrontmatterSchema', () => {
  it('accepts a valid project frontmatter', () => {
    const result = projectFrontmatterSchema.safeParse({
      title: 'Prompthub',
      description: 'AI 프롬프트 마켓플레이스',
      period: '2026.03 - 2026.05',
      team: '개인 프로젝트',
      role: 'Backend',
      stack: ['Spring Boot', 'MySQL'],
      github: 'https://github.com/example/prompthub',
      status: 'archived',
      statusNote: 'AWS 운영 기간 종료로 현재 서버 중단'
    })
    expect(result.success).toBe(true)
  })

  it('rejects a project missing the required github field', () => {
    const result = projectFrontmatterSchema.safeParse({
      title: 'Prompthub',
      description: 'AI 프롬프트 마켓플레이스',
      period: '2026.03 - 2026.05',
      team: '개인 프로젝트',
      role: 'Backend',
      stack: ['Spring Boot'],
      status: 'archived',
      statusNote: '중단됨'
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid status value', () => {
    const result = projectFrontmatterSchema.safeParse({
      title: 'Prompthub',
      description: 'AI 프롬프트 마켓플레이스',
      period: '2026.03 - 2026.05',
      team: '개인 프로젝트',
      role: 'Backend',
      stack: ['Spring Boot'],
      github: 'https://github.com/example/prompthub',
      status: 'not-a-real-status',
      statusNote: '중단됨'
    })
    expect(result.success).toBe(false)
  })
})

describe('troubleshootingFrontmatterSchema', () => {
  it('defaults draft to false when omitted', () => {
    const result = troubleshootingFrontmatterSchema.parse({
      title: '403 에러 해결',
      date: '2026-05-01'
    })
    expect(result.draft).toBe(false)
  })

  it('rejects tags that are not strings', () => {
    const result = troubleshootingFrontmatterSchema.safeParse({
      title: '403 에러 해결',
      date: '2026-05-01',
      tags: [123]
    })
    expect(result.success).toBe(false)
  })
})

describe('studyFrontmatterSchema', () => {
  it('accepts minimal valid study frontmatter', () => {
    const result = studyFrontmatterSchema.safeParse({
      title: 'Spring Batch 정리',
      date: '2026-05-01'
    })
    expect(result.success).toBe(true)
  })
})

describe('aboutFrontmatterSchema', () => {
  it('rejects an invalid email', () => {
    const result = aboutFrontmatterSchema.safeParse({
      name: '김지희',
      role: 'Backend Developer',
      email: 'not-an-email'
    })
    expect(result.success).toBe(false)
  })
})

describe('resumeFrontmatterSchema', () => {
  it('accepts empty experience/education/skills arrays', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [],
      education: [],
      skills: []
    })
    expect(result.success).toBe(true)
  })

  it('rejects malformed experience entries', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [{ company: '회사' }],
      education: [],
      skills: []
    })
    expect(result.success).toBe(false)
  })
})
