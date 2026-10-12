# Grafana 대시보드와 알림 — 게시 승인용 초안

상태: 사용자 승인 후 공개 MDX 두 편과 로드맵 적용·검증·로컬 커밋 완료. 조사일: 2026-10-08 (Asia/Seoul).

## 게시 범위

| 항목 | 글 1 | 글 2 |
| --- | --- | --- |
| 구분 / category | 신규 / cs | 신규 / cs |
| 제목 | 결제 오류가 늘었는지 한 화면에서 알아차리기 | 화면을 안 보고 있어도 결제 이상을 알게 하기 |
| slug | grafana-payment-dashboard | alert-evaluation-and-notification |
| 날짜 | 실제 게시일. 오늘 승인·게시하면 2026-10-08 | 실제 게시일. 오늘 승인·게시하면 2026-10-08 |
| 질문 | 결제 시간 초과가 늘었는지 어떤 숫자를 함께 볼까? | 어떤 상태가 얼마 동안 이어지면 누구에게 알릴까? |
| 한 줄 답 | 같은 시간 범위의 시간 초과 증가량과 전체 호출량을 함께 보고, 수집 상태도 확인한다. | 주기적으로 조건을 평가하고, 지속 시간과 알림 받을 곳을 별도로 정한다. |
| 최소 조건 | 해당 지표가 수집되고 Grafana가 Prometheus에 접근 가능하며 조회 범위와 단위가 맞는다. | Grafana 관리형 규칙의 조회·평가가 정상이며 알림 수신 설정과 전달 경로가 연결된다. |
| 선수 | cs/prometheus-metric-scraping, cs/metric-label-cardinality | cs/grafana-payment-dashboard |
| 다음 | 이번 묶음의 알림 글 | Kafka Lag 진단은 미작성 백로그로만 안내 |
| 실제 프로젝트 근거 | 주문 예약 Counter/Timer 코드, Kibana 대시보드 생성 설정 | 조사한 설정 파일에서 Grafana/Alertmanager 규칙은 찾지 못함. 구축 사례를 주장하지 않음 |
| 생성 파일 | content/study/cs/grafana-payment-dashboard.mdx | content/study/cs/alert-evaluation-and-notification.mdx |

함께 바꿀 파일은 `lib/study-roadmap.ts`와 `lib/study-roadmap.test.ts`다.
순서는 수치 수집 → Label → Grafana → 알림 → 기존 UTC 글로 연결한다.
승인 뒤 Code Planner의 승인 기록은 `docs/code-plans/2026-10-08-grafana-dashboard-and-alerting.md`에 저장한다.
기존 글 본문, UI, 스킬, 프로젝트 Learning Path, 백엔드와 운영 설정은 변경하지 않는다.

## 글 1 본문 초안

### 01 · 주문 7 말고도 결제가 자주 실패할까?

주문 7은 오전 10시 5분에 결제를 3초 기다리다가 시간 초과됐다. 로그로 그 사건은 찾았다. 이제 다른 결제 호출도 함께 실패하는지 보고 싶다.

