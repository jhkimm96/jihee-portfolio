# 근거 검증과 짧은 학습 순서, CS 백로그 대조

기준일: 2026-10-08 (Asia/Seoul). 79편 본문 감사에 이어 작성한 내부 조사 결과다.
공개 MDX와 로드맵 코드는 수정하지 않았다. 공개 적용 전에 아래 수정 범위를 함께 승인받는다.
글이 있다는 것, 이해하기 충분하다는 것, 기술 검증이 끝났다는 것은 다른 상태다.

## 1. 우선 근거 검증

### 확인 범위와 한계

- 최초 우선 후보 5개와 검색 선수 주장 2개를 공식 문서 및 관련 로컬 소스로 대조했다.
- Hibernate current 문서 표시 버전은 7.4.12.Final, Spring API는 7.0.9, PostgreSQL current는 18이다.
  이 버전들이 프로젝트 런타임 버전이라는 뜻은 아니다.
- 외부 백엔드 로컬 build.gradle은 Spring Boot 4.1.0을 선언한다. Git HEAD 조회는 접근 거부로
  실패했다. 아래 코드는 10/8에 읽은 로컬 파일의 상태이며, 원격 develop/배포 상태로 단정하지 않는다.
- DB, S3, 부하 시험을 실행하지 않았다. SNS 영상 수치는 재현·검증하지 않았으므로 보류다.

| 대상 | 판정 | 편집에 반영할 결론 |
| --- | --- | --- |
| JPA EAGER | 정정 근거 확인 | EAGER는 필요한 연관 데이터를 로딩하는 계약이지 SQL 한 번 보장이 아니다. 추가 SELECT와 N+1도 가능하다. LAZY도 항상 별도 SELECT라는 보장은 아니다. |
| 컨텍스트 수명 | 조건 보완 근거 확인 | 요청 범위 EntityManager가 트랜잭션 종료 뒤에도 열려 있을 수 있다. '트랜잭션 종료=책상 철거'는 트랜잭션 범위 예제로 제한한다. |
| OSIV와 연결 점유 | 조건 보완, 실측 보류 | EntityManager 수명과 물리 JDBC 연결 점유는 구분한다. 획득/반납 모드와 실제 트랜잭션 경계를 측정해야 한다. 세션이 열렸다는 사실만으로 요청 내내 연결 점유를 확정하지 않는다. |
| S3 서명 링크 | 정정 근거 확인 | 일회용이 아니다. 유효 기간 내 재사용 가능하며, 소지자가 사용하는 임시 접근권이다. 기본 자격 체인 사용만으로 EC2 Role 사용을 증명할 수 없다. |
| xmin 워터마크 | 정정 근거 확인 | xmin은 행 버전을 만든 트랜잭션 ID다. 쓰기 때 할당하는 ID를 커밋 순서로 취급할 수 없다. A가 먼저 쓰고 B가 먼저 커밋하는 반례가 가능하다(문서에 기반한 추론). |
| 오버랩과 성공 판정 | 보장 표현 축소 필요 | 고정 30초는 그 밖의 긴 트랜잭션을 보호하지 못한다. 실패가 실제로 검출되고 멱등 재처리되는 조건 없이 '영구 손실 없음'을 보장하지 않는다. Outbox도 순서를 자동 보장하지 않는다. |
| 데드락 검증 | 시험 설명 정정 필요 | 번호 순 잠금 뒤에는 두 요청이 같은 첫 행을 경쟁한다. 둘 다 첫 락을 얻은 뒤 만나는 barrier는 성립하지 않는다. 정상 시험과 교착 재현 시험의 동기화 지점을 다르게 설계한다. |
| ES bool/filter | 정정 근거 확인 | filter는 캐시 후보이지 모든 조건을 반드시 캐시하지 않는다. should 기본 최소1은 must와 filter가 모두 없을 때다. |
| int8 양자화 | 정정 근거 확인 | 양자화 벡터의 탐색 메모리 감소와 전체 디스크 용량을 구분한다. 원본 float도 디스크에 남기므로 총 저장공간이 그대로 1/4이라고 쓰지 않는다. |

