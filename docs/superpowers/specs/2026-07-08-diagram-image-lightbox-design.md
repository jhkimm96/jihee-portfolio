# 다이어그램/이미지 렌더링 + 라이트박스 설계

- 날짜: 2026-07-08
- 위치: `C:/cowork/portfolio`
- 범위: `components/markdown.tsx`를 확장해, 콘텐츠(project/troubleshooting/study/decisions 공통)
  본문 안에서 mermaid 텍스트 다이어그램을 자동 렌더링하고, 이미지/다이어그램을 클릭하면 확대해서
  보여주는 라이트박스를 추가한다.

## 배경 / 목적

트러블슈팅·설계 결정 글에서 아키텍처/시퀀스/플로우 흐름을 설명할 때 텍스트만으로는 이해하기
어려운 경우가 있다. 이미지 파일 삽입은 이미 별도 작업 없이 동작하지만(Velite 기본 remark/rehype가
`![]()` 문법을 `<img>`로 컴파일), 다이어그램은 지원되지 않는다. 또한 이미지/다이어그램을 본문
크기 그대로만 보여주면 세부 내용을 읽기 어렵다.

## 제약 조건 (기존 아키텍처 보존)

- MDX 런타임을 쓰지 않고 Velite가 컴파일한 정적 HTML을 `dangerouslySetInnerHTML`로 렌더링하는
  기존 방식을 유지한다. 이번 기능은 그 정적 HTML을 브라우저에서 **후처리(progressive
  enhancement)**하는 방식으로 구현하며, 서버 렌더링/빌드 파이프라인 자체는 바꾸지 않는다.
- 빌드 타임에 헤드리스 브라우저(playwright 등)를 띄워 다이어그램을 정적 SVG로 미리 렌더링하는
  방식은 채택하지 않는다 — 개인 포트폴리오 규모에 비해 빌드 의존성(크로미움 등)이 과하다.

## 아키텍처

`components/markdown.tsx`를 client 컴포넌트(`'use client'`)로 전환한다. project/troubleshooting/
study/decisions 4개 콘텐츠 타입이 모두 이 컴포넌트 하나를 통해 렌더링되므로, 여기 한 곳만 고치면
전체 콘텐츠에 자동 적용된다. 컴포넌트는 여전히 `dangerouslySetInnerHTML`로 서버가 만든 HTML을
그대로 렌더링하되, `useRef`로 컨테이너를 잡고 마운트 후(`useEffect`) 두 가지를 후처리한다:
mermaid 다이어그램 렌더링과 이미지/다이어그램 클릭 시 라이트박스.

## Mermaid 다이어그램 렌더링

