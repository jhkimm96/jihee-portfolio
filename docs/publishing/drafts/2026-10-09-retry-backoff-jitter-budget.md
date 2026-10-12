# Retry·Backoff·Jitter와 요청 예산 — 승인용 초안

상태: 승인 후 게시 완료. 조사·게시일 2026-10-09 (Asia/Seoul).
공개 글·로드맵·테스트·계획 5파일 커밋 `32e839b`, push 없음.
순서 테스트 실패 확인 후 전체 88개, 타입 검사, 격리 빌드 통과.
전체 214페이지 중 신규 Study 1편. 외부 폰트 캐시 시간 초과 경고가 있었으나 빌드 exit0.
승인 범위 민감정보 점검, 링크/토글/생성 메타데이터/HTML과 계산 확인 통과.
검증 임시 폴더 삭제. 브라우저 화면과 실제 결제 재시도/부하 효과는 미검증.

## 기존 글 대조 결과

- Timeout/취소: `cs/cancellation-propagation`에 기다림 종료, 실제 작업 종료, 하위 호출 예산과
  상태 변경 작업의 주의가 있다. 새 Timeout 개요를 복제하지 않고 선수로 연결한다.
- Retry: 비동기 기초7절에 실패 분류와 Backoff, Kafka에 처리 Retry/DLT가 있다.
  이번에는 원격 조회 재시도의 부하·시점 분산·전체 시간 한도에 집중한다.
- 재고 글의 Backoff/Jitter는 낙관적 락 충돌 문맥이다. 예시를 원격 조회로 바꾸는 신규 질문이다.
- Breaker/Fallback/Bulkhead는 지도/프로젝트 참조가 중심이다. 각각의 상세 편집은 후속 백로그로 둔다.
  모든 보호 패턴 본문을 이번에 재검증했다는 뜻은 아니다.

## 게시 범위

| 항목 | 신규 글 | 기존 글 보완 |
| --- | --- | --- |
| 구분 / category | 새 글 1편 / cs | 제한적 보완 / msa |
| 제목 | 실패한 상품 조회를 바로 다시 부르면 왜 더 막힐까? | 동기·비동기부터 Outbox까지 — 제목 유지 |
| slug | retry-backoff-jitter-budget — 충돌 없음 | async-event-processing-foundations — 유지 |
| date | 실제 게시일. 오늘 게시하면 2026-10-09 | 원래2026-08-26 유지, updatedAt=실제 수정일 |
| 질문 | 재시도가 장애를 더 키우지 않게 하려면 무엇을 제한할까? | 기존 개요 유지. timeout의 안전한 재시도 조건만 보완 |
| 한 줄 답 | 다시 시도해도 안전한 실패만 골라 횟수와 전체 시간을 제한하고, 대기와 무작위 분산으로 재호출 집중을 줄인다. | 상태 변경 timeout은 결과 불명일 수 있어 실패 이름만으로 Retry를 정하지 않는다. |
| 최소 조건 | 재시도 가능한 오류 계약과 중복 실행 안전성, 한 번의 호출 제한과 전체 예산을 구분한다. 숫자와 시간은 학습용이다. | 비동기 재처리와 원격 호출의 안전 조건을 혼동하지 않는다. |
| 선수 | cs/cancellation-propagation, cs/async-throughput-and-queue-latency | 기존 구성 유지 |
| 관련 | msa/async-event-processing-foundations, cs/opentelemetry-trace-waterfall, database/stock-concurrency-control | 신규 글 related/본문 링크 추가 |
| 다음 | Circuit Breaker/Fallback/Bulkhead의 미작성·보완 백로그 | 신규 짧은 Retry 글 |
| 프로젝트 근거 | 결제 Retry 설정/실패 Predicate/호출 Gateway와 관련 테스트 소스, 선언 의존성 및 선택 설정값 | 같은 근거와 공식 Retry·멱등성 문서 |
| 파일 | content/study/cs/retry-backoff-jitter-budget.mdx | content/study/msa/async-event-processing-foundations.mdx |

