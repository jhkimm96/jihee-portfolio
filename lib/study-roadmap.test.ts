import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { orderStudyPosts, studyReadingOrder, studyRoadmap } from './study-roadmap'

describe('기술 노트 읽기 순서', () => {
  it('기존 글은 선행 개념 순서로, 새 글은 단계 뒤에 둔다', () => {
    const posts = [
      { slug: 'jvm/new-topic' },
      { slug: 'jvm/collections-and-generics' },
      { slug: 'jvm/java-code-reading-basics' }
    ]

    expect(orderStudyPosts(posts, 'jvm').map((post) => post.slug)).toEqual([
      'jvm/java-code-reading-basics',
      'jvm/collections-and-generics',
      'jvm/new-topic'
    ])
  })

  it('개인 학습 지도의 모든 주제에 추천 순서가 있다', () => {
    const categories = studyRoadmap.flatMap((track) => track.categories)
    expect(categories.every((category) => studyReadingOrder[category]?.length > 0)).toBe(true)
  })

  it('추천 순서에 적힌 노트는 실제 콘텐츠를 가리킨다', () => {
    const missing = Object.entries(studyReadingOrder).flatMap(([category, slugs]) =>
      slugs.filter((slug) => !existsSync(join(process.cwd(), 'content', 'study', category, `${slug}.mdx`)))
        .map((slug) => `${category}/${slug}`)
    )
    expect(missing).toEqual([])
  })
})
