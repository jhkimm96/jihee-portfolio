# Study 본문 검토 기록

검토 기준: 최신 Study 콘텐츠 계약. 갱신일: 2026-10-07.
현재 아래 79편의 현행 본문을 모두 읽었다. 본문 검토 대기는 없다.
검토는 학습 편집과 근거 재검증 필요 지점의 발견이며, 모든 기술 주장이나 프로젝트 적용의 진위 검증 완료가 아니다. 화면 검증도 별도다.
원문 수정은 하지 않았다. 다른 세션의 워킹트리를 보존한다.

| Study 경로 (content/study 아래) | 판정 후보 | 본문에서 확인한 근거와 다음 편집 방향 |
| --- | --- | --- |
| [aws/s3-presigned-url](../../content/study/aws/s3-presigned-url.mdx) | 근거 보완·질문 분리 후보 | 파일 이동 경로 그림은 유용하나 메모리 수치, IAM, 서명·업로드·다운로드가 한 글에 섞임. 일회용 링크 비유와 SDK 자격 조회 설명은 공식 계약 재검증 필요. 파일 흐름을 먼저, 인증은 후속 질문으로. |
| [cicd/github-actions-parallel-build-registry](../../content/study/cicd/github-actions-parallel-build-registry.mdx) | 개요 유지·분리 후보 | OOM부터 러너 등록, Matrix, 레지스트리, 인증과 OIDC까지 독립 질문이 많음. 긴 sequence 두 개도 다시 해석해야 함. 빌드/배포 장소 전후와 병렬 시간축으로 먼저 설명; GHCR 가시성·manifest·OOM 단정은 재검증. |
| [database/btree-index-and-normalization](../../content/study/database/btree-index-and-normalization.mdx) | 질문 분리·근거 보완 후보 | 찾기와 중복 저장이라는 다른 질문. 인덱스 탐색 장면과 상품/태그 전후 표를 구분; 성능·팀의 비정규화 의도는 코드·결정 근거 필요. |
| [database/connection-pool-hikaricp](../../content/study/database/connection-pool-hikaricp.mdx) | 설명 보완 | 짧게 유지하되 연결을 빌림/반납/빈자리 없음 장면 추가. 기본 설정값과 프로젝트 설정·충분하다는 판단의 근거를 분리. |
| [database/isolation-levels-and-locking](../../content/study/database/isolation-levels-and-locking.mdx) | 개요·중복 정리 후보 | 재고 글과 Lost Update·락 설명이 겹침. 격리 수준 한 질문으로 좁히고 read 시점 그림; 팀이 위험 감수했다는 주장과 성능 서열 재검증. |
| [database/pgvector-hnsw-partial-index](../../content/study/database/pgvector-hnsw-partial-index.mdx) | 개요 유지·분리 후보 | 벡터 타입/거리, HNSW, 부분 인덱스/실행계획의 독립 질문. 이웃 탐색 그림은 유용; 인덱스 반드시 탐/못 탐, 정확도와 조회 비용 단정은 조건·공식 문서 보완. |
| [database/rdb-vs-nosql](../../content/study/database/rdb-vs-nosql.mdx) | 근거 보완·설명 보완 | 객체 스토리지와 NoSQL DB 분류를 구분할 필요. 상품 행과 파일의 실제 저장 위치 그림; 저장소 선택을 단순 yes/no로 끝내지 않기. |
| [database/watermark-incremental-sync](../../content/study/database/watermark-incremental-sync.mdx) | 개요 유지·분리·근거 보완 후보 | 커밋 가시성/실패/자기 갱신/해시/429/삭제가 한 글. 시각 타임라인 자산은 유지; xmin이 커밋 순서를 보장한다는 부분, 무손실·Outbox 순서 단정 우선 재검증. |
| [jpa/n-plus-one-problem](../../content/study/jpa/n-plus-one-problem.mdx) | 시각 설명 보완·조건 점검 | 상품10개→판매자10명 조회가 표 중심. 항목에서 DB로 나가는 선과 fetch/batch 전후 장면을 제안. 코드가 본문을 차지함; summary의 1~2회는 batch 크기·페이지/조회 범위 조건을 드러내야 함. |
| [database/stock-concurrency-control](../../content/study/database/stock-concurrency-control.mdx) | 시각 설명 보완 | 재고 읽기/저장 경합을 시점표만으로 전달. A/B가 같은 재고1을 각각 읽고 0을 저장하는 장면과 조건부 차감 전후를 추가할 후보. 비교표는 선택 기준에만 유지. |
| [database/deadlock-lock-ordering](../../content/study/database/deadlock-lock-ordering.mdx) | 시각 설명·검증 설계 보완 | 서로 가진 계좌 락을 기다리는 고리는 표보다 관계 그림이 적합. 영원히 기다린다는 문장과 DB가 끊는 다음 절의 관계 명시. 순서 통일 후 양쪽 첫 락 획득을 기다리는 동일 barrier 시험은 교착될 수 있어 별도 시험 설계 필요. |
| [jpa/orm-basics](../../content/study/jpa/orm-basics.mdx) | 설명 보완·근거 점검 | 객체→SQL→행 변화를 먼저 그림으로. 클래스와 명세/구현 구분 유지; 컬럼 추가가 annotation만으로 끝난다는 표현은 스키마 변경 범위를 확인. |
| [jpa/persistence-context-and-fetch-strategy](../../content/study/jpa/persistence-context-and-fetch-strategy.mdx) | 우선 근거 보완 | 후속 N+1의 선수 글인데 EAGER를 한 번 조회로 설명하고 트랜잭션 종료=컨텍스트 종료처럼 단정. context/트랜잭션 수명과 조회 방식 공식 검증 후 사용 장면 보완. |
| [jpa/transactional-and-propagation](../../content/study/jpa/transactional-and-propagation.mdx) | 질문 분리·설명 보완 | 원자성, ACID, readOnly, 전파가 섞임. 주문 저장 성공/실패 전후와 REQUIRED/NEW 두 경계 그림. 프록시/self-invocation 조건과 readOnly 계약 재검증. |
| [jvm/concurrency-and-completablefuture](../../content/study/jvm/concurrency-and-completablefuture.mdx) | 시각 설명 보완·질문 분리 후보 | 선점과 비동기 완료를 동시에 다룸. 하나의 eventId를 두 작업자가 잡는 장면, send 반환/완료를 나눔. 현재 추상 sequence는 개발자 배경지식을 요구. |
| [jvm/exceptions-and-resource-safety](../../content/study/jvm/exceptions-and-resource-safety.mdx) | 설명 보완 | 추상 계층 그림을 실제 검색 실패→대체 결과 장면으로 바꿈. 외부 구현/자체 예외 출처와 catch 전후; 자원 닫기 질문은 짧은 후속 단위 후보. |
| [jvm/java-code-reading-basics](../../content/study/jvm/java-code-reading-basics.mdx) | 우선 설명 보완 | 비전공자 진입 글인데 DTO/Port/Mapper가 먼저 등장. 한 값의 생성·참조·변경·반환을 그림과 최소 실행 코드로; ellipsis 예제는 실행 불가를 표시. |
| [jvm/junior-java-interview-expectations](../../content/study/jvm/junior-java-interview-expectations.mdx) | 개요 유지·근거 보완 | 공부 항목 안내로는 유용하나 학습 Study의 사건은 없음. 채용 기대 수준 단정의 근거 필요. 기술 정의 글로 억지 확장하지 말고 학습 목표/자기 확인 지도 역할로. |
| [jvm/modern-java-records-optionals-streams](../../content/study/jvm/modern-java-records-optionals-streams.mdx) | 개요 유지·분리 후보 | 독립 문법들을 임의 실행 순서 화살표로 연결. 실제 같은 데이터가 처리되는 경우만 흐름으로 표시; record 불변성 범위와 enum 설명 누락 점검. |
| [jvm/oop-polymorphism-and-interfaces](../../content/study/jvm/oop-polymorphism-and-interfaces.mdx) | 설명 보완 | classDiagram은 구현자용. 같은 검색 버튼이 실제 객체에 따라 다른 조회를 하는 장면→코드로. 캡슐화와 교체 계약은 별도 질문인지 검토. |
| [spring/reading-spring-java-with-di-and-ports](../../content/study/spring/reading-spring-java-with-di-and-ports.mdx) | 설명 보완 | 생성자 예제는 있지만 객체를 누가 만들고 연결하는지 보이지 않음. Spring 조립 전후와 실제/시험 객체 교체 장면; Port는 필수 DI 기능으로 혼동하지 않게. |
| [spring/open-in-view-connection-hold](../../content/study/spring/open-in-view-connection-hold.mdx) | 우선 근거 보완·시각 설명 | 긴 세션과 물리 연결 점유를 단정하는 부분 재검증. 트랜잭션/세션/연결 세 시간축을 분리하고 실제 설정·드라이버의 반환 시점 관찰 필요. |
| [testing/java-backend-testing-basics](../../content/study/testing/java-backend-testing-basics.mdx) | 설명 보완 | Unit→Integration→E2E를 실행 단계처럼 잇는 그림. 입력·실행·관찰 한 실패 예제를 중심에 두고 시험 범위 차이를 별도 비교; PR4 출처도 확인. |
| [kubernetes/pod-lifecycle](../../content/study/kubernetes/pod-lifecycle.mdx) | 내용 보강 필요 | 상태 이름 한 문장뿐. 컨테이너 실행 전/실행/종료 장면과 Pending 원인 등 질문을 정해 새 초안 범위 제안. Running과 준비 상태 혼동 방지. |
| [spring/spring-batch-chunk-processing](../../content/study/spring/spring-batch-chunk-processing.mdx) | 내용 보강 필요 | Chunk/Tasklet 정의만 존재. 거래5건을 묶어 저장하고 실패한 묶음을 확인하는 장면 후보; 버전·실패 재시작 조건 조사 필요. |

