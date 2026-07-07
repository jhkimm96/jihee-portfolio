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

  it('accepts a project with an optional demo url', () => {
    const result = projectFrontmatterSchema.safeParse({
      title: 'Career Link',
      description: '설명',
      period: '2026.06 - 2026.07',
      team: '개인 프로젝트',
      role: 'Backend',
      stack: ['Spring Boot'],
      github: 'https://github.com/example/career-link',
      demo: 'https://career-link.example.com',
      status: 'live',
      statusNote: '운영 중'
    })
    expect(result.success).toBe(true)
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

  it('accepts an optional location', () => {
    const result = aboutFrontmatterSchema.safeParse({
      name: '김지희',
      role: 'Backend Developer',
      location: 'Seoul, KR'
    })
    expect(result.success).toBe(true)
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

  it('accepts an optional summary', () => {
    const result = resumeFrontmatterSchema.safeParse({
      summary: '요약 문단',
      experience: [],
      education: [],
      skills: []
    })
    expect(result.success).toBe(true)
  })

  it('accepts experience with optional highlights', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [
        { company: 'A', period: '2024', role: 'Dev', description: 'desc', highlights: ['did X', 'did Y'] }
      ],
      education: [],
      skills: []
    })
    expect(result.success).toBe(true)
  })

  it('rejects skills expressed as flat strings (must be grouped)', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [],
      education: [],
      skills: ['Java', 'Spring Boot']
    })
    expect(result.success).toBe(false)
  })

  it('accepts skills grouped by category', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [],
      education: [],
      skills: [{ group: 'Language', items: ['Java', 'TypeScript'] }]
    })
    expect(result.success).toBe(true)
  })

  it('accepts certificates with an optional issuer', () => {
    const result = resumeFrontmatterSchema.safeParse({
      experience: [],
      education: [],
      skills: [],
      certificates: [{ name: '정보처리기사', date: '2024-06', issuer: '한국산업인력공단' }]
    })
    expect(result.success).toBe(true)
  })
})
