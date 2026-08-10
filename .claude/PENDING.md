# 미결 사항

세션을 시작할 때 이 목록을 사용자에게 먼저 확인할 것. 해소되면 해당 항목을 지운다.
전부 비면 이 파일을 삭제한다(훅이 자동으로 조용해진다).

## 1. 프로젝트 GitHub 링크 2건이 404 — 사용자 결정 대기

`content/prompthub/project.mdx`와 `content/career-link/project.mdx`의 `github:` 값이
`https://github.com/jihee/...`인데 **둘 다 HTTP 404**다. `jihee`는 사용자 계정이 아니다
(실제 계정은 `jhkimm96`). PromptHub는 `status: github-only`라 "코드는 GitHub뿐"이라는
배지가 이 링크를 가리키므로, 채용 담당자가 지금 누르면 404를 본다.

확인된 사실:
- 팀 저장소 `prgrms-be-adv-devcourse/beadv6_6_3JMT_BE`는 **공개**이며 접근 가능
- `jhkimm96` 공개 저장소: `career-link-ui`, `career-roadmap`, `jihee-portfolio`,
  `my-dev-journey`, `springboot-web-project`
- **career-link 백엔드에 해당하는 공개 저장소는 없다**

물어볼 것: PromptHub를 팀 저장소로 걸지, Career Link를 `career-link-ui`로 걸지 아니면
비공개라 링크를 뺄지.

**URL을 추측해서 넣지 말 것.** 이전 세션에서 두 번 추측했고 둘 다 타인의 저장소였다.
