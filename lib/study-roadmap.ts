export type StudyRoadmapTrack = {
  step: number
  title: string
  description: string
  categories: string[]
}

type RoadmapStudy = {
  slug: string
  prerequisites?: string[]
}

export type StudyRoadmapContext<T extends RoadmapStudy> = {
  current: T
  prerequisites: T[]
  previous?: T
  next?: T
}

/** 현재 노트의 양이 아니라, 개념이 쌓이는 순서를 보여주는 개인 학습 지도. */
export const studyRoadmap: StudyRoadmapTrack[] = [
  {
    step: 1,
    title: 'CS와 Java 런타임',
    description: '자료구조, 메모리, 동시성처럼 다른 기술을 이해하는 기반부터 다집니다.',
    categories: ['cs', 'jvm']
  },
  {
    step: 2,
    title: 'API와 애플리케이션 설계',
    description: 'Spring, JPA, 테스트를 통해 요청이 도메인 로직과 데이터로 이어지는 흐름을 읽습니다.',
    categories: ['spring', 'jpa', 'testing']
  },
  {
    step: 3,
    title: '데이터와 검색',
    description: '트랜잭션과 인덱스에서 출발해 검색 품질과 추천 파이프라인까지 확장합니다.',
    categories: ['database', 'es']
  },
  {
    step: 4,
    title: '분산 시스템과 서비스 경계',
    description: '이벤트, 메시지, 멱등성, 장애 전파를 서비스 간 계약의 관점에서 연결합니다.',
    categories: ['msa']
  },
  {
    step: 5,
    title: '배포와 운영',
    description: 'AWS와 컨테이너, Kubernetes, CI/CD를 실제 운영 검증의 흐름으로 묶습니다.',
    categories: ['aws', 'docker', 'kubernetes', 'cicd']
  }
]

// 카테고리 안에서는 발행일보다 선행 개념을 우선한다. 공개 로드맵에는 아래에 명시한 글만 표시한다.
export const studyReadingOrder: Record<string, string[]> = {
  cs: [
    'index-inverted-index-and-indexing', 'composite-index-and-filesort',
    'connection-pool-bottleneck', 'database-bottleneck-diagnosis',
    'transaction-rollback-boundaries', 'replication-lag-and-read-after-write',
    'redis-ttl-and-eviction', 'cache-stampede-and-single-flight',
    'cache-miss-duplicate-load-diagnosis', 'single-flight-shared-future',
    'cancellation-propagation', 'async-throughput-and-queue-latency',
    'graceful-shutdown-and-traffic-draining', 'utc-and-local-day-boundaries',
    'sharding-design-decisions'
  ],
  jvm: [
    'java-code-reading-basics', 'java-primitive-and-reference-types',
    'java-value-reference-and-object', 'java-equality-identity-and-equals',
    'oop-polymorphism-and-interfaces', 'collections-and-generics',
    'arraylist-vs-linkedlist', 'hashmap-collision-resize-and-lookup',
    'equals-hashcode-and-immutability', 'exceptions-and-resource-safety',
    'heap-memory-reclaim', 'gc-roots-reachability-and-memory-reclaim',
    'concurrency-and-completablefuture', 'modern-java-records-optionals-streams',
    'choosing-collections-for-search-ranking', 'junior-java-interview-expectations'
  ],
  spring: [
    'reading-spring-java-with-di-and-ports', 'open-in-view-connection-hold',
    'spring-batch-chunk-processing', 'row-chain-versioning'
  ],
  jpa: [
    'orm-basics', 'persistence-context-and-fetch-strategy',
    'transactional-and-propagation', 'n-plus-one-problem', 'specification-and-pageable'
  ],
  testing: ['java-backend-testing-basics', 'frontend-e2e-without-backend'],
  database: [
    'rdb-vs-nosql', 'btree-index-and-normalization', 'connection-pool-hikaricp',
    'isolation-levels-and-locking', 'stock-concurrency-control',
    'watermark-incremental-sync', 'pgvector-hnsw-partial-index'
  ],
  es: [
    'search-system-and-es-basics', 'mapping-and-field-types', 'analyzer-and-nori',
    'query-dsl-and-relevance', 'aggregation-log-analysis', 'search-suggest-autocomplete',
    'vector-search-knn', 'vector-quantization-and-storage-cost',
    'reciprocal-rank-fusion', 'hybrid-search-ranking-pipeline',
    'search-recommendation-design-and-qa', 'search-event-log-pipeline',
    'behavioral-recommendation-design', 'security-authentication-and-tls'
  ],
  msa: [
    'project-based-backend-learning-guide', 'msa-prompthub-service-map',
    'prompthub-complete-learning-roadmap', 'async-event-processing-foundations',
    'kafka-offset-lag-reprocessing-idempotency', 'outbox-inbox-when-needed',
    'outbox-inbox-per-service'
  ],
  aws: ['s3-presigned-url'],
  docker: ['multi-stage-build'],
  kubernetes: [
    'cluster-control-plane-worker', 'pod-lifecycle', 'deployment-vs-statefulset',
    'service-and-ingress', 'storage-secret-configmap'
  ],
  cicd: ['github-actions-parallel-build-registry']
}

export function orderStudyPosts<T extends { slug: string }>(posts: T[], category: string): T[] {
  const recommended = studyReadingOrder[category] ?? []
  const rank = new Map(recommended.map((slug, index) => [`${category}/${slug}`, index]))
  return [...posts].sort((left, right) =>
    (rank.get(left.slug) ?? Infinity) - (rank.get(right.slug) ?? Infinity)
  )
}

export function getStudyRoadmapSlugs(): string[] {
  return studyRoadmap.flatMap((track) =>
    track.categories.flatMap((category) =>
      (studyReadingOrder[category] ?? []).map((slug) => `${category}/${slug}`)
    )
  )
}

export function getExplicitRoadmapPosts<T extends { slug: string }>(posts: T[]): T[] {
  const postBySlug = new Map(posts.map((post) => [post.slug, post]))

  return getStudyRoadmapSlugs()
    .map((slug) => postBySlug.get(slug))
    .filter((post): post is T => Boolean(post))
}

export function getTrackRoadmapPosts<T extends { slug: string }>(
  posts: T[],
  track: StudyRoadmapTrack
): T[] {
  const postBySlug = new Map(posts.map((post) => [post.slug, post]))

  return track.categories
    .flatMap((category) => (studyReadingOrder[category] ?? []).map((slug) => `${category}/${slug}`))
    .map((slug) => postBySlug.get(slug))
    .filter((post): post is T => Boolean(post))
}

export function getStudyRoadmapContext<T extends RoadmapStudy>(
  posts: T[],
  slug: string
): StudyRoadmapContext<T> | undefined {
  const roadmapPosts = getExplicitRoadmapPosts(posts)
  const currentIndex = roadmapPosts.findIndex((post) => post.slug === slug)

  if (currentIndex === -1) return undefined

  const current = roadmapPosts[currentIndex]
  const postBySlug = new Map(roadmapPosts.map((post) => [post.slug, post]))
  const prerequisites = (current.prerequisites ?? [])
    .filter((prerequisiteSlug) => prerequisiteSlug !== current.slug)
    .map((prerequisiteSlug) => postBySlug.get(prerequisiteSlug))
    .filter((post): post is T => Boolean(post))

  return {
    current,
    prerequisites,
    previous: roadmapPosts[currentIndex - 1],
    next: roadmapPosts[currentIndex + 1]
  }
}
