# OpenTelemetry/APM — 느린 요청의 시간표 승인용 초안

상태: 승인 범위 게시 완료. 조사 기준일 2026-10-09 (Asia/Seoul).
커밋 `73fbee7`, push 없음. 신규 Study 1편과 로드맵/테스트, 승인 계획 4파일만 커밋했다.
순서 테스트 1개 실패 확인 후 전체 88개 통과, 타입 검사와 격리 빌드 통과.
전체 212개 페이지 중 신규 Study는 1편. 외부 폰트 fetch cache 시간 초과 경고가 있었으나 빌드는 exit 0.
생성 메타데이터/HTML/선수·이전·다음 링크/토글/예시 계산과 승인 범위 민감정보 자동 점검 통과.
검증 임시 폴더 삭제, 원본 의존성과 기존 개발 서버 보존. 브라우저 화면과 실제 추적 수집은 미검증.

## 게시 범위

| 항목 | 제안 |
| --- | --- |
| 구분 / category | 새 글 1편 / cs |
| 제목 | 느린 주문의 시간표를 트레이스로 펼쳐보기 |
| slug | opentelemetry-trace-waterfall — 현재 충돌 없음 |
| date | 실제 게시일. 오늘 승인·게시하면 2026-10-09 |
| 핵심 질문 | 주문이 느릴 때 어느 작업에서 시간을 썼는지 어떻게 확인할까? |
| 한 줄 답 | 작업별 시작·끝과 호출 관계를 기록·전달해 트레이스 화면에서 긴 구간을 찾고, 그 구간의 로그와 지표로 원인을 확인한다. |
| 최소 조건 | 해당 작업 계측, 추적 맥락 전파, 수집·전송·저장 성공과 해당 트레이스 보존이 필요하다. 그림은 동기 순차 호출을 단순화한 학습 예시다. |
| 선수 | cs/logs-metrics-traces, cs/trace-span-event-identifiers |
| 관련 | cs/database-bottleneck-diagnosis, cs/kafka-lag-diagnosis |
| 다음 | Loki/로그 도구 선택은 미작성 백로그. 가짜 공개 링크 없음 |
| 프로젝트 근거 | 로컬 RequestIdMdcFilter, 자동 등록 설정과 필터 테스트 소스. 로그 연결 기능이지 분산 계측 구축 근거는 아님 |
| 신규 파일 | content/study/cs/opentelemetry-trace-waterfall.mdx |
| 함께 수정 | lib/study-roadmap.ts, lib/study-roadmap.test.ts |
| 승인 후 계획 | docs/code-plans/2026-10-09-opentelemetry-trace-waterfall.md |

공개 순서: Kafka 진단 → 새 트레이스 글 → 기존 UTC.
기존 글 본문/주소/날짜, UI, 스킬, 프로젝트 Learning Path와 백엔드는 변경하지 않는다.

## 신규 본문 초안

### 01 · 주문 7이 끝나는 데 1초가 걸렸다

“주문이 느리다”는 건 알지만 재고 확인, 결제 호출 중 어디서 기다렸는지는 모른다.

**작업의 시작·끝과 호출 관계를 기록해 같은 요청의 시간표로 펼쳐본다.** 이를 위해 실제 작업이 기록되고 서비스 사이의 추적 맥락도 이어져야 한다. 다음 숫자와 화면은 실제 운영 캡처가 아닌 학습용 예시다. 앞 Kafka 글의 비동기 알림 처리 시간이 아닌, 주문 API 요청 한 번을 살펴본다.

한 작업 구간이 **span**, 연결된 구간들의 실행 흐름이 **trace**다. T1은 읽기 쉬운 별칭이며 실제 추적 ID가 아니다.

### 02 · 긴 막대가 조사할 구간을 알려준다

```text
주문 7 · T1 — 한 칸은 100ms
시간       0                     1000ms
전체 주문  ██████████              1000ms
재고 확인  █                       100ms
결제 호출   ████████               800ms
  결제 DB    ██████                 600ms
```

재고는 0~100ms, 결제 호출은 100~900ms, 결제 안의 DB 호출은 200~800ms다. 주문 요청은 1000ms에 끝난다. 막대의 가로 위치가 시작 시각, 길이가 걸린 시간이다. 이런 시간순 펼침을 흔히 **waterfall 화면**이라고 한다.

