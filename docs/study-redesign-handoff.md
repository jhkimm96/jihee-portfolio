# Study 개편 인수인계와 다음 작업 순서

갱신: 2026-10-09 (Asia/Seoul). 작업 저장소: `C:/cowork/portfolio`.

## 다음 세션의 요청

아래 문서와 실제 워킹트리를 읽고, 기존 Study 개편을 아래 순서대로 이어간다. 이미 확정한
콘텐츠 방향을 처음부터 다시 선택하게 하지 않는다. 다음 작업에 필요한 부분만 확인하고,
승인된 범위는 파일마다 재승인받지 않는다. 새 범위의 여러 글은 한 번에 제안해서 승인받는다.

이 문서는 인수인계이며, 미승인 게시·커밋·push나 모든 기존 글의 일괄 재작성을 허가하지 않는다.

## 먼저 읽을 문서

- 전체 승인 설계: `docs/superpowers/specs/2026-10-06-study-publishing-roadmap-redesign.md`
- 최신 Study 작성 규칙: `docs/publishing/study-content-contract.md`
- 공통 게시 승인·민감정보 규칙: `docs/publishing/publish-contract.md`
- 게시 스킬 변경 계획: `docs/code-plans/2026-10-06-publishing-skill-contracts.md`
- 로드맵·상세 UI 구현 계획: `docs/code-plans/2026-10-06-study-roadmap-and-detail-ui.md`
- 최초 문제 조사: `docs/study-redesign-audit-2026-10-05/report.md`
- 현재 구조 집계: `docs/study-audit/2026-10-07-inventory.md`
- 현재 본문 검토 기록: `docs/study-audit/2026-10-07-body-review.md`
- 진행 중인 내부 편집 로드맵: `docs/study-audit/2026-10-07-editorial-roadmap.md`
- 우선 근거 검증·학습 순서·CS 백로그 대조: `docs/study-audit/2026-10-08-evidence-and-learning-plan.md`

전체 설계는 최초 승인 시점의 문서다. 후속 사용자 피드백은 최신 Study 작성 규칙에 반영됐다.
설계의 '예정 파일', 최초 76편 수와 파일럿 계획을 현재 완료 상태로 오해하지 않는다.

## 확정한 사용자 요구

- 본문은 비개발자도 '언제 필요하고, 어떻게 쓰며, 무엇이 달라지는지' 이해할 수 있게 한다.
- 시각적 예시가 메인이다. 짧은 장면을 스크롤하며 같은 사람·검색어·값의 변화를 따라간다.
- 한 Study는 핵심 질문 하나. 글 수보다 각 글의 이해 부담과 로드맵의 선수 순서가 중요하다.
- 사용 상황과 시각적 예시를 먼저 보여준다. 코드 없이도 핵심 원리와 효과가 이해되어야 한다.
- 최소 코드와 실행 변화는 그다음 단계. 문법 상세와 전체 구현은 토글에 둔다.
- 이해에 필수인 용어 설명이나 적용 조건은 토글로 숨기지 않는다.
- 기본 클래스도 안다고 가정하지 않는다. 언어 기본 제공/외부 라이브러리/자체 코드의 출처,
  설치 필요 여부, 직접 해주는 역할과 우리가 구현할 책임을 짧게 설명한다.
- 코드 설명은 실행 전 값·상태 → 몇 줄의 코드 → 실행 후 값·상태 → 결과를 연결한다.
  추상적인 화살표 흐름만 보여주지 않는다. 객체와 메서드, 보관함을 구분한다.
- 모든 글에 다이어그램이나 애니메이션을 강제하지 않는다. 작은 상태표가 더 쉬우면 사용한다.
- 발생 상황 → 원인 확인 → 적용과 검증을 조사한다. 개념·진단·구현을 필수 3부작으로 강제하지 않는다.
- 구현 기술은 프로젝트와 문제 계층에 맞게 선택한다. Java에 고정하지 않는다.
- 초안 작성 시 공식 자료와 프로젝트 근거를 확인한다. 설명 자료/SNS 수치를 사실처럼 옮기지 않는다.
- 실제 프로젝트 적용, 독립 학습 예제, 현재 위험, 운영 실측을 구분한다.
- 기존 URL과 작성일을 보존하고, 기존 긴 글은 필요하면 개요로 유지한다.
- 미작성 CS 계획은 내부 백로그다. 실제 글이 없는 공개 링크나 완료 상태를 만들지 않는다.
- 초안 승인 뒤 민감정보는 자동 점검한다. 후보가 없으면 별도 '없음' 답변을 요구하지 않는다.

## 현재 상태

### 2026-10-08 첫 근거 정정 묶음 반영

사용자가 5편 수정 초안을 함께 승인했다. JPA 컨텍스트/fetch, OSIV, S3, 워터마크,
데드락 기존 MDX를 수정했다. URL과 작성일은 유지했고 updatedAt=2026-10-08을 추가·갱신했다.
본문은 구체 장면과 결과 중심, 구현 발췌는 토글로 정리했다. 스킬과 로드맵 코드는 변경하지 않았다.

- 근거: 10/8 공식 자료 대조와 관련 로컬 코드 확인. 원격 HEAD·운영 실측은 미확인.
- 민감정보 자동 점검: 통과. 초안·5편 본문/인용 코드·관련 diff를 검토했다.
  재검증하지 않은 영상 수치와 미조치 프로젝트 위험의 상세 재현 정보는 공개 본문에서 제외했다.
- 테스트81개 통과(최초 EPERM 이후 권한 승인 실행으로 재확인), tsc --noEmit 통과,
  npm run build 통과. Velite 결과에서5편 slug·원래date·updatedAt을 확인했다.
- 화면 검증 미완료: 내장 브라우저가 localhost:4000을 ERR_BLOCKED_BY_CLIENT로 차단했다.
  다른 브라우저/프로토콜로 우회하지 않았다. 시험 서버 시작은 EADDRINUSE로 실패했으므로
  기존 4000 서버를 종료하지 않았다. 모바일 그림 크기·토글 실제 조작은 후속 확인 대상이다.
- 다음은 이5편의 실제 화면 확인과 Java 진입·CompletableFuture 설명 보완 범위 제안이다.
  공개 로드맵 재배치와 관측성 신규 글은 아직 적용하지 않았다.

2026-10-07 사용자 요청으로 임시 PNG/JPG 캡처, 게시 완료된 초안 두 개, B/C 비교 HTML과
그 비교 계획서를 백업 없이 삭제했다. 조사 보고서, 전체 설계와 실행용 Java 예제·테스트는 유지한다.

### 문서·스킬·UI

공통 계약 두 개를 작성했다. Codex와 Claude의 publish 계열 여섯 스킬이 공통 계약을 읽도록
정리했고, 두 publish-study 스킬이 같은 Study 계약을 참조하는 것을 확인했다.

Study의 question/prerequisites 메타데이터, 명시적 로드맵 순서, 상세 질문·한 줄 답·선수 글,
이전/다음 탐색을 구현했다. 주요 변경은 `lib/study-roadmap.ts`와 관련 페이지·컴포넌트다.

### 작성·개편한 파일

1. `content/study/cs/cache-stampede-and-single-flight.mdx` — 개념 파일럿
2. `content/study/cs/cache-miss-duplicate-load-diagnosis.mdx` — 새 진단 글, 시각적 본문으로 재편집
3. `content/study/cs/single-flight-shared-future.mdx` — 새 구현 글, 시각적 본문과 장면별 코드 토글
4. `content/study/cs/cancellation-propagation.mdx` — 기존 글 개편, 날짜 유지, updatedAt 추가

공개 순서는 캐시 개념 → 진단 → 구현 → 타임아웃/취소다. 콘텐츠 변경은 로컬 워킹트리에 있으며
이 작업에서 커밋·push·외부 배포하지 않았다. 자동으로 커밋하지 않는다.

독립 Java 예제와 검증 코드는 `docs/study-examples/SingleFlightExample.java`,
`SingleFlightExampleTest.java`다. 프로젝트 백엔드 자체는 수정하지 않았다.

### 확인 수준과 남은 검증