함께 변경: lib/study-roadmap.ts, lib/study-roadmap.test.ts.
로드맵: Loki → 신규 Retry → 기존 UTC. 기존 취소 글의 위치는 유지한다.
승인 후 기록: docs/code-plans/2026-10-09-retry-backoff-jitter-budget.md.
UI/스킬/백엔드/운영 설정/프로젝트 Learning Path는 변경하지 않는다.

## 신규 본문 초안

### 01 · 조회가 실패해서 모두 다시 눌렀다

앱 서버 A~E가 상품 7을 조회했지만 외부 서비스가 일시적으로 오류를 반환했다. 다섯 서버가 바로 같은 요청을 다시 보낸다. 실패한 작업을 다시 시도하는 것이 **Retry(재시도)**다.

**다시 시도해도 안전한 실패만 골라 횟수·전체 시간을 제한하고, 대기와 시점 분산으로 집중을 줄인다.** 다음은 실제 장애나 개선 실측이 아닌 학습 예시다.

```text
처음 조회       A B C D E → 외부 서비스: 5번 호출
첫 재시도       A B C D E → 외부 서비스: 5번 추가
두 번째 재시도  A B C D E → 외부 서비스: 5번 추가
```

모두 실패해 최초 포함 총3번까지 시도했다면 5×3=15번이다. 원래 다섯 요청이 세 배의 호출을 만들었다. 과부하로 느린 상대에게 재시도까지 몰리면 회복을 방해할 수 있다. [재시도 제한 원칙](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)

### 02 · 기다리는 시간을 두고, 길어지면 더 기다린다

재시도 전에 쉬는 간격이 **Backoff**다. 간격을 늘리는 한 방법이 **지수 Backoff**다. 아래200ms와400ms는 권장값이 아닌 예시다.

```text
최초 조회 실패
  → 200ms 쉬기 → 첫 재시도 실패
  → 400ms 쉬기 → 두 번째 재시도
```

횟수를 제한하지 않고 계속 기다리며 재시도하는 것도 안전하지 않다. 간격과 최대 시도 수, 대기 상한과 종료 조건을 함께 정한다.

### 03 · 똑같이 쉬면 똑같이 다시 몰릴 수 있다

다섯 서버가 비슷한 순간에 실패하고 모두200ms만 쉬면 재시도도 다시 겹칠 수 있다. 대기 시간에 무작위 차이를 주는 것이 **Jitter**다.

```text
각 서버가 실패한 뒤 첫 재시도까지 쉬는 시간 — 학습용

같은 대기   A:200  B:200  C:200  D:200  E:200ms
분산 대기   A:180  B:230  C:310  D:260  E:370ms
```

