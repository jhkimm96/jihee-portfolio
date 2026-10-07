# Study 구조 집계와 본문 검토 상태

집계일: 2026-10-07. 실제 MDX 79편을 파일 경로순으로 집계했다.
이 표는 구조 집계다. 줄 수나 그림 수만으로 품질을 판정하지 않는다.
질문/선수는 메타데이터 존재 여부, 토글/그림/외부 링크는 문법 등장 횟수다.
본문 판정은 별도 검토 기록에 근거해 갱신한다. 과거 대화의 검토 완료 주장은 현행 파일을 다시 읽기 전에는 승계하지 않는다.

| 번호 | 글 | 줄 수 | 질문 / 선수 | 토글 / Mermaid / 외부 링크 | 검토 상태 |
| --- | --- | --- | --- | --- | --- |
| 1 | [S3 presigned URL — 비공개 파일을 임시 서명 링크로 올리고 받기 (feat. IAM Role)](../../content/study/aws/s3-presigned-url.mdx) | 208 | — / — | 2 / 3 / 2 | 본문 검토·판정 후보 기록 |
| 2 | [GitHub Actions 병렬 빌드와 컨테이너 레지스트리 개념 정리](../../content/study/cicd/github-actions-parallel-build-registry.mdx) | 197 | — / — | 8 / 2 / 8 | 본문 검토·판정 후보 기록 |
| 3 | [비동기로 바꿨는데 더 느려진 이유](../../content/study/cs/async-throughput-and-queue-latency.mdx) | 174 | — / — | 1 / 5 / 1 | 본문 검토·판정 후보 기록 |
| 4 | [같은 검색어인데 외부 API가 여러 번 호출되는지 어떻게 확인할까?](../../content/study/cs/cache-miss-duplicate-load-diagnosis.mdx) | 133 | 있음 / 있음 | 6 / 2 / 3 | 본문 검토·판정 후보 기록 |
| 5 | [캐시 만료 순간 DB가 몰리는 이유 — Cache Stampede와 Single-flight](../../content/study/cs/cache-stampede-and-single-flight.mdx) | 150 | 있음 / 있음 | 5 / 2 / 6 | 본문 검토·판정 후보 기록 |
| 6 | [기다리기를 멈췄는데, 왜 서버는 계속 일할까?](../../content/study/cs/cancellation-propagation.mdx) | 169 | 있음 / 있음 | 5 / 4 / 8 | 본문 검토·판정 후보 기록 |
| 7 | [인덱스를 탔는데도 느린 이유 — Using filesort와 복합 인덱스](../../content/study/cs/composite-index-and-filesort.mdx) | 178 | — / — | 1 / 3 / 3 | 본문 검토·판정 후보 기록 |
| 8 | [커넥션 풀을 늘려도 빨라지지 않는 이유](../../content/study/cs/connection-pool-bottleneck.mdx) | 135 | — / — | 0 / 3 / 2 | 본문 검토·판정 후보 기록 |
| 9 | [DB가 느릴 때 병목은 어떻게 확인하나](../../content/study/cs/database-bottleneck-diagnosis.mdx) | 169 | — / — | 1 / 2 / 4 | 본문 검토·판정 후보 기록 |
| 10 | [배포할 때 잠깐 502가 발생하는 이유 — 트래픽 제외와 Graceful Shutdown](../../content/study/cs/graceful-shutdown-and-traffic-draining.mdx) | 145 | — / — | 1 / 3 / 3 | 본문 검토·판정 후보 기록 |
| 11 | [Index, Inverted Index, Indexing은 무엇이 다른가](../../content/study/cs/index-inverted-index-and-indexing.mdx) | 200 | — / — | 1 / 3 / 2 | 본문 검토·판정 후보 기록 |
| 12 | [Redis 메모리가 차면 왜 쓰기만 멈출까 — TTL과 Eviction](../../content/study/cs/redis-ttl-and-eviction.mdx) | 172 | — / — | 1 / 4 / 4 | 본문 검토·판정 후보 기록 |
| 13 | [저장은 성공했는데 목록에 없는 이유 — 복제 지연과 Read-after-write](../../content/study/cs/replication-lag-and-read-after-write.mdx) | 153 | — / — | 1 / 4 / 3 | 본문 검토·판정 후보 기록 |
| 14 | [샤딩하기 전에 정해야 하는 네 가지](../../content/study/cs/sharding-design-decisions.mdx) | 186 | — / — | 3 / 1 / 1 | 본문 검토·판정 후보 기록 |
| 15 | [같은 검색이 동시에 들어오면, 한 번만 조회하게 만들기](../../content/study/cs/single-flight-shared-future.mdx) | 351 | 있음 / 있음 | 12 / 7 / 5 | 본문 검토·판정 후보 기록 |
| 16 | [롤백해도 안 되돌아가는 것들](../../content/study/cs/transaction-rollback-boundaries.mdx) | 246 | — / — | 1 / 11 / 3 | 본문 검토·판정 후보 기록 |
| 17 | [저장은 UTC인데 오늘 매출이 틀린 이유 — 타임존과 하루의 경계](../../content/study/cs/utc-and-local-day-boundaries.mdx) | 203 | — / — | 2 / 2 / 4 | 본문 검토·판정 후보 기록 |
| 18 | [인덱스(B-tree)와 정규화 — 빨리 찾기 vs 깔끔하게 나누기](../../content/study/database/btree-index-and-normalization.mdx) | 55 | — / — | 0 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 19 | [커넥션 풀(HikariCP) — DB 연결을 왜 매번 새로 안 맺나](../../content/study/database/connection-pool-hikaricp.mdx) | 36 | — / — | 0 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 20 | [두 이체가 서로를 기다릴 때 — 데드락과 잠금 순서](../../content/study/database/deadlock-lock-ordering.mdx) | 112 | 있음 / 있음 | 2 / 0 / 7 | 본문 검토·판정 후보 기록 |
| 21 | [격리수준과 동시성 문제, 낙관적 락 vs 비관적 락](../../content/study/database/isolation-levels-and-locking.mdx) | 46 | — / — | 0 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 22 | [pgvector와 HNSW — Postgres에서 \](../../content/study/database/pgvector-hnsw-partial-index.mdx) | 218 | — / — | 3 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 23 | [RDB vs NoSQL — 관계형 데이터와 파일 데이터를 다르게 저장하는 이유](../../content/study/database/rdb-vs-nosql.mdx) | 39 | — / — | 0 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 24 | [재고 1개에 주문 2개가 성공하는 이유 — Lost Update와 동시성 제어 고르기](../../content/study/database/stock-concurrency-control.mdx) | 198 | 있음 / 있음 | 6 / 0 / 13 | 본문 검토·판정 후보 기록 |
| 25 | [워터마크 증분 동기화 — \](../../content/study/database/watermark-incremental-sync.mdx) | 368 | — / — | 8 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 26 | [Dockerfile과 멀티스테이지 빌드 — 왜 FROM이 두 번 나오나](../../content/study/docker/multi-stage-build.mdx) | 74 | — / — | 2 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 27 | [집계로 하는 행동·로그 분석 — 인기 검색어·트렌드·순방문자 (terms, date_histogram, cardinality)](../../content/study/es/aggregation-log-analysis.mdx) | 210 | — / — | 7 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 28 | [분석기와 한글 형태소 nori — 상품명이 실제로 어떻게 쪼개지나](../../content/study/es/analyzer-and-nori.mdx) | 218 | — / — | 5 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 29 | [행동데이터 기반 상품 추천 설계 — 개인화·함께 본 상품·인기 (function_score, 역할 분리)](../../content/study/es/behavioral-recommendation-design.mdx) | 184 | — / — | 7 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 30 | [키워드 검색과 의미 검색은 왜 함께 써야 할까 — BM25부터 Jina Reranker까지](../../content/study/es/hybrid-search-ranking-pipeline.mdx) | 366 | — / — | 5 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 31 | [매핑과 필드 타입 — text vs keyword, 그리고 상품 검색 스키마 설계](../../content/study/es/mapping-and-field-types.mdx) | 207 | — / — | 4 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 32 | [검색 쿼리 DSL과 관련도 — bool·match·term, BM25 점수, function_score로 랭킹 조정](../../content/study/es/query-dsl-and-relevance.mdx) | 260 | — / — | 7 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 33 | [RRF — 점수가 다른 두 검색 결과를 어떻게 합치나](../../content/study/es/reciprocal-rank-fusion.mdx) | 145 | — / — | 1 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 34 | [검색 이벤트 로그 파이프라인 — 이벤트를 어떻게 ES로 흘려보내나 (Kafka·Logstash·data stream·ILM)](../../content/study/es/search-event-log-pipeline.mdx) | 159 | — / — | 4 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 35 | [검색·추천 4개 기능 — 개념, 설계 의도, 예상 질문 총정리](../../content/study/es/search-recommendation-design-and-qa.mdx) | 333 | — / — | 14 / 2 / 0 | 본문 검토·판정 후보 기록 |
| 36 | [검색어 제안 — 자동완성과 오타 교정 (Completion Suggester, 한글 초성, Term Suggester)](../../content/study/es/search-suggest-autocomplete.mdx) | 134 | — / — | 1 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 37 | [검색 시스템과 Elasticsearch 기초 — 왜 RDB가 아니라 검색엔진인가](../../content/study/es/search-system-and-es-basics.mdx) | 161 | — / — | 6 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 38 | [Elasticsearch 보안 켜기 — 인증, TLS, 그리고 왜 한 번에 못 켜는가](../../content/study/es/security-authentication-and-tls.mdx) | 254 | — / — | 0 / 0 / 5 | 본문 검토·판정 후보 기록 |
| 39 | [벡터는 얼마나 무거운가 — 양자화와 저장 비용](../../content/study/es/vector-quantization-and-storage-cost.mdx) | 152 | — / — | 2 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 40 | [벡터 검색과 시맨틱 추천 — dense_vector·kNN·하이브리드 (ES 9.x)](../../content/study/es/vector-search-knn.mdx) | 202 | — / — | 7 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 41 | [목록 하나 열었는데 조회가 11번 — N+1 문제](../../content/study/jpa/n-plus-one-problem.mdx) | 146 | 있음 / 있음 | 3 / 0 / 7 | 본문 검토·판정 후보 기록 |
| 42 | [JPA/ORM 기초 — 객체와 테이블을 어떻게 연결하나](../../content/study/jpa/orm-basics.mdx) | 54 | — / — | 0 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 43 | [영속성 컨텍스트와 1차 캐시, 지연 로딩 vs 즉시 로딩](../../content/study/jpa/persistence-context-and-fetch-strategy.mdx) | 41 | — / — | 0 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 44 | [Specification으로 WHERE 조건 조립하기, 그리고 Pageable의 숨은 sort 파라미터](../../content/study/jpa/specification-and-pageable.mdx) | 192 | — / — | 0 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 45 | [트랜잭션과 ACID, 전파(propagation) — @Transactional이 실제로 하는 일](../../content/study/jpa/transactional-and-propagation.mdx) | 57 | — / — | 0 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 46 | [ArrayList와 LinkedList 중 무엇을 선택할까](../../content/study/jvm/arraylist-vs-linkedlist.mdx) | 125 | — / — | 2 / 0 / 3 | 본문 검토·판정 후보 기록 |
| 47 | [검색 순위 코드에서는 왜 여러 컬렉션을 함께 쓸까](../../content/study/jvm/choosing-collections-for-search-ranking.mdx) | 126 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 48 | [Java 컬렉션과 제네릭: List·Set·Map을 선택하는 기준](../../content/study/jvm/collections-and-generics.mdx) | 93 | — / — | 2 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 49 | [Java 동시성 기초: 선점·비동기 완료·중복 처리](../../content/study/jvm/concurrency-and-completablefuture.mdx) | 37 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 50 | [equals와 hashCode가 HashMap을 지키는 이유](../../content/study/jvm/equals-hashcode-and-immutability.mdx) | 266 | — / — | 2 / 1 / 6 | 본문 검토·판정 후보 기록 |
| 51 | [Java 예외를 읽는 법: 원인·전파·좁은 catch·자원 정리](../../content/study/jvm/exceptions-and-resource-safety.mdx) | 38 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 52 | [JVM은 객체가 필요 없는지 어떻게 판단하는가](../../content/study/jvm/gc-roots-reachability-and-memory-reclaim.mdx) | 244 | — / — | 0 / 2 / 4 | 본문 검토·판정 후보 기록 |
| 53 | [HashMap은 충돌을 처리하면서 어떻게 값을 찾는가](../../content/study/jvm/hashmap-collision-resize-and-lookup.mdx) | 207 | — / — | 4 / 1 / 3 | 본문 검토·판정 후보 기록 |
| 54 | [이미 올라간 heap 메모리는 어떻게 줄어드나 — GC 회수 · OS 반납 · 재시작](../../content/study/jvm/heap-memory-reclaim.mdx) | 97 | — / — | 2 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 55 | [Java 코드를 읽는 첫 순서: 타입·참조·객체·실행 흐름](../../content/study/jvm/java-code-reading-basics.mdx) | 41 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 56 | [==과 equals()는 무엇을 비교할까](../../content/study/jvm/java-equality-identity-and-equals.mdx) | 145 | — / — | 2 / 0 / 2 | 본문 검토·판정 후보 기록 |
| 57 | [Java의 기본형과 참조형에는 무엇이 있을까](../../content/study/jvm/java-primitive-and-reference-types.mdx) | 111 | — / — | 1 / 1 / 2 | 본문 검토·판정 후보 기록 |
| 58 | [변수에는 값과 객체가 어떻게 저장될까](../../content/study/jvm/java-value-reference-and-object.mdx) | 92 | — / — | 1 / 0 / 2 | 본문 검토·판정 후보 기록 |
| 59 | [초급 Java 개발자 면접에서 기대하는 수준](../../content/study/jvm/junior-java-interview-expectations.mdx) | 38 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 60 | [현대 Java 읽기: record·enum·Optional·Stream](../../content/study/jvm/modern-java-records-optionals-streams.mdx) | 32 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 61 | [OOP를 실제 Java 코드로 읽기: 캡슐화·인터페이스·다형성](../../content/study/jvm/oop-polymorphism-and-interfaces.mdx) | 40 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 62 | [Kubernetes 클러스터 구조 — Control Plane과 Worker Node](../../content/study/kubernetes/cluster-control-plane-worker.mdx) | 71 | — / — | 3 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 63 | [Deployment와 StatefulSet — 상태 없는 앱과 있는 앱을 다루는 법](../../content/study/kubernetes/deployment-vs-statefulset.mdx) | 127 | — / — | 4 / 0 / 3 | 본문 검토·판정 후보 기록 |
| 64 | [Kubernetes Pod 라이프사이클 정리](../../content/study/kubernetes/pod-lifecycle.mdx) | 11 | — / — | 0 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 65 | [네트워킹 — Service와 Ingress](../../content/study/kubernetes/service-and-ingress.mdx) | 122 | — / — | 1 / 0 / 2 | 본문 검토·판정 후보 기록 |
| 66 | [스토리지와 설정 — PV/PVC, Secret과 ConfigMap](../../content/study/kubernetes/storage-secret-configmap.mdx) | 84 | — / — | 0 / 0 / 3 | 본문 검토·판정 후보 기록 |
| 67 | [동기·비동기부터 Outbox까지 — 이벤트 처리를 시작하기 전에 알아야 할 것](../../content/study/msa/async-event-processing-foundations.mdx) | 732 | — / — | 14 / 2 / 5 | 본문 검토·판정 후보 기록 |
| 68 | [Kafka Offset와 Consumer Lag 이해하기](../../content/study/msa/kafka-offset-lag-reprocessing-idempotency.mdx) | 578 | — / — | 14 / 2 / 9 | 본문 검토·판정 후보 기록 |
| 69 | [MSA란? 그리고 PromptHub 서비스 지도](../../content/study/msa/msa-prompthub-service-map.mdx) | 128 | — / — | 4 / 0 / 1 | 본문 검토·판정 후보 기록 |
| 70 | [서비스별 Outbox·Inbox 적용 전수 분석 — 우리 MSA는 왜 서비스마다 다른가](../../content/study/msa/outbox-inbox-per-service.mdx) | 81 | — / — | 1 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 71 | [Outbox·Inbox는 짝이 아니다](../../content/study/msa/outbox-inbox-when-needed.mdx) | 92 | — / — | 1 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 72 | [프로젝트에서 출발하는 백엔드 핵심 역량 학습 순서](../../content/study/msa/project-based-backend-learning-guide.mdx) | 166 | — / — | 2 / 1 / 12 | 본문 검토·판정 후보 기록 |
| 73 | [PromptHub 전체 도메인 학습 로드맵 — 현재 develop과 팀 PR로 다시 읽기](../../content/study/msa/prompthub-complete-learning-roadmap.mdx) | 285 | — / — | 11 / 0 / 36 | 본문 검토·판정 후보 기록 |
| 74 | [Spring Boot의 open-in-view, 왜 커넥션을 오래 쥐고 있나](../../content/study/spring/open-in-view-connection-hold.mdx) | 58 | — / — | 1 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 75 | [Java 백엔드 코드를 읽는 법: Spring DI와 Port 경계](../../content/study/spring/reading-spring-java-with-di-and-ports.mdx) | 40 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
| 76 | [코드로 보는 상품 버전 이력 — row-chain 흐름 따라가기](../../content/study/spring/row-chain-versioning.mdx) | 332 | — / — | 3 / 3 / 0 | 본문 검토·판정 후보 기록 |
| 77 | [Spring Batch Chunk 처리 방식 정리](../../content/study/spring/spring-batch-chunk-processing.mdx) | 15 | — / — | 0 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 78 | [백엔드 없이 프론트엔드 변경을 Playwright로 혼자 E2E 검증하기](../../content/study/testing/frontend-e2e-without-backend.mdx) | 215 | — / — | 9 / 0 / 0 | 본문 검토·판정 후보 기록 |
| 79 | [Java 백엔드 테스트 읽기: 단위·통합·실패 재현](../../content/study/testing/java-backend-testing-basics.mdx) | 33 | — / — | 1 / 1 / 0 | 본문 검토·판정 후보 기록 |