| [docker/multi-stage-build](../../content/study/docker/multi-stage-build.mdx) | 설명 보완·비유 정밀화 | 케이크/주방 비유와 핵심3줄은 살린다. 본문이 전체 Dockerfile로 시작하므로 빌드 상자→jar만 실행 상자로 옮기는 전후 그림을 먼저. 새 FROM이 이전 산출물을 전부 버린다는 표현은 stage 참조와 구분. |
| [kubernetes/cluster-control-plane-worker](../../content/study/kubernetes/cluster-control-plane-worker.mdx) | 시각 설명·근거 보완 | 매니저/직원 비유를 실제 Pod 배치 장면으로 연결. 역할 구분과 물리 서버 분리를 동일시하는 설명, medium/large 배치·containerd 버전·팀 결정 근거를 현행 설정과 대조. |
| [kubernetes/deployment-vs-statefulset](../../content/study/kubernetes/deployment-vs-statefulset.mdx) | 개요 유지·분리·근거 보완 후보 | 재생성/롤링배포/고정 신원·저장공간/CronJob이 섞임. 이전·새 Pod 교체 장면과 데이터 연결 장면을 분리. Deployment 저장소는 임시, CronJob 딱1회라는 단정과 미머지 운영 현황은 재검증. |
| [kubernetes/service-and-ingress](../../content/study/kubernetes/service-and-ingress.mdx) | 시각 설명·근거 보완 | 사서함 비유는 살리고 Pod 교체 전후 같은 Service로 도착하는 장면을 본문 앞에. 일반/headless와 Ingress는 별도 질문 후보. primary 고정0번·쓰기 routing 불가·Eureka 실제 경로는 근거 대조. |
| [kubernetes/storage-secret-configmap](../../content/study/kubernetes/storage-secret-configmap.mdx) | 질문 분리·보안 근거 보완 | Pod가 교체돼도 저장소가 남는 장면과 같은 이미지에 설정을 주입하는 장면은 다른 질문. local PV의 노드 장애 한계, Secret의 기본 보안 성질, 값이 별도서버 파일에만 존재한다는 주장 확인. |
| [jvm/arraylist-vs-linkedlist](../../content/study/jvm/arraylist-vs-linkedlist.mdx) | 구조 유지·진입 보완 | 배열 이동/연결 전후 ASCII가 실제 변화와 비용을 보여줘 유지. 정의→코드보다 할일목록 위치읽기 상황 먼저. 큐는 별도 질문 연결 후보; 질문/선수/회상과 Java버전 기준 보완. |
| [jvm/choosing-collections-for-search-ranking](../../content/study/jvm/choosing-collections-for-search-ranking.mdx) | 구조 유지·값 연결 보완 | A/B/C/D와 점수 누적·중복 제거·정렬이 잘 연결됨. 앞 HashMap 예시점수와 뒤 정렬전 점수가 달라 다른 예시인지 밝히거나 통일. 선언/정렬 상세는 토글로; 실제 코드 링크·메타와 회상 보완. |
| [jvm/collections-and-generics](../../content/study/jvm/collections-and-generics.mdx) | 설명 보완·중복 정리 | Map/HashMap 저장과 조회 예시는 살린다. 첫 선택트리의 순서/중복 라벨과 뒤 예제 연결 필요. 제네릭 별도 질문 후보; LinkedHashMap 입력순서 설명의 설정조건 점검. |
| [jvm/equals-hashcode-and-immutability](../../content/study/jvm/equals-hashcode-and-immutability.mdx) | 개요 유지·분리 후보 | 잘못된 hash로 다른 위치를 찾는 예시와 가상 위치 표시는 유용. equals/hash계약에서 record/폴더배치/가변key까지 길어짐. 기본 계약과 key변경 장면은 남기고 record 작성/위치는 후속 연결; 얕은불변성 조건 검증. |
| [jvm/heap-memory-reclaim](../../content/study/jvm/heap-memory-reclaim.mdx) | 우선 근거 보완·질문 분리 | heap used/OS 반환/재시작 구분은 살림. 요청종료=도달불가, GC는 시간기반 아님, RSS는 겉보기일뿐, 강제GC 무해/반납 단정은 GC·JDK조건 검증. used/committed/RSS 전후 그림을 중심으로 재편. |
| [jvm/gc-roots-reachability-and-memory-reclaim](../../content/study/jvm/gc-roots-reachability-and-memory-reclaim.mdx) | 구조 유지·질문 분리 후보 | 참조끊김·순환참조와 root연결 ASCII는 좋은 설명 자산. 데이터영역/도달가능성/세대/STW는 독립질문. 특정 G1단순화 표시 유지; Java27최신 주장·static root와 위치 설명의 공식범위 검증. |
| [jvm/hashmap-collision-resize-and-lookup](../../content/study/jvm/hashmap-collision-resize-and-lookup.mdx) | 구조 유지·그림 단순화 | key1/5/9의 동일 bucket과 resize 전후가 이해에 적합. 순서도와 ASCII가 같은 설명을 중복하는지 검토. 기본조회와 복잡도/resize 분리 후보. Java21프로젝트와26구현자료 구분·선수/회상 보완. |
| [jvm/java-equality-identity-and-equals](../../content/study/jvm/java-equality-identity-and-equals.mdx) | 구조 유지·코드 계층 분리 | 같은내용 객체2개/같은객체 참조2개 예시는 유지. 객체 비교 그림→결과 먼저, 긴 equals구현 토글. 리터럴 동일객체 문구와 Java27기준 확인; 질문/선수/회상 메타 보완. |
| [jvm/java-primitive-and-reference-types](../../content/study/jvm/java-primitive-and-reference-types.mdx) | 설명 보완 | 타입 분류도보다 age20/name객체 예시를 먼저. class/record/enum 분류와 wrapper·null은 토글·후속 연결. 기본형과참조형을 자료이름암기 아닌 실제 저장차이로 전달. |
| [jvm/java-value-reference-and-object](../../content/study/jvm/java-value-reference-and-object.mdx) | 구조 유지·소폭 보완 | 값복사/공유객체/별개객체를 같은예시 전후로 보여줘 그대로 재사용할 자산. 객체공유 글의 선수로 활용. question/prerequisites/회상 보완; Product예제 출처와 실제메모리그림 아님을 짧게 표시. |
| [jpa/specification-and-pageable](../../content/study/jpa/specification-and-pageable.mdx) | 개요 유지·질문 분리·근거 보완 후보 | 탭4개 문제상황은 좋지만 클래스5단계, 조건블록,닉네임선조회,Pageable sort가 한글. 탭선택→조건카드→결과상품 먼저. Page가 SQL한방이라는 표현/count범위·정렬400/500·현행API경로 대조. |
| [spring/row-chain-versioning](../../content/study/spring/row-chain-versioning.mdx) | 개요 유지·분리·현행 근거 대조 | 상품row 전후는 이해자산이나 수정/검수/복원/대표조회/gRPC/판매수까지 코드 장문. 판매중v1과검수v2를 상태장면으로 먼저, 여정별 짧은글 연결. 항상판매중1개·transaction+test보장과 잔여위험 현행코드대조. |
| [testing/frontend-e2e-without-backend](../../content/study/testing/frontend-e2e-without-backend.mdx) | 설명 보완·시험 범위 명시 | 실제UI/가짜인증·네트워크 경계를 구분한 점은 유지. 화면입력→요청→가짜응답→화면변화 그림 먼저, 긴 fixture는 토글. 로컬시험 전제와 전체통합/E2E의 제한을 앞에; 스텁의 기본성공 응답이 누락을 숨기는지 점검. |