- 글 본문에 ` ```mermaid ` 코드 블록을 쓰면 Velite 기본 파이프라인이 별도 설정 없이
  `<pre><code class="language-mermaid">...</code></pre>`로 컴파일한다(remark/rehype 커스터마이징
  불필요).
- `Markdown` 컴포넌트 마운트 시, 컨테이너 안에서 `pre code.language-mermaid`를
  `querySelectorAll`로 찾는다. **하나도 없으면 아무 것도 하지 않는다** — `mermaid` 패키지를
  아예 import하지 않아 다이어그램이 없는 페이지의 번들에 영향이 없다.
- 하나라도 있으면 `import('mermaid')`로 동적 import(코드 스플리팅)한 뒤, 찾은 블록마다
  `mermaid.render(고유id, 코드텍스트)`로 SVG를 생성해 원래 `<pre>` 요소를
  `<div class="mermaid-diagram">{svg}</div>`로 교체한다.
- `mermaid.initialize({ startOnLoad: false, theme: ... })`를 최초 1회 호출한다. `theme`은
  마운트 시점에 `document.documentElement.classList.contains('dark')`를 확인해 `dark`/`default`
  중 하나로 고정한다. 사용자가 렌더링 이후 라이트/다크를 전환해도 이미 그려진 다이어그램은
  다시 그리지 않는다(범위 밖 — 새로고침하면 반영됨).
- `mermaid.render()`가 문법 오류로 실패하면 catch해서, 해당 블록은 원본 코드 텍스트를 그대로
  두고 코드 블록 바로 아래에 작은 오류 메시지(`"다이어그램을 렌더링하지 못했습니다"`)를 추가한다.
  한 블록의 오류가 페이지 전체 렌더링을 막지 않는다.

## 라이트박스 (클릭 시 확대)

- `Markdown` 컴포넌트는 `lightboxContent: { type: 'image' | 'svg'; markup: string } | null`
  state를 갖는다.
- 컨테이너 `div`에 클릭 리스너를 **하나만** 등록한다(이벤트 위임). 클릭된 요소가 `<img>`이면
  `{ type: 'image', markup: img.src }`로, `.mermaid-diagram` 안의 `<svg>`(또는 그 하위 요소)이면
  가장 가까운 `.mermaid-diagram`을 찾아 `{ type: 'svg', markup: 해당 div의 innerHTML }`로
  state를 설정한다. 그 외 요소 클릭은 무시한다.
- state가 있으면 오버레이(`position: fixed; inset: 0`)를 렌더링한다. 배경은 반투명 검정,
  중앙에 확대된 이미지(`<img>`) 또는 SVG(`dangerouslySetInnerHTML`)를 표시하고, 최대
  `90vw`/`90vh`로 제한해 뷰포트를 넘지 않게 한다.
- 닫기: 오버레이 배경 클릭, 우측 상단 닫기 버튼 클릭, `Escape` 키 중 하나로 `lightboxContent`를
  `null`로 리셋한다. 포커스 트랩은 만들지 않는다(개인 포트폴리오 규모에서 과함 — 범위 밖).
- 커서: `.prose-content img`와 `.prose-content .mermaid-diagram`에 `cursor: zoom-in`을 적용해
  클릭 가능함을 시각적으로 알린다.

## 콘텐츠 작성 방식

- **이미지**: 파일을 `public/{project}/images/`에 직접 넣고, 본문에
  `![대체 텍스트](/{project}/images/파일명.png)`로 참조한다. `publish-study`/
  `publish-troubleshooting`/`publish-decision` 스킬은 텍스트 초안만 작성하므로, 이미지 파일
  자체는 항상 사람이 직접 넣는다 — 이번 스펙에서 스킬 워크플로우를 바꾸지 않는다.
- **다이어그램**: 본문에 ` ```mermaid ` 코드 블록으로 mermaid 문법을 직접 쓴다(플로우차트,
  시퀀스 다이어그램 등 mermaid가 지원하는 모든 타입).

## 스타일 (`app/globals.css`)

- `.prose-content img`, `.prose-content .mermaid-diagram`: `cursor: zoom-in`, 다이어그램은
  `display: flex; justify-content: center;`로 중앙 정렬.
- 라이트박스 오버레이: 반투명 배경, 중앙 정렬 콘텐츠, 닫기 버튼 스타일.

## 의존성

- `mermaid` (dependencies에 추가). 다이어그램이 있는 페이지에서만 동적 import되므로 다이어그램
  없는 페이지의 번들 크기에는 영향이 없다.

## 검증 방식

이 레포는 페이지/컴포넌트 단위 자동 테스트가 없는 기존 관례를 따른다(수동 브라우저 확인).

- `content/career-link/troubleshooting/security/jwt-refresh-race.mdx`에 시퀀스 다이어그램
  mermaid 블록을 하나 추가한다(동시성 이슈를 다루는 글이라 시퀀스 다이어그램이 자연스럽게
  어울림).
- 같은 글에 기존 `/career-link/images/thumbnail.svg` 이미지도 본문에 하나 참조해 넣는다.
- 브라우저로 해당 글을 열어 다이어그램이 SVG로 렌더링되는지, 이미지/다이어그램 클릭 시
  라이트박스가 뜨는지, 배경 클릭/Esc로 닫히는지 확인한다.
- 다이어그램이 없는 다른 글(`content/career-link/troubleshooting`이나
  `prompthub/api/rate-limit-429.mdx`)을 열어 네트워크 탭에서 `mermaid` 청크가 로드되지
  **않는** 것을 확인한다.
- `npm run build`가 통과하는지 확인한다.

## 범위 밖

- 빌드 타임 정적 SVG 사전 렌더링(playwright 등) — 빌드 의존성이 무거워 개인 포트폴리오 규모에
  과함.
- 다크/라이트 모드 전환 시 이미 렌더링된 다이어그램의 실시간 재렌더링.
- 라이트박스의 핀치 줌/드래그 팬 같은 고급 인터랙션 — 클릭 확대만 지원.
- `publish-study`/`publish-troubleshooting`/`publish-decision` 스킬이 이미지 파일 자체를
  자동으로 만들거나 배치하는 것 — 스킬은 여전히 텍스트만 다룬다.
- 직접 손으로 그리는 인터랙티브 SVG 컴포넌트(다이어그램마다 커스텀 코드 작성) — mermaid 텍스트
  문법으로 충분히 해결되는 범위이므로 채택하지 않는다.