- 2026-10-07 재확인: 테스트 81개와 `tsc --noEmit`이 통과했다. 빌드는 실행 중인 dev 서버와
  `.next`를 공유하므로 이번에는 다시 실행하지 않았다.
- 기존 `lib/content-data.ts`의 `#site/content` export/import 빌드 경고가 남아 있다.
  빌드 통과를 무경고·운영 정상과 동일시하지 않는다.
- 2026-10-07 화면 검증(내장 브라우저, 1280×900·375×812, 모든 토글을 연 상태): 네 글 모두
  콘솔 오류·페이지 가로 넘침·깨진 그림이 없고, 이전/다음 연결은 캐시 개념 → 진단 → 구현 →
  취소 → '비동기로 바꿨는데 더 느려진 이유' 순서다. 코드 토글을 닫은 채로 각 장면의
  사용 상황과 '결과:' 문장만 읽어도 핵심 답을 따라갈 수 있다.
- 같은 검증에서 A·B를 나란히 둔 Mermaid 그림 6개(진단 1, 구현 3, 취소 2)가 모바일 본문
  폭(343px)을 넘어 가로 스크롤 안에서 B 쪽이 잘렸다. 해당 그림에 `nodeSpacing: 20, padding: 8`
  초기화를 넣고 긴 문구를 두 줄로 나눠 모두 343px 안에 맞췄다. 그림의 의미와 값은 바꾸지 않았다. 고유 크기 렌더링과
  확대 보기는 `components/markdown.tsx`의 의도된 설계라 CSS는 바꾸지 않았다.
- 작성일 표시: 상세 화면이 `updatedAt ?? date`만 보여줘 원래 작성일이 가려졌다. 사용자 결정에 따라
  2026-10-07부터 상세 상단은 'YYYY.MM.DD 작성 · YYYY.MM.DD 수정'으로 둘 다 보여준다
  (`components/post-article.tsx`의 선택 prop `updatedAt`, Study 상세만 전달). 목록 카드는 수정일 그대로다.
- 남은 문제(경미): Mermaid 어두운 테마의 화살표 문구 배경이 회색 상자로 보인다. 읽기에는
  지장이 없어 손대지 않았다. 토글 안 전체 Java 코드는 좁은 화면에서 가로 스크롤된다(코드라 허용).
- 주의: MDX를 연달아 저장하면 dev 서버(Turbopack)가 Velite가 다시 쓰는 중인
  `.velite/studyPosts.json`을 512KB 경계에서 읽어 'invalid utf-8' 오류를 내고 모든 Study가 500을
  반환할 수 있다. 두 번 재현됐다. 한 번은 파일 자체도 깨졌고, 한 번은 파일은 정상인데 읽기만 실패했다.
  MDX 하나를 다시 저장하면 복구된다. 여러 파일을 고친 뒤에는 JSON 유효성과 응답 코드를 확인한다.
- `npm run build`는 `next.config.mjs`가 Velite를 `clean: true`로 실행하고 `.next`를 쓰므로,
  사용자가 띄운 dev 서버와 같은 폴더에서 돌리지 않는다. 2026-10-07에는 scratchpad의 git worktree에
  변경 파일을 복사하고 `node_modules`를 junction으로 연결해 빌드했다.
- 2026-10-07 파일 목록상 Study MDX는 79개다(데드락 글 추가 후). 구조 집계와 79편 전체 본문 검토,
  진행 중인 내부 편집 로드맵을 `docs/study-audit/`에 저장했다. 본문 검토 대기는 없다.
  이는 기술 주장·프로젝트 현행 적용·화면 검증이 모두 완료됐다는 뜻이 아니다.
  시각화 적극 활용 기준을 공통 Study 계약에 보완했다. N+1·재고·데드락의 시각 보완은 아직 제안 단계다.

## 다음 진행 순서

### 1. 최신 파일럿 화면 검증 마무리 — 2026-10-07 완료

결과는 위 '확인 수준과 남은 검증'에 기록했다.

네 글의 실제 본문·토글·그림·이전/다음 연결을 데스크톱과 좁은 화면에서 확인한다.
코드를 건너뛰어도 사용 장면과 효과를 이해할 수 있는지 점검한다. 검증 결과와 남은 문제를 기록한다.
새 UI나 애니메이션을 추가하는 일을 먼저 시작하지 않는다.

### 2. 다른 유형 두 개로 범용성 검증 — 2026-10-07 작성 완료

사용자 승인 범위: 재고 글은 '개요 유지 + 데드락 1편 분리', N+1 글은 제안대로 개편.

- `jpa/n-plus-one-problem.mdx`: 날짜 유지·`updatedAt` 추가. 질문 '목록 하나 열었는데 왜 조회가 11번?'.
  상품 10개·판매자 상태표 → 묶어 가져오기 두 방식 → 조회 수로 확인 → 원격 호출 사례. EAGER 오해와
  컬렉션 fetch join + 페이징은 토글. 프로젝트 사실 정정: 2026-07-20 품질 점검의 판매자 gRPC N+1은
  '배치 API 권장'이 아니라 #440(`3255deb7`, 2026-07-21)에서 호출 자체 제거로 정리됐다.
- `database/stock-concurrency-control.mdx`: URL·날짜 유지. 본문은 Lost Update → 조건부 UPDATE
  한 질문으로 좁히고, 방법 비교표와 '고르는 세 질문'을 개요로 남겼다. 락·version·Backoff/Jitter·Redis
  사실은 토글로 보존했다. 모바일에서 581px이던 결정 흐름도는 같은 내용의 번호 목록으로 바꿨다.
  프로젝트 연결은 `ProductSalesCountService`의 조회-후-저장(`@Version` 없음, `7a4c363f`, 코드상 위험).
- 새 글 `database/deadlock-lock-ordering.mdx`(2026-10-07): 계좌 이체 교차 잠금 → PostgreSQL이 한쪽
  중단(`deadlock_timeout` 1초) → 번호 순 잠금. 영상의 '30회 중 30회' 수치는 사실로 옮기지 않고
  설명 자료 링크만 남겼다. `lib/study-roadmap.ts`의 database 순서에서 재고 글 다음에 넣었다.
- 범용성 관찰: 긴 비교 글은 '한 질문 본문 + 개요 표 + 사실 보존 토글'로 줄일 수 있었다. 짧은 글은
  상태표 두 개로 충분했고 다이어그램이 필요 없었다. 분기 많은 흐름도는 모바일에서 실패하므로
  번호 목록이 낫다. 공통 계약에 반영할지는 3단계 점검에서 반복 여부를 보고 정한다.
- 남은 백로그(공개 글 아님): Retry/Backoff/Jitter는 '장애 전파 방지' 계획에, Redis 원자 연산·분산 락은
  새 후보로 4단계 대조 때 함께 본다.

전체 승인 설계 11.2절의 후보를 사용한다.

- `content/study/database/stock-concurrency-control.mdx`: 비교가 많은 긴 글.
  독립 질문과 기존 관련 Study를 먼저 대조해 유지/연결/분리할 범위를 제안한다.
- `content/study/jpa/n-plus-one-problem.mdx`: 짧은 사례형 글.
  짧은 글을 불필요하게 늘리지 않고 비개발자용 장면과 결과를 연결할 수 있는지 확인한다.

게시 범위와 핵심 질문을 한 번에 제안하고 승인받은 뒤 개편한다. 새 파일 분리, 기존 결론 변경,
URL 변경은 파일럿 승인에서 자동으로 허가된 것으로 보지 않는다.

### 3. 전체 Study 점검과 내부 로드맵 작성

2026-10-08: 첫 우선5편의 핵심 주장과 ES 선수 주장2개를 공식 자료·관련 로컬 코드로 대조하고,
학습 순서 추천안과 CS 계획 전체 대조를 위10/8 문서에 저장했다. 남은 기술 검증은 그 문서에
명시했다. 외부 백엔드 Git HEAD 조회는 접근 거부였으므로 읽은 로컬 파일을 원격/배포 상태로
단정하지 않는다. 다음은 JPA 컨텍스트/fetch, OSIV, S3, 워터마크, 데드락의 수정 초안을 한 번에
제안하는 것이다. 공개 MDX와 로드맵 코드는 이번 조사에서 수정하지 않았다.