결제 호출 800ms **안에** DB 호출 600ms가 들어 있다. 전체에 이미 포함된 자식 시간을 또 더해서 요청 시간을 계산하지 않는다. 실제 병렬 실행은 구간끼리 겹칠 수도 있다. [Span의 시작·끝과 부모 관계](https://opentelemetry.io/docs/concepts/signals/traces/)

### 03 · “결제 쪽이 길다” 다음에는 무엇을 볼까?

800ms는 조사할 범위를 좁혔을 뿐 “결제 서버 CPU가 느리다”는 결론이 아니다. 호출 구간에는 연결과 응답 대기도 포함될 수 있다.

이 예시에서는 결제 아래의 DB 호출도 길다. 그 시각의 쿼리, 잠금 대기와 오류 로그를 함께 확인한다. DB 호출 span이 길다고 SQL 실행만 600ms였다고 단정하지 않는다. 연결 풀에서 기다리는 시간이 그 span에 들어 있는지는 계측 경계를 확인해야 한다.

```text
긴 결제 호출 발견
  → 안쪽 DB 호출도 길다
  → 같은 시각의 쿼리·잠금·연결 대기 근거 확인
  → 확인한 원인에 맞춰 변경
  → 비슷한 조건의 지연·오류·처리량을 다시 확인
```

이번 글에서는 DB 설정이나 서버 수를 바꾸지 않는다. 실제 진단 질문은 [DB 병목 진단](/study/cs/database-bottleneck-diagnosis)에 연결한다.

### 04 · 이 시간표는 누가 만들어 주나?

작업을 측정해서 기록을 내보내도록 붙이는 일이 **계측**이다. OpenTelemetry는 계측·수집·전달을 위한 오픈소스 구성요소들이다. Java 기본 클래스나 캐시 라이브러리가 아니며, 자체가 저장소와 분석 화면을 제공하는 제품도 아니다. [OpenTelemetry의 역할](https://opentelemetry.io/docs/what-is-opentelemetry/)

```text
주문 앱에서 작업 시간 기록
  → 필요하면 중간 수집기로 모음
  → 추적 저장소에 보관
  → 화면에서 주문 7의 긴 구간 확인
```

중간 수집기인 **Collector**는 받은 기록을 처리해 저장 쪽으로 전달한다. 직접 저장 쪽으로 보낼 수도 있어서 항상 필수는 아니다. Collector만 켜도 앱에 없는 span이 만들어지지는 않는다. [Collector와 직접 전송](https://opentelemetry.io/docs/collector/)

**APM(Application Performance Monitoring)**은 애플리케이션의 지연과 오류 등을 살펴보는 영역과 제품군을 뜻한다. 그중 추적 데이터를 받아 시간표를 보여주는 기능을 사용할 수 있다. OpenTelemetry와 APM은 양자택일 이름이 아니다. [APM의 역할 예시](https://www.elastic.co/docs/solutions/observability/apm)

<details>
<summary>Java 앱에는 어떻게 붙이고, 어디까지 자동일까?</summary>

한 방법은 별도 Java agent JAR을 준비해 JVM 실행 설정에 연결하는 것이다. 지원하는 웹 요청·외부 호출·DB 라이브러리 등을 자동 계측할 수 있다. 하지만 모든 업무 함수나 모든 라이브러리를 기록하는 것은 아니다. 필요한 업무 구간은 별도 계측이 필요할 수 있다. [Java agent](https://opentelemetry.io/docs/zero-code/java/agent/)

Spring Boot에서 Micrometer Tracing과 OpenTelemetry 연동 의존성·설정을 쓰는 경로도 있다. Micrometer는 외부 라이브러리이며 Actuator 의존성이 있다는 사실만으로 전송과 추적 화면까지 완성됐다는 뜻은 아니다. 이미 붙인 계측을 확인한 뒤 경로를 선택해 중복 계측을 피한다. 이번 게시에서는 의존성을 설치하거나 운영 JVM 설정을 변경하지 않는다. [Spring Boot Tracing](https://docs.spring.io/spring-boot/reference/actuator/tracing.html)

</details>

### 05 · 화면에 없으면 실행되지 않은 걸까?

아니다. 모든 요청 대신 일부를 선택해서 보관하는 **sampling** 정책 때문에 요청이 빠질 수 있다. 계측 누락, 추적 맥락 단절, 전송 실패나 조회 시간 범위 차이도 확인한다. 시간표의 빈칸은 “그동안 아무 일도 안 했다”는 증거가 아니다. [Sampling](https://opentelemetry.io/docs/concepts/sampling/), [추적 맥락 전달](https://opentelemetry.io/docs/concepts/context-propagation/)

계측을 붙였다면 먼저 테스트 요청 하나로 앱의 기록 생성 → 전달 → 저장 → 조회를 확인한다. 그다음 예상한 서비스·작업이 이어지는지 확인한다. 고객 정보나 요청 본문을 무조건 span에 넣지 않는다.

### 프로젝트 근거와 적용 범위

2026-10-09 로컬 PromptHub의 RequestIdMdcFilter와 자동 등록 설정, 필터 테스트 소스를 확인했다. 유효한 요청 UUID를 로그 문맥에 넣고, 없거나 잘못됐으면 새 UUID를 만들며, 처리 뒤 제거하는 코드다.

이 코드만으로 작업별 시간표나 서비스 간 분산 트레이싱이 구현됐다고 볼 수 없다. Java/Gradle/YAML/properties/XML/Dockerfile 검색 범위에서 OpenTelemetry, 추적 연동과 agent 설정을 찾지 못했다. 외부 배포 환경에도 없다고 단정하지 않는다. 백엔드 테스트 실행, 원격 HEAD, 실제 수집 화면과 개선 효과는 미확인이다.

### 자기 말로 답해보기

결제 호출이 800ms이고 그 안의 DB 호출이 600ms다. 결제 호출과 DB에 총 1400ms가 들었다고 더해도 될까?

답 토글: 아니다. DB 시간은 이미 결제 호출 구간 안에 포함돼 있다. 포함 관계와 시작·끝을 확인하고, 긴 DB 호출의 원인은 별도 근거로 확인한다.

## 조사 기록 — 내부용

- 기존 신호 구분/ID 글은 연결 번호와 신호의 역할, 신규 글은 시간표 해석과 수집 조건이 질문이다.
  기존 본문을 반복하거나 OpenTelemetry 설치 튜토리얼로 확장하지 않는다.
- 시각화: 동일 주문7의 시간 막대, 원인 확인 단계, 기록→조회 흐름. 실제 APM 화면으로 가장하지 않는다.
- 최신 확인: Java instrumentation/agent v2.32.0, Java SDK v1.66.0. 서로 다른 구성요소 버전이다.
  공식 latest의 리디렉션을 확인했으며 preview와 혼합하지 않는다.
  https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/tag/v2.32.0
  https://github.com/open-telemetry/opentelemetry-java/releases/tag/v1.66.0
- Spring Boot 공식 현재 안정 문서4.1.1, 프로젝트 루트 설정4.1.0.
  실제 해결된 tracing 의존성과 배포 버전은 미확인. Collector 구성요소 안정성이 혼합돼 있어
  OpenTelemetry 전체를 단일 버전/모든 기능 안정으로 표현하지 않는다.
- broad tempo 검색의 Temporal 오탐을 제거해 단어 경계로 다시 확인했다. 검색 대상 확장자와
  로컬 범위를 밝히며 저장소 밖의 환경 변수/플랫폼 agent 설치 부재를 단정하지 않는다.
- 완독: RequestIdMdcFilter.java, RequestIdMdcAutoConfiguration.java, RequestIdMdcFilterTest.java.
  코드·테스트 소스 확인은 테스트 통과나 운영 분산 추적 구축 확인이 아니다.
- 1000/800/600/100ms는 학습 수치. 전체에 부모/자식 구간을 더하지 않으며 CPU 실행 시간으로 읽지 않는다.
- 계측 경로의 실제 파일/설정 구현, trace 연동 실행과 Collector 배포는 별도 승인 범위다.
- 승인 뒤 초안/MDX/관련 diff/직접 인용 근거의 민감정보 자동 점검을 한다.
- 초안 단계에서는 실행 검증과 커밋을 하지 않았다. 승인 후 수행한 결과는 문서 상단에 기록했다.

## 적용 계획 요약

신규 MDX 1개와 로드맵 데이터·테스트 2파일만 수정한다. 승인 후 계획을 저장한다.
기존 Label→Grafana→알림→Kafka→UTC 연속 순서 테스트에 새 트레이스 글을 끼워 넣는 기대값을
먼저 추가해 실패를 확인하고, 새 글과 실제 순서를 반영한다. 기존 함수/뷰 재사용.
구현 후 전체 테스트, 타입 검사, 개발 서버와 분리한 빌드, 생성 메타데이터/링크/토글 검증.
브라우저 접근 차단이 계속되면 우회하지 않고 화면 미검증으로 보고한다.
다음 초안은 Loki/로그 도구 선택이며 미작성 공개 링크를 만들지 않는다.
