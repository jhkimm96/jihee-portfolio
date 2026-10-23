---
status: approved
approved_at: 2026-10-24
files:
  - lib/certifications/information-processing-engineer/security-concepts.ts
  - lib/certifications/information-processing-engineer/security-concepts.test.tsx
  - lib/certifications/information-processing-engineer/concepts.ts
  - components/certification-study/security-concept-explorer.tsx
  - components/certification-study/concept-library.tsx
tests_first: []
---

# 보안 개념 4개 클릭형 보강

사용자는 디자인 패턴과 동일하게 기존 보안 카드 안에서 용어를 선택하고 상황·흐름 그림·핵심 표현·방어·혼동 비교를 보는 범위를 승인했다. 기존 개념은 37개로 유지한다.

1. security-concepts.ts에 보안 기초·공격·웹 취약점·암호 4개 카드의 용어를 분류해서 둔다. SecurityConceptExplorer에서 클릭 선택과 내용을 표시한다. 기본·기출 대비와 최신 보충을 명시하되 출제 예측이나 전 용어의 기출 이력을 주장하지 않는다.
2. 전체/기본/보충 선택 → 용어 선택 → 상황과 3개 대상의 간단한 흐름 → 핵심 표현 → 방어 또는 활용 원칙 → 유사 용어 비교 순서다. 최신 보충은 새로 생긴 용어가 아닌 최근 강조되는 추가 학습 범위다.
3. 기존 카드 UI, theme token, 회독·기출 연결을 유지한다. 새 UI는 1·2회독에서 표시한다. 용어 이름 검색도 해당 카드로 연결한다.
4. 의존성, 이미지 파일, 외부 데이터 호출, 공격 실행 기능, 계정·기록 스키마 변경은 추가하지 않는다.
5. 콘텐츠와 표시 책임을 나누며 명시적인 SecurityLesson/SecurityTerm 타입을 쓴다. 정책·계산 엔진은 만들지 않는다. CIA/AAA, MAC 접근통제와 MAC 메시지 인증, 인증과 인가, XSS와 CSRF, 전자서명과 암호화를 구분한다.
6. dead-code 괜찮음(4개 카드 연결), duplication-semantic 괜찮음(단일 보안 표시 UI), value-object-design 괜찮음(명시 타입), cohesion-coupling 괜찮음(교육 데이터/UI 분리). 나머지 서버·DB·통신 항목 해당 없음.
7. 신규 도메인 정책 없음. 구현 후 4개 카드 연결, 고유 ID, 모든 용어의 그림/설명/방어/비교/출처, 37개 유지와 기본/보충 분리를 테스트한다. 전체 테스트·타입 검사·빌드·실제 브라우저 모든 용어 클릭·모바일 320/360px·회독·검색을 확인한다.

근거는 KISA ISMS-P, KISA 보안 권고, OWASP 공격·방어 문서와 NIST 보안 용어/암호 표준이다. 공개 기출 복원과 공식 기술 정의를 구분한다. 기존 파일의 다른 작업은 보존하고 별도 Study MDX를 만들지 않는다.