2026-10-07: 79편 본문 읽기와 파일별 편집 후보 기록 완료. 다음은 내부 로드맵의
우선 근거 검증, 시각 장면 보완 범위 제안, 중복·선수 순서와 미작성 CS 백로그 대조다.
이번 감사에서는 공개 MDX, 스킬, 애플리케이션 코드를 추가 수정하거나 커밋하지 않았다.

그때의 실제 파일 목록을 기준으로 기존 글을 하나씩 읽고 상태표를 만든다.
유지 / 설명 보완 / 개편 필요 / 개요 유지·분리 후보를 구분하고, 선수 관계·중복·근거 부족을 기록한다.
파일 길이만으로 판단하거나 전부 다시 쓰지 않는다.

비동기 이벤트 처리, Kafka 소비 흐름, DB 동시성 장문은 여러 짧은 학습 단위의 근거로 검토한다.
독립 글이 이미 있으면 새 글을 복제하지 않고 연결한다.

### 4. 미작성 CS 계획을 백로그와 대조

기존 Study에 이미 포함됐는지부터 확인한다. 아래는 사용자 공부 계획이지 작성 완료 목록이 아니다.
과거 9/28–10/23 일정은 지금의 게시일이나 확정 일정으로 사용하지 않는다.

1. 로그·관측성: 로그/메트릭/트레이싱, JSON 로그, traceId/spanId/eventId, ELK/OpenSearch,
   Kibana, Actuator, Prometheus label, Grafana/알림, Kafka Lag, OpenTelemetry/APM/Loki
2. 장애 전파 방지: Timeout, Retry, Backoff/Jitter, Circuit Breaker, Fallback, Bulkhead,
   Rate Limiting, Token Bucket/Bucket4j, Redis 분산 제한, HTTP 429, 패턴 비교
3. 배포·운영: Docker, Kubernetes Deployment/Service, ConfigMap/Secret/Probe,
   Resource Request/Limit, OOMKilled, YAML, CronJob, 배치 모듈, GC와 운영 점검
4. 정산·배치: 데이터 모델, 대사, 일별 배치, 실패 관리, 멱등 재처리, Spring Batch Job/Step, 결과 검증
5. 이후 심화: WebFlux/Reactive Streams/Backpressure/Netty, gRPC, MongoDB/S3,
   Ollama/RAG, Go, Rust, AX 개념 확인

제시됐던 '로그와 관측성 초안'은 이 작업에서 실제 파일이 제공·작성된 것으로 확인되지 않았다.
새 세션은 기존 문서에서 찾거나, 없다면 새 초안을 조사해 제안한다.

### 5. 검증된 학습 순서대로 작은 범위씩 개편·작성

내부 로드맵의 우선 구간을 정해 여러 글의 범위를 함께 승인받는다. 기존 글 개편과 미작성 주제
작성을 같은 로드맵에서 관리한다. 읽기 피드백으로 반복되는 실패가 확인되면 공통 계약을 보완한다.

## 작업 안전과 실행 참고

### 2026-10-08 후속 묶음 준비 상태

- 이전 우선5편 공개 변경은 `3558527`에 커밋됨. push하지 않았다.
- 테스트 81개, 타입 검사, 콘텐츠 빌드는 통과했다. localhost 브라우저가
  `net::ERR_BLOCKED_BY_CLIENT`로 차단돼 화면 검수는 미완료다. 우회해서 열지 않는다.
- 다음 묶음의 콘텐츠 초안과 적용 검증 기록:
  `docs/publishing/drafts/2026-10-08-java-visuals-observability.md`.
- 범위는 Java 코드 읽기, CompletableFuture, N+1, 재고 동시성 기존4편과
  로그/메트릭/트레이스, JSON 로그, 추적·이벤트 ID 신규3편이다.
- 사용자 승인 후 기존4편과 신규3편, 로드맵 두 파일에 적용했다. 승인된 계획은
  `docs/code-plans/2026-10-08-study-prerequisites-and-observability-order.md`다.
- 공개7편, 로드맵2파일과 승인 계획은 `c3fcb12`로 커밋했다. push하지 않았다.
  이 인수인계와 감사/초안 문서는 워킹트리에 남아 있으며 다른 작업의 초안과 섞어서 커밋하지 않는다.
- 정책 테스트4개 실패 확인 → 순서 데이터 변경 → 전체85개 통과. 타입 검사와 격리 빌드 통과.
  빌드203개는 기존 페이지를 포함한 전체 재생성 수이며, 신규 글 수는 3개다.
- Java21 예제 실행, 생성 콘텐츠7편, 선수/내부 링크와 민감정보 검사는 통과했다.
  화면과 Mermaid 브라우저 렌더링 검수는 미완료다. 기존4000번 서버는 종료·재시작하지 않았다.
- 공식 Java21 API, OpenTelemetry, W3C Trace Context, Spring Boot logging 문서를 조사했다.
  로컬 요청 ID 필터와 Gateway 키-값 로그 코드를 확인했지만 최종 JSON 출력이나
  분산 트레이싱·운영 수집 완료를 확인한 것은 아니다.
- drafts 폴더에는 다른 작업의 AI 워크플로 문서도 있다. 이번 범위에 포함하거나 덮어쓰지 않는다.
- 다음은 실제 화면 피드백을 확인한 뒤 관측성의 수집·검색 흐름, Actuator, 메트릭/대시보드,
  Kafka Lag 구간을 기존 글과 대조해 다음 묶음의 짧은 질문과 초안을 제안하는 것이다.

### 2026-10-08 관측성 두 번째 묶음 초안

- 수집·검색 흐름, Kibana Data View/Saved Objects, Actuator 준비 상태의 신규3편 초안을
  `docs/publishing/drafts/2026-10-08-observability-collection-discover-health.md`에 저장했다.
- 사용자 승인 후 신규3편과 로드맵 순서/정책 테스트에 적용했다. 백엔드와 기존 공개 글은 수정하지 않았다.
- 기존 검색 이벤트 파이프라인과 Graceful Shutdown 본문을 읽고 각각 행동 이벤트 상세,
  종료 중 요청 보호에 집중하도록 중복을 구분했다. 기존 두 글 개편은 이번 범위 밖이다.
- Fluent Bit/Logstash 수집 설정, Kibana Data View 파일과 가져오기 설정,
  주문 서비스의 Actuator 의존성/probe 경로를 로컬 파일에서 확인했다.
  실제 운영 수집·검색, 준비 상태 응답과 트래픽 제외 결과는 확인하지 않았다.
- 공식 Logstash/Kibana, Spring Boot/Kubernetes 문서를 대조했다. 최신 문서 버전과
  프로젝트 이미지/프레임워크 버전을 초안 내부 근거 기록에서 구분했다.
- 승인 범위: 신규3편과 `lib/study-roadmap.ts`, `lib/study-roadmap.test.ts`의 순서 연결.
  승인 계획은 `docs/code-plans/2026-10-08-observability-collection-discover-health.md`에 저장했다.
- 새 정책 테스트1개 실패 확인 → 연결 후 전체86개 통과. TypeScript 검사와 격리 빌드 통과.
  빌드206개는 기존 사이트 전체 재생성 수이고 신규 Study는 3개다.
- 생성 콘텐츠3편의 메타데이터/공개 상태/선수·관련 링크/토글과 민감정보 점검 통과.
  화면/Mermaid 렌더링과 실제 운영 수집·검색/probe 동작 검수는 미완료다.
- 승인된 공개3편, 로드맵2파일과 승인 계획은 `8c828a1`로 커밋했다. push하지 않았다.
  격리 빌드 임시 폴더만 삭제했고 원본 의존성과 기존4000번 서버는 보존했다.
  로컬 개발용 생성 데이터에도 새3편이 포함되어 있다. 내부 초안과 인수인계/감사 문서는
  다른 작업과 섞어서 커밋하지 않고 워킹트리에 남겼다.
- 다음 백로그는 Prometheus 메트릭/label → Grafana/알림 → Kafka Lag → 추적 도구다.
  미작성 글은 아직 공개 로드맵의 링크로 넣지 않는다.

### 2026-10-08 Prometheus와 Label 초안

