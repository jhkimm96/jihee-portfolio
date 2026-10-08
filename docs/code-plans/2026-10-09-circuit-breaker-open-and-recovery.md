---
status: approved
approved_at: 2026-10-09T02:59
files:
  - content/study/cs/circuit-breaker-open-and-recovery.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---


1. 파일: 신규 MDX, 기존 roadmap.ts/test.ts 2파일. 승인 후 code-plans 기록 1파일.
2. 함수: 새 함수 없음. 기존 순서/탐색 계산 재사용. Retry → Breaker → UTC.
3. 연결: Retry/취소 글은 선수, 기존 본문은 변경하지 않는다. 중복 개요/미작성 링크 없음.
4. 최소 구현: 새 UI/스킬/라이브러리/백엔드 설정/운영 호출/부하 시험 없음.
5. 읽기: 서버 A와 상품 7을 유지한다. 호출 허용/거절, 4건 판정, 제한된 복구 조회 장면을 먼저 보여준다.
6. 루브릭 예측:

| 항목 | 판정과 이유 |
| --- | --- |
| controller-thin | 해당 없음: 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음: 엔티티 변경 없음 |
| http-semantics | 해당 없음: HTTP 구현 변경 없음 |
| logging-quality | 해당 없음: 로그 구현 변경 없음 |
| exception-discipline | 해당 없음: 예외 구현 변경 없음 |
| layer-separation | 괜찮음: 콘텐츠/순서 데이터 분리 유지 |
| dead-code | 괜찮음: 새 헬퍼 없이 기존 흐름 사용 |
| duplication-semantic | 괜찮음: 기존 Retry/취소 설명은 연결 |
| diagnosability | 해당 없음: 런타임 진단 구현 변경 없음 |
| integration-robustness | 해당 없음: 외부 연동 구현 변경 없음 |
| service-boundary | 해당 없음: 서비스 경계 변경 없음 |
| value-object-design | 해당 없음: 도메인 값 변경 없음 |
| polymorphism-opportunity | 해당 없음: 새 분기 없음 |
| cohesion-coupling | 괜찮음: 순서 데이터와 정책 테스트만 변경 |

7. 테스트: 기존 연속 순서 테스트에 Breaker를 기대하도록 먼저 바꿔 실패를 확인한 뒤 순서 반영.
   전체 테스트/타입/격리 빌드, 생성 메타데이터와 HTML/선수·이전·다음/링크/토글/2÷4=50% 확인.
   승인 초안/공개 본문/관련 diff/직접 인용 근거 자동 민감정보 검사. 정확한 승인 파일만 로컬 커밋.
   브라우저 화면/실제 결제 차단·복구·부하 효과는 별도이며 push는 하지 않는다.
