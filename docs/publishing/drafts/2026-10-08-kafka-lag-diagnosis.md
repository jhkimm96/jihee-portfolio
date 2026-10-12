# Kafka Lag 원인 진단 — 승인용 초안

상태: 승인 범위 게시 완료. 조사일 2026-10-08 (Asia/Seoul). 커밋 `d096821`, push 없음.

검증: 순서 테스트 1개 실패 확인 후 전체 88개 통과, 타입 검사와 격리 빌드 통과.
전체 211개 페이지 중 새 Study는 1편. 생성 메타데이터·HTML·링크·토글·예시 계산과
승인 초안/게시 글/관련 diff/직접 인용 근거의 민감정보 자동 점검 통과.
검증용 임시 복사본 삭제, 원본 의존성과 기존 개발 서버 보존.
브라우저 화면과 운영 Kafka, 프로젝트 백엔드 테스트 실행은 미검증.

## 게시 범위

| 항목 | 신규 글 | 기존 글 보완 |
| --- | --- | --- |
| category | cs | msa |
| 제목 | 주문 알림이 밀릴 때 Kafka에서 먼저 볼 것 | Kafka Offset와 Consumer Lag 이해하기 — 제목 유지 |
| slug | kafka-lag-diagnosis | kafka-offset-lag-reprocessing-idempotency — 유지 |
| 날짜 | 실제 게시일. 오늘 게시하면 2026-10-08 | date=2026-09-04 유지, updatedAt=실제 수정일 |
| 질문 | Lag가 늘 때 유입 증가와 처리 지연을 어떻게 구분할까? | 기존 개요 유지. Lag 측정 기준 혼동만 보완 |
| 한 줄 답 | 같은 구간의 유입과 처리·commit 진행을 비교한 뒤 파티션별 편중, 실패·대기와 담당 상태를 좁힌다. | 저장된 재시작 위치 기준 Lag와 현재 읽기 위치 기준 클라이언트 지표를 구분한다. |
| 최소 조건 | 같은 Topic/Group/Partition·시간 범위와 지표 기준을 비교하며 수집 누락과 Offset 변경을 구분한다. | 기존 단순화 식과 클라이언트 지표를 같은 수치로 취급하지 않는다. |
| 선수 | msa/kafka-offset-lag-reprocessing-idempotency, cs/async-throughput-and-queue-latency, cs/grafana-payment-dashboard | 기존 선수/구성 유지 |
| 다음 | 추적 도구 학습은 미작성 백로그로만 안내 | 새 진단 글에 연결 |
| 프로젝트 근거 | 알림 Consumer → 처리 Handler → acknowledge 호출, MANUAL 설정과 재시도/DLT 설정, 설정 테스트 소스 | 같은 로컬 소스와 공식 Kafka/Spring Kafka 문서 |
| 파일 | content/study/cs/kafka-lag-diagnosis.mdx | content/study/msa/kafka-offset-lag-reprocessing-idempotency.mdx |

함께 변경: lib/study-roadmap.ts, lib/study-roadmap.test.ts.
알림 → Kafka 진단 → 기존 UTC 순서. 승인 후 계획 기록:
docs/code-plans/2026-10-08-kafka-lag-diagnosis.md.
UI/스킬/프로젝트 Learning Path/백엔드/운영 Kafka 설정은 변경하지 않는다.

## 신규 본문 초안

### 01 · 결제는 끝났는데 주문 알림이 늦는다

주문 7의 결제 완료 이벤트는 Kafka에 들어왔다. 그런데 사용자에게 보여줄 주문 알림이 늦는다. 앞 글의 운영자 장애 알림과는 다른, 사용자용 주문 알림이다.

**같은 시간의 유입과 처리 진행을 비교한 뒤 어디서 멈추는지 좁힌다.** Lag 숫자 하나로 서버 부족을 단정하지 않는다. 다음은 운영 실측이 아닌 학습용 사례다.