- `docs/publishing/drafts/2026-10-08-prometheus-metrics-and-labels.md`에 신규2편 초안을 저장했다.
  사용자 승인 후 공개 Study2편과 로드맵 순서/정책 테스트에 적용했다. 백엔드는 수정하지 않았다.
- Counter 증가와 Prometheus 수집은 다른 단계로 설명하고, 제한된 결과 Label과
  주문 번호별 Label의 조합 증가를 짧은 시각 장면으로 나눈다.
- 로컬 주문 예약/만료의 Micrometer 구현, enum 분류, 호출부와 식별자 tag 제외 테스트 소스를 읽었다.
  외부 백엔드 테스트 실행이나 운영 수집을 확인한 것은 아니다.
- 검색한 Gradle/Java/YAML/TOML 파일에서 Prometheus registry/수집 연결 일치 파일을 찾지 못했다.
  외부 운영 환경에 없다는 단정은 하지 않는다. 검색 범위/최신 안정 버전은 초안 내부 기록에 남겼다.
- 승인 범위: 신규2편과 로드맵 순서/테스트 두 파일. 기존 Actuator → Graceful Shutdown 연결은
  유지하고 그 뒤에 수집 → Label을 넣었다. 승인 계획은
  `docs/code-plans/2026-10-08-prometheus-metrics-and-labels.md`에 저장했다.
- 새 정책 테스트1개 실패 확인 → 연결 후 전체87개 통과. TypeScript 검사 통과.
  공개 초안/MDX의 링크/구문/민감정보와 생성2편의 메타데이터/공개 상태/선수·관련 링크를 확인했다.
- 확인한 로컬 Gradle 캐시에 Micrometer core JAR이 없어 Java 예제 실행은 하지 않았다.
  공식 API와 예시 숫자는 점검했으며 새 의존성을 설치하지 않았다.
  화면/Mermaid 렌더링과 실제 운영 수집 검증은 미완료다.
- 격리 콘텐츠 빌드와 신규2편 정적 페이지 생성 확인 완료. 사이트 전체208개 재생성 중 신규 Study는 2개다.
- 승인된 공개2편/로드맵2파일/승인 계획은 `075c130`으로 커밋했다. push하지 않았다.
  승인 diff의 민감정보 점검 통과. 검증 임시 폴더만 삭제했고 원본 의존성과 기존4000번 서버는 보존했다.
  로컬 개발용 생성 데이터에도 새2편이 포함되어 있다. 내부 초안/감사와 다른 작업의 변경은 커밋하지 않았다.
- 그다음은 Grafana/알림 → Kafka Lag → 추적 도구의 미작성 백로그다.

- 현재 워킹트리에 이 작업과 다른 작업의 변경이 섞일 수 있다. 시작할 때 실제 diff를 확인한다.
  광범위한 stage/reset이나 관련 없는 수정은 금지한다.
- 코드를 수정·검토하면 사용자 AGENTS.md에 따라 ponytail과 write-readable-code를 읽고 적용한다.
  Study 게시·보완은 publish-study와 두 공통 계약을 읽는다.
- 외부 백엔드 `C:/programmers_prj/beadv6_6_3JMT_BE`는 근거 확인용이다. 별도 요청 없이 수정하지 않는다.
- 프로젝트 근거 링크는 `7a4c363f` 커밋 기준이다. 최신 주장으로 쓸 때 현행 코드와 대조한다.
- Java의 Future 취소와 CompletableFuture 취소를 섞지 않는다. CompletableFuture.cancel(true)는
  실제 계산 스레드의 interrupt를 수행하지 않는다.
- 공유 Future 취소, 진행 중 등록 삭제, 호출자 대기 포기, 원본 HTTP 종료는 서로 다른 동작이다.
- 로컬 개발 서버는 4000 포트다. 세션 ID/PID는 인수인계하지 않는다. 실제 상태를 확인해 재사용한다.
- 같은 .next 출력에 dev와 build를 동시에 실행하면 충돌할 수 있다. 자신이 시작한 서버만
  확인 후 중단하고, 검증 뒤 다시 실행한다. 알려지지 않은 프로세스를 임의로 종료하지 않는다.
- 결과에는 실제 검증 수준과 민감정보 점검 범위를 남긴다. 화면 미확인을 완료라고 보고하지 않는다.

### 2026-10-08 Grafana와 알림 묶음 완료

- 승인 초안: `docs/publishing/drafts/2026-10-08-grafana-dashboard-and-alerting.md`.
- 신규2편: `cs/grafana-payment-dashboard`, `cs/alert-evaluation-and-notification`.
  대시보드의 횟수/전체 호출량/비율과 알림의 평가/지속/전달을 다른 질문으로 설명한다.
  화면 스케치와 타임라인을 사용하고 조회 문법과 구성 차이는 토글에 둔다.
- 프로젝트의 주문 예약 Counter/Redis Timer 코드와 Kibana 대시보드 생성 설정을 확인했다.
  Kibana 설정을 Grafana 구축 근거로 쓰지 않는다. 검색 범위에서 Grafana/Alertmanager/
  PrometheusRule 설정을 찾지 못했지만 외부 환경에도 없다고 단정하지 않는다.
- 최신 공식 다운로드 안정 버전13.2.3과 v13.2 문서 기준. 프로젝트 Grafana 버전/배포는 미확인.
- 승인된 로드맵/테스트 두 파일에는 Label → Grafana → 알림 → 기존 UTC 순서만 추가했다.
  새 함수/UI/스킬/백엔드 변경, 설치와 실제 알림 발송은 없다.
- 순서 테스트1개 실패 확인 → 전체88개 통과. 타입 검사와 격리 빌드 통과.
  전체210개 페이지 재생성 중 신규 Study는2편이다. 두 HTML 생성/메타데이터/내부 링크/details,
  예시 산술/지속 시간/승인 diff와 민감정보 자동 검사 통과.
- 공개2편/로드맵2파일/승인 계획은 `11be364`로 커밋했다. push하지 않았다.
  내부 초안·감사·인수인계와 다른 작업의 변경은 워킹트리에 남긴다.
- 검증용 임시 복사본은 삭제했고 원본 의존성과 기존 개발 서버는 보존했다.
  브라우저 화면, PromQL 실행, 실제 규칙 평가와 알림 수신 검증은 하지 않았다.
- 다음: Kafka Lag 원인 진단 → OpenTelemetry/APM → Loki/로그 도구 선택.
  이후 장애 보호 → 배포/운영 → 정산/배치. 기존 글을 먼저 대조하고 작은 묶음씩 승인받는다.

### 2026-10-08 Kafka Lag 진단 완료

- 승인 초안: `docs/publishing/drafts/2026-10-08-kafka-lag-diagnosis.md`.
- 신규 `cs/kafka-lag-diagnosis`: 주문 알림 지연을 저장 위치, 유입/처리 비교,
  파티션 편중, 실패·대기 근거와 실제 업무 회복 확인으로 설명한다.
- 기존 `msa/kafka-offset-lag-reprocessing-idempotency`는 원래 date/URL 유지,
  updatedAt과 related 추가, committed Offset과 records-lag-max 기준 차이만 보완.
- 로드맵은 Label → Grafana → 알림 → Kafka 진단 → 기존 UTC.
  UI/스킬/백엔드/프로젝트 Learning Path와 운영 설정은 변경하지 않았다.
- Kafka 4.3.1/Spring Kafka 4.1.1 공식 문서와 로컬 알림 Consumer/Handler/설정/
  설정 테스트 소스를 대조했다. 실제 배포 버전, Lag와 개선 효과는 미확인.
- 테스트 1개 실패 확인 → 전체 88개 통과, 타입 검사/격리 빌드 통과.
  전체 211개 페이지 중 신규 Study는 1편. 생성 메타데이터/HTML/링크/details,
  예시 계산과 승인 범위 민감정보 자동 점검 통과.
- 승인된 공개 글 2파일/로드맵 2파일/계획은 `d096821`으로 커밋, push 없음.
  내부 초안/감사/인수인계와 다른 작업은 커밋하지 않았다.
