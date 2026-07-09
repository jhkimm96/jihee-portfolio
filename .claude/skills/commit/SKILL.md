---
name: commit
description: 변경 단위별로 커밋 메시지를 작성하고 커밋한다. "커밋해줘"라는 요청이나 논리적으로 완결된 변경 단위가 끝났을 때 사용한다.
---

# Commit Skill

## 1. 변경 확인

```bash
git status --short
git diff --stat
```

관련 없는 변경이 섞여 있으면 파일 단위로 나눠서 커밋한다.

## 2. 카테고리 판단

`git diff --stat`으로 바뀐 경로를 보고 아래 기준으로 카테고리를 정한다. 여러 카테고리가
섞여 있으면 커밋을 나눈다.

| 경로 | 카테고리 |
|---|---|
| `content/{project}/troubleshooting/**` | `troubleshooting` |
| `content/{project}/decisions/**` | `decisions` |
| `content/{project}/reviews/**` | `reviews` |
| `content/study/**` | `study` |
| `content/{project}/**` (위 항목 외 프로젝트 자체 콘텐츠/코드) | `{project}` (예: `career-link`, `prompthub`) |
| `content/profile/**`, `app/(resume\|about)/**` | `profile` |
| `app/`, `components/`, `lib/` 등 사이트 공통 코드 (nav, layout, 스키마, 빌드 설정 등) | `site` |

애매하면 가장 넓은 범위(`site`)보다 구체적인 카테고리를 우선한다.

## 3. 커밋 메시지 작성

형식: `<카테고리>: <설명>`. 설명은 한국어로, 무엇을 했는지 한 줄로 명확하게 쓴다.
`feat:`/`fix:` 같은 작업 유형 프리픽스는 쓰지 않고 카테고리만 붙인다.

예: `decisions: 결정 목록/상세 페이지와 데이터 레이어 추가`, `site: Button asChild shim의 중첩 <a><a> SSR 출력 수정`

## 4. 커밋

```bash
git add <파일...>
git commit -m "<카테고리>: <한국어 설명>"
```

## 금지 사항

- 관련 없는 변경을 한 커밋에 섞지 않는다.
- 실패하는 테스트를 숨기려고 파일을 제외하지 않는다.
- 사용자가 명시적으로 요청하지 않으면 커밋하지 않는다.
