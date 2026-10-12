# Loki의 라벨과 로그 검색 — 승인용 초안

상태: 승인 범위 게시 완료. 조사 기준일 2026-10-09 (Asia/Seoul).
커밋 `abab328`, push 없음. 공개 MDX/로드맵/테스트/승인 계획 4파일만 커밋했다.
순서 테스트1개 실패 확인 후 전체88개 통과. 타입 검사와 격리 빌드 통과.
전체213개 페이지 중 신규Study1편. 메타데이터/HTML/선수·이전·다음 링크/토글과
JSON 예시 필터 결과, 승인 범위 민감정보 점검 통과. 실제 LogQL 실행과 브라우저 화면은 미검증.
검증 임시 복사본 삭제, 원본 의존성과 기존 개발 서버 보존. 파일 끝 빈 줄 정리 후 staged diff check 통과.

## 게시 범위

| 항목 | 제안 |
| --- | --- |
| 구분 / category | 새 글 1편 / cs |
| 제목 | Loki에서 주문 번호는 어디에 넣어야 할까? |
| slug | loki-labels-and-log-search — 충돌 없음 |
| date | 실제 게시일. 오늘 게시하면 2026-10-09 |
| 핵심 질문 | 주문 7의 로그를 찾으려면 주문 번호를 인덱스 라벨로 만들어야 할까? |
| 한 줄 답 | 서비스·환경 같은 제한된 분류와 시간으로 범위를 좁히고 로그 내용의 주문 번호로 찾는다. 주문마다 새 인덱스 라벨 조합을 만들 필요는 없다. |
| 최소 조건 | 해당 로그가 수집·저장돼 있고 조회 범위와 라벨이 실제 설정에 맞아야 한다. 예시는 같은 나머지 라벨, 정상 JSON의 문자열 orderId를 가정한다. |
| 선수 | cs/log-collection-and-search, cs/metric-label-cardinality |
| 관련 | cs/structured-json-logs, cs/opentelemetry-trace-waterfall, cs/kibana-data-view-and-saved-objects |
| 다음 | 관측성 이후 장애 보호 패턴은 다음 조사 백로그. 미작성 공개 링크 없음 |
| 프로젝트 근거 | 로컬 Fluent Bit ConfigMap의 입력/필터/전송, Logstash ConfigMap의 JSON 해석/분기/Elasticsearch 출력. Loki 구축 근거는 아님 |
| 신규 파일 | content/study/cs/loki-labels-and-log-search.mdx |
| 함께 수정 | lib/study-roadmap.ts, lib/study-roadmap.test.ts |
| 승인 후 계획 | docs/code-plans/2026-10-09-loki-labels-and-log-search.md |

공개 순서: 트레이스 시간표 → 새 Loki 글 → 기존 UTC.
기존 콘텐츠의 본문/URL/date, UI, 스킬, 백엔드와 프로젝트 Learning Path는 변경하지 않는다.
실제 Loki 설치·마이그레이션·LogQL 실행·운영 비용 측정은 범위 밖이다.

## 신규 본문 초안

### 01 · 주문 7의 시간 초과 로그를 찾고 싶다

주문 7의 결제 호출이 시간 초과됐다. 이번에는 로그 저장소가 Loki라고 가정하고 그 기록을 찾는다. 실제 프로젝트 운영 사건이 아닌 학습용 예시다.

**서비스·환경과 시간으로 범위를 좁힌 뒤 로그 안의 주문 번호로 찾는다.** 찾고 싶은 값마다 인덱스 라벨을 만들 필요는 없다. 해당 기록이 먼저 수집·저장돼 있어야 한다.

