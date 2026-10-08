---
status: approved
approved_at: 2026-10-09T01:14+09:00
files:
  - content/study/cs/loki-labels-and-log-search.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

# Loki 라벨과 주문 로그 검색

직전 초안과 7개 항목 계획을 사용자가 `응 승인`으로 승인했다.
초안: docs/publishing/drafts/2026-10-09-loki-labels-and-log-search.md.

## 1. 파일

신규 Study 한 편과 로드맵 데이터·테스트. 승인 기록까지 함께 커밋한다.
기존 콘텐츠 본문/URL/date는 변경하지 않는다.

## 2. 함수와 흐름

새 함수 없음. studyReadingOrder.cs에 트레이스 → Loki → UTC 순서를 둔다.
getStudyRoadmapSlugs → 기존 목록 조회 → getStudyRoadmapContext를 재사용한다.
본문은 주문 로그 찾기 → 같은 묶음/주문별 분리 → 조회 조건 → 도구 선택이다.

## 3. 기존 코드와 관계

기존 Study 화면을 재사용하고 수집·메트릭 Label 글을 선수로 연결한다.
Label부터 UTC까지 연속 순서 테스트를 Loki를 포함하도록 확장한다.

## 4. Ponytail 생략

설치, 마이그레이션, UI, 백엔드, 스킬, 프로젝트 Learning Path는 변경하지 않는다.
LogQL 실행이나 운영 비용 측정도 하지 않는다.

## 5. 읽히는 코드

기존 함수 이름과 책임을 보존한다. 테스트 이름으로 학습 순서를 드러낸다.
동일 주문7/8/9의 묶음 비교가 먼저, 조회 문법과 조건 상세는 토글에 둔다.
조회 시 추출 필드와 저장 시 인덱스 라벨을 구분한다.

## 6. 루브릭 예측

| 기준 | 예측 | 이유 |
| --- | --- | --- |
| controller-thin | 해당 없음 | 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음 | 엔티티 변경 없음 |
| http-semantics | 해당 없음 | 응답 변경 없음 |
| logging-quality | 해당 없음 | 로그 구현 변경 없음 |
| exception-discipline | 해당 없음 | 처리 코드 변경 없음 |
| layer-separation | 괜찮음 | 콘텐츠·데이터 분리 유지 |
| dead-code | 괜찮음 | 보조 코드 추가 없음 |
| duplication-semantic | 괜찮음 | 탐색 계산 재사용 |
| diagnosability | 해당 없음 | 실행 진단 코드 변경 없음 |
| integration-robustness | 해당 없음 | 실제 연동 변경 없음 |
| service-boundary | 해당 없음 | 서비스 변경 없음 |
| value-object-design | 해당 없음 | 모델 추가 없음 |
| polymorphism-opportunity | 해당 없음 | 분기 추가 없음 |
| cohesion-coupling | 괜찮음 | 순서와 테스트에 변경 한정 |

## 7. 테스트

구현 전: `Label 뒤에 대시보드, 알림, Kafka 진단, 트레이스, Loki를 순서대로 읽는다` 실패 확인.
구현 후: 전체 npm test, npx tsc --noEmit, 개발 서버와 분리한 복사본의 npm run build.
생성 메타데이터·링크·토글·예시 입력/결과와 승인 범위 민감정보를 점검한다.
실제 LogQL 실행/운영 효과와 브라우저 화면 미검증을 구분해서 보고한다.
