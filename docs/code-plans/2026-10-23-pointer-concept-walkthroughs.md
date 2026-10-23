---
status: approved
approved_at: 2026-10-23
files:
  - components/certification-study/concept-library.tsx
  - components/certification-study/pointer-walkthrough.tsx
  - lib/certifications/information-processing-engineer/concepts.ts
  - lib/certifications/information-processing-engineer/pointer-walkthroughs.ts
  - lib/certifications/information-processing-engineer/pointer-walkthroughs.test.tsx
tests_first: []
---

# 기존 포인터 개념 7개 보강

사용자는 기존 37개 개념을 유지하며 포인터 관련 7개 카드 안에 주소·이름·저장값과 단계 선택 UI를 추가하도록 승인했다. 마지막 구조체 미리보기의 형태를 기준으로 한다. 별도 Study MDX와 Learning Path를 생성하지 않는다.

1. `pointer-walkthroughs.ts`에 7개 예제의 메모리 객체, 필드, 단계별 결과·변경값·해설을 둔다. `concepts.ts`의 해당 설명과 예제를 맞춘다.
2. `PointerWalkthrough`가 선택 단계에 해당하는 메모리 칸을 강조하고 현재 식, 결과 종류, 해설을 차례로 표시한다. 기존 `ConceptCard`에서 1·2회독에 표시한다.
3. 기존 카드, 검색, 회독, 연결 기출을 재사용한다. 학습 저장소와 답안은 변경하지 않는다.
4. 추가 의존성, 별도 페이지, 그림 파일, 범용 C 인터프리터는 만들지 않는다. 정확한 주소·값을 HTML/CSS로 직접 표시한다.
5. 주소·정수·함수 주소·문자열 출력의 용어를 구분한다. 가상 주소와 자료형 크기 가정을 표시한다. 동일 데이터에서 그림과 해설을 가져오되 계산 엔진을 추가하지 않는다.
6. 품질 예측: dead-code 괜찮음(7개 카드에서 사용), duplication-semantic 괜찮음(공통 표시 컴포넌트), value-object-design 괜찮음(명시적인 메모리 객체·단계 타입), cohesion-coupling 괜찮음(교육 데이터와 UI 분리). controller-thin, entity-encapsulation, http-semantics, logging-quality, exception-discipline, layer-separation, diagnosability, integration-robustness, service-boundary, polymorphism-opportunity는 정적 교육 UI에 해당 없음.
7. 계산·상태 정책의 신규 구현은 없다. 구현 후 기존 37개 유지, 7개 연결, 강조 필드·값 변경 참조의 유효성, 주소 연결, 서버 렌더링과 각 예제의 핵심 결과를 확인한다. 전체 테스트, 타입 검사, production build를 실행한다. 가능하면 C 컴파일러로 예제 출력도 대조한다.
