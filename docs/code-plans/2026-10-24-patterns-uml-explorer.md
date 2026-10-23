---
status: approved
approved_at: 2026-10-24
files:
  - lib/certifications/information-processing-engineer/design-patterns.ts
  - lib/certifications/information-processing-engineer/design-patterns.test.tsx
  - lib/certifications/information-processing-engineer/concepts.ts
  - components/certification-study/design-pattern-explorer.tsx
  - components/certification-study/concept-library.tsx
tests_first: []
---

# 디자인 패턴과 UML 관계 카드

사용자가 동작하는 Visualize 미리보기를 확인하고 구현을 승인했다. 기존 patterns-uml 카드 안에서 생성 5개, 구조 7개, 행위 11개 및 UML 관계 6개를 선택한다. 개념 개수는 37개로 유지한다.

1. 예제 데이터를 design-patterns.ts에, 선택과 표시 UI를 DesignPatternExplorer에 둔다. ConceptCard에서 1·2회독일 때 표시한다. 3회독은 기존 회상 흐름을 유지한다.
2. 분류 선택 → 이름 선택 → 상황·간단한 그림·효과·기출 키워드·혼동 비교를 표시한다. 일반 상황 그림은 UML 도식과 명확히 구분하고, UML은 선과 끝 모양을 실제 표기대로 그린다. 브리지 예시는 두 계층의 독립적인 확장을 보여준다.
3. 기존 개념 카드, 폰트, 색상 토큰과 반응형 규칙을 재사용한다. 저장 방식, 오답, 회차, 기출 연결은 변경하지 않는다.
4. 그림 라이브러리, 이미지 파일, 전역 상태, 새 페이지는 필요 없다. 기본 HTML/CSS와 작은 SVG로 표시한다.
5. 패턴의 이름과 목적을 일관되게 쓴다. 메서드는 DesignPatternExplorer, PatternDiagram, UmlDiagram으로 역할을 드러낸다. 클릭 선택은 React 상태 두 개로 관리한다.
6. 품질 예측: dead-code 괜찮음(기존 카드에 직접 연결), duplication-semantic 괜찮음(공통 구조로 모든 패턴 표시), value-object-design 괜찮음(패턴/관계별 명시 타입), cohesion-coupling 괜찮음(데이터와 UI 분리). 나머지 서버·DB·통신 관련 10개 루브릭은 정적 교육 UI에 해당 없음.
7. 계산·권한·상태 정책의 신규 도메인 로직은 없다. 데이터 분류 5/7/11, 고유 ID, 그림 구조, 37개 유지와 서버 렌더링을 확인한다. 전체 테스트, 타입 검사, production build 및 실제 브라우저에서 23+6개 선택, 360px·320px 너비, 회독 동작을 검증한다.

공개 근거: GoF Design Patterns 원저의 패턴 분류와 OMG UML 2.5.1의 관계 표기를 대조한다. 사용자가 승인한 미리보기의 문구·예시를 프로젝트 데이터로 이관한다. 새 Study MDX나 Learning Path는 만들지 않는다.