| [cs/async-throughput-and-queue-latency](../../content/study/cs/async-throughput-and-queue-latency.mdx) | 질문 분리·근거 보완 | 접수와 실제 완료 비유는 유지. 영상 응답/완료 수치 재검증; 같은 작업의 두 시간축과 쌓이는 큐를 먼저. 소비자 증설 효과는 DB·파티션 등 병목 조건 명시. |
| [cs/cache-miss-duplicate-load-diagnosis](../../content/study/cs/cache-miss-duplicate-load-diagnosis.mdx) | 구조 유지 | A/B의 같은 key 겹침과 호출2회 예시, 독립 시험과 운영 관측 구분이 좋음. 관측 비교표는 유지; 실제 백엔드 시험 완료로 해석하지 않음. |
| [cs/cache-stampede-and-single-flight](../../content/study/cs/cache-stampede-and-single-flight.mdx) | 구조 유지·소폭 보완 | 한 서버 같은 key 1000회→1회 장면은 유지. 서버5대 최대5회는 조건부 설명; 필요하면 서버별 대표 요청 그림. stale/jitter로 본문을 늘리지 않음. |
| [cs/cancellation-propagation](../../content/study/cs/cancellation-propagation.mdx) | 구조 유지·조건 점검 | 앱1초/외부5초와 취소 신호≠실제 종료, 공유 작업B 보호를 잘 구분. 끊어진 호출 관계 그림은 부재 의미 표시; CompletableFuture의 interrupt와 혼동하지 않음. |
| [cs/composite-index-and-filesort](../../content/study/cs/composite-index-and-filesort.mdx) | 근거 보완·시각 설명 | 찾기/정렬 비유는 유지. 영상248889행·355배 수치 재검증; MySQL filesort와 프로젝트 PostgreSQL 구분. 같은 목록의 정렬 전후를 먼저, 여러 순서도는 축소. |
| [cs/connection-pool-bottleneck](../../content/study/cs/connection-pool-bottleneck.mdx) | 근거 보완·시각 설명 | 입구/주방 대기는 유용. 영상 비율·대기시간은 실측 출처 확인. 같은 요청이 연결 밖/DB 안에서 기다리는 전후 장면; 풀 증설은 진단 뒤 선택. |
| [cs/database-bottleneck-diagnosis](../../content/study/cs/database-bottleneck-diagnosis.mdx) | 설명 보완·계측 조건 점검 | 풀/쿼리/락 세 사례와 한 조건 변경 시험은 유지. p95는 본문 짧은 풀이 필요. 앱 경과시간에서 풀 대기를 뺀 값을 순수 DB 내부 시간으로 단정하지 않음. |
| [cs/graceful-shutdown-and-traffic-draining](../../content/study/cs/graceful-shutdown-and-traffic-draining.mdx) | 질문 분리·근거 보완 | 새 요청 차단과 기존 요청 완료 장면으로 시작. 영상 실패 횟수 재검증; readiness/startup/종료 유예는 공식 조건 확인. 기존A 완료 중 신규B 이동을 시각화. |
| [cs/index-inverted-index-and-indexing](../../content/study/cs/index-inverted-index-and-indexing.mdx) | 구조 유지·질문 분리 | 문서1/2/3와 단어→문서 ASCII는 좋은 자산. 용어표보다 한 단어로 문서를 찾는 장면 먼저. 샤드 내부는 후속 후보; 색인 후 검색 가시성 조건 점검. |
| [cs/redis-ttl-and-eviction](../../content/study/cs/redis-ttl-and-eviction.mdx) | 근거 보완·시각 설명 | 유효기간/공간 부족 구분 유지. 영상 쓰기·eviction 수치 재검증. 같은 key의 만료/용량 초과 전후 장면; 만료와 실제 메모리 회수 시점은 구분. |
| [cs/replication-lag-and-read-after-write](../../content/study/cs/replication-lag-and-read-after-write.mdx) | 근거 보완·조건 명시 | 원본/복사본과 로그 위치120/115는 유지. 영상 지연·누락 수치 재검증. 일정 시간 primary 읽기는 보장 조건 필요; 동기 복제의 flush/apply 설정 차이 확인. |
| [cs/sharding-design-decisions](../../content/study/cs/sharding-design-decisions.mdx) | 개요 유지·근거 보완 | 분산 후 키/조회/ID/전역 유일성 네 선택의 개요 역할 유지. 같은 사용자 주문 배치 전후 그림. 전역 제약·primary 쓰기 단정은 저장소 범위와 근거 확인. |
| [cs/single-flight-shared-future](../../content/study/cs/single-flight-shared-future.mdx) | 구조 유지·범위 명시 | F1을 함께 기다림→같은 결과→완료 캐시 장면과 기본 클래스 출처 설명 유지. 긴 구현은 토글에 있음. 독립 예제의 용량·취소 한계와 운영 구현을 구분. |
| [cs/transaction-rollback-boundaries](../../content/study/cs/transaction-rollback-boundaries.mdx) | 개요 유지·질문 분리 | 같은 DB 롤백과 외부 결제 잔존을 같은 주문으로 먼저 보여줌. sequence/Saga/Outbox/멱등성은 후속 연결 후보; 여러 긴 그림과 정의를 본문에 모두 두지 않음. |
| [cs/utc-and-local-day-boundaries](../../content/study/cs/utc-and-local-day-boundaries.mdx) | 근거 보완·예시 정합성 | 같은 순간 KST/UTC와 반열린 날짜 구간은 유지. 영상 행 수 재검증; 오늘/어제09시 경계 설명의 대상 날짜 통일. DB 시간 타입·SQL 방언과 Java 예제 범위 명시. |