이벤트를 읽어 처리하는 앱이 Consumer, 같은 일을 나눠 맡는 묶음이 Consumer Group이다. Topic은 이벤트를 모으는 이름, Partition은 그 안에서 순서를 가진 저장 줄이다. 먼저 같은 Topic/Group/Partition과 시간 범위를 보고 있는지 확인한다.

### 02 · “뒤에 얼마나 남았나”와 “얼마나 오래 기다렸나”는 다르다

```text
저장 줄의 위치 — 학습용

재시작 위치로 기록된 번호 90
          ↓
  [90] [91] … [99]
                   ↑
          저장 끝의 다음 번호 100

위치 차이: 100 - 90 = 10
```

저장된 재시작 위치를 committed Offset이라고 한다. 이 글의 Lag는 저장 끝과 그 위치의 차이다. 연속된 일반 메시지이고 삭제·트랜잭션 등으로 번호가 건너뛰지 않는 예시다. 실제 Offset 차이는 업무 미완료 건수나 대기 초와 반드시 같지 않다. [그룹 위치 확인](https://kafka.apache.org/43/operations/basic-kafka-operations/)

주문 알림이 실제로 얼마나 늦는지는 이벤트 생성부터 알림 저장·전달까지의 시간도 별도로 본다. Lag 10만 보고 “10초 늦다”고 읽지 않는다.

### 03 · 들어오는 쪽이 늘었을까, 처리하는 쪽이 느려졌을까?

같은 1분을 비교하는 단순화된 두 장면이다. 처리한 메시지의 위치까지 정상적으로 commit되고 중간 생략·재시작·재처리가 없다고 가정한다.

```text
A. 유입이 늘어난 장면
이전: 유입 40 → 처리 40
지금: 유입 60 → 처리 40 → 차이 20이 더 쌓임

B. 처리가 느려진 장면
이전: 유입 40 → 처리 40
지금: 유입 40 → 처리 20 → 차이 20이 더 쌓임
```

둘 다 더 밀리지만 조사할 곳은 다르다. A는 어떤 기능의 이벤트가 늘었는지, B는 어느 작업의 처리 시간과 실패가 늘었는지 확인한다. 실제로는 업무 처리 완료와 commit 진행을 각각 측정해, 처리가 느린지 위치 저장이 늦는지도 구분한다. 단순 Consumer 수신량을 업무 성공량으로 대신하지 않는다.

### 04 · 전체 합계 대신 막힌 줄을 찾아본다

Partition은 독립적으로 읽는 저장 줄이다. 일반 Consumer Group에서는 같은 Partition을 동시에 여러 Consumer에게 나눠 맡기지 않는다. 아래는 시점 하나의 학습용 거리다.

```text
Partition 0: Lag  2  ██
Partition 1: Lag 38  ███████████████████
Partition 2: Lag  0
```

1번 줄에 유입이 몰렸는지, 그 줄의 담당 Consumer가 느린지부터 본다. Consumer를 더 켜도 이미 한 담당자가 맡는 뜨거운 Partition이 자동으로 둘로 나뉘지는 않는다. 총합만 줄었는지보다 해당 줄의 진행과 주문 알림 지연이 회복되는지를 확인한다. [Kafka Consumer의 파티션 분담](https://kafka.apache.org/43/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)

### 05 · 멈춘 이유에 맞춰 다음 확인을 고른다

| 관찰 | 다음에 확인할 근거 |
| --- | --- |
| 유입은 비슷한데 처리 시간이 늘어남 | DB 대기·쿼리, 외부 호출 지연, CPU·GC 정지 |
| 같은 이벤트가 반복 실패 | 예외 종류, 재시도 대기와 횟수, 실패 분리 상태 |
| 담당자가 없거나 자주 바뀜 | Consumer 실행 상태, 연결/권한 오류, 재배치 기록 |
| 앱 처리는 끝났는데 commit이 정체 | 실제 AckMode, acknowledge 호출과 commit 성공/실패 |

증상은 원인 후보를 고르는 출발점이다. DB 대기가 확인되면 쿼리/잠금/연결 풀을, 반복 실패가 확인되면 오류 분류와 재시도 정책을 먼저 검토한다. 무조건 Consumer 수나 대기 제한만 키우지 않는다.

담당 Partition을 다시 나누는 일을 Rebalance라고 한다. 같은 시간의 처리 정체와 재배치 기록을 함께 확인하되 재배치가 원인인지 느린 처리의 결과인지도 구분한다.

<details>
<summary>숫자 이름이 비슷하면 같은 Lag일까?</summary>

아니다. Kafka 클라이언트의 `records-lag-max`는 현재 읽기 위치 기준이며 측정 구간의 Partition 최대 Lag다. 위의 committed Offset 기준 거리나 모든 Partition의 합과 같지 않다. 지표를 만든 주체, 기준 위치와 최대/합계를 먼저 확인한다. [Kafka Consumer 지표](https://kafka.apache.org/43/operations/monitoring/)

Kafka의 `poll()`은 읽은 메시지를 앱에 반환하는 호출이다. 반환됐다고 DB 반영이나 알림 전송이 끝난 것은 아니다. `max.poll.interval.ms`는 다음 poll 호출까지 허용하는 최대 간격이며, 넘겼을 때의 재할당 시점은 정적 멤버십과 그룹 프로토콜 등에 따라 달라진다. 긴 처리 시간을 확인하지 않고 이 값만 늘리면 원인을 가릴 수 있다. [Consumer 설정](https://kafka.apache.org/43/configuration/consumer-configs/)

</details>

### 06 · Lag를 작게 만드는 것과 문제를 해결하는 것은 다르다

재시작 위치를 강제로 앞으로 옮겨 메시지를 건너뛰면 Lag는 줄어도 주문 알림은 누락될 수 있다. 실패 메시지를 별도 보관한 뒤 본 줄이 진행되는 경우도 업무 실패가 해결됐다는 뜻은 아니다.

변경 뒤에는 유입이 계속되는 동안 처리·commit 진행이 회복되는지, 실패 보관 건수와 실제 알림 지연이 어떤지도 확인한다. **Lag 감소와 업무 결과 회복을 함께 본다.** 이 글에서는 Offset을 변경하거나 운영 서버를 늘리지 않는다.

### 프로젝트에서는 어디를 확인했나?

로컬 PromptHub 알림 Consumer는 메시지를 읽고 처리 Handler를 호출한 뒤 acknowledge한다. Handler에는 이벤트 처리 이력 확인과 알림 생성 호출이 있다. 설정에는 자동 commit 비활성화, MANUAL AckMode, 일부 오류의 재시도 제외와 DLT 전송 설정이 있고 설정 테스트 소스도 확인했다.

Spring Kafka는 외부 Java 라이브러리다. `acknowledge()`는 처리 확인을 컨테이너에 알리는 호출이며 **MANUAL은 호출 즉시 매 메시지 commit을 보장하는 설정이 아니다.** 컨테이너의 배치 처리 조건을 따른다. [Spring Kafka commit 방식](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/message-listener-container.html)

소스 확인을 했을 뿐 실제 Lag, 느린 DB, 알림 누락이나 개선 효과를 측정하지 않았다. 테스트도 실행하지 않았고 원격 HEAD와 배포 상태는 확인 범위 밖이다.

### 자기 말로 답해보기

Consumer를 두 배로 늘렸는데 Partition 1의 Lag만 계속 커진다. 서버를 또 두 배로 늘리면 해결될까?

답 토글: 보장할 수 없다. 해당 Partition에 유입이 몰렸는지, 담당 처리와 DB/외부 호출이 막혔는지 확인한다. 같은 Partition은 일반 그룹의 여러 Consumer가 동시에 나눠 읽는 줄이 아니다.

## 기존 Kafka 글의 정확한 보완 범위

7절의 단순화 Lag 식과 기존 예시는 유지한다. `records-lag-max` 언급 다음에 아래 설명과 신규 글 링크를 추가한다.

> 이 절의 단순화 식은 committed Offset 기준이다. 클라이언트의 records-lag-max는 현재 읽기 위치 기준이며 측정 구간의 Partition 최대값이다. 둘을 같은 숫자로 취급하거나 업무 처리 성공량으로 읽지 않는다. Lag가 늘 때 확인 순서는 새 진단 글에서 살펴본다.

공식 Kafka 지표 출처를 가까이에 추가한다. related에 신규 글을 연결하고 updatedAt을 갱신한다.
나머지 Kafka 본문, 원래 작성일/URL과 버전 소개는 이 묶음에서 바꾸지 않는다.

## 조사 기록 — 내부용

- Kafka 공식 다운로드의 최고 안정 계열: 4.3.1. 지원되는 이전 계열4.2.2는 2026-09-29 릴리스다.
  릴리스 날짜가 더 늦다고 버전 계열까지 더 최신이라고 쓰지 않는다.
  https://kafka.apache.org/community/downloads/
- Spring Kafka 최신 안정4.1.1,4.2.0-M2는 preview. https://docs.spring.io/spring-kafka/reference/index.html
- 프로젝트 루트 Gradle은 Spring Boot4.1.0과 starter-kafka를 선언한다. 의존성 해결을 실행하지 않아
  실제 Spring Kafka/kafka-clients 해결 버전은 미확인이다.
- 루트 Compose/Kubernetes에는 confluentinc/cp-kafka:7.8.0, 서비스별 Compose에는
  apache/kafka:3.7.0이 있다. Confluent 버전 숫자를 Apache Kafka 버전으로 취급하지 않는다.
  활성 실행 환경과 실제 브로커 버전은 미확인이다. 업그레이드 구현은 범위 밖이다.
- 확인한 파일: NotificationKafkaConfig.java, NotificationEventConsumer.java,
  OrderEventHandler.java, NotificationKafkaConfigTest.java 전체.
  컨슈머에서 미지원 이벤트는 acknowledge 후 반환한다. 모든 사건을 알림 생성으로 처리한다고 쓰지 않는다.
  관련 Handler 호출은 확인했지만 하위 NotificationService 구현 전체와 전달 결과는 미확인이다.
- 재시도 설정의 FixedBackOff(1000,3)와 제외 오류/DLT Recoverer는 소스에서 확인.
  실제 재시도 횟수·시간이나 DLT 전달 성공을 운영 사실로 주장하지 않는다.
- Kafka 기존7절은 원인 후보 목록, 기존 큐 글은 유입/처리량 비교다. 신규 글은
  측정 기준 → 같은 구간 비교 → Partition 편중 → 실패·대기 근거 → 업무 회복 확인이라는 진단 질문에 집중한다.
- CLI가 필요하면 공식 --describe의 역할만 선택적 토글로 설명한다.
  이번 초안에 실행 명령/내부 주소/실제 그룹·Topic 식별자/Secret을 옮기지 않았다.
  운영 접근, CLI 실행, Offset 초기화, 재시작과 부하 시험은 수행하지 않았다.
- 숫자10/20/38과 주문7은 학습용. 그림은 저장 줄과 두 변화 장면, 편중 막대다.
  크고 복잡한 다이어그램이나 새 컴포넌트가 필요하지 않다.
- 슬러그 충돌 없음. 공개 신규 파일/연결은 승인 뒤 작성한다. 민감정보는 승인 범위로 자동 재검사한다.
- 다음 학습: OpenTelemetry/APM → Loki와 로그 도구 선택. 미작성 링크를 공개하지 않는다.
