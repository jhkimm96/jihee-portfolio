---
status: approved
approved_at: 2026-10-06T02:52:55+09:00
files:
  - docs/publishing/publish-contract.md
  - docs/publishing/study-content-contract.md
tests_first: []
---

# 공통 게시 계약과 게시 스킬 개편

## 1. 변경 파일

### 포트폴리오 저장소

- `docs/publishing/publish-contract.md`: 모든 게시 유형이 따르는 승인 범위, 민감정보 자동 검사,
  근거 조사, 간결성, 검증과 커밋 규칙
- `docs/publishing/study-content-contract.md`: Study의 질문 하나, 비전공자 설명, 장면형 흐름,
  다이어그램, 웹 조사와 로드맵 배치 규칙

### Codex와 Claude 스킬

두 환경의 `publish`, `publish-study`, `publish-troubleshooting`, `publish-decision`,
`publish-reviews`, `publish-quality`의 `SKILL.md` 12개를 수정한다. 각 파일은 공통 계약의
경로를 가리키고, 해당 기록 유형만의 고유 규칙만 보존한다.

### Claude 평가 시나리오

- `C:/Users/JIHEE/.claude/skills/publish-study/evals/evals.json`
- `C:/Users/JIHEE/.claude/skills/publish-troubleshooting/evals/evals.json`

민감정보 후보 없음 자동 통과, 마스킹, 애매한 후보 확인, 단계별 일괄 승인과 최신 근거 조사를
검증하는 시나리오로 바꾼다.

## 2. 흐름과 책임

### `publish`

실제 작업 근거를 확인하고 기록 유형을 분류한 뒤 해당 하위 스킬로 연결한다. Study의 콘텐츠
구조와 다이어그램 규칙을 직접 반복하지 않는다.

### 공통 게시 계약

`게시 범위 승인 → 파일·diff·인용 근거 자동 검사 → 후보 처리 → 검증 → 커밋` 흐름을 정의한다.
후보가 없으면 자동 통과하고, 명백한 항목은 일반화 후 재검사한다. 사실관계가 달라질 수 있는
애매한 항목만 사용자에게 질문한다.

### `publish-study`

웹, 공식 문서와 프로젝트 근거를 조사한 뒤 Study 콘텐츠 계약을 적용한다. 한 글에 여러 독립
질문이 있으면 분리 또는 기존 글 연결을 제안한다.

### 나머지 하위 스킬

Troubleshooting, Decision, Review, Quality의 기록 목적은 유지한다. 공통 계약만 따르고 Study의
학습 템플릿은 적용하지 않는다. 미조치 취약점처럼 유형 특유의 고위험 공개 제한은 유지한다.

## 3. 기존 구조와의 관계

- 기존 스킬마다 중복된 민감정보 체크리스트와 최신성 규칙은 공통 계약으로 통합한다.
- 현재 콘텐츠 경로, slug 충돌 확인, build, 커밋, push 금지 규칙은 유지한다.
- 별도 검사 스크립트, CMS, SNS 자동 게시, 새 데이터베이스는 만들지 않는다.

## 4. 제외할 것

- Study 상세 UI와 로드맵 코드는 이 단계에서 수정하지 않는다.
- 기존 Study MDX는 수정하지 않는다.
- 민감정보를 저장소 전체에서 무차별 검색하지 않는다.
- 기존 파일을 자동 삭제하거나 URL을 바꾸지 않는다.

## 5. 읽기 쉬운 규칙

공통 계약에서는 `게시 범위 승인`, `민감정보 자동 검사`, `공개 근거 조사`라는 용어를 통일한다.
스킬 본문은 실행 순서와 유형별 예외만 남기고, 공통 체크리스트를 복사하지 않는다.

## 6. 루브릭 예측

| 항목 | 예상 | 이유 |
|---|---|---|
| controller-thin | 해당 없음 | 애플리케이션 컨트롤러를 수정하지 않는다. |
| entity-encapsulation | 해당 없음 | 엔티티를 수정하지 않는다. |
| http-semantics | 해당 없음 | HTTP 경로를 수정하지 않는다. |
| logging-quality | 해당 없음 | 런타임 로그를 추가하지 않는다. |
| exception-discipline | 해당 없음 | 예외 처리 코드를 추가하지 않는다. |
| layer-separation | 해당 없음 | 애플리케이션 계층을 수정하지 않는다. |
| dead-code | 괜찮음 | 실제로 모든 게시 스킬이 읽는 공통 계약만 추가한다. |
| duplication-semantic | 개선 | 민감정보·승인·최신성 규칙을 한 기준으로 통합한다. |
| diagnosability | 해당 없음 | 런타임 진단 코드를 수정하지 않는다. |
| integration-robustness | 해당 없음 | 서비스 간 통신을 수정하지 않는다. |
| service-boundary | 해당 없음 | 서비스 경계를 수정하지 않는다. |
| value-object-design | 해당 없음 | 도메인 값을 추가하지 않는다. |
| polymorphism-opportunity | 해당 없음 | 조건 분기 코드를 추가하지 않는다. |
| cohesion-coupling | 개선 | 라우터, 기록 유형, 공통 계약의 책임을 분리한다. |

## 7. 검증 계획

규칙 문서와 스킬 변경에는 실행 가능한 도메인 로직이 없으므로 `tests_first`는 비어 있다. 대신
구현 전 Claude의 기존 평가 시나리오를 먼저 새 정책에 맞게 갱신한다.

- 후보 없음: 사용자 `없음` 답변 없이 자동 통과
- 내부 도메인: 일반화 후 재검사
- Secret 후보: 원문을 노출하지 않고 중단
- 애매한 고객사명: 사용자 확인
- 단계별 승인: 승인된 파일마다 재승인하지 않음
- 최신 Study: 검색, 공식 자료와 프로젝트 근거를 구분

구현 후에는 공통 계약 참조, 기존 수동 `없음` 강제 문구 제거, Claude 평가 JSON 문법, Codex
스킬 frontmatter, 공통 경로, `git diff --check`를 확인한다.