| [es/aggregation-log-analysis](../../content/study/es/aggregation-log-analysis.mdx) | 설명 보완·근거 보완 | 같은 로그5건→검색어별 묶음→그래프 장면 먼저. 집계 문법은 토글. cardinality 정밀도 보장·TOP10 신뢰 단정은 공식 조건 확인; 분석 로그와 운영 메트릭은 구분. |
| [es/analyzer-and-nori](../../content/study/es/analyzer-and-nori.mdx) | 우선 근거 보완 | 상품명→토큰 전후 예시는 유지하되 실제 _analyze 출력 확인 필요. standard로 이어폰 검색이 반드시0건이라는 예시, mixed/none 검색 결과와 분석기 변경 불가 범위를 점검. nori 필수와 프로젝트 미사용을 구분. |
| [es/behavioral-recommendation-design](../../content/study/es/behavioral-recommendation-design.mdx) | 개요 유지·질문 분리 | 사용자A/B가 같은 상품 목록에서 다른 순서를 받는 장면 먼저. 추천 종류의 개요는 유지. 벡터 필수·계산은 이름을 안 본다는 단정은 뒤 텍스트 임베딩 설명과 대조; 담당자 분담은 사실 확인. |
| [es/hybrid-search-ranking-pipeline](../../content/study/es/hybrid-search-ranking-pipeline.mdx) | 개요 유지·현행 근거 대조 | 검색어와 무관 상품이라는 문제는 구체적. 긴 알고리즘 설명 대신 같은 상품의 단계별 후보/탈락 장면. 실측 수치와 설명용 추적표 구분; Jina·현재 설정·num_candidates 범위 현행 코드 대조. |
| [es/mapping-and-field-types](../../content/study/es/mapping-and-field-types.mdx) | 질문 분리·조건 보완 | 같은 상품명 text/keyword 두 색인 장면과 red0/blue5 잘못된 조합 예시 유지. nested는 후속 질문 후보. 매핑 변경 불가·RDB 반드시 사용·동적 매핑 정책 단정 범위 확인. |
| [es/query-dsl-and-relevance](../../content/study/es/query-dsl-and-relevance.mdx) | 질문 분리·우선 근거 보완 | 이어폰 후보→가격 필터→순위 변화 먼저. 긴 JSON은 토글. filter 자동 캐시, should 기본 일치 조건, best_fields 점수 합산, term 사용 범위 등 공식 조건 점검. |
| [es/reciprocal-rank-fusion](../../content/study/es/reciprocal-rank-fusion.mdx) | 구조 유지·우선 근거 보완 | A/B/C 순위 합계는 좋은 설명 자산. 원시 코사인과 ES 변환 점수 범위 구분, 왜곡 없음 단정 완화 후보. 창 밖 한쪽 검색은 프로젝트 정책이지 RRF 필수 규칙 아님; 논문 직접 링크 필요. |
| [es/search-event-log-pipeline](../../content/study/es/search-event-log-pipeline.mdx) | 개요 유지·신뢰성 조건 보완 | 넣기와 보기 두 경로 구분은 유지. 이벤트1건의 Kafka 대기→색인→대시보드 장면 먼저. Kafka만 있으면 유실 방지/던지면 끝은 승인·재시도·보존 조건 확인; data stream/ILM 운영 환경 명시. |
| [es/search-recommendation-design-and-qa](../../content/study/es/search-recommendation-design-and-qa.mdx) | 우선 현행 근거 대조·개요 유지 | 자동완성/검색/정렬/추천을 화면 진입별 지도 역할로 유지. 후속 Jina 글과 후보수·정렬·재조회 정책 차이 확인. 코사인 범위·차원 고정·양자화 총 용량·20초 최대 지연 단정 재검증. |
| [es/search-suggest-autocomplete](../../content/study/es/search-suggest-autocomplete.mdx) | 개요 유지·분리·근거 보완 | 타이핑→제안과 검색후→교정은 다른 질문. 같은 입력의 드롭다운 변화 먼저. search_as_you_type 구조·한글 전처리 출력 점검; korean/name.trigram 정의 없는 예제는 실행 전제 표시. |
| [es/search-system-and-es-basics](../../content/study/es/search-system-and-es-basics.mdx) | 우선 진입 보완·근거 보완 | 상품3개와 역색인은 유지할 자산. 물리 구조는 뒤로. RDB 검색 불가/LIKE 인덱스 불가 단정 범위, cluster 자동 합류·refresh 최대1초·flush 영속화 표현 점검. operations-and-tuning 링크 실제 파일 확인. |
| [es/security-authentication-and-tls](../../content/study/es/security-authentication-and-tls.mdx) | 개요 유지·보안 근거 우선 | 출입증/봉투와 두 서비스 전환 장면 유지. 코드 긴 부분 토글; 단일 노드 bootstrap 예외·API key 전환 순서 재검증. 부분 인증 설정 시 무인증 연결은 당시 구현 사실과 권장 보안 정책 구분. |
| [es/vector-quantization-and-storage-cost](../../content/study/es/vector-quantization-and-storage-cost.mdx) | 우선 근거 보완·시각 설명 | 1536×4 원시 벡터 계산은 유지. 한 벡터의 정밀도 전후를 먼저. int8 탐색 메모리 감소와 원본 보존 포함 총 디스크 용량 구분; 차원 축소 손해가 항상 더 크다는 단정 점검. |
| [es/vector-search-knn](../../content/study/es/vector-search-knn.mdx) | 개요 유지·설명 보완 | 검색어→숫자 배열→가까운 상품 장면 먼저; 벡터 생성/검색 책임 구분 유지. 외부 모델 필수와 Elastic inference 경로 구분, 실제 반환 size/k·샤드 후보 조건 점검. 생략 배열은 실행 불가 표시. |

