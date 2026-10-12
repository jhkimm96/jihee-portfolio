# Rate Limiting — 승인용 초안

상태: 승인 후 게시 완료. 조사·게시일 2026-10-09 (Asia/Seoul).
승인 4파일 커밋 `ef913e6`, push 없음. 최초 순서 테스트 1개 실패 → 전체 88개 통과.
타입 검사/격리 빌드 통과. 전체 218페이지 중 신규 Study 1편.
메타데이터/HTML/선수·이전·다음/링크/토글와 승인 범위 민감정보 검사 통과.
검증 임시 폴더 삭제, 원본 의존성과 개발 서버 보존. 실제 HTTP 응답/운영 효과/화면 미검증.

## 게시 범위

| 항목 | 제안 |
| --- | --- |
| category / 유형 | cs / 신규 Study 1편 |
| 제목 | 처리가 빨라도 요청을 왜 제한할까? |
| slug | rate-limiting-request-budget — 기존 파일 없음 |
| date | 실제 게시일. 오늘 게시하면 2026-10-09 |
| 질문 | 동시에 처리하는 수는 적은데 짧은 시간에 호출이 너무 많으면 어떻게 막을까? |
| 한 줄 답 | 정한 시간 구간에서 허용할 호출량을 세고, 남은 한도가 없으면 기다리거나 거절한다. |
| 최소 조건 | 어떤 경로/사용자/서버의 한도인지, 시간 구간과 계산 방식, 대기/거절 정책을 정한다. |
| 선수 | cs/bulkhead-concurrent-call-isolation |
| 관련 | cs/retry-backoff-jitter-budget, cs/circuit-breaker-open-and-recovery, msa/project-based-backend-learning-guide |
| 다음 | Token Bucket/Bucket4j 및 Redis 분산 제한은 내부 백로그. 미작성 링크 없음 |
| 프로젝트 근거 | TossRateLimiterConfig, TossPaymentGateway, 설정 구간, 관련 테스트와 PaymentErrorCode |
| 공식 근거 | Resilience4j RateLimiter 문서/v2.4.0 구현, RFC 6585, Kong 고정 구간 설명 |
| 공개 변경 | content/study/cs/rate-limiting-request-budget.mdx, lib/study-roadmap.ts, lib/study-roadmap.test.ts |
| 승인 후 계획 | docs/code-plans/2026-10-09-rate-limiting-request-budget.md |

로드맵: Bulkhead → Rate Limiting → 기존 UTC. 기존 본문/date/URL은 유지한다.
UI/스킬/백엔드/운영 설정/프로젝트 Learning Path 변경 없음.

## 기존 글과 비교

- 기존 프로젝트 학습 글에는 패턴 목적과 읽을 항목이 있다. 독립 Rate Limiting 글은 찾지 못했다.
- Bulkhead의 질문은 현재 진행 중 호출 수, 이번 질문은 시간 구간에서 사용한 호출량이다.
- Token Bucket/Redis 구현/실패 대응 전체를 한 글로 묶지 않는다. 이번에는 한도의 뜻과 적용 위치가 핵심이다.

## 신규 본문 초안

### 01 · 한 번에 하나씩인데도 외부 호출은 너무 많을 수 있다

서버 A에서 서로 다른 결제 요청 5건을 순서대로 처리한다고 해 보자. 각 호출이 빨리 끝나 모두 같은 1초 구간에 들어간다. 실제 결제 기록이 아닌 학습 예시다.

```text
한 1초 구간 안에서
결제1 완료 → 결제2 완료 → 결제3 완료 → 결제4 완료 → 결제5 완료

동시에 진행: 최대 1건
구간 전체 호출: 5건
```

Bulkhead 한도가 2건이어도 모두 통과할 수 있다. 그러나 외부 서비스의 허용량이나 호출 비용을 생각하면 “동시에 적다”만으로 충분하지 않다.

