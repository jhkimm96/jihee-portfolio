import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { projectShowcases } from './project-showcase'

const showcases = Object.entries(projectShowcases)

describe('대표 프로젝트 소개 자료', () => {
  it('소개 자료가 있는 프로젝트는 모두 실제 프로젝트 글이 있다', () => {
    const projectSlugs = readdirSync('content').filter((slug) => existsSync(join('content', slug, 'project.mdx')))
    expect(Object.keys(projectShowcases).sort()).toEqual(projectSlugs.sort())
    for (const [slug] of showcases) {
      expect(existsSync(join('content', slug, 'project.mdx')), slug).toBe(true)
    }
  })

  it('모든 프로젝트 흐름은 문제·선택·구현·검증 네 단계다', () => {
    for (const [slug, showcase] of showcases) {
      expect(showcase.flow.map((step) => step.label.split(' / ')[0]), slug).toEqual(['PROBLEM', 'CHOICE', 'BUILD', 'VERIFY'])
    }
  })

  it('그림 경로마다 public 폴더에 실제 파일이 있다', () => {
    for (const [slug, showcase] of showcases) {
      expect(showcase.media.length, slug).toBeGreaterThan(0)
      for (const media of showcase.media) {
        expect(media.src, `${slug}: ${media.label}`).toBeTruthy()
        if (media.src) expect(existsSync(join('public', media.src)), media.src).toBe(true)
      }
    }
  })
})
