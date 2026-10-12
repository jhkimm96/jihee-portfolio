# Bulkhead — 승인용 초안

상태: 승인 후 게시 완료. 조사·게시일 2026-10-09 (Asia/Seoul).
승인 4파일 커밋 `277d3ed`, push 없음. 최초 순서 테스트 1개 실패 → 전체 88개 통과.
타입 검사/격리 빌드 통과. 전체 217페이지 중 신규 Study 1편.
생성 메타데이터/HTML/선수·이전·다음/링크/토글 및 민감정보 점검 통과.
검증 임시 폴더 삭제, 원본 의존성과 개발 서버 보존. 실제 장애 격리 효과/화면 동작 미검증.

## 게시 범위

| 항목 | 제안 |
| --- | --- |
| category / 유형 | cs / 신규 Study 1편 |
| 제목 | 결제가 느려졌는데 왜 다른 요청까지 기다릴까? |
| slug | bulkhead-concurrent-call-isolation — 기존 파일 없음 |
| date | 실제 게시일. 오늘 게시하면 2026-10-09 |
| 질문 | 한 기능의 느린 호출이 공용 처리 자원을 모두 차지하지 않게 하려면? |
| 한 줄 답 | 기능별 동시 사용량을 제한하거나 처리 자원을 분리해 장애의 영향을 가둔다. |
| 최소 조건 | 공유 자원과 보호할 경로를 정하고, 초과 요청의 대기/거절 및 다른 공용 자원도 확인한다. |
| 선수 | cs/cancellation-propagation, cs/fallback-safe-results |
| 관련 | cs/circuit-breaker-open-and-recovery, cs/connection-pool-bottleneck, msa/project-based-backend-learning-guide |
| 다음 | Rate Limiting은 내부 백로그. 미작성 공개 링크 없음 |
| 프로젝트 근거 | TossBulkheadConfig, TossPaymentGateway, 설정 구간과 Bulkhead 테스트 소스 |
| 공식 근거 | Microsoft Bulkhead 패턴, Resilience4j Bulkhead 문서/v2.4.0 구현/릴리스 |
| 공개 변경 | content/study/cs/bulkhead-concurrent-call-isolation.mdx, lib/study-roadmap.ts, lib/study-roadmap.test.ts |
| 승인 후 계획 | docs/code-plans/2026-10-09-bulkhead-concurrent-call-isolation.md |

로드맵: Fallback → Bulkhead → 기존 UTC. 기존 본문/URL/date는 유지한다.
UI/스킬/백엔드/운영 설정/프로젝트 Learning Path는 변경하지 않는다.

## 기존 글과 비교

- 프로젝트 학습 순서에는 이름과 보호 대상, 전체 로드맵에는 관련 PR 링크가 있다.
  Bulkhead의 입장 제한과 처리 자리 전후를 설명하는 독립 글은 찾지 못했다.
- 비동기 처리량 글은 유입량과 작업 큐의 지연, 커넥션 풀 글은 DB 병목 판단을 다룬다.
  이번에는 특정 기능이 공유 자원을 독점하지 않도록 하는 경계만 설명한다.
- 검색 시스템이나 결제 시스템에서 장애가 실제 발생했다는 기록으로 쓰지 않는다.

## 신규 본문 초안

### 01 · 결제 응답을 기다리는 동안 처리 자리도 비지 않는다

한 앱 서버가 상품 조회와 결제 요청을 함께 처리한다고 해 보자. 동시에 일할 자리 6개가 있는데, 외부 결제 서비스가 느려져 결제 6건이 그 자리를 모두 차지한다. 실제 프로젝트 배치 구조가 아닌 학습용 상황이다.

```text
서버 A의 공용 처리 자리 — 결제 응답을 기다리는 중
[결제1] [결제2] [결제3] [결제4] [결제5] [결제6]

새 상품 조회 → 빈 자리가 없어 기다림
```

여기서 자리는 **요청을 실행하는 작업 스레드**를 단순화한 것이다. 스레드는 코드 실행을 맡고, 이 예시의 동기 외부 호출에서는 응답을 기다리는 동안 다른 일을 맡지 못한다.