- 검증 임시 복사본 삭제. 원본 node_modules와 기존 개발 서버 보존.
  로컬 dev 생성 데이터에 신규 글 포함. 브라우저 화면/운영 Kafka/백엔드 테스트 미검증.
- 다음은 OpenTelemetry/APM → Loki/로그 도구 선택 조사와 작은 묶음 초안 승인이다.

### 2026-10-09 OpenTelemetry/APM 시간표 완료

- 승인 초안: `docs/publishing/drafts/2026-10-09-opentelemetry-trace-waterfall.md`.
- 신규 `cs/opentelemetry-trace-waterfall`: 주문7 시간표로 포함 관계, 긴 구간과 원인 구분,
  OpenTelemetry/Collector/APM 역할과 sampling/계측/전송 누락을 설명한다.
  실제 운영 화면이 아닌 학습용 정적 시간 막대와 단계 그림이다.
- 기존 본문/URL/날짜와 UI/스킬/백엔드/프로젝트 Learning Path는 변경하지 않았다.
  Kafka 진단 → 트레이스 시간표 → 기존 UTC로 연결했다.
- Java agent/instrumentation2.32.0, SDK1.66.0, Spring Boot4.1.1 공식 자료 확인.
  프로젝트 Boot설정4.1.0과 RequestId 필터/자동 등록/테스트 소스를 대조했다.
  요청ID 기능을 분산 추적 구축 근거로 쓰지 않는다. 실제 tracing 의존성과 배포는 미확인.
- 순서 테스트1개 실패 확인 → 전체88개 통과. 타입 검사와 격리 빌드 통과.
  전체212개 페이지 중 신규Study1편. 외부 폰트 캐시 시간 초과 경고가 있었으나 exit0.
  생성 메타데이터/HTML/선수·이전·다음 링크/details와 시간 산술, 승인 범위 민감정보 점검 통과.
- 공개MDX/로드맵/테스트/계획4파일 커밋 `73fbee7`, push 없음.
  내부 초안·감사·인수인계와 다른 작업은 커밋하지 않았다.
- 검증 임시 폴더 삭제. 원본 의존성과 기존 개발 서버 보존. 로컬 dev 생성 데이터에 새 글 포함.
  브라우저 화면, 백엔드 테스트 실행, 실제 agent/Collector와 분산 추적 수집은 미검증.
- 다음은 Loki/로그 도구 선택 조사 → 작은 초안 묶음 승인 → 반영/검증이다.
  이후 장애 보호 → 배포/운영 → 정산/배치. 미작성 주제의 공개 링크는 만들지 않는다.

### 2026-10-09 Loki 라벨과 로그 검색 완료

- 승인 초안: `docs/publishing/drafts/2026-10-09-loki-labels-and-log-search.md`.
- 신규 `cs/loki-labels-and-log-search`: 동일 주문7/8/9의 로그 묶음과 주문별 라벨 분리를 비교하고
  시간/서비스/환경 → 본문 주문번호 조회를 설명한다. 문법과 structured metadata/Alloy는 토글.
- 기존 콘텐츠 본문/URL/date와 UI/스킬/백엔드/프로젝트 Learning Path는 변경하지 않았다.
  트레이스 → Loki → 기존 UTC로 연결했다.
- 공식 Loki 안정3.7.8/v3.7.x 문서와 Promtail의2026-03-02 지원 종료를 확인했다.
  로컬 Fluent Bit/Logstash ConfigMap의 수집·JSON 해석·분기·Elasticsearch 출력 설정과 대조.
  Kubernetes labels를 Loki 인덱스 라벨로 동일시하지 않는다. Loki 구축/이전/효과는 주장하지 않는다.
- 순서 테스트1개 실패 확인 → 전체88개 통과, 타입 검사와 격리 빌드 통과.
  전체213개 페이지 중 신규Study1편. 생성 메타데이터/HTML/선수·이전·다음 링크/details와
  JSON 예시 결과, 승인 범위 민감정보 점검 통과. 실제 LogQL 실행과 브라우저 화면은 미검증.
- 공개MDX/로드맵/테스트/계획4파일 커밋 `abab328`, push 없음.
  내부 초안/감사/인수인계와 다른 작업은 커밋하지 않았다.
- 검증용 임시 복사본 삭제, 원본 의존성과 기존 개발 서버 보존. 로컬 dev 생성 데이터에 새 글 포함.
- 다음: 장애 전파 방지의 기존 Timeout/Retry/Backoff/Jitter/Breaker/Fallback/Bulkhead 관련 글을
  먼저 대조하고, 누락 질문에만 짧은 초안 묶음을 제안한다. 승인 전 공개 변경은 하지 않는다.
  이후 배포/운영 → 정산/배치. 관측성 주제 게시 완료가 실제 운영 구성 검증 완료를 뜻하지 않는다.

### 2026-10-09 Retry 대기와 전체 요청 예산 완료

- 승인 초안: `docs/publishing/drafts/2026-10-09-retry-backoff-jitter-budget.md`.
- 신규 `cs/retry-backoff-jitter-budget`: 서버 A~E의 상품 7 조회로 5→15회 호출,
  Backoff/Jitter와 2초 전체 예산을 설명한다. 숫자는 학습 예시이며 권장값/실측이 아니다.
- 기존 비동기 기초 글은 7절 timeout 안전 조건 두 문단, related와 updatedAt만 보완했다.
  기존 date/URL 유지. 취소와 재고 글은 연결만 한다. Loki → Retry → UTC로 연결.
- 공식 AWS Retry/Backoff/멱등성과 Resilience4j 2.4.0을 확인하고 로컬 결제 설정/분류/
  Gateway/테스트 소스를 대조했다. 최대 2회/고정 500ms 설정을 Jitter 구현으로 쓰지 않는다.
  직접 cause timeout 제외를 모든 중첩 예외 제외로 과장하지 않는다. 테스트는 읽기만 했다.
- 순서 테스트 1개 실패 확인 → 전체 88개 통과. 타입 검사 및 격리 빌드 통과.
  전체 214페이지 중 신규 Study 1편. 외부 폰트 캐시 시간 초과 경고가 있었으나 exit0.
  생성 메타데이터/HTML/선수·이전·다음/토글/계산과 승인 범위 민감정보 점검 통과.
- 공개 콘텐츠 2파일, 로드맵/테스트 및 승인 계획의 5파일 커밋 `32e839b`, push 없음.
  내부 기록과 다른 작업은 커밋하지 않았다. 검증 임시 폴더 삭제, 원본 의존성/개발 서버 보존.
- 브라우저 화면, 실제 결제 Retry와 운영 부하 효과, 런타임 의존성/배포 설정은 미검증.
- 다음은 Circuit Breaker/Fallback/Bulkhead의 기존 글과 프로젝트 근거 대조 및 짧은 초안 승인.
  이후 Rate Limiting → 배포/운영 → 정산/배치. 미작성 주제는 공개 링크로 만들지 않는다.

### 2026-10-09 Circuit Breaker 차단과 회복 확인 완료

- 승인 초안: `docs/publishing/drafts/2026-10-09-circuit-breaker-open-and-recovery.md`.
- 신규 `cs/circuit-breaker-open-and-recovery`: 서버 A의 상품 7 조회로 최소 4건/실패율 50%,
  CLOSED 허용/OPEN 차단/HALF_OPEN 제한된 회복 확인을 설명한다. 숫자는 학습용이며 권장값이 아니다.
- 기존 글 본문/date/URL 유지. Retry → Circuit Breaker → UTC로 연결했다.
  UI/스킬/백엔드/운영 설정/프로젝트 Learning Path는 수정하지 않았다.
- Resilience4j 공식 문서/v2.4.0 구현/릴리스와 Microsoft 패턴을 대조했다.
  프로젝트 설정/실패 분류/외부 호출 래퍼 및 관련 테스트 소스를 읽었으며 실행하지 않았다.
  slow-call 기준과 Timeout, 실패 판정 false와 ignore, 내부 Retry의 기록 단위를 구분했다.
  서버별 메모리 상태를 전체 서버 공통 상태로 설명하지 않는다.
