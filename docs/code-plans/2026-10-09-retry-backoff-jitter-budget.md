---
status: approved
approved_at: 2026-10-09T01:50
files:
  - content/study/cs/retry-backoff-jitter-budget.mdx
  - content/study/msa/async-event-processing-foundations.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

## 1. 변경 파일

신규 Retry Study 1편, 기존 비동기 기초 글 7절의 안전 조건 두 문단과 related/updatedAt,
로드맵 데이터와 순서 테스트만 변경한다. 기존 URL과 발행일은 유지한다.

## 2. 함수와 실행 흐름

새 함수는 없다. 기존 getStudyRoadmapSlugs와 getStudyRoadmapContext가 읽기 순서와
이전/다음/선수를 계산한다. Loki → Retry → UTC 순서를 데이터에 추가한다.

## 3. 기존 코드와 연결

기존 렌더러와 탐색을 재사용한다. 취소와 재고 글은 연결만 하며 수정하지 않는다.
미작성 Circuit Breaker/Fallback/Bulkhead는 공개 링크로 만들지 않는다.

## 4. Ponytail 범위

새 UI, 헬퍼, 의존성, 스킬, 백엔드 설정, 운영 호출과 부하 시험은 필요 없다.
프로젝트 Learning Path도 이번 승인 범위 밖이다.

## 5. 읽히는 코드와 콘텐츠

테스트 이름에 읽기 순서를 드러낸다. 본문은 서버 A~E의 상품 7 조회를 유지하며
호출 증가 → 대기 → 분산 → 전체 예산으로 설명한다. 문법은 선택 토글에 둔다.
학습 숫자, 확인한 코드, 읽기만 한 테스트와 미검증 운영 효과를 구분한다.

## 6. 루브릭 예측

| 항목 | 판정과 이유 |
| --- | --- |
| controller-thin | 해당 없음: 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음: 엔티티 변경 없음 |
| http-semantics | 해당 없음: HTTP 구현 변경 없음 |
| logging-quality | 해당 없음: 로그 구현 변경 없음 |
| exception-discipline | 해당 없음: 예외 구현 변경 없음 |
| layer-separation | 괜찮음: 콘텐츠와 순서 데이터 분리 유지 |
| dead-code | 괜찮음: 새 헬퍼 없이 기존 데이터 사용 |
| duplication-semantic | 괜찮음: 취소 설명은 기존 글 연결 |
| diagnosability | 해당 없음: 런타임 진단 구현 변경 없음 |
| integration-robustness | 해당 없음: 외부 호출 구현 변경 없음 |
| service-boundary | 해당 없음: 서비스 경계 변경 없음 |
| value-object-design | 해당 없음: 도메인 값 변경 없음 |
| polymorphism-opportunity | 해당 없음: 새로운 분기 없음 |
| cohesion-coupling | 괜찮음: 순서 데이터와 그 정책 테스트만 변경 |

## 7. 검증 계획

순서 테스트를 Loki 뒤 Retry를 기대하도록 먼저 고쳐 실패를 확인한다.
그 뒤 콘텐츠와 순서 데이터를 반영한다. 전체 npm test, npx tsc --noEmit,
개발 서버와 분리한 복사본의 npm run build를 실행한다.
날짜, 링크, 토글, 15회/9회 및 2초 계산, 생성 메타데이터와 관련 diff를 확인한다.
민감정보 검사는 승인 초안/공개 MDX/관련 diff/직접 인용 근거에 한정한다.
화면 및 실제 Retry 실행 검증은 수행했다고 주장하지 않는다. 정확한 승인 파일만 커밋하고 push하지 않는다.
