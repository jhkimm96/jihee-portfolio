# Token Bucket + Bucket4j — 승인용 초안

상태: 사용자 일괄 승인으로 게시 완료. 조사·게시일 2026-10-09 (Asia/Seoul).
장애 보호4편 묶음 커밋 `e644f4f`, push 없음. 전체88개/타입/격리 빌드/민감정보 점검 통과.
Java 예제는 API 대조 수준이며 실행하지 않았다. 원본 개발 서버/의존성 보존, 임시 폴더 삭제.

## 게시 범위

| 항목 | 제안 |
| --- | --- |
| category / 유형 | cs / 신규 Study 1편 |
| 제목 | 요청이 잠깐 몰릴 때 어디까지 허용할까? |
| slug | token-bucket-and-bucket4j — 기존 파일 없음 |
| date | 실제 게시일. 오늘 게시하면 2026-10-09 |
| 질문 | 평소 호출량은 제한하면서 잠깐 몰리는 요청은 어떻게 허용할까? |
| 한 줄 답 | 호출권을 일정 속도로 채우되 보관 상한을 두고, 남은 호출권만큼 요청을 허용한다. |
| 최소 조건 | 같은 제한 대상이 같은 버킷 상태를 사용해야 하며 용량/충전 속도/초기량/요청 비용/거절 정책을 정한다. |
| 선수 | cs/rate-limiting-request-budget |
| 관련 | cs/bulkhead-concurrent-call-isolation, msa/project-based-backend-learning-guide |
| 다음 | Redis 분산 제한은 내부 백로그. 미작성 공개 링크 없음 |
| 프로젝트 근거 | 현재 결제 RateLimiter와 Gradle 확인. Bucket4j/Token Bucket 사용은 확인되지 않아 학습 예제로 구분 |
| 공식 근거 | Bucket4j 8.21.0 참조 문서/릴리스, AWS API Gateway의 rate/burst 구분 |
| 공개 변경 | content/study/cs/token-bucket-and-bucket4j.mdx, lib/study-roadmap.ts, lib/study-roadmap.test.ts |
| 승인 후 계획 | docs/code-plans/2026-10-09-token-bucket-and-bucket4j.md |

로드맵: Rate Limiting → Token Bucket → 기존 UTC. 기존 본문/date/URL 유지.
UI/스킬/백엔드/라이브러리 설치/운영 설정/프로젝트 Learning Path 변경 없음.

## 기존 글과 비교

- 학습 지도에 Token Bucket 이름이 있지만 토큰 소비/충전과 용량의 독립 설명은 찾지 못했다.
- 기존 Rate Limiting 글은 고정 구간의 갱신과 제한 대상을 설명한다. 이번에는 보충 속도와
  보관 용량을 분리해 잠깐 몰림을 다루므로 동일 질문을 복제하지 않는다.
- Bucket4j는 선택 가능한 Java 구현 예시다. 프로젝트의 Resilience4j를 교체하자는 결정이 아니다.

## 신규 본문 초안

### 01 · 한 번에 세 번은 허용하고 계속 몰리는 요청은 줄이고 싶다

서버 A의 상품 검색에 요청이 잠깐 몰린다. 첫 3건은 바로 허용하되, 그 뒤에는 호출권이 채워지는 속도에 맞춰 제한하고 싶다고 해 보자. 실제 장애가 아닌 학습용 정책이다.

**호출권을 채워 두고 요청마다 쓰되, 최대 보관량을 넘게 쌓지는 않는다.** 이것이 **Token Bucket(토큰 버킷)**이다. 토큰은 로그인 비밀키가 아니라 “요청을 허용할 권리”를 세는 숫자다. 같은 대상의 요청들이 같은 버킷 상태를 사용해야 한다.

```text
서버 A의 검색 호출권 보관함
┌─────────────┐
│  ●  ●  ●    │  최대 3개 보관
└─────────────┘
시간이 지나면 초당 1개 보충 / 검색 1건에 1개 사용
```

**보관 용량은 잠깐 몰림의 크기, 충전 속도는 계속 허용할 속도**를 정한다. 잠깐 몰리는 요청을 **버스트(burst)**라고 부른다. 모든 요청을 고르게 한 건씩만 보내는 방식은 아니다. [요청 속도와 burst를 구분하는 실제 사용 사례](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)

### 02 · 시간이 거의 지나지 않고 네 요청이 오면

처음 호출권은 3개이며, 아래 네 요청 사이에는 새 호출권이 채워질 만큼 시간이 지나지 않았다고 가정한다.

```text
처음      [● ● ●]
검색1 허용 [● ●]
검색2 허용 [●]
검색3 허용 []
검색4 거절 []       검색 작업을 시작하지 않음
```

첫 세 건은 한꺼번에 몰려도 허용한다. 검색이 빨리 끝나도 사용한 호출권을 자동 반납하지는 않는다. 이 예시에서 다시 받을 조건은 **시간 경과에 따른 충전**이다.