Loki는 로그를 모아 저장하고 조회하는 별도 서버 프로그램이다. 로그 본문 전체를 검색용 인덱스로 만드는 방식 대신, 로그 묶음의 라벨을 인덱싱한다. 인덱스는 후보 기록을 찾는 검색용 목록이다. 본문을 인덱싱하지 않는다고 본문 검색을 못 하는 것은 아니다. [Loki의 저장·조회 방식](https://grafana.com/docs/loki/latest/get-started/overview/)

### 02 · 이름표는 묶음에, 주문 번호는 기록 안에

인덱스 **라벨(label)**은 로그 묶음을 구분하는 이름표다. 같은 전체 라벨 조합을 가진 로그 묶음이 **stream**이다.

```text
묶음 이름표: 서비스=order, 환경=prod
  ├ 주문 7: payment_timeout
  ├ 주문 8: payment_success
  └ 주문 9: payment_timeout
```

나머지 라벨도 같다는 조건의 그림이다. 주문 번호가 달라도 같은 묶음에 기록할 수 있다. `order`와 `prod`는 학습용 이름이며 실제 프로젝트 설정값이 아니다.

반대로 주문 번호까지 인덱스 라벨로 만들면 같은 예시가 이렇게 나뉜다.

```text
서비스=order, 환경=prod, 주문=7 → 주문 7 묶음
서비스=order, 환경=prod, 주문=8 → 주문 8 묶음
서비스=order, 환경=prod, 주문=9 → 주문 9 묶음
새 주문이 올 때마다 새 라벨 조합
```

라벨 값과 조합이 많이 생기는 높은 **카디널리티**는 stream과 작은 저장 덩어리를 늘려 부담을 키울 수 있다. 주문 번호나 traceId처럼 계속 새 값이 생기는 항목을 인덱스 라벨로 무조건 올리지 않는다. Prometheus의 시계열과 비슷한 주의점이지만 여기서는 로그 stream이다. [Loki 카디널리티](https://grafana.com/docs/loki/latest/get-started/labels/cardinality/)

### 03 · 묶음을 고른 뒤 주문 7만 남긴다

조회 화면에서 10:00~10:05를 선택했다고 가정한다. 서비스와 환경을 고른 뒤 해당 범위의 JSON 로그에서 주문 번호를 확인한다.

```text
시간 + 서비스/환경으로 후보 범위 선택
  → 기록 속 orderId 확인
  → 7인 기록만 남김
  → 주문 7의 payment_timeout을 읽음
```

먼저 범위를 좁히면 모든 서비스의 긴 기간을 무작정 읽는 일을 줄일 수 있다. 실제 조회 속도는 로그 양, 저장 방식과 설정에 따라 다르며 이 예시에서 측정한 것은 아니다.

<details>
<summary>LogQL로 쓰면 무엇이 입력되고 무엇이 남을까?</summary>

LogQL은 Loki의 조회 언어다. Java 코드나 캐시 라이브러리가 아니다. 조회 화면/API에서 사용하며, 이 예시는 LogQL을 지원하는 Loki와 연결된 조회 환경을 전제로 한다.

입력 기록은 다음과 같다. 시간은 기록의 타임스탬프에 있고 두 로그의 나머지 인덱스 라벨은 같다.

```json
{"orderId":"7","event":"payment_timeout"}
{"orderId":"8","event":"payment_success"}
```

조회 시간은 화면에서 선택하고, 아래는 로그를 거르는 식이다.

```text
{service_name="order", environment="prod"} | json | orderId="7"
```

중괄호는 실제 저장된 라벨로 묶음을 선택한다. `| json`은 본문의 JSON 필드를 조회 중에 꺼내고, `orderId="7"`은 꺼낸 값으로 거른다. 결과에는 첫 기록만 남는다. 조회 때 꺼낸 필드를 저장 시점의 인덱스 라벨로 바꾼 것은 아니다. 해당 이름과 라벨이 실제 설정에 없으면 그대로 복사해도 같은 결과가 나오지 않는다. [LogQL의 JSON 해석과 필터](https://grafana.com/docs/loki/latest/query/log_queries/)

</details>

### 04 · 그렇다면 Elasticsearch 대신 항상 Loki를 쓰면 될까?

아니다. 둘 다 로그를 조회할 수 있지만 검색을 준비하는 방식과 운영 구성이 다르다. 아래는 선택을 시작할 질문이지 기능을 독점한다는 표가 아니다.

| 자주 하는 일 | 검토할 기준 |
| --- | --- |
| 서비스와 시간으로 범위를 좁혀 사건 찾기 | Loki의 stream 선택과 본문 필터가 요구를 충족하는지 |
| 다양한 필드의 검색·집계, 단어와 문장 검색 | Elasticsearch/OpenSearch 계열의 매핑·인덱스·조회 설계가 요구에 맞는지 |
| 이미 운영하는 로그 경로가 있음 | 기존 구성에서 가능한지, 새 도구의 운영·이전 비용이 필요한지 |

Elasticsearch에서는 필드 용도를 정하는 **매핑(mapping)**이 중요하다. 문장을 분석해 단어로 찾는 `text`와 값 자체를 조건으로 찾는 `keyword`는 다르다. 모든 로그 필드가 같은 방식으로 인덱싱된다고 가정하지 않는다. OpenSearch의 구체적인 설정도 별도로 확인해야 한다. [text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/text), [keyword](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/keyword)

어느 쪽이 항상 더 싸고 빠르다고 결론 내리지 않는다. 실제 검색 조건, 보관 기간과 데이터량으로 조회 지연·누락·저장/운영 부담을 비교한 뒤 선택한다.

<details>
<summary>주문 번호를 본문 밖에 보관하거나 수집할 수도 있을까?</summary>

Loki의 **structured metadata**는 인덱스 라벨로 만들지 않고 로그에 부가 정보를 붙이는 기능이다. 자주 찾는 높은 카디널리티 값을 둘 수도 있다. 본문 JSON만이 유일한 방식은 아니다. 다만 저장 스키마와 인덱스 타입 등 지원 조건을 확인해야 한다. 자동으로 활성화됐거나 모든 환경에서 쓸 수 있다고 가정하지 않는다. [Structured metadata](https://grafana.com/docs/loki/latest/get-started/labels/structured-metadata/)

수집에 쓰는 Grafana Alloy 역시 별도 프로그램이다. 수집 설정을 준비해 실행하는 단계가 필요하고, Loki와 조회 화면을 대체하지 않는다. 예전 글의 Promtail은 2026-03-02 지원 종료(EOL) 상태다. 새 구성에서는 Alloy 등 현재 지원되는 클라이언트를 검토한다. 이번 게시에서는 설치나 기존 수집기 교체를 하지 않는다. [Promtail 상태](https://grafana.com/docs/loki/latest/send-data/promtail/), [Alloy](https://grafana.com/docs/alloy/latest/)

</details>

### 프로젝트 근거와 적용 범위

2026-10-09 로컬 PromptHub의 Fluent Bit와 Logstash ConfigMap을 대조했다. 컨테이너 로그를 읽어 전송하고 JSON을 해석·분기해 Elasticsearch로 출력하는 설정이 있다. Kubernetes 이름표를 읽는 설정이 있다는 사실은 Loki 인덱스 라벨을 구성했다는 뜻이 아니다.

YAML/CONF/JSON/Gradle/Dockerfile 검색 범위에서 Loki·Promtail·Alloy 구성을 찾지 못했다. 외부 환경에도 없다는 결론은 아니다. 이번 Loki 예시는 학습용 대안이며, 기존 로그 경로를 이전했거나 운영 조회·성능·비용을 검증한 기록은 아니다.

### 자기 말로 답해보기

주문마다 새 값이 생기니까 orderId를 인덱스 라벨로 만들지 않았다. 그러면 주문 7의 기록은 더 이상 찾을 수 없을까?

답 토글: 아니다. 서비스·환경·시간으로 범위를 좁힌 뒤 본문 필드를 해석해 orderId=7을 찾을 수 있다. 지원 조건에 맞으면 structured metadata도 검토할 수 있다.

## 조사 기록 — 내부용

- 공식 확인일2026-10-09. Loki 최신 안정 릴리스 v3.7.8, 문서 v3.7.x.
  https://github.com/grafana/loki/releases/tag/v3.7.8
- Promtail 지원 종료는 공식 페이지에서 2026-03-02로 확인. 오래된 Promtail 도입 예제를 그대로 쓰지 않는다.
- structured metadata는 chunkV4/schema13이상 및 tsdb 지원 조건이 공식 현재 문서에 있다.
  구체적인 설치 설정을 만들지 않으므로 본문은 조건 확인으로 한정한다.
- 조회 추출 라벨과 ingest 인덱스 라벨을 구분한다. 문자열 orderId와 실제 존재하는
  service_name/environment를 가정한 예시이며 LogQL 실행은 하지 않았다.
- 프로젝트는 fluent-bit.yaml의 ConfigMap 입력/필터/HTTP 출력과 logstash.yaml의
  gateway-access.conf/payment-audit-log.conf/pipelines.yml을 선택해 읽었다.
  전체 배포·권한·Secret과 원격 HEAD/운영 환경을 검증한 것은 아니다.
  내부 주소·인증 설정·식별자·컨테이너 경로 원문은 공개 본문으로 옮기지 않는다.
- 원본 설정에는 Kubernetes labels가 있다. 이를 Loki Label이나 Prometheus Label로 동일시하지 않는다.
- 기존 수집 글은 로그 이동, 메트릭 Label 글은 시계열 분류다. 신규 글은 Loki 인덱스 라벨 없이
  주문 번호를 조회할 수 있는지에 답한다. 일반 도구 선택은 짧은 보조 비교이며 설치 장문으로 확장하지 않는다.
- 승인 뒤 초안/공개MDX/관련diff/직접 인용 근거의 민감정보 자동 점검을 한다.
- 초안 단계에서는 실행 검증과 커밋을 하지 않았다. 승인 후 결과는 문서 상단에 기록했다.

## 적용 계획

신규MDX1개와 로드맵/테스트2파일, 승인 후 계획 기록만 변경한다.
트레이스 → Loki → UTC를 기존 연속 순서 테스트에 먼저 추가해 실패를 확인하고 구현한다.
기존 목록/탐색/렌더러를 재사용하고 기존 본문/URL/date, 새UI/스킬/백엔드/운영 구성은 건드리지 않는다.
구현 후 전체 테스트, 타입 검사, 격리 빌드, 메타데이터/참조/토글과 예시 입력→결과를 확인한다.
실제 LogQL 실행과 운영 비용 검증, 브라우저 화면 확인 수준을 별도로 보고한다.
