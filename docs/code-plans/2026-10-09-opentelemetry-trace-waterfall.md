---
status: approved
approved_at: 2026-10-09T00:43+09:00
files:
  - content/study/cs/opentelemetry-trace-waterfall.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

# 느린 주문의 트레이스 시간표

직전 대화의 초안과 7개 항목 계획을 사용자가 `진행해`로 승인했다.
초안: docs/publishing/drafts/2026-10-09-opentelemetry-trace-waterfall.md.

## 1. 파일

신규 Study 한 편, 기존 로드맵 데이터와 테스트. 승인 계획도 함께 커밋한다.
기존 콘텐츠 본문/URL/작성일은 변경하지 않는다.

## 2. 함수와 흐름

새 함수 없음. studyReadingOrder.cs에 Kafka 진단 → 트레이스 시간표 → UTC 순서를 둔다.
getStudyRoadmapSlugs → 기존 목록 조회 → getStudyRoadmapContext의 탐색을 재사용한다.
본문은 느린 주문 → 시간 막대 읽기 → 원인 확인 → 기록·전달·조회 → 누락 확인이다.

## 3. 기존 코드와 관계

신호 구분과 ID 글은 선수로 연결한다. 기존 렌더러와 로드맵 뷰를 유지한다.
기존 Label부터 UTC까지 연속 순서 테스트의 기대값을 새 정책에 맞춰 확장한다.

## 4. Ponytail 생략

새 UI/의존성, Java agent 설치, Collector 배포, 백엔드/운영 설정을 추가하지 않는다.
프로젝트 Learning Path와 스킬도 변경하지 않는다.

## 5. 읽히는 코드

함수 책임과 이름을 유지하고 테스트 이름으로 학습 순서를 드러낸다.
주문7의 동일 시간표로 부모·자식 시간 포함과 긴 구간/원인 구분을 설명한다.
프로젝트 소스와 테스트 파일 확인을 실제 운영 수집/테스트 실행과 구분한다.

## 6. 루브릭 예측

| 기준 | 예측 | 이유 |
| --- | --- | --- |
| controller-thin | 해당 없음 | 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음 | 엔티티 변경 없음 |
| http-semantics | 해당 없음 | 응답 변경 없음 |
| logging-quality | 해당 없음 | 로그 구현 변경 없음 |
| exception-discipline | 해당 없음 | 예외 구현 변경 없음 |
| layer-separation | 괜찮음 | 콘텐츠와 순서 데이터 분리 유지 |
| dead-code | 괜찮음 | 보조 코드 추가 없음 |
| duplication-semantic | 괜찮음 | 기존 탐색 계산 재사용 |
| diagnosability | 해당 없음 | 실행 진단 코드 변경 없음 |
| integration-robustness | 해당 없음 | 실제 연동 변경 없음 |
| service-boundary | 해당 없음 | 서비스 변경 없음 |
| value-object-design | 해당 없음 | 모델 추가 없음 |
| polymorphism-opportunity | 해당 없음 | 분기 추가 없음 |
| cohesion-coupling | 괜찮음 | 데이터와 정책 테스트에 한정 |

## 7. 테스트

구현 전: `Label 뒤에 대시보드, 알림, Kafka 진단, 트레이스를 순서대로 읽는다` 실패 확인.
구현 후: 전체 npm test, npx tsc --noEmit, 개발 서버와 분리한 임시 복사본 npm run build.
메타데이터·선수/관련/내부 링크·토글·시간표 산술과 승인 범위 민감정보를 점검한다.
브라우저 접근 차단이 계속되면 우회하지 않는다. 화면 미검증과 실제 추적 수집 미검증을 보고한다.