### 03 · 1초 지나면 한 개, 오래 쉬어도 최대 세 개다

검색3까지 허용해 보관함이 빈 시점을 기준으로 보자. 초당 1개씩 보충하는 정책이다.

```text
빈 보관함에서 1초 뒤 [●]
새 검색5 허용       []

그 뒤 요청 없이 충분히 오래 쉬면 [● ● ●]
더 기다려도                    [● ● ●]  용량 3개까지만
```

충전 속도가 초당 1개여도 이미 모인 세 개는 바로 쓸 수 있다. 따라서 “어떤 연속 1초에도 반드시 한 건만 허용한다”는 뜻이 아니다. 서버가 감당하지 못할 만큼 큰 보관 용량은 피해야 한다.

<details>
<summary>3개씩 채우는 설정도 초당 1개와 같을까?</summary>

평균 속도가 같아도 보충 시점은 다를 수 있다. Bucket4j의 Greedy 방식은 가능한 만큼 조금씩 보충하고, Intervally 방식은 정한 주기가 지나야 묶어서 보충한다. 이번 글은 `refillGreedy(1, 1초)`를 기준으로 한다. 충전 방식까지 함께 읽는다. [충전 방식과 용량](https://bucket4j.com/8.21.0/toc.html)

</details>

### 04 · Bucket4j는 숫자 계산을 맡고, 정책은 우리가 정한다

**Bucket4j는 외부 Java 라이브러리**다. Java 기본 제공 클래스가 아니어서 쓰려면 의존성을 추가해야 한다. 토큰 보충과 소비 판정을 맡지만, 어떤 요청을 묶을지와 거절한 사용자에게 무엇을 보여줄지는 앱이 정한다.

<details>
<summary>그 보관함을 Java에서는 어떻게 만들까?</summary>

아래는 Bucket4j 8.21.0 기준의 로컬 메모리 학습 예시이며 실행 검증하지 않았다. 프로젝트에 설치하거나 적용한 코드가 아니다.

```java
import io.github.bucket4j.Bucket;
import java.time.Duration;

Bucket searchBucket = Bucket.builder()
    .addLimit(limit -> limit.capacity(3)
        .refillGreedy(1, Duration.ofSeconds(1))
        .initialTokens(3))
    .build();
```

`Bucket`은 라이브러리가 제공하는 타입이다. `Bucket.builder() ... .build()`는 규칙을 지정해 버킷 객체 하나를 만드는 과정이고, **`searchBucket`은 그 객체를 가리키는 변수**다. 처음에는 사용 가능한 토큰 3개가 있다. `Duration`은 Java 기본 제공 시간 길이 클래스이며 `ofSeconds(1)`은 1초를 뜻한다.

이 생성은 제한 대상의 상태를 준비하는 단계에서 한 번 하고, 요청마다 **같은 `searchBucket`**을 사용한다. 요청마다 새 버킷을 만들면 매번 초기 토큰을 받고 기존 사용량을 이어 세지 못한다.

```java
boolean allowed = searchBucket.tryConsume(1);
```

토큰이 3개라면 한 개를 소비해 **2개가 되고 `allowed`는 true**다. 토큰이 0개이고 아직 보충되지 않았다면 **0개 그대로이고 false**다. 이 호출은 토큰을 기다리지 않는다. true일 때 검색하고 false일 때 거절하는 연결은 우리가 작성해야 하며, 이 줄만으로 검색이나 HTTP 오류 응답이 실행되는 것은 아니다. [생성·초기량·소비 API](https://bucket4j.com/8.21.0/toc.html)

Java 17 이상용 core 의존성은 `com.bucket4j:bucket4j_jdk17-core:8.21.0`이다. 이번 작업에서는 설치하지 않는다. 2026-10-09 조사 당시 공식 최신 안정 버전도 8.21.0이다. [공식 릴리스](https://github.com/bucket4j/bucket4j/releases/tag/8.21.0)

</details>

설정한 용량만큼 처음 몰리는 요청과, 비운 뒤 다시 허용되는 시점, 거절 수를 확인한다. 권한별로 버킷을 나누거나 여러 서버가 공유하려면 추가 설계가 필요하다. 동시 실행 수를 제한하는 [Bulkhead](/study/cs/bulkhead-concurrent-call-isolation)도 대신하지 않는다.

### 05 · 내 프로젝트에서 쓴 방식과는 구분한다

확인한 PromptHub 결제 코드는 **Resilience4j의 주기별 호출권 갱신**을 사용한다. Gradle과 Java 소스 검색에서 Bucket4j 의존성/사용을 찾지 못했다. 이것만으로 모든 외부 시스템까지 미사용이라고 확정하지는 않는다.

따라서 위 상품 검색과 Bucket4j 코드는 **이해용 예제**다. 기존 결제 코드가 이미 Token Bucket으로 구현됐다거나 교체했다는 뜻이 아니다. 현재 경로는 [프로젝트의 Rate Limiting 글](/study/cs/rate-limiting-request-budget)과 비교해 읽는다.

<details>
<summary>서버가 5대여도 이 보관함 하나를 함께 쓸까?</summary>

위 `Bucket.builder()` 예시는 서버 프로세스 메모리에 상태를 둔다. 서버마다 별도로 만들면 각자 토큰을 갖는다. 모든 서버가 같은 제한량을 공유하려면 별도의 공유 저장소와 안전한 상태 갱신이 필요하다. Redis 분산 제한은 다음 백로그에서 따로 다룬다.

</details>

### 자기 말로 답해보기

용량 3개, 초당 1개 보충인 버킷을 비운 뒤 아무 요청 없이 10초를 쉬었다. 새 요청 10개가 거의 동시에 오면 모두 허용될까?

<details>
<summary>답 확인하기</summary>

아니다. 용량이 3개라 최대 세 호출권만 보관한다. 요청들 사이에 추가 보충이 일어나지 않는다면 세 개를 허용하고 나머지는 거절한다. 10초를 쉬었다고 10개가 쌓이지 않는다.

</details>

## 조사 기록 — 내부용

- 2026-10-09 일반 검색 후 공식 현재 버전 사이트/릴리스 목록에서 8.21.0 확인.
  사이트는 2026-10-02 릴리스라고 표시한다. 오래된 8.11/8.18 검색 결과와 개발 README의
  8.20 의존성 예시를 최신 근거로 쓰지 않았다.
- 공식 8.21 참조 문서의 dependency, initialTokens, Bucket/Builder, capacity,
  refillGreedy/Intervally, tryConsume, local memory, burst 위험 구간만 읽었다. 전체 2,699줄 완독 아님.
- AWS API Gateway의 rate/burst 구분을 확인했다. AWS의 best-effort 한도를
  Bucket4j 단일 버킷의 원자적 소비 계약이나 프로젝트 적용 사실로 옮기지 않는다.
- Java/Gradle/kts/toml 파일 범위에서 Bucket4j/TokenBucket/refillGreedy/refillIntervally 사용 검색은 0건.
  payment-service/build.gradle과 TossRateLimiterConfig는 완독. 런타임 전이 의존성과 외부 서비스는 미확인.
- 실제 설치/컴파일/토큰 소비/HTTP/부하 시험 없음. 코드 예시는 공식 API 대조 수준.
- main은 단일 버킷/초기 3개/용량3/초당1 보충/요청1토큰/즉시 거절이다.
  초기 네 요청과 마지막 동시 요청 사이에는 보충 가능한 시간이 없다는 조건을 명시했다.
- 그림은 시간에 따른 가능 상태를 나타내며, 매초 백그라운드 스레드가 반드시 도는 구현 그림이 아니다.
- 여러 제한/비용별 토큰/버킷 보관 만료/재시작/분산 제한/Redis 장애는 이번 구현 범위 밖.
  요청마다 새 버킷 생성과 사용자별 버킷 무제한 보관 위험은 실제 적용 시 별도 설계한다.
- 포트폴리오 UI/스킬/백엔드 변경 없음. 승인 후 직접 인용 근거와 게시 범위 자동 민감정보 검사.

## 적용 계획 요약

1. 파일: 신규 MDX, roadmap.ts/test.ts. 승인 후 code-plans 기록 1파일.
2. 함수: 새 함수 없음. 기존 순서/탐색 계산 사용. Rate Limiting → Token Bucket → UTC.
3. 연결: 기존 Rate Limiting/Bulkhead는 링크만 사용. 기존 본문/date/URL 변경 없음.
4. 최소 구현: 새 UI/컴포넌트/의존성 설치/백엔드/운영 호출/부하 시험 없음.
5. 읽기: 서버 A의 검색1~5와 토큰3개를 유지해 소비 → 거절 → 보충 → 상한을 보여준다.
   핵심 설명은 본문, 생성 API와 한 줄 소비의 값 변화는 토글로 분리한다.
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
| duplication-semantic | 괜찮음: 기존 고정 구간 설명은 연결 |
| diagnosability | 해당 없음: 런타임 진단 변경 없음 |
| integration-robustness | 해당 없음: 외부 연동 구현 변경 없음 |
| service-boundary | 해당 없음: 서비스 경계 변경 없음 |
| value-object-design | 해당 없음: 도메인 값 변경 없음 |
| polymorphism-opportunity | 해당 없음: 새 분기 없음 |
| cohesion-coupling | 괜찮음: 순서 데이터와 정책 테스트만 변경 |

7. 테스트: 순서 테스트에 Token Bucket을 먼저 추가해 실패 확인 → 순서 반영.
   전체 테스트/타입/격리 빌드, 메타데이터/HTML/선수·이전·다음/링크/토글/산술 확인.
   Java 예시는 공식 API 대조와 상태 산술만 확인하고 실행 검증과 구분한다. 라이브러리를 설치하지 않는다.
   승인 범위 본문/diff/직접 인용 근거 자동 민감정보 검사 후 정확한 파일만 로컬 커밋. push 없음.
