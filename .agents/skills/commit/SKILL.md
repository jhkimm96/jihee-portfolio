---
name: commit
description: 변경 단위별로 Git 변경을 검토하고, 포트폴리오 경로에 맞는 카테고리와 한국어 메시지로 커밋한다. 사용자가 "$commit", "/commit", "커밋해줘", "변경사항 커밋해줘"처럼 명시적으로 커밋을 요청할 때 사용한다.
---

# Commit

## 변경 확인

다음을 실행해 추적 파일과 미추적 파일을 모두 확인한다.

```bash
git status --short
git diff --stat
git diff --cached --stat
```

관련 없는 변경이 섞여 있으면 파일 단위로 나눠 커밋한다. 기존 사용자 변경을 수정하거나 되돌리지 않는다.

## 카테고리 판단

변경 경로에 따라 가장 구체적인 카테고리를 선택한다. 여러 카테고리가 섞여 있으면 커밋을 나눈다.

| 경로 | 카테고리 |
|---|---|
| `content/{project}/troubleshooting/**` | `troubleshooting` |
| `content/{project}/decisions/**` | `decisions` |
| `content/{project}/reviews/**` | `reviews` |
| `content/study/**` | `study` |
| `content/{project}/quality/**` | `quality` |
| `content/{project}/**` (위 항목 외 프로젝트 콘텐츠/코드) | `{project}` (예: `career-link`, `prompthub`) |
| `content/profile/**`, `app/(resume|about)/**` | `profile` |
| `app/`, `components/`, `lib/` 등 사이트 공통 코드 | `site` |

표에 없는 저장소에서는 해당 저장소의 `AGENTS.md`, 최근 커밋 메시지, 변경 범위를 순서대로 참고해 기존 관례를 따른다.

## 메시지 작성

포트폴리오에서는 `<카테고리>: <한국어 설명>` 형식을 사용한다. 설명은 무엇을 했는지 한 줄로 명확하게 쓴다. `feat:`나 `fix:` 같은 작업 유형 접두사는 카테고리 앞에 추가하지 않는다.

예: `decisions: 결정 목록과 상세 페이지 데이터 레이어 추가`

## 커밋

명시적으로 선택한 파일만 스테이징하고, 스테이징 결과를 확인한 뒤 커밋한다.

```bash
git add <파일...>
git diff --cached --stat
git commit -m "<카테고리>: <한국어 설명>"
```

커밋 후 `git status --short`와 최신 커밋을 확인해 결과를 보고한다.

## 금지 사항

- 관련 없는 변경을 한 커밋에 섞지 않는다.
- 실패하는 검사를 숨기려고 파일을 제외하지 않는다.
- 사용자가 명시적으로 요청하지 않으면 커밋하지 않는다.
- 사용자가 요청하지 않으면 amend, rebase, force push로 기존 이력을 변경하지 않는다.
- 사용자가 요청하지 않으면 push하지 않는다.