**최근 시간 초과 횟수와 전체 호출량을 같은 범위에서 함께 본다.** 숫자를 모아 보여주는 화면이 대시보드다. Grafana는 이런 화면을 만드는 별도 프로그램이며 Java 기본 클래스나 캐시 라이브러리가 아니다. 아래는 실제 운영 화면이 아닌 학습용 스케치다. [Grafana 대시보드](https://grafana.com/docs/grafana/latest/visualizations/dashboards/)

### 02 · 누적 7을 그대로 올리면 질문이 달라진다

```text
앱의 누적 시간 초과 횟수
10:04:45  4 → 10:05:00  5 → 10:05:15  7

“지금 누적값은?”과 “최근 5분에 얼마나 늘었나?”는 다르다.
```

앞 글의 값이다. 이 세 점만으로 최근 5분의 증가량을 계산할 수는 없다. 다음 화면은 충분한 수집 기록에서 최근 5분 값을 조회했다고 가정한 별도 학습용 결과다. 실제 계산은 재시작과 수집 간격도 고려한다. [Prometheus 증가량 조회](https://prometheus.io/docs/prometheus/latest/querying/functions/)

### 03 · 같은 6번도 전체 호출량에 따라 다르게 보인다

```text
결제 상태 — 같은 시각에서 뒤로 5분
┌──────────────────────────────┐
│ 시간 초과 호출   약 6회       │
│ 전체 결제 호출   약 120회     │
│ 시간 초과 비율   약 5%        │
└──────────────────────────────┘
```

숫자 하나를 보여주는 작은 영역이 **패널**이다. 전체 호출량이 약 1,200회라면 같은 약 6회도 약 0.5%다. 횟수와 비율을 함께 보되, 무엇을 장애로 판단할지는 서비스 기준에 따라 정한다. 호출 기준이므로 재시도가 있으면 주문 수와 다를 수 있다.

이 예시는 모든 결제 호출을 같은 기준으로 한 번씩 기록하고, 전체 호출량이 0보다 크다는 조건이다. 시간 범위나 서버 범위를 다르게 잡으면 비율이 잘못될 수 있다.

### 04 · 내가 실제로 만드는 것은 보는 방법이다

```text
① Grafana에 숫자를 읽을 곳으로 Prometheus를 연결
② 새 패널에서 보고 싶은 지표를 조회
③ 숫자 또는 시간에 따른 그래프로 표시
④ 시간 범위·단위·제목을 정하고 대시보드 저장
```

숫자를 읽을 연결 설정이 **데이터 소스**다. Grafana를 설치했다고 앱의 숫자가 자동으로 수집되는 것은 아니다. 앞 글의 측정·수집 연결이 먼저 필요하다. 실제 메뉴는 버전에 따라 달라질 수 있다. [대시보드 만들기](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard/), [Prometheus 데이터 소스](https://grafana.com/docs/grafana/latest/datasources/prometheus/)

<details>
<summary>패널에 넣는 조회 문장은 어떻게 생겼을까?</summary>

PromQL은 Prometheus의 조회 문법이다. Java 코드가 아니다. 앞 글의 학습용 지표를 최근 5분 증가량으로 조회한다.

```text
sum(increase(payment_calls_total{outcome="timeout"}[5m]))
```

`increase`는 각 시계열의 증가량을, `sum`은 그 결과의 합을 구한다. 실제 운영에서는 환경·서비스 조건도 넣어 의도한 호출만 고른다. 전체 호출량 패널은 같은 범위에서 `outcome` 제한을 뺀 조회를 쓴다. 결과는 추정값으로 소수가 나올 수 있으며 정확한 거래 원장이 아니다. 오류 비율은 같은 범위의 두 증가량을 나누며, 분모 0과 데이터 누락 처리는 별도로 정한다. [increase의 동작](https://prometheus.io/docs/prometheus/latest/querying/functions/)

</details>

### 05 · 빈 화면은 “0건”이라는 뜻이 아니다

조회 범위, 지표 이름, Label 조건과 데이터 소스 연결을 확인한다. 오류가 없어서 0인 것과 측정 자료를 못 얻은 것은 다르다. 늘어난 시간 초과의 이유는 이 화면만으로 확정하지 않고 해당 시간의 로그와 추적으로 좁힌다.

### 프로젝트에서는 어디를 확인했나?

로컬 PromptHub 주문 서비스에서 예약 시도 Counter와 Redis 작업 Timer 코드를 확인했다. 프로젝트에는 Kibana 대시보드를 생성하는 설정도 있다. **Kibana 설정을 Grafana 구축 근거로 쓰지는 않는다.** 이번 결제 패널과 조회는 독립 학습 예시다. 실제 수집과 운영 화면, 원격 HEAD와 배포 상태는 미확인이다.

### 자기 말로 답해보기

시간 초과가 약 6회인데 전체 호출이 120회에서 1,200회로 달라졌다. 시간 초과 비율도 같을까?

답 토글: 아니다. 같은 측정 기준이면 약 5%와 약 0.5%다. 횟수만으로 서비스 영향을 같다고 볼 수 없다.

## 글 2 본문 초안

### 01 · 화면을 닫으면 누가 이상을 확인할까?

대시보드는 열어서 볼 때 도움이 된다. 하지만 담당자가 다른 일을 하는 동안에도 결제 시간 초과가 이어질 수 있다.

**Grafana의 알림 규칙이 주기적으로 숫자를 확인하고, 정한 상태가 이어지면 알릴 대상으로 전달한다.** 이번 글은 Grafana가 직접 평가하는 관리형 규칙의 학습 예시다. 대시보드를 만들었다고 알림까지 자동 완성되지는 않는다. [알림 평가](https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rule-evaluation/)

### 02 · “최근 5분”과 “1분 지속”은 다른 시간이다

예시 규칙은 최근 5분의 시간 초과 증가량이 5 이상인지를 20초마다 확인한다. 그 조건이 평가 때마다 1분 동안 유지되면 알림 대상으로 전환한다. **5회와 1분은 이해를 위한 값이지 운영 권장값이 아니다.**

```text
10:05:00  조회값 6 → 조건 충족, 대기 시작
10:05:20  조회값 7 → 대기 20초
10:05:40  조회값 8 → 대기 40초
10:06:00  조회값 9 → 1분 유지, 알림 대상
```

각 값은 그 시각에서 뒤로 5분을 본 조회 결과를 단순화한 학습용 숫자다. 앞 글의 30초 수집값으로 계산한 결과가 아니다. 대기 상태를 **Pending**, 알림 대상 상태를 **Alerting**이라고 한다. 이 판단은 주기적 평가 기준이지 매 순간을 끊김 없이 감시했다는 보장은 아니다. [평가 주기와 지속 시간](https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rule-evaluation/)

### 03 · 중간에 조건이 풀리면 다시 기다린다

```text
10:05:00  조회값 6 → 대기 시작
10:05:20  조회값 4 → 기준 미달, 대기 해제
10:05:40  조회값 6 → 새로 대기 시작
```

짧은 흔들림마다 호출받지 않도록 지속 시간을 둔다. 대신 너무 오래 기다리면 대응도 늦어진다. 평소 요청량, 고객 영향과 담당자가 취할 조치를 기준으로 조건을 정한다. [알림 설계 원칙](https://grafana.com/docs/grafana/latest/alerting/guides/best-practices/)

### 04 · 이상 판단과 메시지 도착은 다른 단계다

```text
규칙이 이상 판단
  ↓
누구에게 보낼지 선택
  ↓
이메일·메신저 등 전달 경로
  ↓
담당자가 수신하고 확인
```

알림 받을 곳의 설정이 **Contact point**다. 규칙에서 직접 고르거나, 여러 알림을 담당별로 나누는 **Notification policy**로 연결할 수 있다. 묶음 전송이나 일시 음소거, 전달 실패 때문에 Alerting 전환 시각과 실제 수신 시각은 다를 수 있다. [알림 전달 설정](https://grafana.com/docs/grafana/latest/alerting/fundamentals/notifications/)

메시지는 “결제 시간 초과 증가, 확인할 대시보드, 먼저 볼 로그와 담당 역할”처럼 행동으로 이어지게 쓴다. 실제 수신 채널과 자격증명은 이 글에 넣지 않는다.

<details>
<summary>패널과 알림 규칙은 같은 조회를 자동 공유할까?</summary>

패널에서 규칙을 만들면 일부 설정을 가져오고 화면을 연결할 수 있다. 하지만 이후 **패널 조회와 규칙 조회는 자동으로 동기화되지 않는다.** 화면 조건을 바꿨다면 규칙도 따로 확인한다. [패널과 알림 연결](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/link-alert-rules-to-panels/)

Prometheus 서버가 규칙을 평가하고 별도 Alertmanager가 알림을 전달하는 구성도 있다. Grafana 관리형 규칙과는 평가 주체가 다르다. Grafana 자체에도 알림 수신·전달용 Alertmanager가 포함되어 있으므로 외부 Alertmanager를 항상 추가 설치해야 한다는 뜻은 아니다. [Prometheus 알림 구성](https://prometheus.io/docs/alerting/latest/overview/), [Grafana 알림 구조](https://grafana.com/docs/grafana/latest/alerting/fundamentals/notifications/)

</details>

### 05 · 숫자를 못 가져왔을 때도 정책이 필요하다

**No Data**는 조회했지만 데이터가 없는 상태, **Error**는 조회·평가가 실패한 상태다. 둘을 “오류 0건, 정상”으로 뭉개지 않는다. Grafana 관리형 규칙에서는 이 경우의 동작을 따로 설정할 수 있다. [No Data와 Error](https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rule-evaluation/nodata-and-error-states/)

규칙의 정상·대기·알림 대상 전환과 수신 경로를 각각 시험해야 한다. 알림 판단이 맞더라도 메시지가 도착하지 않으면 담당자는 놓칠 수 있다. 이번 게시에서는 실제 채널로 시험 메시지를 보내지 않는다.

### 프로젝트 근거와 적용 범위

2026-10-08 로컬 프로젝트의 YAML/JSON/Java/Gradle/MJS 검색에서 Grafana, Alertmanager, PrometheusRule 설정을 찾지 못했다. 외부 운영 환경에도 없다는 결론은 아니다. 위 조건과 타임라인은 학습 설계이며 실제 장애나 기존 운영 정책을 재현한 것이 아니다.

### 자기 말로 답해보기

규칙 화면이 Alerting으로 바뀌었다. 담당자의 메신저에도 반드시 도착했을까?

답 토글: 아니다. 수신 대상 연결, 묶음·음소거 정책과 실제 전달 성공을 따로 확인한다.

## 조사와 확인 기록 — 내부용

- 2026-10-08 공식 다운로드 기본 안정 릴리스: Grafana 13.2.3, 2026-09-29. Nightly와 구분.
  출처: https://grafana.com/grafana/download . 문서 기준 v13.2 latest.
- 프로젝트 Grafana 사용 버전과 실제 배포 여부는 확인할 근거를 찾지 못했다.
- 기존 신호 글은 신호별 질문, Kibana 글은 검색 범위/설정 저장, Kafka 장문은 Grafana 도구 언급까지만 다룬다.
  이번 두 질문의 패널 구성·평가·전달 설명을 대체하지 않으므로 신규 두 편을 제안한다.
- 로컬 코드: order-service/.../MicrometerOrderProductReservationMetrics.java 전체 확인.
  Counter/outcome, Timer/operation/outcome/duration 구현. 실제 수집 결과는 확인하지 않았다.
- 로컬 설정: k8s/addons/elk/kibana-operations-dashboards.yaml의 생성 Job과 가져오기 구간 확인.
  공개 본문에 내부 주소, 리소스 이름과 접근 경로를 옮기지 않는다. Job 성공/대시보드 화면은 미확인.
- 파일명 검색: *grafana*, *prometheus*, *alert*, *dashboard*.
  내용 검색: grafana|alertmanager|prometheusrule, YAML/JSON/Java/Gradle/MJS로 한정.
  관련 설정 검색의 무결과를 전체 외부 환경 부재로 단정하지 않는다.
- 두 신규 slug는 기존 파일과 충돌하지 않는다. 승인 전에는 공개 링크를 만들지 않는다.
- 시각화: 글 1은 작은 화면 스케치와 설정 단계, 글 2는 지속 시간 타임라인과 전달 단계.
  복잡한 설치 그림과 새 UI는 생략. 코드 없이 핵심 답이 성립하도록 구성한다.
- 초안 범위 안전 검토: 학습용 숫자/이름만 사용. 공개 근거 문장에 내부 DNS·Secret·수신 주소 없음.
  승인 후 생성 MDX, 직접 인용 근거와 관련 diff를 다시 자동 검사한다.
- PromQL 실제 실행, Grafana 설치, 실제 알림 발송과 화면 검증은 하지 않았다.
  공개본 변환 시 회상 답과 선택적 설명을 details로, 선수/related를 메타데이터로 옮긴다.

## 적용 검증 기록

- 승인 계획: docs/code-plans/2026-10-08-grafana-dashboard-and-alerting.md.
- 신규 순서 테스트: 구현 전 1개 실패/14개 통과 → 연결 후 전체 88개/9파일 통과.
- npx tsc --noEmit 통과. 로드맵의 기존 함수와 UI는 변경하지 않았다.
- 생성 콘텐츠 두 편의 날짜/공개 상태/question/summary/선수·관련 링크/details/회상 질문 확인.
- 본문 코드 블록과 토글 균형, 내부 링크, 6/120=5%와 6/1200=0.5% 점검 통과.
- 공개 본문과 승인 초안의 민감정보 후보 검사 및 직접 인용 범위 검토 통과.
  내부 Kubernetes 주소는 공개 본문에 옮기지 않았다. 백엔드 파일은 읽기만 했다.
- 화면 스케치와 타임라인을 정적으로 검토했다. 브라우저 화면, PromQL 실행과 실제 알림 수신은 미확인.
- 격리 npm run build 통과. 사이트 전체 210개 재생성 중 신규 Study는 두 편이다.
  새 두 편의 정적 HTML 파일 생성과 로컬 개발용 생성 데이터 포함을 확인했다.
- 최종 승인 diff의 파일 범위/구문/민감정보 점검 통과. 승인 파일 5개만 `11be364`로 커밋했다.
  push하지 않았다. 내부 초안/인수인계/감사와 다른 작업의 변경은 커밋하지 않았다.
- 검증 임시 복사본을 삭제했다. node_modules 연결을 먼저 비재귀 제거한 뒤
  정확한 임시 경로와 남은 재분석 지점 부재를 확인했다. 원본 Next/Vitest 의존성은 보존했다.
  기존 개발 서버와 원본 .next는 건드리지 않았다. 실제 화면/규칙 평가/알림 수신은 미확인이다.
- 다음은 Kafka Lag 진단 초안 조사다. 미작성 글 링크를 공개 로드맵에 넣지 않는다.
