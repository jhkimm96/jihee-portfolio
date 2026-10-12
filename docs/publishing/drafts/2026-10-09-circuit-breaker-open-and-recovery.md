# Circuit Breaker — 승인용 초안

상태: 승인 후 게시 완료. 조사·게시일 2026-10-09 (Asia/Seoul).
공개 글·로드맵·테스트·계획 4파일 커밋 `08c0ebd`, push 없음.
순서 테스트 실패 확인 → 전체 88개, 타입 검사와 격리 빌드 통과.
전체 215페이지 중 신규 Study 1편. 생성 데이터/HTML/링크/토글/산술 및 승인 범위 민감정보 점검 통과.
검증 임시 폴더 삭제, 원본 의존성과 개발 서버 보존. 화면 및 실제 결제 차단/복구/부하 효과 미검증.

## 게시 범위

| 항목 | 제안 |
| --- | --- |
| 구분 / category | 신규 글 1편 / cs |
| 제목 | 상품 조회가 계속 실패하면 왜 잠깐 호출을 막을까? |
| slug | circuit-breaker-open-and-recovery — 기존 파일 없음 |
| date | 실제 게시일. 오늘 게시하면 2026-10-09 |
| 질문 | 실패하는 외부 서비스로 새 호출을 계속 보내지 않으려면? |
| 한 줄 답 | 최근 호출 결과로 상태를 판단해 새 호출을 잠시 거절하고, 제한된 호출로 회복 여부를 확인한다. |
| 최소 조건 | 같은 Breaker를 통과하는 호출, 실패 분류·관찰 범위·최소 표본·차단/회복 기준이 필요하다. 학습 예시는 한 서버의 순차 조회다. |
| 선수 | cs/retry-backoff-jitter-budget, cs/cancellation-propagation |
| 관련 | cs/async-throughput-and-queue-latency, cs/grafana-payment-dashboard, msa/project-based-backend-learning-guide |
| 다음 | Fallback/Bulkhead는 내부 백로그. 미작성 공개 링크는 만들지 않는다. |
| 프로젝트 근거 | TossCircuitBreakerConfig, TossFailurePredicate, TossPaymentGateway 및 설정/분류/차단 테스트 소스 |
| 공개 변경 | content/study/cs/circuit-breaker-open-and-recovery.mdx, lib/study-roadmap.ts, lib/study-roadmap.test.ts |
| 승인 후 계획 기록 | docs/code-plans/2026-10-09-circuit-breaker-open-and-recovery.md |
| 공식 근거 | Resilience4j CircuitBreaker 문서와 v2.4.0 구현/릴리스, Microsoft Circuit Breaker 패턴 |

로드맵: Retry → Circuit Breaker → 기존 UTC. 기존 본문/URL/date는 수정하지 않는다.
UI, 스킬, 백엔드, 운영 설정과 프로젝트 Learning Path는 변경하지 않는다.

## 기존 글과 비교

- 프로젝트 기반 학습 순서와 전체 학습 로드맵에는 패턴 이름/목적과 읽을 항목만 있다.
- 기존 Retry 글의 질문은 재호출 횟수·시점·전체 예산이다. 이번 질문은 여러 호출의 결과를
  모아 이후 호출의 허용 여부를 바꾸는 것이다. 같은 질문을 복제하지 않는다.
- 관련 Review에는 slow-call 운영값 재검토 항목이 있지만 상태 전이 설명이나 측정 결과는 없다.
  해당 기록을 Circuit Breaker로 성능을 개선했다는 근거로 쓰지 않는다.

## 신규 본문 초안

### 01 · 이번 요청만 실패한 게 아니라 다음 요청도 계속 실패한다

앱 서버 A가 상품 7을 외부 서비스에서 조회한다. 처음에는 응답이 왔지만 외부 서비스에 문제가 생겨 뒤의 조회가 계속 실패한다. 학습용 상황이며 실제 장애 기록은 아니다.

**최근 호출 결과가 나쁘면 새 호출을 잠시 막고, 일부 호출로 회복 여부를 확인한다.** 이 방식이 **Circuit Breaker(서킷 브레이커)**다. 외부 호출 직전에서 “지금 보내도 되는가?”를 판단한다.

