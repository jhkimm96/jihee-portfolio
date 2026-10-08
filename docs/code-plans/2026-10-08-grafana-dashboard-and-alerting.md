---
status: approved
approved_at: 2026-10-08T14:04+09:00
files:
  - content/study/cs/grafana-payment-dashboard.mdx
  - content/study/cs/alert-evaluation-and-notification.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

# Grafana 대시보드와 알림 Study 연결

직전 대화에서 두 신규 글과 아래 적용 계획을 제시했고 사용자가 `ㅇㅇ`으로 승인했다.
승인 확인 시각은 위와 같다. 초안: docs/publishing/drafts/2026-10-08-grafana-dashboard-and-alerting.md.

## 1. 파일

신규 MDX 두 편과 기존 읽기 순서 데이터·테스트 두 파일. 이 승인 기록까지 정확히 커밋한다.
기존 공개 글의 URL/작성일/본문, 스킬, UI, 프로젝트 Learning Path와 백엔드는 변경하지 않는다.

## 2. 함수와 흐름

새 함수 없음. studyReadingOrder.cs에 Label → grafana-payment-dashboard →
alert-evaluation-and-notification 순서를 넣는다. getStudyRoadmapSlugs →
getExplicitRoadmapPosts/getTrackRoadmapPosts → getStudyRoadmapContext의 기존 계산으로
목록과 선수/이전/다음 탐색에 반영한다. 신규 글 작성일은 2026-10-08이다.

## 3. 기존 코드와 관계

기존 Study 상세 페이지와 로드맵 뷰의 데이터 처리를 재사용한다. 슬러그 충돌 없음.
Kibana 검색 글과 신호 구분 글은 연결하고 복제하지 않는다. Label 뒤의 기존 UTC 글 순서를 보존한다.

## 4. Ponytail 생략

새 UI, 의존성, Grafana 설치, Prometheus 수집 설정, 운영 규칙과 실제 알림 발송을 만들지 않는다.
콘텐츠를 위한 별도 프로그램이나 테스트 프레임워크도 추가하지 않는다.

## 5. 읽히는 코드

기존 도메인 이름과 조회 함수를 보존한다. 테스트 이름으로 학습 순서를 드러낸다.
본문은 결제 예시의 화면 스케치와 시간순 변화가 먼저이고 선택적인 조회 문법은 토글에 둔다.
학습용 수치, 소스 확인, 실제 운영 실행을 구분한다.

## 6. 루브릭 예측

| 기준 | 예측 | 이유 |
| --- | --- | --- |
| controller-thin | 해당 없음 | 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음 | 엔티티 변경 없음 |
| http-semantics | 해당 없음 | 응답 계약 변경 없음 |
| logging-quality | 해당 없음 | 로그 구현 변경 없음 |
| exception-discipline | 해당 없음 | 예외 처리 변경 없음 |
| layer-separation | 괜찮음 | 기존 콘텐츠와 순서 데이터 분리 유지 |
| dead-code | 괜찮음 | 새 함수와 운영 설정 없음 |
| duplication-semantic | 괜찮음 | 기존 탐색 계산 재사용 |
| diagnosability | 해당 없음 | 실행 진단 코드 변경 없음 |
| integration-robustness | 해당 없음 | 실제 외부 연동 구현 없음 |
| service-boundary | 해당 없음 | 서비스 변경 없음 |
| value-object-design | 해당 없음 | 새 모델 없음 |
| polymorphism-opportunity | 해당 없음 | 조건 분기 추가 없음 |
| cohesion-coupling | 괜찮음 | 순서 데이터와 정책 테스트에 변경 한정 |

## 7. 테스트

구현 전: `Label 뒤에 대시보드와 알림을 순서대로 읽는다`를 기존 테스트 파일에 추가하고 실패 확인.
구현 후: 전체 npm test, npx tsc --noEmit, dev 서버와 분리한 임시 복사본의 npm run build.
생성된 글의 메타데이터·선수/관련/내부 링크, 토글 균형, 산술과 타임라인을 확인한다.
승인 초안·공개 MDX·관련 diff·직접 인용 근거에서 민감정보를 자동 검사한다.
브라우저 접근 차단이 계속되는 경우 우회하지 않고 화면 검증 미완료로 보고한다.
PromQL/Grafana 실환경 실행과 실제 메시지 수신은 검증 범위 밖이다.