무작위 값은 정한 범위와 전체 예산 안에서 고른다. 위는 분산의 모습만 보여주며 특정 라이브러리의 공식이나 실제 분포를 재현한 것이 아니다. 충돌이 줄 가능성을 높이지만 상대의 장애가 해결되거나 호출이 절대 겹치지 않는다는 보장은 없다. [Backoff와 Jitter의 역할](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

### 04 · 세 번 시도할 수 있어도 전체 시간이 모자라면 멈춘다

한 요청을 기다릴 총 예산을2초로 잡았다고 하자. 한 번의 시도는 최대400ms, 실패 뒤 대기는200ms와400ms, 정리에는200ms를 남긴 단순 예시다. 이 계산에서는 호출 제한이 해당 시도의 전체 구간을 덮는다고 가정한다.

```text
1차400 + 대기200 + 2차400 + 대기400 + 3차400 + 정리200
= 최대2000ms
```

실제로는 연결·조회·처리와 정리에 든 시간을 함께 보고, 다음 대기와 시도가 **남은 예산 안에 가능한지** 확인한다. Jitter를 넣으면 선택한 대기 시간으로 다시 계산한다. 횟수만 정했다고 전체2초 제한이 자동 구현되는 것은 아니다.

시간 제한으로 기다리기를 끝내도 안쪽 작업이 계속될 수 있다. 이 차이는 [기다리기를 멈췄는데 서버는 계속 일하는 이유](/study/cs/cancellation-propagation)에 연결한다. 재시도와 취소를 같은 동작으로 취급하지 않는다.

### 05 · 결제가 늦었다고 같은 규칙으로 다시 보내면 안 된다

상품 조회 예시와 결제처럼 상태를 바꾸는 요청은 안전 조건이 다르다. 응답을 못 받았어도 결제는 완료됐을 수 있다. **timeout은 실패 확정이 아니라 결과를 모르는 상태일 수 있다.**

같은 의도의 요청을 여러 번 받아도 추가 결제가 생기지 않도록 처리하는 성질이 **멱등성**이다. 상대가 지원하는 중복 방지 계약과 결과 확인 방법을 먼저 확인한다. 번호만 보내거나 Backoff를 넣었다고 중복이 자동 방지되지는 않는다. [안전한 재시도와 멱등성](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

요청 형식 오류나 권한 부족은 보통 기다려도 바뀌지 않는다. 오류 이름이나 HTTP 상태 하나만으로 전부 재시도하지 말고 의존성의 오류 계약, 요청 성격과 복구 가능성을 함께 본다.

<details>
<summary>SDK도 재시도하면 내가 정한 세 번만 나갈까?</summary>

상위 앱이 최초 포함3번 시도하고, 각 호출에서 하위 클라이언트도 최초 포함3번 시도하면, 모두 실패하는 조건에서 맨 아래 호출은 최대3×3=9번이 될 수 있다. 위의 서버5대 그림과는 별도의 한 요청 예시다.

기존 SDK·프록시·서버의 재시도를 먼저 확인하고, 재시도를 책임질 계층과 전체 호출 예산을 정한다. Resilience4j의 `maxAttempts`는 최초 호출을 포함한다. 다른 API의 “재시도 횟수”가 같은 의미라고 가정하지 않는다. [Resilience4j Retry](https://resilience4j.readme.io/docs/retry)

</details>

### 프로젝트에서는 어디를 확인했나?

로컬 PromptHub 결제 코드의 TossRetryConfig, TossRetryPredicate, TossPaymentGateway와 관련 테스트 소스를 확인했다. Resilience4j는 Java 기본 기능이 아닌 외부 라이브러리이며 프로젝트는 Gradle 의존성으로 가져온다. Retry를 실제 호출에 감싸는 코드와 재시도할 오류를 고르는 코드는 별도로 있다.

확인한 설정 파일은 최초 포함 최대2번과 고정500ms 대기를 지정한다. 실패 분류 코드는 직접 원인이 SocketTimeoutException인 네트워크 예외를 Retry에서 제외하고 일부 서버 오류를 대상으로 한다. 이 설정을 모든 네트워크 timeout의 안전한 자동 재시도나 Jitter 구현으로 설명하지 않는다.

테스트 소스에는 재시도 대상/제외 분류와 호출 횟수를 확인하는 사례가 있다. 이번에는 읽었을 뿐 실행하지 않았으며 실제 배포 설정, 전체 요청 deadline, 운영 부하와 개선 효과는 검증하지 않았다.

### 자기 말로 답해보기

서버 다섯 대가 실패 뒤 모두1초를 쉬었다. Backoff가 있으니 재시도가 절대 몰리지 않을까?

답 토글: 아니다. 비슷한 순간에 실패했다면 같은 대기 뒤 다시 겹칠 수 있다. Jitter와 시도/전체 시간 한도를 함께 검토한다. 어떤 오류를 다시 실행해도 안전한지도 먼저 확인한다.

## 기존 비동기 기초 글의 제한적 보완

7절의 Retry 대상 표와 기존 본문은 유지한다. Backoff 설명 뒤에 다음 두 문단만 추가한다.

> 상태를 바꾸는 원격 호출은 timeout이 나도 이미 처리됐을 수 있다. “일시적인 Network Timeout”이라는 이름만으로 재시도를 정하지 않고, 중복 실행 안전성·상대의 멱등성 계약과 결과 확인 방법을 먼저 확인한다.
>
> 재시도 횟수·전체 시간과 호출 시점 분산은 새 짧은 Retry 글에서 살펴본다.

첫 문단 가까이에 공식 멱등성 문서를 연결하고 둘째는 새 글 링크를 넣는다.
related에 새 글 추가, updatedAt 갱신. 기존URL/date/나머지 본문은 유지한다.

## 조사 기록 — 내부용

- 공식 조회일2026-10-09. Resilience4j 최신 안정2.4.0, 프로젝트 payment-service/build.gradle 선언2.4.0.
  실제 Gradle 해결/런타임 버전과 배포 설정은 확인하지 않았다.
  https://github.com/resilience4j/resilience4j/releases/tag/v2.4.0
- AWS Builders Library의 timeouts/retries 원문은 Builder Center로 리디렉션되고 본문을 가져오지 못했다.
  그 페이지를 읽었다고 주장하지 않는다. 읽을 수 있는 AWS 최신 Well-Architected Retry 지침,
  공식 Backoff/Jitter 글, 멱등성 글과 Resilience4j 공식 문서로 주장을 검증했다.
- AWS 공식 Backoff 글의 그래프/측정값을 복제하지 않는다. A~E와200/400ms,2초는 새 학습 예시다.
- 완독: TossRetryConfig.java, TossRetryPredicate.java, TossPaymentGateway.java,
  TossRetryConfigTest.java, TossRetryPredicateTest.java, TossPaymentGatewayRetryTest.java.
  설정 파일은 retry.instances.toss-confirm-retry의 선택 구간(max-attempts2/wait500ms)만 확인.
  테스트의 가짜 자격증명, 헤더 생성 값과 실제 식별자를 공개 본문에 옮기지 않는다.
- Predicate는 ResourceAccessException의 직접 cause만 검사한다. 모든 중첩 timeout을 제외하거나
  연결·읽기 timeout을 모두 완벽히 분류한다고 과장하지 않는다.
- Gateway의 confirm Retry를 확인했으며 refund에도 같은 Retry가 적용된다고 쓰지 않는다.
  Idempotency-Key 설정만으로 공급자의 멱등 계약/보관기간/결과 확인을 검증했다고 하지 않는다.
- 고정 대기 구성과 Jitter 학습 대안을 구분한다. 실제2초 전체 deadline 구현 근거는 없다.
- 기존 재고 글의 지수 Backoff 예시는 연결만 하고 이번 수정 범위에 넣지 않는다.
- 승인 뒤 초안/공개MDX/관련diff/직접 인용 근거 민감정보 자동 점검.
  테스트/타입검사/격리빌드/커밋은 승인 후 진행하며 운영 호출/부하 시험은 수행하지 않는다.

## 적용 계획 요약

공개MDX2파일(신규1/기존 제한 보완1), 로드맵/테스트2파일과 승인 후 계획 기록.
Loki → Retry → UTC 연속 정책의 기대값부터 바꿔 실패를 확인하고 실제 순서를 반영한다.
기존 목록/선수/이전·다음/렌더러를 재사용한다. 실환경 Retry/설정/스킬/UI/백엔드는 변경하지 않는다.
검증: 전체 테스트·타입·격리 빌드, 생성 메타데이터/기존 날짜 유지/링크/토글,
15회/9회와 시간 예산 계산, 승인 범위 민감정보 검사. 실제 운영 효과와 화면 검증 수준은 별도 보고.
