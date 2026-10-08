---
status: approved
approved_at: 2026-10-08T14:39+09:00
files:
  - content/study/cs/kafka-lag-diagnosis.mdx
  - content/study/msa/kafka-offset-lag-reprocessing-idempotency.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

# Kafka Lag 진단 Study

사용자가 앞서 제시한 7개 항목의 계획과 초안을 `승인`했다.
초안: docs/publishing/drafts/2026-10-08-kafka-lag-diagnosis.md.

## 1. 파일

새 진단 글 한 편, 기존 Kafka의 Lag 측정 기준 보완, 로드맵 데이터와 테스트.
기존 URL과 date를 유지하고 updatedAt만 추가한다. 승인 기록도 함께 커밋한다.

## 2. 함수와 흐름

새 함수 없음. studyReadingOrder.cs에 알림 → Kafka 진단 → UTC 순서를 둔다.
getStudyRoadmapSlugs → 기존 목록 조회 → getStudyRoadmapContext를 재사용한다.
본문은 알림 지연 → 위치 차이 → 유입/처리 비교 → 파티션 편중 → 회복 확인이다.

## 3. 기존 코드와 관계

기존 Study 렌더러와 탐색을 재사용한다. 기본 Kafka와 작업 큐 내용을 복제하지 않는다.
Label부터 UTC까지 연속 순서를 검증하는 기존 테스트를 새 학습 순서로 확장한다.

## 4. Ponytail 생략

UI, 의존성, 백엔드, 운영 Kafka 설정, Offset 변경과 부하 시험을 추가하지 않는다.
프로젝트 Learning Path와 스킬도 변경하지 않는다.

## 5. 읽히는 코드

기존 함수 이름과 책임을 보존한다. 테스트 이름이 읽기 순서를 드러낸다.
같은 주문 예시와 짧은 장면으로 설명하고 선택적 지표·설정은 토글에 둔다.
학습 수치, 소스 확인과 실제 운영 검증을 구분한다.

## 6. 루브릭 예측

| 기준 | 예측 | 이유 |
| --- | --- | --- |
| controller-thin | 해당 없음 | 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음 | 엔티티 변경 없음 |
| http-semantics | 해당 없음 | 응답 변경 없음 |
| logging-quality | 해당 없음 | 로그 구현 변경 없음 |
| exception-discipline | 해당 없음 | 예외 구현 변경 없음 |
| layer-separation | 괜찮음 | 콘텐츠와 순서 데이터 분리 유지 |
| dead-code | 괜찮음 | 새 보조 코드 없음 |
| duplication-semantic | 괜찮음 | 기존 탐색 계산 재사용 |
| diagnosability | 해당 없음 | 운영 진단 코드 변경 없음 |
| integration-robustness | 해당 없음 | 외부 연동 구현 없음 |
| service-boundary | 해당 없음 | 서비스 변경 없음 |
| value-object-design | 해당 없음 | 새 모델 없음 |
| polymorphism-opportunity | 해당 없음 | 분기 추가 없음 |
| cohesion-coupling | 괜찮음 | 데이터와 정책 테스트에 변경 한정 |

## 7. 테스트

구현 전: `Label 뒤에 대시보드, 알림, Kafka 진단을 순서대로 읽는다` 실패 확인.
구현 후: 전체 npm test, npx tsc --noEmit, 격리 복사본 npm run build.
메타데이터, 선수/관련 링크, 토글과 예시 계산을 점검한다.
초안·공개 MDX·직접 인용 근거와 관련 diff의 민감정보를 자동 검사한다.
운영 Kafka 실행, 테스트 소스 실행과 브라우저 화면 검증은 별도로 구분한다.