- 순서 테스트 1개 실패 확인 → 전체 88개 통과, 타입 검사/격리 빌드 통과.
  전체 215페이지 중 신규 Study 1편. 메타데이터/HTML/선수·이전·다음/링크/토글/산술과
  승인 범위 민감정보 점검 통과. 브라우저 화면/실제 결제 차단·복구·부하 효과는 미검증.
- 공개 콘텐츠/로드맵/테스트/승인 계획 4파일 커밋 `08c0ebd`, push 없음.
  내부 기록/다른 작업은 커밋하지 않았다. 검증 임시 폴더 삭제, 원본 의존성과 개발 서버 보존.
  개발 서버 생성 데이터에 새 글 포함을 확인했다.
- 다음은 Fallback(실패할 때 어떤 대체 결과를 보여줄 수 있는가)의 근거 조사와 초안 승인.
  이후 Bulkhead → Rate Limiting → 배포/운영 → 정산/배치. 미작성 공개 링크는 만들지 않는다.

### 2026-10-09 Fallback 대체 응답의 안전 조건 완료

- 승인 초안: `docs/publishing/drafts/2026-10-09-fallback-safe-results.md`.
- 신규 `cs/fallback-safe-results`: 자동완성 생략과 상품 0개의 의미 차이,
  안전한 대체의 조건과 DB 부하 이동을 짧은 장면/비교표로 설명한다.
- PromptHub ProductQueryService의 검색/RDB 및 빈 제안 경로,
  QueryEmbeddingCache와 검색 Querier의 단어 검색 경로를 대조했다.
  프로젝트 테스트는 소스만 확인했다. 넓은 RuntimeException catch를 권장 규칙으로 쓰지 않는다.
- AWS 공식 graceful degradation/일본어 Builders' Library와 Java 21 List API 확인.
  화면 장면은 학습 설계 예시이며 실제 프런트엔드 동작/장애/대체 DB 용량은 미검증.
- 기존 글/URL/date 유지, Breaker → Fallback → UTC 연결. UI/스킬/백엔드 변경 없음.
- 최초 순서 테스트 1개 실패 → 전체 88개 통과, 타입 검사 및 격리 빌드 통과.
  전체 216페이지 중 신규 Study 1편. 생성 메타데이터/HTML/링크/토글/민감정보 점검 통과.
- 승인 4파일 커밋 `f722222`, push 없음. 다른 변경과 내부 기록은 커밋하지 않았다.
  검증 임시 폴더 삭제. 정리 중 Junction Target 문자열 타입 점검 오류가 있었으나
  링크 자체만 비재귀 삭제했고, 사후 점검에서 원본 Next/Vitest/TypeScript와 의존성 보존 확인.
  개발 서버 콘텐츠에 새 글 포함 확인. 브라우저 화면은 미검증.
- 다음은 Bulkhead 근거 조사/기존 글 대조/초안 승인, 이후 Rate Limiting → 배포/운영 → 정산/배치.

### 2026-10-09 Bulkhead 게시 완료와 Rate Limiting 초안 대기

- 신규 `cs/bulkhead-concurrent-call-isolation`: 처리 자리 6개/결제 최대 2개로 독점과
  입장권 반납을 설명했다. 숫자는 학습용이며 프로젝트 전용 스레드 풀 구현으로 쓰지 않는다.
- 공식 Microsoft/Resilience4j 및 v2.4.0 구현/릴리스, 결제 설정/Gateway/테스트 소스를 대조했다.
  테스트는 읽기만 했으며 운영 장애 격리 효과는 미검증이다.
- 최초 순서 테스트 1개 실패 → 전체 88개 통과, 타입 검사/격리 빌드 통과.
  전체 217페이지 중 신규 Study 1편. 생성 데이터/HTML/연결/토글와 민감정보 점검 통과.
- 승인 4파일 커밋 `277d3ed`, push 없음. Fallback → Bulkhead → UTC 연결.
  검증 임시 폴더 삭제, 원본 의존성과 개발 서버 보존. 기존 본문/UI/스킬/백엔드 변경 없음.
- 사용자의 “다음 바로” 요청으로 Rate Limiting 조사와 초안까지 이어갔다.
  `docs/publishing/drafts/2026-10-09-rate-limiting-request-budget.md` 승인 대기. 공개 파일 미작성.
- 다음 초안은 동시 호출과 구간 호출량, 고정 구간 한도 갱신, 사용자별/서버별 제한을 구분한다.
  프로젝트는 승인용 외부 호출량 제한이며 PG_RATE_LIMITED의 503 선언을 사용자별 429 구현으로 쓰지 않는다.
  Retry의 호출권 소비/뒤쪽 Bulkhead 거절에도 호출권 사용/서버별 한도 합계 경계를 기록했다.
- 이후 Token Bucket/Bucket4j → Redis 분산 제한 → 배포/운영 → 정산/배치 순서로 조사한다.

### 2026-10-09 Rate Limiting 게시 완료

- 신규 `cs/rate-limiting-request-budget`: 순차 결제5건/구간 호출권3개로 동시 진행과
  구간 호출량을 구분하고, 종료 때 반납되지 않는 호출권과 다음 구간 갱신을 설명했다.
- Resilience4j 문서/v2.4.0 구현, RFC6585와 Kong 고정 구간 경계 몰림을 대조했다.
  프로젝트 승인 경로 설정/래퍼/테스트와 PG_RATE_LIMITED의 503 선언을 구분했다.
  실제 백엔드 테스트, HTTP 응답/운영 효과는 미검증이다.
- 기존 본문/URL/date 유지, Bulkhead → Rate Limiting → UTC 연결. UI/스킬/백엔드 변경 없음.
- 최초 순서 테스트 1개 실패 → 전체 88개 통과. 타입 검사/격리 빌드 통과.
  전체 218페이지 중 신규 Study 1편. 생성 데이터/HTML/연결/토글/민감정보 점검 통과.
- 승인 4파일 커밋 `ef913e6`, push 없음. 내부 기록과 다른 작업은 커밋하지 않았다.
  검증 임시 폴더 삭제, 원본 의존성과 개발 서버 보존. 브라우저 화면은 미검증.
- 현재 장애 보호 백로그는 4묶음: Token Bucket/Bucket4j, Redis 분산 제한,
  HTTP429/외부 API 실패 대응, 보호 패턴 종합 비교. 새 글 편수 확정은 아니다.
  이후 배포/운영과 정산/배치. 기존 Study 전체 재검증/개편 완료와 구분한다.

### 2026-10-09 장애 보호 백로그4묶음 완료 — 이후 일괄 진행 권한

- 사용자가 “계속이어서 해줘 승인다승인이여 알아서 다 진행해줘”라고 명시했다.
  기존 CS 백로그 범위는 초안마다 재승인 질문 없이 조사/편집/게시한다.
  근거 충돌/민감정보/외부 시스템 변경/새로운 범위 확대는 확인. push/백엔드 수정은 권한에 포함하지 않는다.
- 신규4편: token-bucket-and-bucket4j, redis-shared-rate-limit,
  http-retry-after-and-failure-response, resilience-pattern-boundaries.
- 공식 Bucket4j8.21/Redis Lua·INCR·복제/RFC6585·9110/개별 패턴 문서를 대조했다.
  Redis 공유 제한과 Bucket4j는 프로젝트 미사용 검색 범위와 학습 예제로 구분한다.
- 최초 순서 테스트1개 실패 → 전체88개/타입/격리 빌드 통과. 전체222페이지 중 신규4편.
  메타데이터/HTML/연결/토글/민감정보 점검 통과. 최초 링크 점검식의 배열 결합 오류를 수정해 재검사했다.
- 승인7파일 커밋 `e644f4f`, push 없음. 원본 개발 서버/의존성 보존. 임시 빌드 폴더 삭제.
  화면/Java 예제 실행/실제 Redis·PG 부하·장애 효과 미검증.
- 현재 장애 보호 구간은 완료. 배포/운영 기존 글과 실제 Dockerfile/product 매니페스트/settlement CronJob 및 Batch Config를 읽기 시작했다.
  현재 저장소에는 settlement CronJob 파일이 있다. 과거 “파일 없음” 문구를 현재 사실과 구분해 보완할 예정.
- 배포/운영과 정산/배치는 미완료. 79편 전체 재검증/개편 완료라는 뜻은 아니다.

