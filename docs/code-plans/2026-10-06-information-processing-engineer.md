---
status: approved
approved_at: 2026-10-06T11:00:00+09:00
files:
  - app/study/page.tsx
  - app/study/certifications/page.tsx
  - app/study/certifications/information-processing-engineer/page.tsx
  - components/certification-study/information-processing-engineer-hub.tsx
  - components/certification-study/exam-workspace.tsx
  - components/certification-study/wrong-answer-notebook.tsx
  - components/certification-study/flashcard-deck.tsx
  - components/certification-study/concept-library.tsx
  - lib/certifications/information-processing-engineer/types.ts
  - lib/certifications/information-processing-engineer/question-bank.ts
  - lib/certifications/information-processing-engineer/curriculum.ts
  - lib/certifications/information-processing-engineer/concepts.ts
  - lib/certifications/information-processing-engineer/concepts.test.ts
  - lib/certifications/study-grading.ts
  - lib/certifications/study-grading.test.ts
  - lib/certifications/study-progress.ts
  - lib/certifications/study-progress.test.ts
  - lib/certifications/information-processing-engineer/question-bank.test.ts
tests_first:
  - impl: lib/certifications/study-grading.ts
    test: lib/certifications/study-grading.test.ts
  - impl: lib/certifications/study-progress.ts
    test: lib/certifications/study-progress.test.ts
  - impl: lib/certifications/information-processing-engineer/question-bank.ts
    test: lib/certifications/information-processing-engineer/question-bank.test.ts
---

# 정보처리기사 실기 학습 허브 구현 계획

## 1. 범위

포트폴리오의 `/study/certifications/information-processing-engineer`에 공개형 학습 허브를 추가한다. 로그인, 서버 DB, 다른 자격증, AI 기능, 코딩테스트 일정은 이번 범위에서 제외한다.

## 2. 화면과 데이터 흐름

정적 기출·개념·10일 플랜 데이터를 서버 페이지에서 전달하고, 클라이언트 허브가 브라우저 기록을 복원한다. 사용자가 기출을 풀면 자동 저장하고, 제출 또는 150분 종료 시 채점한다. 오답은 사유·메모·암기 규칙과 함께 보관하고 1·3·7일 복습 대상으로 만든다. JSON 내보내기와 가져오기로 다른 브라우저·기기 이동을 지원한다.

## 3. 파일 역할

- `app/study/page.tsx`: 자격증 학습 진입 카드 추가.
- `app/study/certifications/page.tsx`: 현재 제공 자격증 목록.
- `app/study/certifications/information-processing-engineer/page.tsx`: 허브의 서버 진입점.
- `components/certification-study/*`: 탭, 시험 화면, 오답노트, 암기카드의 상호작용.
- `lib/certifications/information-processing-engineer/*`: 기출 160문항, 출처, 10일 플랜, 타입.
- `lib/certifications/study-grading.ts`: 이론 답안 정규화와 코드 출력 엄격 비교.
- `lib/certifications/study-progress.ts`: 오답 이력, 복습일, JSON 백업 검증.
- `app/globals.css`: 기존 테마를 유지한 집중 모드와 모바일 안전 여백.

## 4. 사용자 경험 원칙

기존 공통 헤더·테마를 유지한다. 집중 모드만 헤더와 주변 탐색을 숨긴다. 모바일은 오늘 학습, 기출, 오답, 암기카드, 더보기의 다섯 항목으로 압축한다. 출처는 회차마다 원문 블로그 링크를 제공하고, 해설은 새로 작성한다.

## 5. 품질 방어

이론형 답은 공백·대소문자·한국어/영어 허용 답안을 정규화한다. 코드 출력은 공백·줄바꿈·소수 표현을 엄격히 비교한다. 반복 오답은 기존 이력을 지우지 않는다. 백업은 인증서 ID와 스키마를 확인한 뒤에만 불러온다.

## 6. 테스트 우선 순서

1. 이론형 답안 정규화와 코드 출력 엄격 비교.
2. 첫 오답의 복습일 생성, 재오답의 이력 보존과 복습일 재계산.
3. 유효한 JSON 복원과 잘못된 인증서·형식의 JSON 거부.
4. 회차별 20문항, 총 160개의 고유 ID와 출처 URL 검증.

## 7. 완료 기준

- 10일 필수 플랜과 4일 유연일을 볼 수 있다.
- 2024년 1회부터 2026년 2회까지 8회차·160문항을 풀고 자동채점할 수 있다.
- 오답·암기카드·학습 기록이 브라우저에 복원되고 JSON으로 옮겨진다.
- 공통 포트폴리오 경험을 해치지 않고 휴대폰에서 사용할 수 있다.
- Vitest와 production build가 통과한다.

## 2026-10-06 구현 진행 기록

