---
status: approved
approved_at: 2026-10-24
files:
  - lib/certifications/information-processing-engineer/python-lessons.ts
  - lib/certifications/information-processing-engineer/java-lessons.ts
  - lib/certifications/information-processing-engineer/python-reference.ts
  - lib/certifications/information-processing-engineer/programming-practice.ts
  - lib/certifications/information-processing-engineer/programming-practice.test.tsx
  - lib/certifications/information-processing-engineer/python-slicing.ts
  - lib/certifications/information-processing-engineer/python-slicing.test.ts
  - lib/certifications/information-processing-engineer/concepts.ts
  - lib/certifications/information-processing-engineer/*test.ts*
  - lib/certifications/information-processing-engineer/types.ts
  - lib/certifications/study-progress.ts
  - lib/certifications/study-progress.test.ts
  - components/certification-study/programming-lesson-explorer.tsx
  - components/certification-study/python-slice-explorer.tsx
  - components/certification-study/programming-practice.tsx
  - components/certification-study/concept-library.tsx
  - components/certification-study/information-processing-engineer-hub.tsx
  - components/certification-study/wrong-answer-notebook.tsx
  - components/certification-study/flashcard-deck.tsx
  - scripts/verify-programming-examples.ts
tests_first:
  - impl: lib/certifications/information-processing-engineer/python-slicing.ts
    test: lib/certifications/information-processing-engineer/python-slicing.test.ts
  - impl: lib/certifications/study-progress.ts
    test: lib/certifications/study-progress.test.ts
---

# 승인된 범위
사용자가 1~3순위 및 Python 내장 함수/메서드 전체 보강과 구현 계획을 승인했다.
기존 학습 흐름의 확장이다. 새 서버, 로그인, DB, 임의 코드 실행기, 의존성 추가는 없다.

## 1. 파일
언어별 콘텐츠, Python 함수 사전, 연습 문항 조합, 슬라이싱 계산을 분리한다.
기존 개념 UI, 허브, 오답/카드와 기록/백업을 연결한다. 관련 테스트를 함께 수정한다.

## 2. 흐름
ProgrammingLessonExplorer: 주제→예제→줄별 상태. PythonSliceExplorer: 인덱스/범위→선택.
ProgrammingPractice: 예측→제출→채점→해설. tracePythonSlice: Python 범위 정규화와 인덱스 계산.
recordProgrammingAttempt: 결과 저장→오답 연결. findStudyQuestion: 기출/자체 연습 조회.
예제는 사전 검증한 정적 추적이며 브라우저에서 실행하지 않는다.

## 3. 재사용
gradeAnswer, addWrongAnswer, reviewWrongAnswer, 기존 localStorage/JSON 계약을 재사용한다.
새 practice 기록은 모의고사 점수와 분리. 기존 v1 백업에서 새 필드 생략을 허용한다.
기출만 조회하던 오답/카드/허브를 자체 연습에도 연결한다. 기존 문항 ID는 보존한다.

## 4. 최소 구현
임의 실행기, 정답 eval/JSON 유사 코드 파서, 계정/서버 동기화, UI 의존성은 제외한다.
출력은 기존 엄격한 code-output 채점을 재사용한다. 정답 표시 규칙을 입력창에 안내한다.

## 5. 읽히는 코드
콘텐츠는 언어/사전 단위로 나눈다. 사례마다 id/규칙/함정/실행 코드/기대 출력/단계가 있다.
다국어 상태를 가상 주소가 아닌 객체 식별 이름으로 표시하며 실제 메모리 주소로 오인시키지 않는다.

## 6. 14개 루브릭
- controller-thin: 해당 없음(서버 없음)
- entity-encapsulation: 위험(기록은 도메인 함수에서 갱신)
- http-semantics: 해당 없음
- logging-quality: 괜찮음(답안/메모 로그 없음)
- exception-discipline: 위험(입력 오류는 UI, 저장 오류는 기존 메시지)
- layer-separation: 위험(계산/저장/UI 분리)
- dead-code: 괜찮음(모든 예제와 사전 항목 연결 검증)
- duplication-semantic: 위험(기출/연습 공통 조회 및 채점 재사용)
- diagnosability: 위험(백업 실패 시 기존 데이터 보존)
- integration-robustness: 해당 없음(외부 서비스 없음)
- service-boundary: 해당 없음
- value-object-design: 괜찮음(추적 단계/예제 데이터 타입)
- polymorphism-opportunity: 괜찮음(공통 데이터 렌더링, 범용 실행기 없음)
- cohesion-coupling: 위험(콘텐츠와 학습 기록 분리)

## 7. 검증
먼저: 역방향/생략값/명시 -1/범위 초과/step0, 기록 누적/점수 분리/구버전 백업.
테스트 미정의 실패→시그니처만 작성해 동작 실패→구현→통과 순서.
이후: 콘텐츠 누락/고유 ID/연결/SSR, Python3 및 javac --release17 실제 예제 실행 비교,
전체 Vitest/typecheck/build, 320/360/1280px 화면과 제출/복습/새로고침/백업 검증.