### 2026-10-09 배포/운영과 정산/배치 완료 — 핵심 CS 백로그 학습 연결 마감

- 위 미완료 상태를 이어 처리했다. 기존6편(Docker/Pod/Deployment/Service/설정/Chunk)은 URL/date 유지하고 updatedAt10/9로 보완.
- 신규9편: Kubernetes 자원/OOM/CronJob/운영 검증4편, batch 카테고리의 모델/기간/대사/실패 전달/Job 재시작5편.
  로드맵 마지막6단계 정산과 배치 추가. 기존 Spring Chunk URL 이동 없음.
- 공식 Docker/Kubernetes/Java21/Spring Batch안정판6.0.5/Stripe 대사·멱등 계약과
  직접 관련 프로젝트 소스를 대조. 프로젝트는 주간, 일별은 학습 설계로 구분.
  집계 대사/원본 연결 대사의 한계, 계산/업무 완료/전달 완료와 실제 지급을 구분.
- 새 정책 테스트3개 실패 확인 → 전체91개 통과, 타입/격리 빌드 통과.
  전체232페이지는 신규 Study9편 + 신규 카테고리1개를 포함한다. 232편 Study라는 뜻이 아니다.
- 15편 HTML/메타데이터/토글/앞뒤·선수·관련 링크/원본 날짜/공개 민감정보 자동 검사 통과.
  초기 격리 설정 복사 누락과 로드맵 초기 렌더링에 맞지 않은 검증식을 수정해 재확인.
- 승인20파일 커밋 f946379, push 없음. 내부 기록/기존 다른 변경은 커밋하지 않음.
  임시 빌드 복사본 삭제. 원본 개발 서버/의존성 보존.
- 핵심 주제 대조: docs/study-audit/2026-10-09-core-backlog-coverage.md.
  승인된 핵심 CS 계획은 공개 학습 연결 완료. 이번 이어진 작업 합계 신규13편/기존6편.
- 남은 별도 범위: 유예된 심화9주제, 원본79편 전체 주장 재검증·시각 QA,
  실제 배포/장애/배치/정산 실행·운영 성과 검증. 이것들을 완료로 표시하지 않는다.
  다음에는 사용자 읽기 피드백 또는 원본 감사 편집 후보를 대상으로 범위를 이어 정한다.

### 2026-10-09 기존 CS 근거 보완1차 완료

- 사용자의 후속 “다음”으로 기존 감사 후보3편을 개편했다.
  graceful-shutdown-and-traffic-draining / redis-ttl-and-eviction / replication-lag-and-read-after-write.
- 기존URL/date 유지, updatedAt10/9. 미확인 영상 실험 숫자 제외, 짧은 장면과 조건/회상/연결 보완.
  숫자가 틀렸다고 입증한 것은 아님. 원본 Instagram3개 접근 실패로 재확인 불가.
- 공식 Spring Boot/Kubernetes/Redis/PostgreSQL18 문서와 관련 매니페스트/검색 범위 대조.
  새 페이지/공개 로드맵/UI/앱·백엔드 변경 없음. 기존3편 합계189줄 감소.
- 전체91개/타입/격리 빌드232페이지/3편 HTML·연결·날짜/민감정보 자동 검사 통과.
  외부 폰트 캐시 timeout 경고1회, 빌드exit0. 브라우저/폰트/운영 검증 미실시.
- 공개3파일 커밋 d7e4875, push 없음. 내부 기록과 기존dirty 변경은 보존.
- 편집 로그: docs/study-audit/2026-10-09-existing-cs-repair-log.md.
  다음 후보는 연결 풀 대기와 비동기 처리량/큐 지연의 장면·실험 근거 대조.
  기존79편 전체 개편이나 기술 검증 완료로 표시하지 않는다.

### 2026-10-09 기존 CS 근거 보완2차 완료

- 후속 “응 다음”으로 connection-pool-bottleneck / async-throughput-and-queue-latency 기존2편 개편.
- 연결 획득/점유/SQL호출과 DB내부 시간 구분, 작업번호7의 접수/대기/시작/완료 장면.
  유입과 처리율/공유 병목/포화 정책/메모리큐 내구성을 설명. 기존 영상 수치는 원본 접근 실패로 제외.
- HikariCP공식 README·PoolSizing/Java21/Spring현행 API, product 중앙config/main검색,
  AI실행 설정/호출서비스/properties 전체 대조. 큐0/실행상한/거절 경로와 운영 활성화 미확인 구분.
- 원본URL/date 유지, updatedAt10/9. 새 페이지/로드맵/UI/백엔드 변경 없음. 합계108줄 감소.
- 전체91개 테스트/타입/격리빌드232페이지/2편 HTML·질문·토글·앞뒤·선수·관련·날짜/민감정보 검사 통과.
- 공개2파일 커밋1eadf2f, push 없음. 내부기록/기존dirty 보존. 브라우저/운영·부하 시험 미실시.
- 다음 후보는 database/connection-pool-hikaricp의 확인되지 않은 팀 판단과 최종값 단정,
  cs/database-bottleneck-diagnosis의 계측 조건. 이후 검색/Outbox 등의 기존 감사 후보가 남음.

### 2026-10-09 기존 근거 보완3차 완료

- 사용자 “다음”으로 database/connection-pool-hikaricp / cs/database-bottleneck-diagnosis 기존2편 보완.
- 건강한 연결 정상반납/재사용, 기본API·외부라이브러리 구분, 공식기본값과 최종적용값 구분.
  근거없는 팀 판단 제외. 진단은 920−500의420을 순수DB시간으로 부르지 않음.
  p95분포와 개별 요청, 실제DB대기 증거, EXPLAIN ANALYZE 실행 위험 설명.
- 공식 HikariCP/Boot/PostgreSQL18/Prometheus와 루트build.gradle/중앙상품config 대조.
  기존URL/date 보존, updatedAt10/9. 새페이지/로드맵/UI/앱·백엔드 변경 없음.
- 전체91개/타입/격리빌드232페이지/2편HTML·질문·토글·날짜·탐색 연결/민감정보 검사 통과.
- 공개2파일 커밋87224b6, push 없음. 합계20줄 감소. 내부기록/기존dirty 보존.
  브라우저·운영·실제DB명령/부하 시험 미실시.
- 다음 후보는 Outbox/Inbox의 unique/upsert·업무반영 원자성·현행 적용 범위.
  원본79편 전체 근거 검증 완료는 아님. 세부 기록은 existing-cs-repair-log.md 참고.

### 2026-10-09 기존 근거 보완4차 완료 — Outbox/Inbox

- 사용자 “응 다음”으로 outbox-inbox-when-needed/per-service 기존2편 보완.
- 같은상품7/E7/판매수10→11, exists경합과sameTX·unique·충돌롤백 조건을 시각장면으로 설명.
  동일사건중복과 다른사건갱신/업무중복/외부효과/보관기간을 구분.
- 주요5서비스의 현행 확인경로로 표수정. payment현재환불요청consumer,
  정산현재gRPC등록을 과거snapshot/SETTLEMENT_CREATED흐름과 혼동하지 않음.
  전수검증/키만으로자연멱등/Outbox면자동전달완료 단정 제외.
- AWS/원저자패턴/PostgreSQL18 및 프로젝트근거24파일 직접확인·좁은민감정보검사.
  상품mock단위테스트는 읽기만, 동시DB/롤백/재시도 시험 미실시.
- 원본URL/date 유지, updatedAt10/9. 새페이지/UI/로드맵/앱·백엔드 변경 없음.
- 전체91개/타입/격리빌드232페이지/2편HTML·메타·날짜·토글·탐색연결/민감정보 통과.
- 공개2파일 커밋2490221, push 없음. 내부기록과 다른dirty 보존. 임시복사본 삭제.
  브라우저·운영·백엔드시험 미검증.
- 다음 후보는 ES 검색기초의 미존재 operations-and-tuning 링크와 refresh/검색가시성 조건.
  기존79편 전체 재검증 완료는 아님.

### 2026-10-10 기존 근거 보완5차 완료 — ES 기초

