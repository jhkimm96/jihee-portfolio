# 핵심 CS 백로그 최종 대조

기준일: 2026-10-09. 범위: 사용자가 제공한 관측성 → 장애 보호 → 배포/운영 → 정산/배치.
아래는 콘텐츠 존재와 학습 질문의 대조다. 운영 구현 완료나 79편 전체 재검증 완료 표가 아니다.

핵심 백로그의 공개 학습 연결 완료. 마지막 구간 커밋 f946379.
신규9편/기존6편 보완, 전체91개 테스트/타입/격리 빌드 통과(전체232페이지:
새 Study9편과 새 카테고리1개). 공식 자료/프로젝트 소스 대조 및 공개 범위 민감정보 검사 통과.

## 이번 마지막 구간

| 원래 학습 주제 | 공개 Study 연결 | 반영 방식 |
| --- | --- | --- |
| Dockerfile/Image/Container | docker/multi-stage-build | 기존 보완, 빌드/실행 구분 |
| Deployment/Service | kubernetes/deployment-vs-statefulset, service-and-ingress | 기존 보완, 교체와 연결 보장 구분 |
| ConfigMap/Secret | kubernetes/storage-secret-configmap | 기존 보완, 참조/보안/설정 갱신 |
| Startup/Readiness/Liveness | kubernetes/pod-lifecycle | 기존 보완, 실행/준비/재시작 구분 |
| Resource Request/Limit | kubernetes/resource-requests-and-limits | 신규 |
| OOMKilled | kubernetes/oom-killed-and-java-memory | 신규, JVM 메모리 선수 연결 |
| Kubernetes YAML | 위 Pod/Deployment/Service/설정/자원/CronJob 발췌 | 독립 중복 문법 글 없이 값과 객체 연결 |
| CronJob | kubernetes/cronjob-schedule-and-idempotency | 신규, 주간 실제 설정/중복 경계 |
| Batch App/Module | 같은 CronJob 글 3절 | 실행 모드와 물리 모듈 분리 구분 |
| GC/unreachable | jvm/gc-roots-reachability-and-memory-reclaim, heap-memory-reclaim | 기존 재사용, OOM 글 선수/관련 연결 |
| 로그/메트릭 운영 점검 | kubernetes/deployment-operational-verification | 신규, 기존 관측성 글 재사용 |
| 거래/정산 모델 | batch/transaction-and-settlement-model | 신규 |
| Reconciliation | batch/reconciliation-and-result-verification | 신규, 원본/계산/전달 경계 |
| 일별 정산 | batch/settlement-period-boundaries | 신규 학습 설계, 프로젝트는 주간만 확인 |
| 실패 건 관리 | batch/failed-delivery-and-idempotent-retry | 신규, 계산/전달/불일치 구분 |
| 재처리/멱등성 | 위 재전송 글, batch/job-step-and-restart-identity | 전달 재시도와 Job 재시작 구분 |
| Spring Batch Job/Step | batch/job-step-and-restart-identity, spring/spring-batch-chunk-processing | 신규/기존 보완 |
| 정산 CronJob | 운영 CronJob 글 재사용 | 같은 주제로 중복 글 생성 안 함 |
| 정산 결과 검증 | batch/reconciliation-and-result-verification | 대사 글에 통합 |

## 앞 구간

관측성: logs-metrics-traces → structured-json-logs → trace-span-event-identifiers
→ log-collection-and-search → kibana-data-view-and-saved-objects
→ actuator-health-and-readiness → prometheus-metric-scraping → metric-label-cardinality
→ grafana-payment-dashboard → alert-evaluation-and-notification → kafka-lag-diagnosis
→ opentelemetry-trace-waterfall → loki-labels-and-log-search.

장애 보호: cancellation-propagation(기존 Timeout) → retry-backoff-jitter-budget
→ circuit-breaker-open-and-recovery → fallback-safe-results → bulkhead-concurrent-call-isolation
→ rate-limiting-request-budget → token-bucket-and-bucket4j → redis-shared-rate-limit
→ http-retry-after-and-failure-response → resilience-pattern-boundaries.

위 slug는 모두 cs 카테고리다. 여기 화살표는 주제 확인 목록이며 실제 전체 탐색 순서는
lib/study-roadmap.ts가 기준이다. 핵심 개념3묶음(비동기/Kafka/DB동시성)은 기존 글을 재사용한다.

## 남은 별도 범위

- WebFlux/Reactive Streams/Netty/gRPC심화/MongoDB·S3/Ollama·RAG/Go/Rust/AX: 기존 계획대로 유예.
- 원본79편 모든 주장·기여 재검증과 전체 시각 QA: 완료 아님. 감사 후보를 글 편집 때 재검증.
- 실제 배포/부하/실패 복구/재시작/정산 실행과 결과 측정: 이번 작업 범위 밖, 미실시.
- 브라우저 화면 확인은 별도. 콘텐츠 생성 HTML 검증을 실사용 화면 검증으로 기록하지 않는다.