**정한 시간 구간에 쓸 수 있는 호출량을 제한한다.** 이것이 **Rate Limiting(요청량 제한)**이다. 어떤 경로의 한도인지와 시간 구간을 함께 정해야 한다. [시간 구간과 허용량 설정](https://resilience4j.readme.io/docs/ratelimiter)

### 02 · 이번 구간의 호출권 3개를 다 썼다면

같은 서버 A의 결제 호출 경로에 고정된 1초 구간당 3번을 허용한다고 해 보자. 호출권이 없으면 기다리지 않고 거절한다. 숫자는 권장값이 아니다.

```text
이번 1초 구간 시작: 호출권 [● ● ●]

결제1 → 허용 → [● ●]
결제2 → 허용 → [●]
결제3 → 허용 → []
결제4 → 거절 → 외부 호출 없음
결제5 → 거절 → 외부 호출 없음
```

앞선 결제가 끝났어도 **이번 구간의 호출권은 다시 생기지 않는다.** Bulkhead의 입장권은 호출 종료 때 돌아오지만, 이 Rate Limiting 예시는 다음 구간에 한도가 갱신된다. [RateLimiter 호출권은 종료 때 반납하지 않는다](https://github.com/resilience4j/resilience4j/blob/v2.4.0/resilience4j-ratelimiter/src/main/java/io/github/resilience4j/ratelimiter/RateLimiter.java)

### 03 · 다음 구간이 되면 새 요청을 받을 수 있다

```text
이번 구간:  결제1 ○  결제2 ○  결제3 ○  결제4 ×  결제5 ×
            ────────────────────────│
다음 구간:                         │ 새 호출권 [● ● ●]
                                   └ 결제6 → 허용
```

거절한 결제4와 결제5를 자동으로 보관해 다시 실행하는 것은 아니다. 사용자가 다시 시도할지, 서버가 재시도할지는 별도 정책이다. 특히 결제는 [중복 방지 조건과 Retry 예산](/study/cs/retry-backoff-jitter-budget)을 먼저 확인한다.

<details>
<summary>“1초에 3번”이면 어떤 연속 1초에도 3번 이하일까?</summary>

고정 구간에서는 아니다. 구간 끝 직전에 3건, 다음 구간 시작 직후에 3건을 허용하면 짧은 시간에 6건이 몰릴 수 있다. 각 구간의 규칙은 지켰지만 호출이 고르게 퍼진 것은 아니다.

이 경계 몰림까지 줄이려면 움직이는 시간 구간이나 호출권을 보충하는 방식 등 계산 방법을 별도로 선택한다. 이번 예시는 고정 구간이며 모든 RateLimiter가 같은 방식은 아니다. [고정 구간의 경계 몰림](https://developer.konghq.com/gateway/rate-limiting/window-types/)

</details>

### 04 · 누구의 한도인지가 빠지면 엉뚱하게 막는다

| 제한 위치 | 세는 것 | 같은 뜻이 아닌 것 |
| --- | --- | --- |
| 사용자별 API 입구 | 그 사용자의 요청 | 모든 사용자 합계 |
| 서버 A의 결제 호출 직전 | 그 서버의 승인 경로 호출권 | 사용자별 한도 / 모든 서버 합계 |

API는 다른 프로그램이 요청을 보내는 입구다. 사용자에게 적용한 API 한도를 초과하면 **HTTP `429 Too Many Requests`**로 “정해진 시간에 너무 많이 요청했다”고 알릴 수 있다. 응답에는 다시 요청하기 전 기다릴 시간을 나타내는 `Retry-After` 헤더를 넣을 수도 있지만 필수는 아니다. [429의 공식 의미](https://www.rfc-editor.org/rfc/rfc6585#section-4)

외부 호출량을 보호하는 서버 내부 제한은 이와 다른 경계다. 전체 용량 때문에 막힌 사용자를 무조건 개인 한도 초과로 설명하지 않는다. 거절 비율과 허용 호출량, 지연, 재시도 증가를 함께 보며 한도를 조정한다.

<details>
<summary>한도를 기다리는 시간은 외부 응답 Timeout일까?</summary>

아니다. RateLimiter의 대기는 호출권을 얻을 때까지 기다리는 시간이다. 외부 호출 응답을 기다리는 시간은 별도로 제한한다. 대기를 길게 잡으면 요청 스레드가 묶일 수 있으며, 즉시 재시도를 반복하면 거절 요청만 더 늘어난다.

</details>

### 05 · 내 프로젝트는 외부 승인 호출량을 제한한다

PromptHub는 **Resilience4j라는 외부 Java 라이브러리**를 Gradle로 가져온다. `TossRateLimiterConfig`와 `TossPaymentGateway`는 프로젝트가 작성한 연결 코드다. Java 기본 제공 기능이나 Redis 공유 제한이 아니다.

1. **설정:** 확인한 파일은 승인 경로의 갱신 구간 1초, 구간별 호출권 30개, 호출권 대기 0ms다.
2. **연결:** Gateway가 외부 승인 호출 전에 RateLimiter를 거친다. 한도가 없으면 `RequestNotPermitted`를 `PG_RATE_LIMITED` 오류로 바꾼다.
3. **근거:** 테스트 소스에는 10초 구간에 한 번만 허용해 첫 요청 뒤 두 번째를 거절하는 사례가 있다. 이번에는 실행하지 않았다.

이 한도는 **서버 프로세스 안에서 승인 경로가 함께 쓰는 한도**다. 서버 5대에 각각 30개라면 서버별 한도의 합은 150개다. 전체 외부 서비스의 한도를 30개로 자동 공유하지 않는다. [메모리 Registry와 주기별 갱신](https://resilience4j.readme.io/docs/ratelimiter)

<details>
<summary>프로젝트도 429와 Retry-After를 반환할까? Retry는 무엇을 세나?</summary>

확인한 `PaymentErrorCode`에서 `PG_RATE_LIMITED`는 `SERVICE_UNAVAILABLE`(503)로 선언되어 있다. 그러므로 이 코드를 “사용자별 429 구현”으로 소개하지 않는다. 실제 HTTP 응답과 Retry-After 전달은 이번에 실행 검증하지 않았다.

승인 경로는 Retry 안에서 RateLimiter를 거치므로 재시도도 호출권을 소비한다. 또 RateLimiter 뒤에 Bulkhead가 있어, 호출권을 얻은 뒤 Bulkhead에서 거절되면 실제 HTTP 호출이 없어도 호출권은 이미 사용한 상태다. 설정 한도를 실제 HTTP 성공 건수와 같다고 보지 않는다.

환불은 이 승인용 RateLimiter를 통과하지 않는다. 프로젝트 Gradle 선언과 조사 시점의 최신 안정 릴리스는 2.4.0이며, 실제 해결 의존성과 배포 설정은 확인하지 않았다. [안정 릴리스](https://github.com/resilience4j/resilience4j/releases/tag/v2.4.0)

</details>

### 자기 말로 답해보기

같은 구간에 세 호출권을 다 썼는데 결제1이 끝났다. 결제4를 바로 허용해도 될까?

<details>
<summary>답 확인하기</summary>

이 고정 구간 예시에서는 안 된다. 동시 처리 자리는 비었어도 구간의 호출량은 이미 사용했다. 다음 구간의 갱신과 별도 재시도 정책을 확인해야 한다.

</details>

## 조사 기록 — 내부용

- 2026-10-09 일반 검색/공식 자료 대조. Resilience4j 현행 문서에서 시간 구간, 호출권 갱신,
  대기 한도, in-memory Registry를 확인했다. 운영 기본값을 추천하지 않는다.
- v2.4.0 RateLimiter.java의 API 계약/생성/동기 decorateSupplier 경로 확인:
  획득한 호출권은 반납하지 않는다. Bulkhead의 finally 반납과 혼동하지 않는다.
- RFC 6585 4절의 429/선택적 Retry-After 확인. 문서 오래됨은 표준 의미와 별개다.
  Kong 문서는 고정 구간 경계 몰림만 참고하며 Kong의 기본 설정을 프로젝트에 적용하지 않는다.
- 완독: TossRateLimiterConfig.java, TossRateLimiterConfigTest.java,
  TossPaymentGatewayRateLimiterTest.java. Gateway/build.gradle은 Bulkhead 조사에서 완독했다.
  PaymentErrorCode는 PG_RATE_LIMITED 선언 구간, YAML은 ratelimiter 구간 확인.
- 단일 test의 두 요청은 주기 경계를 넘지 않는 기대를 전제로 한다. 테스트 실행/신뢰성 보장 없음.
- 기존 전체 로드맵/학습 순서의 관련 구간 대조. 모든 Study 재검증 아님.
- 수치/실행 결과는 학습 예시 또는 소스 기대값이며 운영 실측이 아니다.
- 사용자별 제한, 전역 공유, Token Bucket, Bucket4j, Redis, HTTP 실응답/부하 시험 미검증.
  후속은 Token Bucket/Bucket4j와 Redis 분산 한도를 따로 조사/제안한다.
- 공개 본문에 가짜 Secret/결제 식별자/테스트 URL을 복사하지 않는다. 승인 후 범위 자동 검사.

## 적용 계획 요약

1. 파일: 신규 MDX, roadmap.ts/test.ts. 승인 후 code-plans 기록 1파일.
2. 함수: 새 함수 없음. 기존 읽기 순서/탐색 계산 재사용. Bulkhead → Rate Limiting → UTC.
3. 연결: Bulkhead는 선수, Retry와 Breaker는 연결만 사용. 기존 본문/date/URL 변경 없음.
4. 최소 구현: 새 UI/컴포넌트/의존성/백엔드/운영 호출/부하 시험 없음.
5. 읽기: 서버 A의 결제1~6과 호출권3개를 유지한다. 동시 실행, 구간 누적, 대상과 범위를 구분한다.
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
| duplication-semantic | 괜찮음: 기존 동시 제한/Retry 글은 연결 |
| diagnosability | 해당 없음: 런타임 진단 변경 없음 |
| integration-robustness | 해당 없음: 외부 연동 구현 변경 없음 |
| service-boundary | 해당 없음: 서비스 경계 변경 없음 |
| value-object-design | 해당 없음: 도메인 값 변경 없음 |
| polymorphism-opportunity | 해당 없음: 새 분기 없음 |
| cohesion-coupling | 괜찮음: 순서 데이터와 정책 테스트만 변경 |

7. 테스트: 연속 순서 테스트에 Rate Limiting을 먼저 추가해 실패 확인 → 순서 반영.
   전체 테스트/타입/격리 빌드, 메타데이터/HTML/선수·이전·다음/링크/토글/산술 확인.
   승인 범위 본문/diff/직접 인용 근거 민감정보 자동 검사 후 정확한 파일만 로컬 커밋.
   실제 운영 효과/화면 검증과 push는 포함하지 않는다.