- 사용자 “다음”으로 es/search-system-and-es-basics 기존 한 편 보완.
- 상품7의 원본→색인→검색 반영, 상품7/8/9 역색인 장면. 실제 프로젝트는 디지털 상품임을 구분.
- DB 검색 불가/최대1초/Nori 자동 품질/자동 확장/flush 전 메모리 단정과 없는 링크 제외.
- Elastic 현행 공식 문서/릴리스 최신 항목9.5.5, PostgreSQL18 및 직접 인용 프로젝트5파일 확인.
  프로젝트 테스트 이미지9.4.3 선언은 운영 버전 증거 아님. backend/ES 실행 검증 미실시.
- URL/date 유지, updatedAt10/10. 새페이지/UI/로드맵/앱·백엔드 변경 없음.
- 전체91개/타입/격리빌드232페이지/HTML·날짜·토글·앞뒤·출처/민감정보 통과.
- 공개 한 파일 커밋 edcda28, push 없음. 내부기록과 기존dirty 보존. 브라우저 QA 미실시.
- 다음은 mapping-and-field-types의 실제 값 변화와 Nori 필수 단정/현행 매핑 대조 후보.
  원본79편 전체 재검증 완료는 아님.

### 2026-10-12 기존 근거 보완6차 완료 — ES 매핑

- 사용자 “다음”으로 mapping-and-field-types 기존 한 편 보완. 상품7 이름1개→두 색인 방식,
  match/term 결과 비교. 필수 용어/JSON 설정 읽기 본문, 매핑변경/옵션 짝은 토글.
- Nori/strict 필수, 모든 keyword 기본256, 파일변경 자동적용/무조건 무중단 단정 제외.
- 현행 Elastic 공식 문서·릴리스 최신항목9.5.5와 직접 프로젝트5파일 대조.
  매핑 선언/쿼리 실제사용/운영 적용/테스트 품질 범위를 구분. backend/ES 실행 없음.
- URL/date 유지, updatedAt10/12. 앱/UI/새페이지/로드맵 변경 없음. 원문57줄 감소.
- 91개/타입/격리빌드232페이지/생성데이터·HTML·선수·앞뒤·날짜·토글/민감정보 통과.
- 공개 한 파일 커밋14d15cf, push 없음. 기존dirty/내부기록 보존. 브라우저 QA 미실시.
- 다음은 analyzer-and-nori의 잘못된 매칭 예시/토큰 출력 단정/설치·현행 근거 구분.
  원본만 읽었으며 다음 수정/외부근거 조사는 미실시. 원본79편 전체 재검증 완료 아님.

### 2026-10-12 기존 근거 보완7차 완료 — ES 분석기

- 사용자 “다음”으로 analyzer-and-nori 기존 한 편 개편. 상품7 이름 PRO의 자르기/소문자화/
  검색어 비교 장면. 설명용 기본 규칙 예상값과 Nori 실행로그/현행 프로젝트 출력 구분.
- 분석기 이름이 다르면0건/standard면한글실패/mixed면품질보장/동의어즉시반영 단정 정리.
- Elastic 공식 분석/Nori/API/동의어/릴리스9.5.5 및 프로젝트 직접인용5파일 확인.
  테스트이미지9.4.3 선언. backend/운영ES/API/설치/실제토큰 검증 미실시.
- 원본URL/date 유지, updatedAt10/12. 앱/UI/새페이지/로드맵/의존성 변경 없음. 원문65줄 감소.
- 91개/타입/격리빌드232페이지/생성데이터·HTML·날짜·토글·장면·요청·앞뒤/민감정보 통과.
  외부폰트 fetch cache timeout 경고1회, buildexit0. 브라우저/폰트 시각QA 미실시.
- 공개 한 파일 커밋9dfb19d, push 없음. 내부기록/기존dirty 보존.
- 다음은 query-dsl-and-relevance의 후보→제외→정렬, should/캐시/multi_match가중합 단정,
  실제 ranking/sort 경로 대조. 원문만 읽었고 다음 수정/외부조사 미실시. 원본79편 전체완료 아님.

### 2026-10-12 기존 근거 보완8차 완료 — ES 검색 조건/순위

- 사용자 “다음”으로 query-dsl-and-relevance 기존 한 편 개편. 상품7~11의 후보→조건탈락→
  상품7/8 관련도/가격순, 임의 추가점수 계산. 설명용 schema/점수/순서와 actual 경로 구분.
- should/filter캐시/multi_match합산/sort/TF-IDF/인기와개인화 단정 정리.
- 현행 공식 Elastic 문서·릴리스9.5.5와 프로젝트 직접근거4파일 대조.
  function_score만으로 최종popular 결과 설명하지 않음. 실제가중치/운영ES/backend 미검증.
- 원본URL/date 유지 updatedAt10/12, 원문86줄 감소. 앱/UI/새페이지/로드맵/의존성 변경 없음.
- 전체91개/타입/격리빌드232페이지/생성데이터·HTML·날짜·토글·장면·요청·선수·앞뒤/민감정보 통과.
- 공개 한 파일 커밋1c615bc, push 없음. 브라우저 시각QA 미실시. 내부기록/기존dirty 보존.
- 다음은 aggregation-log-analysis의 사건수/고유값/집계오차/날짜경계와 현행 로그 근거 대조.
  원문만 읽었고 다음 수정/외부조사는 미실시. 원본79편 전체완료 아님.

### 2026-10-12 기존 근거 보완9차 완료 — ES 집계

- 사용자 “다음”으로 aggregation-log-analysis 기존 한 편 보완. 기록5장→검색어묶음3/2,
  사용자표시중복제거2, size0/집계범위/중복/날짜경계/근사값 구분. 실제로그·응답 아님.
- cardinality/precision_threshold/TOP10·terms오차 단정 정리. 앱/로그수집/새페이지/로드맵 변경 없음.
- Elastic 공식 문서·릴리스9.5.5와 공개 행동로그 미구현 설계/현행 Gateway·Logstash 대조.
  직접근거6파일, 원문 내부주소/Secret참조 공개본 제외. 실제배포/ES/로그적재/Kibana/backend 미검증.
- 원본URL/date 유지 updatedAt10/12, 원문35줄 감소.
- 91개/타입/격리빌드232페이지/생성데이터·HTML·날짜·장면·토글·요청·근거·앞뒤/민감정보 통과.
- 공개 한 파일 커밋0884535, push 없음. 브라우저QA 미실시, 기존dirty/내부기록 보존.
- 다음은 search-suggest-autocomplete의 actual match_phrase_prefix/예시설계 구분,
  입력·제안·요청시점과IME/오래된응답/필드조건 대조. 원문만 읽었고 다음 수정/외부조사 미실시.
  원본79편 전체완료 아님.

### 2026-10-12 기존 근거 보완10차 완료 — ES 자동완성

- search-suggest-autocomplete 기존 한 편을 입력→후보→선택/단어앞부분/늦은응답 장면으로 보완.
- 실제 match_phrase_prefix/판매량순/최대5문서뒤이름중복제거와 Completion 대안 구분.
  정규화/빈입력·실패빈목록 확인. 미정의설정예제와 요청시점·초성구현 보장 단정 정리.
- Elastic 공식 현행/릴리스9.5.5와 MDN IME·취소/직접관련9파일 대조.
- 원본URL/date 유지 updatedAt10/12. 새페이지/앱/UI/로드맵/백엔드/의존성 변경 없음.
- 91개/타입/격리빌드232페이지/생성데이터·HTML·날짜·토글4개·선수·앞뒤/민감정보 통과.
- 공개 한 파일 커밋ec6d742, push 없음. backend/ES/프론트/브라우저QA/운영 시험 미실시.
- 다음 search-event-log-pipeline 원문을 읽음. 사건1개흐름/유실·도구·보존조건과 현재수집경로를
  대조할 후보. 외부조사/수정 미실시. 내부기록과 기존dirty 보존.
- 잔여 수: 감사79편 전체읽기 완료; 감사75800d3이후 후속변경32편/나머지47편 재점검후보.
  전부전면재작성할글47편이라는뜻아님. 핵심CS게시·연결완료, 심화·운영·화면검증별도.
  산정근거와분야별수는2026-10-09-existing-cs-repair-log.md 마지막절 참고.