```text
호출을 계속 보내면
새 조회 → 외부 서비스 → 실패
새 조회 → 외부 서비스 → 실패

차단 상태라면
새 조회 → 서버 A에서 거절     외부 서비스까지 보내지 않음
```

실패할 가능성이 높은 호출을 반복하며 기다리면 우리 서버의 처리 자원도 묶일 수 있다. Circuit Breaker는 상대를 고치는 기능이 아니라 그동안 추가 호출과 대기 부담을 줄이는 장치다. [왜 일시 차단하는가](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

### 02 · 한 번 실패했다고 무조건 막지는 않는다

서버 A의 같은 Breaker가 최근 조회 4건을 보고, 최소 4건이 쌓인 뒤 실패 비율이 50% 이상이면 차단한다고 정해 보자. 각 조회는 순서대로 끝나고 Retry는 없다고 가정한다. 숫자는 권장 설정이 아니다.

```text
상품 7 조회 기록 — ○ 성공, × 실패

1건째  ○          계속 허용
2건째  ○ ○        계속 허용
3건째  ○ ○ ×      아직 최소 4건이 안 됨
4건째  ○ ○ × ×    실패 2/4 = 50% → 새 호출 차단
```

“최근 4건”은 새 결과가 들어오면 오래된 결과를 빼는 관찰 범위다. 기술 이름은 **호출 수 기반 Sliding Window**다. 최소 표본 없이 실패 한 건을 전체 장애로 판단하거나, 사용자의 잘못된 요청까지 외부 장애로 세면 불필요하게 막을 수 있다. [관찰 범위와 최소 호출 수](https://resilience4j.readme.io/docs/circuitbreaker)

### 03 · OPEN은 열어 주는 게 아니라 끊어 놓은 상태다

Circuit Breaker는 전기 회로에서 이름을 가져왔다. **CLOSED는 회로가 이어져 호출 허용, OPEN은 끊어져 호출 차단**이다. 문을 열고 닫는 뜻으로 생각하면 반대로 읽기 쉽다.

```text
CLOSED  서버 A ── 상품 7 조회 ──→ 외부 서비스
OPEN    서버 A ── 상품 7 조회 ──× 외부 호출 없음
```

OPEN에서 들어온 요청을 자동으로 보관했다 나중에 다시 보내는 것도 아니다. 이 예시는 즉시 거절한다. 거절 뒤 사용자에게 무엇을 보여줄지는 별도 정책이며, 결제라면 차단을 “결제 성공”으로 바꾸면 안 된다.

이미 외부로 보낸 호출을 소급해서 취소하지도 않는다. 한 호출을 얼마나 기다릴지는 [Timeout과 취소 경계](/study/cs/cancellation-propagation)로 제한한다. Breaker가 있으니 Timeout이 필요 없다는 뜻은 아니다.

### 04 · 30초 쉬었다고 모두 정상은 아니다

30초 차단 뒤 다음 조회가 들어오면, 회복 확인용으로 최대 2건만 허용한다고 해 보자. 이것이 **HALF_OPEN(일부 호출 허용)**이다. 별도 검사 요청을 자동 생성하는 것이 아니라 들어온 실제 조회 일부를 통과시키는 예시다.

```text
OPEN: 30초 쉬기
  ↓ 시간이 지난 뒤 새 조회가 들어옴
HALF_OPEN: 회복 확인용 조회 최대 2건 허용
  ├ 두 건 모두 정상 완료 → CLOSED: 다시 일반 조회 허용
  └ 두 건 모두 실패      → OPEN: 다시 쉬기
```

허용한 두 건의 결과를 판단하기 전에는 추가 조회를 거절한다. 위는 실패율 기준 50%로 설명한 두 가지 경우이며, 느린 호출 기준이 있다면 그것도 만족해야 한다. “한 건 성공했으니 복구 완료”나 “30초 뒤 반드시 정상”이라는 뜻은 아니다. [Resilience4j의 상태와 회복 판정](https://resilience4j.readme.io/docs/circuitbreaker)

<details>
<summary>쉬는 시간이 끝나면 자동으로 외부를 확인할까?</summary>

Resilience4j에서 자동 상태 전환 설정의 기본값은 false다. 이 경우 대기 시간이 지난 뒤 호출이 들어올 때 HALF_OPEN으로 전환한다. 자동 전환을 켜도 상태 전환과 실제 외부 검사 호출은 다른 일이다. 앱이 실제 호출을 실행해야 결과를 확인할 수 있다.

또한 기본 Registry는 프로세스 메모리에 있다. 서버 A가 OPEN이라고 서버 B까지 자동으로 OPEN이 되는 것은 아니다. “회복 확인용 2건”도 모든 서버를 합쳐 2건이라는 뜻이 아니다. [설정과 Registry 범위](https://resilience4j.readme.io/docs/circuitbreaker)

</details>

### 05 · 프로젝트에서는 세 곳을 이어서 확인한다

PromptHub 결제 코드에서는 Resilience4j라는 외부 Java 라이브러리를 Gradle 의존성으로 가져온다. Java 기본 제공 기능은 아니다. 설정을 만들기만 해서는 외부 호출이 보호되지 않으므로 다음을 함께 본다.

1. **설정 — TossCircuitBreakerConfig:** 최근 몇 건을 볼지, 몇 건부터 판단할지, 얼마나 차단할지 정한다. 승인과 환불에는 서로 다른 Breaker를 만든다.
2. **실패 분류 — TossFailurePredicate:** 네트워크 접근 예외와 특정 서버 오류를 장애로 센다. 결제 거절을 전부 외부 장애로 보지는 않는다.
3. **실제 호출 — TossPaymentGateway:** 외부 호출을 Breaker로 감싸고, 차단 예외를 결제 서비스 이용 불가 오류로 바꾼다.

차단 테스트 소스에는 반복 실패로 OPEN이 된 후 다음 승인 요청을 넣고, 외부 HTTP 호출 수가 더 늘지 않는지 확인하는 사례가 있다. 이번에는 코드를 읽었을 뿐 테스트를 실행하지 않았으며 실제 운영 복구와 부하 감소도 측정하지 않았다.

<details>
<summary>프로젝트 설정도 최근 4건과 회복 확인 2건일까?</summary>

아니다. 확인한 설정 파일은 최근 20건, 최소 10건, 실패율 50%, OPEN 대기 30초, HALF_OPEN 허용 3건이다. 20초를 넘는 느린 호출 비율 50%도 판단 기준으로 지정한다. **느리다고 기록하는 기준은 호출을 20초에 중단하는 Timeout이 아니다.**

결제 승인에서는 Breaker가 내부 Retry 전체를 감싼다. 따라서 HTTP 시도마다 실패 한 건을 기록하는 구조와 다르다. 관련 테스트 소스도 승인 처리 2번에서 HTTP 시도 4번이 나가는 상황을 다룬다. 실제 통계의 한 건이 무엇인지 감싸는 위치부터 확인한다.

실패 분류에서 false를 반환하는 것과 통계에서 완전히 제외하는 것은 다르다. Resilience4j에서는 별도 ignore 규칙이 없으면 그런 예외를 성공 쪽으로 집계할 수 있다. 설정 파일에 ignore 항목이 있다는 이유만으로 직접 만드는 Breaker에도 적용됐다고 단정하지 않는다. [실패와 제외의 구현](https://github.com/resilience4j/resilience4j/blob/v2.4.0/resilience4j-circuitbreaker/src/main/java/io/github/resilience4j/circuitbreaker/internal/CircuitBreakerStateMachine.java)

Gradle 선언 버전과 2026-10-09 확인한 최신 안정 버전은 2.4.0이다. 실제 해결 의존성, 배포 설정과 HALF_OPEN 복구 테스트 실행은 확인하지 않았다. [안정 릴리스](https://github.com/resilience4j/resilience4j/releases/tag/v2.4.0)

</details>

### 자기 말로 답해보기

서버 A의 Breaker가 OPEN이고 30초가 지났다. 상품 7 조회 한 건이 성공하면 모든 서버가 바로 정상으로 돌아갈까?

<details>
<summary>답 확인하기</summary>

아니다. 대기 시간이 끝났다는 것과 회복 확인이 끝났다는 것은 다르다. 정한 호출 결과와 실패·느림 기준을 확인해야 하며, 서버 A의 메모리 상태가 다른 서버에 자동 공유되지도 않는다.

</details>

## 조사 기록 — 내부용

- 기존 제목/본문 검색: Circuit Breaker 독립 Study 없음. 학습 순서5절과 전체 로드맵 payment5단계,
  관련 Review의 운영값 재검토를 대조했다. 그 Review 전체를 재검증했다는 뜻은 아니다.
- 완독: TossCircuitBreakerConfig.java, TossFailurePredicate.java, TossPaymentGateway.java,
  TossCircuitBreakerConfigTest.java, TossFailurePredicateTest.java, TossPaymentGatewayCircuitBreakerTest.java,
  payment-service/build.gradle. TossPaymentGatewayRetryTest는 해당 테스트 메서드 구간만 읽었다.
- config/src/main/resources/configs/payment-service.yml은 circuitbreaker 설정 구간만 확인.
  ignore-exceptions가 Java custom builder로 전달되는지는 별개다. 현재 builder에는
  recordException만 있으며 ignoreExceptions를 설정하지 않는다. 수정/효과 검증은 이번 범위 밖.
- 프로젝트 테스트의 가짜 Secret/식별자/임시 localhost를 공개 본문에 옮기지 않는다.
- 공식 CircuitBreaker 문서에서 최소 호출, >= 임계값, OPEN 거절, HALF_OPEN 허용 수,
  자동 전환 false, in-memory Registry, 동시성 제한과의 차이를 확인했다.
- v2.4.0 StateMachine의 handleThrowable/자동 전환/상태 전이 구간을 대조했다.
  Microsoft의 일반 Half-Open 설명을 Resilience4j의 “한 번 실패 즉시 OPEN” 규칙으로 복사하지 않는다.
- 공식 자료: https://resilience4j.readme.io/docs/circuitbreaker
  https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
  https://github.com/resilience4j/resilience4j/releases/tag/v2.4.0
- 날짜/버전은 초안 작성 기준. 실제 게시일이 바뀌면 재확인한다.

## 적용 계획 요약

1. 파일: 신규 MDX, 기존 roadmap.ts/test.ts 2파일. 승인 후 code-plans 기록 1파일.
2. 함수: 새 함수 없음. 기존 순서/탐색 계산 재사용. Retry → Breaker → UTC.
3. 연결: Retry/취소 글은 선수, 기존 본문은 변경하지 않는다. 중복 개요/미작성 링크 없음.
4. 최소 구현: 새 UI/스킬/라이브러리/백엔드 설정/운영 호출/부하 시험 없음.
5. 읽기: 서버 A와 상품 7을 유지한다. 호출 허용/거절, 4건 판정, 제한된 복구 조회 장면을 먼저 보여준다.
6. 루브릭 예측:

| 항목 | 판정과 이유 |
| --- | --- |
| controller-thin | 해당 없음: 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음: 엔티티 변경 없음 |
| http-semantics | 해당 없음: HTTP 구현 변경 없음 |
| logging-quality | 해당 없음: 로그 구현 변경 없음 |
| exception-discipline | 해당 없음: 예외 구현 변경 없음 |
| layer-separation | 괜찮음: 콘텐츠/순서 데이터 분리 유지 |
| dead-code | 괜찮음: 새 헬퍼 없이 기존 흐름 사용 |
| duplication-semantic | 괜찮음: 기존 Retry/취소 설명은 연결 |
| diagnosability | 해당 없음: 런타임 진단 구현 변경 없음 |
| integration-robustness | 해당 없음: 외부 연동 구현 변경 없음 |
| service-boundary | 해당 없음: 서비스 경계 변경 없음 |
| value-object-design | 해당 없음: 도메인 값 변경 없음 |
| polymorphism-opportunity | 해당 없음: 새 분기 없음 |
| cohesion-coupling | 괜찮음: 순서 데이터와 정책 테스트만 변경 |

7. 테스트: 기존 연속 순서 테스트에 Breaker를 기대하도록 먼저 바꿔 실패를 확인한 뒤 순서 반영.
   전체 테스트/타입/격리 빌드, 생성 메타데이터와 HTML/선수·이전·다음/링크/토글/2÷4=50% 확인.
   승인 초안/공개 본문/관련 diff/직접 인용 근거 자동 민감정보 검사. 정확한 승인 파일만 로컬 커밋.
   브라우저 화면/실제 결제 차단·복구·부하 효과는 별도이며 push는 하지 않는다.
