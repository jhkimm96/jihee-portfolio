---
status: approved
approved_at: 2026-10-09T12:54
files:
  - content/study/cs/rate-limiting-request-budget.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

1. 파일: 신규 MDX, roadmap.ts/test.ts. 승인 후 code-plans 기록 1파일.
2. 함수: 새 함수 없음. 기존 읽기 순서/탐색 계산 재사용. Bulkhead → Rate Limiting → UTC.
3. 연결: Bulkhead는 선수, Retry와 Breaker는 연결만 사용. 기존 본문/date/URL 변경 없음.
4. 최소 구현: 새 UI/컴포넌트/의존성/백엔드/운영 호출/부하 시험 없음.
5. 읽기: 서버 A의 결제1~6과 호출권3개를 유지한다. 동시 실행, 구간 누적, 대상과 범위를 구분한다.
6. 루브릭 예측:

| 항목 | 판정과 이유 |
| --- | --- |
| controller-thin | 해당 없음: 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음: 엔티티 변경 없음 |
| http-semantics | 해당 없음: HTTP 구현 변경 없음 |
| logging-quality | 해당 없음: 로그 구현 변경 없음 |
| exception-discipline | 해당 없음: 예외 구현 변경 없음 |
| layer-separation | 괜찮음: 콘텐츠/순서 데이터 분리 유지 |
| dead-code | 괜찮음: 새 헬퍼 없음 |
| duplication-semantic | 괜찮음: 기존 동시 제한/Retry 글은 연결 |
| diagnosability | 해당 없음: 런타임 진단 변경 없음 |
| integration-robustness | 해당 없음: 외부 연동 구현 변경 없음 |
| service-boundary | 해당 없음: 서비스 경계 변경 없음 |
| value-object-design | 해당 없음: 도메인 값 변경 없음 |
| polymorphism-opportunity | 해당 없음: 새 분기 없음 |
| cohesion-coupling | 괜찮음: 순서 데이터와 정책 테스트만 변경 |

7. 테스트: 연속 순서 테스트에 Rate Limiting을 먼저 추가해 실패 확인 → 순서 반영.
   전체 테스트/타입/격리 빌드, 메타데이터/HTML/선수·이전·다음/링크/토글/산술 확인.
   승인 범위 본문/diff/직접 인용 근거 민감정보 자동 검사 후 정확한 파일만 로컬 커밋.
   실제 운영 효과/화면 검증과 push는 포함하지 않는다.