| [msa/async-event-processing-foundations](../../content/study/msa/async-event-processing-foundations.mdx) | 개요 유지·질문별 연결 | 주문→판매량→알림 시각과 중복 event-123 예시는 유지. 동기/블로킹/Executor/내구성/멱등/Retry/Outbox의 독립 질문을 짧은 글로 연결. Future는 다른 스레드 전용 결과표 아님, Executor 항상 큐에 넣음 단정과 Inbox 원자성 조건 점검. |
| [msa/kafka-offset-lag-reprocessing-idempotency](../../content/study/msa/kafka-offset-lag-reprocessing-idempotency.mdx) | 개요 유지·근거 보완 | 같은 주문 key·partition과 commit 다음 번호 예시는 좋은 자산. 위치/commit/Lag 한 장면부터 짧은 질문별 연결; 멱등 경합 조건을 본문에서도 짧게 표시. 최신4.3.1/4.1.1 출처와 Lag 계측 종류 재검증. |
| [msa/msa-prompthub-service-map](../../content/study/msa/msa-prompthub-service-map.mdx) | 개요 유지·근거 보완 | 한 구매 요청으로 서비스 책임을 먼저 보여줌. 모놀리스=한 직원·MSA 자동 장애 격리·REST=HTTP1.1 단정과 gRPC 압축 비유 점검. 후속 전체 도메인 지도에 추가된 notification/ai 등 현황 대조. |
| [msa/outbox-inbox-per-service](../../content/study/msa/outbox-inbox-per-service.mdx) | 개요 유지·현행 근거 대조 | 5서비스 비교표는 적합. 판매량10→11, 중복시12/방어시11 장면을 코드 앞에. 자연 멱등 주장은 키만으로 증명되지 않음; 실제 upsert/제약/트랜잭션 확인. 당시 미도입과 위험 감수 의도 구분. |
| [msa/outbox-inbox-when-needed](../../content/study/msa/outbox-inbox-when-needed.mdx) | 구조 보완·중복 정리 | 발행/소비 다른 문제라는 한 질문 유지. 제목 product만 Inbox 필요와 표 order도 필요의 불일치 정리 후보. exists후 처리만으로 동시 중복 방지가 안 되므로 unique/원자성 조건 표시; 전수 분석은 다음 링크로. |
| [msa/project-based-backend-learning-guide](../../content/study/msa/project-based-backend-learning-guide.mdx) | 지도 유지·로드맵 연결 | 기술 설명 전체가 아닌 학습 인덱스로 유지. 상세 작성 여부와 읽기/검증 완료 구분 필요. 예시 선택 변경 인용문은 실제 경험으로 오해하지 않게 표시; 현재 세부 글 링크와 공개 로드맵 중복 대조. |
| [msa/prompthub-complete-learning-roadmap](../../content/study/msa/prompthub-complete-learning-roadmap.mdx) | 지도 유지·기준 시점 명시 | 현재/운영전용/FE미연결/과거 구분은 유지할 자산. 2026-08-04 고정 근거와 제목 현재의 차이 명시; PR 목록은 토글. 구매1건 여정과 도메인별 진입을 나누고 두 Outbox 글·검색 종합의 오래된 상태와 대조. |

## 첫 세 편의 시각화 보완 제안

- N+1: 상품 목록을 한 번 가져오는 장면 → 판매자별 추가 조회선 → 묶은 조회 전후. 방법 비교만 표로 유지.
- 재고: 같은 재고 1을 A/B가 읽는 장면 → 각자 0 저장 → 주문은 2개. 조건부 차감은 B가 기다린 뒤 재고0으로 거절되는 별도 장면.
- 데드락: A가 계좌1을 보유하고 B의 계좌2를 기다림, B는 반대 방향이라는 순환 그림 → 작은 번호부터 잠그는 두 단계. 정상·실패를 같은 그림에 몰지 않음.

한 글에 모든 표현을 넣는 것이 목표가 아니다. 필요한 장면 그림을 비교표로 대체하지 않는 것이 목표다.
