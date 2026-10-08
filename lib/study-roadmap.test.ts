import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  getExplicitRoadmapPosts,
  getStudyRoadmapContext,
  getStudyRoadmapSlugs,
  orderStudyPosts,
  studyReadingOrder,
  studyRoadmap
} from './study-roadmap'

describe('기술 노트 읽기 순서', () => {
  it('Java 코드 읽기와 CompletableFuture를 공유 Future 구현보다 먼저 읽는다', () => {
    const slugs = getStudyRoadmapSlugs()
    const implementation = slugs.indexOf('cs/single-flight-shared-future')
    expect(slugs.indexOf('jvm/java-code-reading-basics')).toBeLessThan(implementation)
    expect(slugs.indexOf('jvm/concurrency-and-completablefuture')).toBeLessThan(implementation)
  })

  it('영속성 컨텍스트를 OSIV보다 먼저 읽는다', () => {
    const slugs = getStudyRoadmapSlugs()
    expect(slugs.indexOf('jpa/persistence-context-and-fetch-strategy'))
      .toBeLessThan(slugs.indexOf('spring/open-in-view-connection-hold'))
  })

  it('GC 도달 가능성을 메모리 회수보다 먼저 읽는다', () => {
    const slugs = getStudyRoadmapSlugs()
    expect(slugs.indexOf('jvm/gc-roots-reachability-and-memory-reclaim'))
      .toBeLessThan(slugs.indexOf('jvm/heap-memory-reclaim'))
  })

  it('관측성은 신호, JSON 로그, 추적 ID 순서로 Kafka 뒤와 운영 앞에 둔다', () => {
    const slugs = getStudyRoadmapSlugs()
    const start = slugs.indexOf('cs/logs-metrics-traces')
    expect(start).toBeGreaterThan(slugs.indexOf('msa/kafka-offset-lag-reprocessing-idempotency'))
    expect(slugs.slice(start, start + 3)).toEqual([
      'cs/logs-metrics-traces',
      'cs/structured-json-logs',
      'cs/trace-span-event-identifiers'
    ])
    expect(start + 2).toBeLessThan(slugs.indexOf('aws/s3-presigned-url'))
  })

  it('추적 ID 다음에 수집, Kibana 탐색, 앱 상태 확인 순서로 읽는다', () => {
    const slugs = getStudyRoadmapSlugs()
    const start = slugs.indexOf('cs/trace-span-event-identifiers')
    expect(start).toBeGreaterThanOrEqual(0)
    expect(slugs.slice(start, start + 5)).toEqual([
      'cs/trace-span-event-identifiers',
      'cs/log-collection-and-search',
      'cs/kibana-data-view-and-saved-objects',
      'cs/actuator-health-and-readiness',
      'cs/graceful-shutdown-and-traffic-draining'
    ])
  })

  it('앱 상태와 종료 절차 뒤에 수치 수집과 Label 설계 순서로 읽는다', () => {
    const slugs = getStudyRoadmapSlugs()
    const start = slugs.indexOf('cs/actuator-health-and-readiness')
    expect(start).toBeGreaterThanOrEqual(0)
    expect(slugs.slice(start, start + 4)).toEqual([
      'cs/actuator-health-and-readiness',
      'cs/graceful-shutdown-and-traffic-draining',
      'cs/prometheus-metric-scraping',
      'cs/metric-label-cardinality'
    ])
  })

  it('Label 뒤에 대시보드, 알림, Kafka 진단, 트레이스를 순서대로 읽는다', () => {
    const slugs = getStudyRoadmapSlugs()
    const start = slugs.indexOf('cs/metric-label-cardinality')
    expect(start).toBeGreaterThanOrEqual(0)
    expect(slugs.slice(start, start + 6)).toEqual([
      'cs/metric-label-cardinality',
      'cs/grafana-payment-dashboard',
      'cs/alert-evaluation-and-notification',
      'cs/kafka-lag-diagnosis',
      'cs/opentelemetry-trace-waterfall',
      'cs/utc-and-local-day-boundaries'
    ])
  })

  it('캐시 병합은 개념, 진단, 구현, 취소 경계 순서로 읽는다', () => {
    const slugs = getStudyRoadmapSlugs()
    const start = slugs.indexOf('cs/cache-stampede-and-single-flight')
    expect(slugs.slice(start, start + 4)).toEqual([
      'cs/cache-stampede-and-single-flight',
      'cs/cache-miss-duplicate-load-diagnosis',
      'cs/single-flight-shared-future',
      'cs/cancellation-propagation'
    ])
  })
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

  it('공개 로드맵에는 명시된 글만 노출한다', () => {
    const posts = [
      { slug: 'jvm/java-code-reading-basics' },
      { slug: 'jvm/collections-and-generics' },
      { slug: 'jvm/new-topic' }
    ]

    expect(getExplicitRoadmapPosts(posts).map((post) => post.slug)).toEqual([
      'jvm/java-code-reading-basics',
      'jvm/collections-and-generics'
    ])
  })

  it('명시된 읽기 순서에는 같은 글이 두 번 나타나지 않는다', () => {
    const slugs = getStudyRoadmapSlugs()

    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('현재 글의 선수·이전·다음 Study를 계산한다', () => {
    const posts = [
      { slug: 'jvm/java-code-reading-basics', title: '코드 읽기' },
      {
        slug: 'jvm/java-primitive-and-reference-types',
        title: '기본형과 참조형',
        prerequisites: ['jvm/java-code-reading-basics']
      },
      { slug: 'jvm/java-value-reference-and-object', title: '값과 객체' }
    ]

    expect(getStudyRoadmapContext(posts, 'jvm/java-primitive-and-reference-types')).toMatchObject({
      previous: { slug: 'jvm/java-code-reading-basics' },
      next: { slug: 'jvm/java-value-reference-and-object' },
      prerequisites: [{ slug: 'jvm/java-code-reading-basics' }]
    })
  })

  it('로드맵에 없는 글에는 학습 탐색을 만들지 않는다', () => {
    const posts = [{ slug: 'jvm/new-topic' }]

    expect(getStudyRoadmapContext(posts, 'jvm/new-topic')).toBeUndefined()
  })
})