### 공식 출처

- [Hibernate fetching](https://docs.hibernate.org/orm/current/userguide/html_single/#fetching): EAGER 추가 SELECT.
- [Hibernate connection handling](https://docs.hibernate.org/orm/current/userguide/html_single/#transactions-connection-handling): 연결 획득/반납 모드.
- [Spring OpenEntityManagerInViewFilter](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/orm/jpa/support/OpenEntityManagerInViewFilter.html): 요청 범위와 종료된 트랜잭션 구분.
- [AWS presigned URL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html): 재사용과 소지자 접근.
- [AWS 기본 자격 체인](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials-chain.html): 먼저 찾은 자격 사용.
- [PostgreSQL system columns](https://www.postgresql.org/docs/18/ddl-system-columns.html), [transaction IDs](https://www.postgresql.org/docs/18/transaction-id.html): xmin과 쓰기 시점 ID 할당.
- [PostgreSQL deadlocks](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-DEADLOCKS): 순환 대기와 동일 잠금 순서.
- [Elastic bool](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-bool-query): 캐시 후보와 should 기본 조건.
- [Elastic dense_vector](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector): 양자화 뒤 원본 디스크 보존.
- [Elastic bulk 응답](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-bulk): 응답/항목별 실패 검사 후속 기준.

### 로컬 프로젝트 근거

기준 디렉터리: `C:/programmers_prj/beadv6_6_3JMT_BE`. 비밀값은 읽거나 옮기지 않았다.

- Review.java의 product는 LAZY, user-service User.java의 roles는 EAGER다. 매핑 존재는 확인했지만
  실제 SQL 횟수와 이 선택의 팀 의도는 확인하지 않았다.
- config의 product/order/admin/settlement/notification 설정에 open-in-view:false가 있다.
  실제 활성 profile과 배포 환경의 최종 설정은 미확인이다. 과거 OSIV 위험과 구분한다.
- product/config/S3Config.java는 region만 지정한다. 코드에 자격 공급자 지정은 없지만, 런타임
  자격의 출처나 IAM Role 부착 상태는 이 파일로 확인할 수 없다.
- ProductReconcileScheduler.java: fixedDelay 기본 20초, overlap 30초, 성공 시 startedAt으로 전진.
  fixedDelay는 실행 종료 후 대기이므로 전체 반영 지연의 최대20초 보장이 아니다.
- ProductReindexService.java: bulkReconcile 반환 후 true. ElasticsearchProductSearchIndexer.java의
  bulkReconcile은 client.bulk 응답을 검사하지 않는다. 항목 실패가 있어도 워터마크가 전진할
  위험 후보로 기록한다. 운영 유실 발생을 확인한 것은 아니다.
- 같은 서비스는 embeddings를 읽어 문서 입력을 만든 뒤 refresh한다. 이번에 만든 벡터가 같은
  문서 입력에 없을 수 있다. 다음 증분 대상 재선정까지 확인해야 하므로 '반드시 다음 주기에 반영'
  또는 '최대20초'로 단정하지 않는다.
- 로컬 검색에는 FUSION_WINDOW=100이 보이며 검색 패키지의 Jina/rerank 검색 결과는 없었다.
  후속 Jina 글과 다른 checkout일 가능성이 있으므로 어느 글이 현재라고 판정하지 않는다.

### 데드락 시험을 고칠 때의 범위

1. 교착 재현: A가 행1, B가 행2를 각각 잠근 뒤 두 번째 행으로 진행시킨다. 유한 대기 시간과
   기대한 DB 오류를 확인한다.
2. 순서 통일: 두 작업을 첫 락 획득 전에 함께 출발시킨다. 첫 락 이후 양쪽 합류를 요구하지 않는다.
   두 완료와 잔액 합을 확인한다. A/B의 대기 순서 자체는 성공 조건으로 고정하지 않는다.
3. 실제 PostgreSQL 시험과 코드 작성은 아직 하지 않았다. 이번 결과는 시험 설계의 논리 점검이다.

### 남은 재검증

nori 실제 토큰 출력, RRF 점수 변환/논문, Outbox/Inbox 실제 제약과 원자성, TLS 전환 조건,
SNS 실험 수치, Spring Kafka 버전/프로젝트 버전은 남아 있다. Kafka 공식 다운로드에 4.3.1의
2026-06-25 릴리스는 확인했으나 과거 글 전체의 버전 주장을 검증한 것으로 보지 않는다.
[Kafka downloads](https://kafka.apache.org/community/downloads/)

## 2. 짧은 학습 순서 추천안

전체 설계는 유지한다. 날짜별 강제 진도가 아닌 선수 지식별 진입이며, 아래는 공개 구현 전 추천안이다.
모든 독자가 79편을 처음부터 끝까지 읽어야 하는 구조로 만들지 않는다.

| 학습 구간 | 먼저 이해할 한 장면 | 기존 글과 다음 연결 |
| --- | --- | --- |
| 0. 프로젝트 지도 | 구매1건을 누가 처리하는가 | msa-prompthub-service-map을 입구로, 전체 도메인 지도는 참고용 |
| 1. Java 읽기 | 값 복사와 같은 객체 공유 | primitive/reference → value/reference/object → equality → collections → HashMap/equals → DI·실제 검색 순위 |
| 2. 요청과 DB | 같은 ID 조회, 저장 성공/실패 | ORM → 컨텍스트/fetch 정정 → 트랜잭션 → N+1 → 조건 조립/페이지 |
| 3. 충돌과 병목 | 재고1에 주문2, 연결 앞 대기 | 연결 풀 기본 → 격리 → 재고 → 데드락 → 병목 진단 → filesort/복제 지연 |
| 4. 캐시와 비동기 | A/B가 같은 진행 중 결과를 기다림 | TTL/eviction → stampede → 진단 → CompletableFuture 기본 → single-flight → 취소 → 처리량/큐 |
| 5. 이벤트와 복구 | DB는 성공했는데 발행이 빠짐 | 동기/블로킹 → 내구성 → dual-write → Outbox → partition/offset → 중복/Inbox → retry/DLT → 대사 |
| 6. 로그와 관측 | 지연1건의 원인을 좁힘 | 신호 차이 → JSON 로그 → ID 연결 → 수집/검색 → 메트릭/대시보드 → Lag → 추적/알림 |
| 7. 장애 보호 | 외부 API가 늦어 전체 자원이 고갈됨 | timeout/취소 → retry/backoff → circuit breaker/fallback → bulkhead → 유입 제한 → 정책 비교 |
| 8. 배포와 운영 | 새 Pod가 준비되면 트래픽 이동 | image/container → Deployment/Service → 설정/probe → 자원/OOM → 종료/배포 → GC 운영 관찰 |
| 9. 정산과 배치 | 원천10건 중 결과9건의 누락 찾기 | 거래 모델 → 대사 → 일별 실행 → 실패/멱등 재처리 → Job/Step → CronJob → 결과 검증 |
| 선택. 검색 심화 | 같은 상품이 각 검색 단계에서 남거나 빠짐 | 역색인 → mapping/analyzer → DSL → 벡터 → RRF → reranker → 동기화/운영 |
| 이후 심화 | 지금 도구의 한계를 새 기술로 해결 | WebFlux/gRPC/RAG/언어별 학습은 구체적인 필요가 생길 때 |

### 기존 공개 순서와의 차이

- lib/study-roadmap.ts는 category들을 이어 붙이므로 cs 사례가 jvm 기본보다 앞선다.
  전체 추천 순서를 바꾸거나 선수 링크로 바로 갈 수 있게 하되, 구현 방식은 별도 승인한다.
- 메모리는 도달가능성 → GC 회수 → heap/OS 반환 순으로 읽는다. 현재 heap 글이 roots 글보다 앞선다.
- OSIV는 JPA 트랜잭션/컨텍스트를 배운 뒤 연결 점유 진단에서 읽는다.
- CompletableFuture의 완료/미완료 객체 개념을 single-flight 구현 전에 짧게 제공한다.
- 긴 비동기/Kafka 글은 전체 지도와 심화 참고로 유지한다. 이미 있는 Outbox/Inbox 글을 복제하지 않는다.
- '기술 공부 순서'와 'PromptHub 업무 흐름 지도'는 역할이 다르므로 둘을 하나의 필수 장문으로 합치지 않는다.

### 공개 편집의 첫 묶음 제안

먼저 JPA 컨텍스트/fetch, OSIV, S3, 워터마크, 데드락 5편을 기존 URL 그대로 보완한다.
이유는 선수 개념과 보장 범위의 잘못된 이해가 후속 글까지 전파되기 때문이다.
그다음 Java 진입/CompletableFuture 설명과 N+1·재고·데드락의 실제 시각 장면을 보완한다.
새 파일 분리와 현재 공개 결론 변경은 초안에서 명시한 뒤 승인받는다.

## 3. 미작성 CS 백로그 대조

아래 '없음'은 79편 Study에서 해당 학습 질문의 독립 설명을 찾지 못했다는 뜻이다.
프로젝트에 구현이 없다는 뜻이 아니다. 키워드 검색은 위치 찾기에만 사용했고 기존 본문 감사와
대조했다. 초안만 제시된 '로그와 관측성'은 게시 완료로 잡지 않는다.

상태: 재사용=관련 설명 있음(근거 정정 가능), 보완=정의/개요/일부 설명만 있음,
신규=해당 질문을 다룰 Study 필요, 유예=현재 핵심 학습 뒤 진행. 새 글 수는 이 표 행 수와 다르다.

### 로그와 관측성

| 주제 | 상태 / 기존 근거 | 다음에 답할 질문 |
| --- | --- | --- |
| 로그·메트릭·트레이싱 차이 | 보완 / 백엔드 학습 지도4절 | 느린 주문1건을 세 신호로 각각 무엇까지 알 수 있나? |
| 구조화 JSON 로그 | 보완 / search-event-log-pipeline 이벤트 JSON | 문장 로그와 필드 로그로 검색하는 차이는? |
| traceId | 보완 / 지도 request ID 언급 | 같은 요청 로그가 여러 서비스에서 어떻게 이어지나? |
| spanId | 신규 | 요청 안의 외부 호출과 DB 구간은 어떻게 나뉘나? |
| eventId | 재사용 / 비동기·Kafka·Inbox | 요청 추적 ID와 중복 처리 ID는 왜 다른가? |
| ELK 수집 흐름 | 재사용 / search-event-log-pipeline | 이벤트1건이 저장되고 조회되기까지 누가 무엇을 하나? |
| Elasticsearch·OpenSearch 비교 | 보완 / index 용어·ES 기본 | 호환성·배포 환경에 따라 무엇을 선택하나? |
| Kibana Data View | 신규 | 날짜별 로그 인덱스를 한 화면에서 어떻게 검색하나? |
| Kibana Saved Object | 보완 / 지도 공식 링크뿐 | 저장한 검색·차트·대시보드의 관계는? |
| Spring Boot Actuator | 신규 | 상태 확인과 관측 endpoint를 어떻게 안전하게 노출하나? |
| Prometheus | 보완 / Kafka 지표 도구 언급 | 시간에 따라 변하는 수치를 어떻게 수집하나? |
| Metric Label | 신규 | 라벨 값을 계속 늘리면 왜 비용이 커지나? |
| Grafana Dashboard | 보완 / 도구 소개 | 장애 판단에 필요한 지표들을 어떻게 함께 보나? |
| Alerting | 보완 / 지도·DLT 알림 | 어떤 변화에 누가 대응해야 하나? |
| Kafka Lag 관측 | 보완 / Kafka7절 원인 목록 | 같은 Lag 증가에서 생산량/DB/재시도 원인을 좁히는 순서는? |
| OpenTelemetry | 보완 / 신호 지도 | 실제 요청에 추적 정보를 어떻게 붙여 전달하나? |
| APM | 보완 / DB 병목 글 span 언급 | 한 요청에서 어디에 시간이 쓰였는지 어떻게 읽나? |
| Loki | 보완 / 지도 label 주의 | 로그 필드와 인덱스 라벨을 어떻게 나누나? |

추천 첫 학습 묶음은 신호 차이 → JSON 로그 → 세 ID 역할이다. 수집 경로 글은 재사용하고,
Data View/Saved Object는 도구 사용 질문으로 묶을 수 있다. 도구 이름마다 새 글을 강제하지 않는다.

### 장애 전파 방지

| 주제 | 상태 / 기존 근거 | 다음에 답할 질문 |
| --- | --- | --- |
| Timeout | 보완 / cancellation-propagation | 어느 호출의 대기를 얼마까지 허용하나? |
| Retry | 재사용 / 비동기·Kafka 실패 정책 | 일시 실패와 영구 실패를 어떻게 구분하나? |
| Backoff·Jitter | 보완 / 워터마크·재고 토글 | 모두가 동시에 재시도하면 어떻게 되나? |
| Circuit Breaker | 보완 / 지도 목적표 | 계속 실패 중일 때 요청을 왜 잠시 막나? |
| Fallback | 보완 / ES·검색 종합 사례 | 대체 응답의 정확성·신선도·장애 관측 한계는? |
| Rate Limiting | 보완 / 지도·429 설명 | 유입 요청을 어느 사용자/서비스 단위로 제한하나? |
| Bulkhead | 보완 / 지도·프로젝트 PR 링크 | 한 기능이 다른 기능의 작업 자리까지 차지하지 않게 하려면? |
| Token Bucket | 신규 / 지도 이름뿐 | 토큰이 채워지고 소비되는 장면으로 버스트를 설명할 수 있나? |
| Bucket4j | 신규 | 라이브러리가 해주는 일과 직접 설정할 정책은? |
| Redis 분산 Rate Limit | 신규 / 지도 목표뿐 | 서버5대가 제한량을 어떻게 공유하나? |
| HTTP429·외부 API 장애 | 보완 / 워터마크 HTTP429 | Retry-After와 호출 예산, 사용자 응답을 어떻게 정하나? |
| 보호 패턴 비교 | 보완 / 지도 표 | 같은 지연 사건에서 어떤 보호가 어느 경계를 지키나? |

Redis 원자 연산과 분산 락은 재고 글 토글에 설명이 있다. 분산 제한과 역할이 다르므로 동일
구현으로 간주하지 않고, 필요할 때 각각 상태 변화와 실패 조건을 보완한다.

### 배포와 운영

| 주제 | 상태 / 기존 근거 | 다음에 답할 질문 |
| --- | --- | --- |
| Dockerfile·Image·Container | 보완 / multi-stage-build | 빌드 재료와 실제 실행 결과는 어떻게 다른가? |
| Deployment·Service | 재사용 / 해당 Kubernetes 글 | 새 Pod 교체 중에도 같은 주소가 어떻게 연결되나? |
| ConfigMap·Secret | 보완 / storage-secret-configmap | 설정 주입과 비밀 보호가 왜 별도 문제인가? |
| Readiness·Liveness·Startup | 보완 / graceful-shutdown | 준비 안 됨과 재시작 필요를 어떻게 구분하나? |
| Resource Request·Limit | 신규 / 학습 지도 목표 | 자원 예약과 사용 상한은 어떻게 다른가? |
| OOMKilled | 신규 / 지도 이름뿐 | 컨테이너 메모리 종료와 Java heap 부족은 어떻게 구분하나? |
| Kubernetes YAML 읽기 | 보완 / 여러 매니페스트 발췌 | 같은 Pod에 설정·트래픽·저장소가 어떻게 연결되나? |
| CronJob | 보완 / deployment-vs-statefulset | 중복·누락 실행과 이전 작업 겹침을 어떻게 다루나? |
| Batch App·Module 분리 | 신규 | 계속 켜진 API와 종료되는 배치 실행의 책임은? |
| GC·unreachable object | 재사용 / roots·heap 글 | 참조가 끊어진 뒤 회수와 OS 반환은 왜 다른가? |
| 로그·메트릭 운영 점검 | 보완 / DB 병목·종료 지표 | 배포 전후 변화와 실패 원인을 어떤 순서로 보나? |

### 정산과 배치

| 주제 | 상태 / 기존 근거 | 다음에 답할 질문 |
| --- | --- | --- |
| 거래·정산 데이터 모델 | 보완 / 전체 도메인 지도6절 | 결제1건에서 정산 대상과 결과가 어떻게 생기나? |
| Reconciliation 대사 | 보완 / 비동기·워터마크·도메인 지도 | 총합이 같아도 누락과 중복을 어떻게 찾나? |
| 일별 정산 배치 | 신규 / 지도 읽을 순서만 | 업무 하루의 경계와 집계 대상은? |
| 실패 건 관리 | 신규 / DLT와는 다른 업무 상태 | 계산/전달 실패를 어디에 남기고 재시도하나? |
| 재처리·멱등성 | 보완 / 이벤트 소비 멱등 | 정산 작업 재실행이 중복 지급으로 이어지지 않게 하려면? |
| Spring Batch Job·Step | 보완 / chunk 글 정의2개 | 실행 이력과 실패한 단계 재시작 조건은? |
| Kubernetes CronJob | 위 운영 행 재사용 | 스케줄은 같아도 배치 완료·재실행 보장은 왜 별개인가? |
| 정산 결과 검증 | 보완 / 도메인 지도 대사 | 원천/계산/전달의 어느 경계를 서로 비교하나? |

### 이후 심화

| 주제 | 상태 / 기존 근거 | 시작 조건 |
| --- | --- | --- |
| WebFlux | 유예 / 지도 이름뿐 | 현재 블로킹 경로와 병목을 설명한 뒤 |
| Reactive Streams·Backpressure | 유예 / 비동기 지도 용어 구분 | 생산/소비 속도 차이와 큐를 이해한 뒤 |
| Netty | 유예 | 네트워크 처리 계층을 직접 진단할 필요가 있을 때 |
| gRPC 심화 | 유예 / MSA 지도 기본 설명 | timeout·취소·계약 호환성을 다룬 뒤 |
| MongoDB·S3 비교 | 유예 / rdb-vs-nosql 분류 보완 | 문서 데이터와 파일 객체의 요구 차이를 먼저 정한 뒤 |
| Ollama·사내 RAG | 유예 / 지도 이름뿐 | 공개 가능한 데이터/검색/권한 요구부터 정한 뒤 |
| Go | 유예 | 기존 구현보다 무엇을 바꾸려는지 정한 뒤 |
| Rust | 유예 | 시스템 안전성/성능 등 실제 학습 목적을 정한 뒤 |
| AX | 유예 | 사용자가 뜻하는 문맥과 목표를 확인한 뒤 |

## 4. 다음 실행과 남은 승인

이번에 완료한 것은 우선 주장 대조, 내부 학습 순서 추천, 사용자 CS 목록의 학습 커버리지 대조다.
79편 모든 기술 주장과 모든 프로젝트 경로를 재검증한 것은 아니다.

1. 남은 재검증 후보는 해당 공개 글을 편집하기 직전에 공식 버전과 실제 프로젝트 근거를 확인한다.
2. 첫 5편의 수정 초안을 한 번에 제시한다. URL/날짜 유지, 정정 내용과 그림 장면을 함께 승인받는다.
3. Java 기본 설명 보완과 파일럿 시각 장면을 적용·화면 검증한다.
4. 관측성 첫 묶음 초안을 조사한다. 기존 로그 수집 글은 연결하고 불필요하게 다시 쓰지 않는다.
5. 공개 로드맵 변경은 별도 계획/승인/테스트 후 적용한다. 새 백로그 글에 가짜 공개 링크를 만들지 않는다.

이번 작업에서는 테스트·빌드·화면 검증을 실행하지 않았다. 문서 링크/경로와 변경 범위를 확인한다.