**한 기능이 쓸 수 있는 양을 제한하거나 자원을 나눠, 다른 기능까지 묶이지 않게 한다.** 이것이 **Bulkhead(벌크헤드)**다. 배 안의 칸막이처럼 문제가 번질 범위를 줄이는 설계 방식이다. [공유 자원 고갈과 Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

### 02 · 결제는 최대 2개만 들어가게 하면

같은 서버 A에서 외부 결제를 기다리는 호출은 최대 2개만 허용하고, 자리가 없으면 즉시 거절한다고 정해 보자. 숫자는 이해용이며 권장 설정이 아니다.

```text
공용 처리 자리 6개
[결제1] [결제2] [상품7 조회] [비어 있음] [비어 있음] [비어 있음]
  └ 결제 동시 호출은 최대 2개 ┘

결제3 → 입장 거절 → 외부 결제 호출을 보내지 않음
```

결제 응답을 기다리는 호출이 6자리를 독점하던 상황을 막는다. 상품 조회가 사용할 여지는 남지만 **상품 조회 전용 4자리를 예약한 것은 아니다.** 다른 요청이나 공용 DB가 바쁘면 상품 조회도 느릴 수 있다.

이처럼 “지금 들어가 있는 호출 수”를 세는 입장권 방식은 **Semaphore(세마포어)** 방식이다. 별도 작업 스레드를 만드는 것과 다르다. [Resilience4j의 두 Bulkhead 방식](https://resilience4j.readme.io/docs/bulkhead)

### 03 · 입장권은 호출이 끝나야 돌아온다

동시에 2개까지만 허용하는 같은 Bulkhead를 계속 보자. 입장권은 요청마다 새로 만드는 것이 아니라 이 경로의 호출들이 함께 사용하는 한도다.

```text
① 결제1, 결제2 진행 중  → 남은 입장권 0개
② 결제3 도착           → 즉시 거절, 자동 보관하지 않음
③ 결제1 호출 종료      → 남은 입장권 1개
④ 새 결제4 도착        → 입장 가능
```

거절한 결제3을 나중에 자동 재실행하는 것은 아니다. 호출이 성공하거나 예외로 종료되면 입장권을 돌려줘야 다음 요청이 들어갈 수 있다. Resilience4j의 동기 호출 래퍼는 이 반납을 처리한다. [동기 Supplier 래퍼의 획득과 반납](https://github.com/resilience4j/resilience4j/blob/v2.4.0/resilience4j-bulkhead/src/main/java/io/github/resilience4j/bulkhead/Bulkhead.java)

<details>
<summary>입장 대기를 200ms로 정하면 결제도 200ms 안에 끝날까?</summary>

아니다. 입장 대기 시간은 자리 획득을 기다릴 한도다. 들어간 뒤 외부 결제가 끝날 때까지 기다릴 시간과 다르다. 입장을 기다리는 요청도 스레드를 붙잡을 수 있으므로, 긴 입장 대기는 공용 처리 자원을 다시 소모한다.

호출을 언제 끝낼지는 [Timeout과 취소 경계](/study/cs/cancellation-propagation)로 따로 다룬다. 화면에서 기다리기를 중단해도 실제 서버 작업이 계속 중이라면 처리 자원까지 즉시 반환됐다고 볼 수 없다.

</details>

### 04 · 입장 제한과 전용 작업팀은 다르다

| 방식 | 나누는 것 | 주의할 점 |
| --- | --- | --- |
| 동시 입장 제한 | 한 기능이 진행할 수 있는 호출 수 | 공용 스레드/DB까지 따로 생기는 것은 아님 |
| 전용 스레드 풀 | 그 기능의 작업 스레드와 대기 줄 | 대기 줄도 제한해야 하며 DB/CPU 등은 여전히 공유할 수 있음 |

**풀은 여러 자원을 모아 빌려 쓰는 묶음**이다. 전용 스레드 풀을 쓰면 결제 작업팀과 조회 작업팀을 나눌 수 있지만 서버의 CPU, 메모리나 DB 연결까지 자동으로 분리되는 것은 아니다. 어디까지 나눴는지 확인한다. [격리 수준과 비용의 선택](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

적용 전후에는 느린 결제와 상품 조회를 함께 보내고, 결제 동시 실행 수·거절 수·스레드 대기·상품 조회 시간을 비교한다. 상품 조회가 느리다는 증상 하나만으로 결제 스레드 고갈이라고 단정하지 않는다.

<details>
<summary>Circuit Breaker나 Rate Limiting으로 대신할 수 있을까?</summary>

Circuit Breaker는 최근 실패 결과로 새 호출을 잠시 막는다. Bulkhead는 성공 여부와 관계없이 지금 동시에 진행하는 수를 제한한다. 아직 실패 통계가 쌓이지 않았어도 느린 호출이 자리를 모두 차지하지 못하게 할 수 있다.

Rate Limiting은 정한 시간 동안 들어오는 요청량을 제한한다. 초당 요청이 적어도 한 요청이 오래 걸리면 진행 중 호출은 쌓일 수 있으므로 동시 실행 한도와 시간당 유입 한도는 다르다.

</details>

### 05 · 프로젝트에서는 결제 승인 입구에 붙어 있다

PromptHub 결제 코드는 **Resilience4j라는 외부 Java 라이브러리**를 Gradle 의존성으로 가져온다. Java 기본 클래스가 아니며, 설정 클래스와 실제 호출 연결은 프로젝트가 작성한다.

1. **TossBulkheadConfig:** 동시 호출 수와 입장 대기 한도로 승인용 Bulkhead를 만든다. 확인한 설정 파일 값은 최대 20개, 대기 200ms다.
2. **TossPaymentGateway.executeConfirm:** 외부 결제 승인 호출을 Bulkhead로 감싸고, 입장이 거절되면 `PG_BUSY` 오류로 바꾼다. 결제 성공으로 바꾸지 않는다.
3. **TossPaymentGatewayBulkheadTest:** 한도 2개/대기 0으로 설정해 세 호출 중 두 개가 성공하고 한 개가 `PG_BUSY`인지 확인하는 테스트 소스가 있다.

이 구현은 **동시 입장 제한 방식**이다. 전용 스레드 풀이 생겼다거나 모든 서버를 합쳐 20개라고 해석하지 않는다. 이번에는 테스트 소스만 읽었고, 실제 실행이나 운영 장애 격리 효과는 측정하지 않았다.

<details>
<summary>승인 한도가 환불도 보호할까? Retry는 어떻게 세나?</summary>

확인한 Gateway에서 환불은 다른 실행 경로를 쓰며 이 승인용 Bulkhead를 통과하지 않는다. 한 기능에 설정했다고 다른 기능까지 보호되는 것은 아니다.

승인 경로는 Retry 안에서 Bulkhead를 거친다. 각 외부 시도 동안 입장권을 갖고 시도가 종료되면 반납하는 구조다. 재시도 대기 전체에 입장권을 계속 보유하는 배치와 다르며, 재시도 대기 동안 요청 스레드가 비는지도 별도로 봐야 한다.

Registry는 프로세스 메모리에 있다. 서버 5대에 각각 한도 20개라면 같은 종류의 진행 중 호출은 전체 최대 100개까지 가능하다. 외부 서비스의 전체 용량도 함께 고려한다.

프로젝트 선언 버전과 2026-10-09 확인한 최신 안정 릴리스는 2.4.0이다. 저장소의 개발 브랜치 설명을 출시된 3.x 기능으로 쓰지 않는다. 실제 해결 의존성과 배포 설정은 확인하지 않았다. [안정 릴리스](https://github.com/resilience4j/resilience4j/releases/tag/v2.4.0)

</details>

### 자기 말로 답해보기

서버 A에서 결제는 최대 2개로 제한했다. 결제 요청이 아주 많이 들어와도 상품 조회는 항상 빨라질까?

<details>
<summary>답 확인하기</summary>

아니다. 결제 외부 호출의 동시 사용량을 줄인 것이지 공용 CPU, 요청 대기 줄, DB와 다른 요청까지 모두 격리한 것은 아니다. 입장 대기가 길어도 스레드를 소모한다. 실제 병목과 다른 기능의 지연을 함께 측정해야 한다.

</details>

## 조사 기록 — 내부용

- 2026-10-09 조사. 일반 검색에서 설명 관점을 찾고, 기술 사실은 공식 문서/버전 구현과 대조했다.
- Microsoft Bulkhead 문서는 격리 경계, 공유 자원 고갈, 비용과 입도 선택을 확인했다.
- Resilience4j 현행 Bulkhead 문서에서 동시 실행/입장 대기, 두 방식과 in-memory Registry를 확인했다.
  검색 결과의 v0.15.0 문서는 사용하지 않았다. 기본값을 운영 권장값으로 제시하지 않는다.
- v2.4.0 Bulkhead.java의 decorateSupplier/of 구간, SemaphoreBulkhead의 permit 획득/
  tryAcquire(timeout)/onComplete 구간 확인. 전체 라이브러리 검토라는 뜻은 아니다.
- 릴리스 목록은 v2.4.0을 Latest로 표시한다. 저장소 개발 브랜치의 Java 21/3 설명과 구분한다.
- 완독: TossBulkheadConfig.java, TossBulkheadConfigTest.java,
  TossPaymentGateway.java, TossPaymentGatewayBulkheadTest.java, payment-service/build.gradle.
- payment-service.yml은 bulkhead 구간만 확인. 설정 파일 값을 운영 적용값으로 단정하지 않는다.
- 테스트는 Thread.sleep으로 경쟁 시간을 주는 구조다. 실행하지 않았으므로 신뢰성이나 통과를 과장하지 않는다.
- 기존 학습 순서/전체 로드맵은 관련 구간만, 비동기 처리량/커넥션 풀 글은 전체를 읽었다.
  해당 글의 SNS 실험 수치를 새 글의 사실/프로젝트 측정값으로 가져오지 않는다.
- main 예시는 한 서버에 공용 처리 스레드가 있고, 입장 거절을 즉시 반환하는 단순화다.
  초과 요청의 입장 전 비용은 없어지지 않는다. 무조건 다른 기능 정상이라는 표현을 피했다.
- 실제 결제/운영 호출, 부하 시험, 백엔드 코드 변경 없음. 화면 예시는 프로젝트 서비스 배치와 다르다.
- 테스트의 가짜 Secret/결제 키/URL은 공개하지 않는다. 승인 후 관련 범위 자동 검사.

## 적용 계획 요약

1. 파일: 신규 MDX, roadmap.ts/test.ts. 승인 후 code-plans 기록 1파일.
2. 함수: 새 함수 없음. 기존 읽기 순서/탐색 계산 재사용. Fallback → Bulkhead → UTC.
3. 연결: 기존 실패 차단/취소/DB 풀 글은 링크만 사용. 기존 본문 변경 없음.
4. 최소 구현: UI/컴포넌트/라이브러리/백엔드/운영 호출/부하 시험은 추가하지 않는다.
5. 읽기: 서버 A의 6자리를 유지해 독점 → 결제 2개 제한 → 입장권 반납을 보여준다.
   기능의 한도와 전용 자원, 입장 대기와 외부 대기를 같은 용어로 섞지 않는다.
6. 루브릭 예측:

| 항목 | 판정과 이유 |
| --- | --- |
| controller-thin | 해당 없음: 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음: 엔티티 변경 없음 |
| http-semantics | 해당 없음: HTTP 구현 변경 없음 |
| logging-quality | 해당 없음: 로그 구현 변경 없음 |
| exception-discipline | 해당 없음: 예외 구현 변경 없음 |
| layer-separation | 괜찮음: 콘텐츠/순서 데이터 분리 유지 |
| dead-code | 괜찮음: 새 헬퍼 없음 |
| duplication-semantic | 괜찮음: 기존 병목/취소 글은 연결 |
| diagnosability | 해당 없음: 런타임 진단 변경 없음 |
| integration-robustness | 해당 없음: 외부 연동 구현 변경 없음 |
| service-boundary | 해당 없음: 서비스 경계 변경 없음 |
| value-object-design | 해당 없음: 도메인 값 변경 없음 |
| polymorphism-opportunity | 해당 없음: 새 분기 없음 |
| cohesion-coupling | 괜찮음: 순서 데이터와 정책 테스트만 변경 |

7. 테스트: 연속 순서 테스트에 Bulkhead를 먼저 추가해 실패 확인 → 순서 반영.
   전체 테스트/타입/격리 빌드, 메타데이터/HTML/선수·이전·다음/링크/토글/산술 확인.
   승인 범위 본문/diff/직접 인용 근거 민감정보 자동 검사 후 정확한 파일만 로컬 커밋.
   실제 운영 효과/브라우저 화면 검증과 push는 포함하지 않는다.