승인된 개념 학습 범위에 37개 개념을 채웠다. 정의, 자체 작성 예제, 풀이 순서, 함정, 자가 확인, 기억 규칙과 기존 문항 연결을 제공한다. 1·2·3회독 화면, 검색, 분야/난이도 선택, 모바일 더보기 접근을 검증했다. 연결 기출의 번호 존재뿐 아니라 이중 포인터 주제 일치도 회귀 테스트로 확인했다.

엄격 출력 채점과 잘못된 백업 거부의 실패 테스트를 추가하고 수정했다. 기록을 불러오기 전에 초기값으로 덮어쓰지 않도록 저장 시점을 제한했다. 시간 종료도 수동 제출과 같은 오답 저장 경로를 사용한다.

2026년 2회의 주제별 연습 초안 20개를 원문 복원 20문항으로 교체했다. 이전 초안 답안이 다른 문제에 재사용되지 않도록 새 문항 ID를 부여했다. 최근 8회차 160문항의 원문 조건과 답안을 대조했으며, 이전 7회차에 코드 63개와 원본 도식 21개를 보완했다. 최신 회차의 표는 텍스트 표로 옮겼다. 자료실은 원문 목차 33개 링크를 네 그룹으로 연결한다.

최신 회차 코드 7개는 C/Java/Python으로 실행했고 SQL 2개와 SRT 계산도 검산했다. 이전 140문항의 코드 전체를 독립 실행 검증한 것은 아니다. 2026년 2회 IP 문항의 서브넷 가정과 정규화 문항의 누락 조건, 복수 답안을 제공하는 C 문항은 주의 사항을 표시했다. 점수는 공식 정답 점수가 아닌 복원 기준 점수다.

정정한 주요 항목: 2026년 1회 3번 DB 설계 단계 5개, 2025년 2회 20번 출력 열 이름, 2024년 1회 10번 이미 제공된 보기 제외, 2025년 1회 15번 빈칸과 실행 순서, 2025년 3회 9번 숫자 빈칸 채점. 원문 출처와 라이선스를 회차별로 표시하며 해설은 별도로 작성했다.

전체 테스트 76개와 TypeScript 검사를 통과했다. 시험 세션/점수의 영속 저장과 완성된 복습 흐름은 남아 있다. production build와 최종 모바일 화면 검증은 아직 완료되지 않았으므로 앱 전체 완료나 배포 완료로 간주하지 않는다.

## 시험 기록과 복습 흐름 후속 구현

시험 시작 버튼과 시간 제한 없는 연습을 구분했다. 시작 시각을 저장하고 새로고침이나 탭 전환에도 150분 마감 시간이 이어진다. 만료된 시험은 페이지가 다시 활성화될 때도 제출된다. 수동 제출과 시간 종료는 같은 상태 갱신으로 점수, 제출 답안과 오답을 저장하며, 이미 제출된 시험을 다시 제출해도 오답 횟수가 증가하지 않는다. 재시험은 새 기록을 추가하고 이전 점수와 사용자의 오답 메모를 유지한다.

암기카드는 오늘 복습할 카드와 전체 오답을 구분하고, 키워드와 기억 규칙을 뒤집어 본 뒤 기억함/다시 복습을 기록한다. 성공 복습은 다음 간격으로 넘어가고 잊은 카드는 다음 날로 지정한다. 오늘 학습에 복습 대상 개수를 연결했다. 오답노트는 문항, 최근 제출 답안, 복원 정답과 전체 코드 화면 연결을 제공한다.

백업 버전과 저장 키를 유지하면서 새 필드가 없는 기존 백업도 복원한다. 잘못된 점수와 복습 기록은 복원 전에 거부한다. 저장 상태를 읽기 전에는 시험을 조작할 수 없도록 했다. 전체 테스트 80개와 TypeScript 검사를 통과했고 별도 검증 브라우저에서 답안/타이머/점수/복습 기록의 새로고침 복원을 확인했다. 작은 모바일 뷰포트에서 카드의 가로 넘침 없음과 44px 버튼을 확인했다. production build와 공개 배포는 아직 확인하지 않았다.

## 배포용 빌드 검증 완료

현재 작업 내용을 `C:/cowork/정보처리기사실기/tmp/portfolio-build-check-b432ad2f`에 복사하고, 설치된 의존성만 재사용해 원본 개발 서버와 빌드 출력 폴더를 분리했다. 이 복사본에서 `npm run build`가 종료 코드 0으로 완료됐다. 타입 검사와 197개 정적 페이지 생성이 모두 통과했다. 정보처리기사 학습 페이지는 정적 페이지이며 첫 로딩 JavaScript는 178kB로 보고됐다.

빌드 결과를 127.0.0.1:4001에서 실행해 자격증 목록과 정보처리기사 페이지의 HTTP 200 응답, 기출 도식 21개의 HTTP 200 응답을 확인했다. 실제 브라우저에서 개념 37개와 기출 화면이 열렸으며 검사 시점의 오류/경고 로그는 없었다. 원본 개발 서버와 학습 기록은 변경하지 않았다. 공개 배포, 실제 휴대폰 접속과 실기기 백업 이동 검증은 아직 수행하지 않았다.
