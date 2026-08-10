---
name: 김지희 개발 포트폴리오
description: 판단의 근거를 기록으로 남기는 백엔드 개발자의 기술 포트폴리오
colors:
  signal-blue: "oklch(0.55 0.13 255)"
  ink: "oklch(0.22 0.012 260)"
  graphite: "oklch(0.26 0.018 262)"
  paper: "oklch(0.992 0.001 260)"
  card-white: "oklch(1 0 0)"
  quiet-surface: "oklch(0.965 0.003 260)"
  rule: "oklch(0.912 0.004 260)"
  secondary-text: "oklch(0.505 0.012 260)"
  status-live: "oklch(0.62 0.14 155)"
  status-archived: "oklch(0.68 0.13 75)"
  status-github: "oklch(0.55 0.01 260)"
  destructive: "oklch(0.577 0.222 27.2)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  code:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.85em"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
rounded:
  sm: "0.25rem"
  md: "0.35rem"
  lg: "0.5rem"
  xl: "0.675rem"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "7": "28px"
  "10": "40px"
  "14": "56px"
  "20": "80px"
components:
  button-primary:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "0 12px"
    height: "32px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 12px"
    height: "32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-text}"
    rounded: "{rounded.lg}"
    padding: "0 12px"
    height: "32px"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "20px"
  chip-tech:
    backgroundColor: "{colors.quiet-surface}"
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  badge-status:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  nav-link-active:
    backgroundColor: "{colors.quiet-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  input-search:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
---

# Design System: 김지희 개발 포트폴리오

## Overview

**Creative North Star: "엔지니어링 노트북"**

이 사이트는 실험 노트다. 완성된 결과물을 전시하는 갤러리가 아니라, 무엇을 관찰했고 왜 그렇게 판단했는지가 날짜와 함께 적힌 기록물이다. 그래서 화면은 설득하려 들지 않고 기록한다. 방문자가 느껴야 할 것은 감탄이 아니라 **신뢰**다 — "이 사람은 지어내지 않는구나."

그 태도가 시각적으로 드러나는 방식은 하나다. **기계가 아는 사실과 사람이 쓴 문장을 서체로 구분한다.** 날짜, 개수, 태그, 기술 스택, 경로, 상태 라벨처럼 시스템에서 나온 값은 모노스페이스로 등폭 정렬되어 흔들리지 않는다. 그 옆에서 사람이 판단하고 쓴 문장은 산세리프로 편안하게 흐른다. 이 대비가 이 사이트 개성의 90%이며, 다른 어떤 장식도 이만큼 일하지 않는다.

바탕은 순수한 흰색이나 검정이 아니라 hue 260으로 아주 살짝 기운 쿨 그레이다. 그림자도 같은 hue를 머금는다. 그래서 화면 전체가 한 장의 종이처럼 한 덩어리로 읽힌다. 그 위에 0.028 불투명도의 미세한 그레인이 깔려 완전히 평평한 디지털 표면을 아주 조금 깬다 — 눈치채면 안 되고, 없으면 허전한 정도의 질감이다. 유채색은 사실상 파랑 하나뿐이고, 그 하나조차 아껴 쓴다.

**Key Characteristics:**
- 모노스페이스가 메타데이터를, 산세리프가 서술을 담당하는 이중 서체 체계
- hue 260으로 통일된 쿨 그레이 중립 — 배경, 테두리, 그림자가 같은 계열
- 유채색은 시그널 블루 하나. 상태색 3종은 별도 어휘로 격리
- 카드는 정지 상태부터 또렷이 들려 있고, 호버에서 한 단 더 올라온다
- 섹션은 상자가 아니라 한 줄의 선으로 나뉜다
- 등폭 숫자(`tabular-nums`)가 전역 기본값 — 수치가 세로로 정렬된다

## Colors

거의 무채색인 쿨 그레이 지반 위에 파란 신호등 하나. 색은 분위기를 만들려고 쓰이지 않고, 무언가를 **가리키려고** 쓰인다.

### Primary

- **시그널 블루 / Signal Blue** (`oklch(0.55 0.13 255)`, 다크 `oklch(0.72 0.12 255)`): 이 사이트의 유일한 유채색. 근거로 가는 링크, Key outcome 블록, 활성 내비게이션의 밑단, 인용문 좌측 테두리, 호버 시 카드 테두리, 히어로 뒤 방사형 광원. 채도를 눌러 놓았기 때문에 여러 번 등장해도 시끄럽지 않지만, 그 절제가 규칙으로 지켜질 때만 신호로 작동한다.

### Neutral

- **잉크 / Ink** (`oklch(0.22 0.012 260)`): 본문과 제목. 순수 검정이 아니라 아주 살짝 푸른 먹색.
- **그라파이트 / Graphite** (`oklch(0.26 0.018 262)`): 기본 버튼과 프로젝트 배지의 바탕. 잉크보다 한 단 밝아 텍스트와 구분된다.
- **페이퍼 / Paper** (`oklch(0.992 0.001 260)`): 페이지 지반. 순백이 아니라 한 톤 낮춘 종이.
- **카드 화이트 / Card White** (`oklch(1 0 0)`): 카드 표면. 지반보다 밝아서 들려 보인다. 라이트 모드에서 유일하게 순백인 자리.
- **콰이엇 서피스 / Quiet Surface** (`oklch(0.965 0.003 260)`): 코드 블록, 기술 칩, 활성 내비게이션, 표 헤더. 강조 없이 "여기는 다른 성격"만 표시한다.
- **룰 / Rule** (`oklch(0.912 0.004 260)`): 모든 테두리와 구분선. 이 시스템에서 가장 자주 등장하는 선.
- **세컨더리 텍스트 / Secondary Text** (`oklch(0.505 0.012 260)`): 요약문, 날짜, 메타데이터. 본문보다 확실히 물러나되 읽힌다.

### Tertiary — 상태 어휘

프로젝트가 지금 접근 가능한지를 알리는 3색. 액센트가 아니라 **데이터**다.

- **라이브 그린** (`oklch(0.62 0.14 155)`): 데모가 실제로 떠 있음.
- **아카이브 앰버** (`oklch(0.68 0.13 75)`): 종료·보관됨.
- **깃허브 그레이** (`oklch(0.55 0.01 260)`): 코드만 공개, 실행 인스턴스 없음. 무채색인 것이 의도다 — 중립 상태에 색을 주지 않는다.

### 차트 팔레트

품질 대시보드는 UI 토큰과 **분리된 hex 팔레트**를 쓴다(`--viz-series` `#2a78d6`, 심각도 `#d03b3b` / `#ec835a` / `#fab219`, 델타 `#006300` / `#d03b3b`). 카드 표면 위에서 대비를 검증한 값이므로 UI 토큰으로 대체하지 말 것. 차트의 계열색은 액센트가 아니며, 반대로 액센트를 차트 계열색으로 끌어다 쓰지도 않는다.

### Named Rules

**The Signal Rule.** 시그널 블루는 *가리킬 때만* 쓴다. 근거·경로·활성 상태를 지시하는 자리에만 나타나고, 넓은 면을 칠하거나 분위기를 내는 데 쓰지 않는다. 한 화면에서 파란 픽셀이 10%를 넘으면 그건 이미 신호가 아니라 배경이다.

**The Status-Is-Not-Accent Rule.** 라이브/아카이브/깃허브 3색은 상태 표시 전용이다. 초록이 예뻐 보인다는 이유로 버튼이나 강조에 승격시키지 않는다. 이 3색이 다른 데서 보이는 순간 배지의 의미가 죽는다.

**The Cool-260 Rule.** 새로 만드는 중립은 hue 260을 지킨다. 순수 회색(chroma 0)이나 다른 hue의 회색을 섞으면 화면이 두 장의 종이로 갈라진다. 그림자도 검정이 아니라 `oklch(0.32 0.02 260)` 계열이다.

## Typography

**Display / Body Font:** Geist (fallback: `ui-sans-serif, system-ui, sans-serif`)
**Label / Mono Font:** Geist Mono (fallback: `ui-monospace, SFMono-Regular, monospace`)

**Character:** 한 가족의 산세리프와 모노스페이스를 짝지었다. 둘의 골격이 같아 한 화면에 섞여도 이질감이 없고, 그래서 서체 전환이 **장식이 아니라 의미의 전환**으로 읽힌다. Geist는 중립적이고 조금 기하학적이다 — 개성을 주장하지 않으므로 내용이 앞에 선다.

### Hierarchy

- **Display** (700, 2.25rem → 640px 이상에서 3rem, lh 1.1, ls -0.025em): 홈 히어로의 이름 한 줄에만. 사이트 전체에서 한 번 등장한다.
- **Headline** (700, 1.875rem → 640px 이상에서 2.25rem, lh 1.15, ls -0.02em): 각 목록 페이지와 문서의 제목. `text-balance`로 줄바꿈을 고르게 잡는다.
- **Title** (600, 1.25rem / 1.125rem, lh 1.4, ls -0.025em): 섹션 제목과 문서 내 h2. 문서 본문의 h2는 아래에 `border-b` 한 줄을 깐다.
- **Card Title** (600, 1rem / 0.95rem, lh 1.375): 카드 제목. `text-pretty`로 고아 단어를 막는다.
- **Body** (400, 0.95rem, lh 1.625): 본문과 요약. 문서 본문은 `text-foreground/90`으로 아주 살짝 눌러 제목과의 위계를 만든다.
- **Label** (모노, 500, 0.7rem–0.8rem, ls 0.02em): 날짜, 개수, 태그, 기술 칩, 상태, 내비게이션, 카드 하단 메타. 이 시스템에서 가장 자주 쓰이는 역할.
- **Eyebrow** (모노, 500, 0.75rem, 대문자, ls 0.1em): 섹션 위의 소제목(`Selected work` 등). 액센트색.
- **Code** (모노, 0.85em, lh 1.625): 인라인 코드는 콰이엇 서피스 바탕에 `rounded-sm`, 블록은 테두리 있는 `rounded-md`.

### Named Rules

**The Mono-Is-Metadata Rule.** 모노스페이스는 *시스템이 아는 사실*에만 쓴다 — 날짜, 개수, 슬러그, 기술명, 상태, 경로, 내비게이션 라벨. 사람이 판단해서 쓴 문장은 절대 모노로 조판하지 않는다. 이 경계가 흐려지면 노트북이 터미널 흉내로 전락한다.

**The Tabular-By-Default Rule.** `.font-mono`, `<time>`, `tabular` 클래스는 전역에서 `font-variant-numeric: tabular-nums`를 받는다. 수치가 세로로 정렬되지 않는 곳은 버그로 본다.

**The 62ch Rule.** 페이지 설명문은 `62ch`, 빈 상태 안내는 `42ch`, 히어로 리드는 `max-w-2xl`에서 끊는다. 측정 가능한 상한이 있고, 눈대중으로 넘기지 않는다.

## Layout

**컨테이너.** 본문 폭은 `max-w-5xl`(1024px), 좌우 여백은 `px-4`에서 640px 이상 `px-6`. 검색처럼 읽기 전용 화면은 `max-w-3xl`로 더 좁힌다. 페이지는 중앙 한 단이며 사이드바는 없다.

**헤더.** 높이 56px 고정, `sticky top-0`, 배경은 `bg-background/85` + `backdrop-blur-md`. 스크롤해도 사라지지 않는다 — 어느 페이지든 단독 진입점이므로 전체 구조가 항상 손에 닿아야 한다.

**섹션 리듬.** 히어로는 `py-14`(모바일) / `py-20`(640px 이상), 이후 섹션은 `py-10`. 카드 내부 패딩은 20px, 카드 사이 간격은 목록에서 12px, 프로젝트 그리드에서 16px.

**그리드.** 기본 1열, `md`(768px)에서 2열로 한 번만 꺾인다. 3열 이상으로 쪼개지 않는다 — 카드마다 제목·요약·메타 3층이 들어가야 하므로 좁아지면 읽히지 않는다.

**모바일.** 768px 미만에서 내비게이션은 햄버거로 접히고, 열리면 헤더 아래 세로 목록으로 펼쳐진다(드로어나 모달이 아니다). 데스크톱 검색 필드는 `lg`(1024px) 미만에서 숨고 검색 페이지로 대체된다.

**인쇄.** 이력서는 인쇄 대상이다. `.no-print`로 내비게이션·버튼을 제거하고, `.print-container`가 폭 제한과 여백을 풀고, `.print-page`가 그림자와 테두리를 없앤다. 바탕은 순백, 글자는 순검정으로 강제한다.

### Named Rules

**The Rule-Not-Box Rule.** 섹션은 카드로 감싸지 않고 `border-b` / `border-t` 한 줄로 나눈다. 상자 안의 상자는 이 시스템에 없다. 카드는 *목록의 항목*일 때만 등장한다.

## Elevation & Depth

그림자를 쓴다. 다만 그림자의 색이 검정이 아니라 배경의 hue 260을 머금고, 광원은 위에서 아래 하나로 통일되어 있다. 그래서 떠 있는 느낌이 화면의 색과 싸우지 않는다.

카드는 **정지 상태부터 또렷하게 들려 있다**(e2). 목록이 물리적인 카드 더미처럼 읽히고, 호버에서 한 단 더 올라오며(e3) 4px 떠오른다. 다크 모드에서는 어두운 표면 위에서 형태가 죽지 않도록 더 깊고 넓게 퍼지는 값을 따로 쓴다.

### Shadow Vocabulary

- **e1** (`--elevation-1`): 버튼과 작은 표면(빈 상태 아이콘, 스킵 링크). 떠 있다기보다 바닥에서 살짝 떼어 놓는 정도.
- **e2** (`--elevation-2`): **카드의 정지 상태.** 목록에서 항목이 지반과 분리되어 보이게 한다.
- **e3** (`--elevation-3`): 카드의 호버·포커스 상태. 이 시스템에서 가장 강한 그림자이며 상호작용에만 허용된다.

### Named Rules

**The Two-Step Rule.** 카드는 정지 e2 → 호버 e3, 딱 두 단만 오간다. 세 단계 이상으로 쌓지 않고, 카드에 e1을 쓰지 않는다.

**The One-Light Rule.** 모든 그림자의 광원은 위쪽 하나다. 방향이 다른 그림자를 새로 만들지 않는다.

**The Tinted-Shadow Rule.** 그림자는 `oklch(... 260)` 계열로 물들인다. `rgba(0,0,0,...)`를 새로 쓰지 않는다.

## Shapes

곡률은 작고 일관적이다. 기준값 `--radius: 0.5rem`에서 배수로 파생되며, **담는 것이 클수록 반지름이 커진다**: 칩·입력·코드 블록 `md`(5.6px) → 버튼 `lg`(8px) → 카드 `xl`(10.8px) → 상태 배지 `full`(알약). 완전한 직각도, 과한 둥근 모서리도 쓰지 않는다.

선은 이 시스템의 주된 구조 재료다. 카드 테두리, 섹션 구분선, 표 격자, 문서 h2 아래 밑줄, 인용문 좌측 2px 바가 모두 같은 `rule` 색을 공유한다. 빈 상태만 `border-dashed`로 "여기는 아직 비었다"를 형태로 말한다.

**모션.** 이징은 `--ease-out-soft`(`cubic-bezier(0.22, 1, 0.36, 1)`) 하나로 통일한다. 지속 시간은 두 값뿐이다 — 즉각적인 피드백(버튼, 아이콘, 색 전환) 200ms, 표면 이동(카드 리프트, 그림자) 300ms. `prefers-reduced-motion`에서 모든 애니메이션과 전환이 0.01ms로 무력화되고 스무스 스크롤도 꺼진다.

**질감.** 화면 전체에 고정된 그레인 오버레이(SVG `feTurbulence`, 라이트 0.028 / 다크 0.05, `pointer-events: none`). 히어로 뒤에는 시그널 블루를 90~94% 투명하게 녹인 방사형 광원 두 겹이 깔린다 — 45도 선형 그라디언트의 균일함을 피하기 위한 선택이다.

### Named Rules

**The Radius-Ladder Rule.** 곡률은 담는 것의 크기를 따라간다. 칩이 카드보다 둥글거나, 카드가 배지보다 둥근 상황을 만들지 않는다.

**The Two-Duration Rule.** 200ms 아니면 300ms. 새 지속 시간을 발명하지 않는다.

## Components

### Buttons

- **Shape:** 부드럽게 둥근 모서리(`rounded-lg`, 8px). 기본 높이 32px(`h-8`)로 작고 조밀하다 — 이 사이트에서 버튼은 주인공이 아니다.
- **Primary:** 그라파이트 바탕 + 페이퍼 글자, `shadow-e1`, 좌우 패딩 12px, 0.875rem/500.
- **Hover / Focus:** 호버 시 바탕 80% 불투명 + `shadow-e2`. 포커스는 `ring-3`에 `ring/30`과 테두리 색 전환. `active`에서 1px 내려앉고 그림자가 사라진다 — 눌린 느낌을 색이 아니라 위치로 표현한다.
- **Outline / Secondary / Ghost:** 각각 테두리+배경, 콰이엇 서피스, 투명 바탕. 셋 다 호버에서 `muted` 계열로 채워진다.
- **Link:** 텍스트만, 호버에서 `underline-offset-4` 밑줄.
- 아이콘은 기본 16px(`size-4`), `xs` 크기에서 12px. 항상 `shrink-0`.

### Chips

- **기술 칩:** 콰이엇 서피스 바탕, 모노 0.7rem/500, `rounded-md`, 패딩 2px 8px. 테두리 없음. 4개까지 노출하고 나머지는 `+N`으로 접는다.
- **태그:** 배경 없이 `#태그` 형태의 모노 텍스트, 세컨더리 텍스트 색. 칩보다 한 단 약한 어휘다.
- **콘텐츠 배지:** 프로젝트 배지는 그라파이트 바탕에 반전 글자(가장 강함), 카테고리 배지는 테두리만(가장 약함). 이 대비가 "어느 프로젝트인지"를 먼저 읽게 한다.

### Cards / Containers

- **Corner Style:** `rounded-xl` (10.8px).
- **Background:** 카드 화이트, 지반은 페이퍼. 썸네일 영역은 `aspect-[1200/500]`에 하단 테두리.
- **Shadow Strategy:** 정지 e2 → 호버 e3 (Elevation 참조). 호버에서 `-translate-y-1`(프로젝트) / `-translate-y-0.5`(포스트), 테두리는 시그널 블루 40%로 전환, 300ms.
- **Border:** `rule` 색 1px 상시.
- **Internal Padding:** 20px. 내부 구획은 `border-t` + `pt-3`으로 나눈다.
- **우상단 화살표:** 카드 제목 옆 `ArrowUpRight` 16px이 호버에서 우상단으로 2px 이동하며 액센트색이 된다 — 카드 전체가 링크임을 알리는 유일한 신호.

### Inputs / Fields

- **Style:** `rounded-md`, `rule` 테두리 1px, 페이퍼 바탕. 헤더 검색은 32px 높이에 모노 0.75rem이고 좌측에 14px 아이콘, 검색 페이지는 40px 높이에 산세리프 0.875rem.
- **Focus:** 아웃라인을 없애고 테두리만 시그널 블루로 전환한다(200ms). 링을 두르지 않는 유일한 컴포넌트다.
- **Placeholder:** 세컨더리 텍스트 색.

### Navigation

- 항목은 모노 0.8rem/500, `rounded-md`, 패딩 6px 12px.
- **활성:** 콰이엇 서피스 바탕 + 잉크 글자. **비활성:** 세컨더리 텍스트, 호버 시 바탕 60% + 잉크.
- 활성 판정은 정확히 일치하거나 해당 경로의 하위일 때(`/projects/foo`도 Projects 활성).
- 로고는 28px 그라파이트 정사각(`rounded-md`)에 터미널 아이콘 + 모노 이름.
- **모바일:** 768px 미만에서 햄버거 → 헤더 아래 세로 목록. 항목 높이가 40px로 커진다.

### Empty State

`rounded-xl` 점선 테두리에 `muted/25` 바탕, 중앙에 44px 아이콘 타일(`rounded-lg`, 카드 바탕, e1), 그 아래 42ch로 제한된 안내문. 오류가 아니라 "아직 없음"임을 형태로 말한다.

### 문서 본문 (`.prose-content`)

이 사이트의 진짜 주력 컴포넌트다.

- **h2**: 위 32px 여백, 아래 `border-b` + 8px 패딩. 문서 안에서 챕터를 나누는 유일한 선.
- **링크**: 액센트색 + `underline-offset-4` 상시 밑줄. 본문에서는 밑줄을 숨기지 않는다.
- **인용문**: 좌측 시그널 블루 2px 바, 세컨더리 텍스트.
- **표**: 0.8em, 전 셀 테두리, 헤더는 콰이엇 서피스, 짝수 행 `muted/40`. 밀도가 높다 — 비교표가 많은 콘텐츠다.
- **`<details>`**: `rounded-md` 테두리 + `muted/30` 바탕, summary는 호버에 반응하고 열리면 아래 구분선이 생긴다. 긴 근거를 접어두는 장치.
- **이미지 / Mermaid**: `cursor-zoom-in`. 클릭하면 80% 검정 오버레이 라이트박스로 확대된다(90vw/90vh 상한, 우상단 원형 닫기).

### Signature — Key outcome 블록

프로젝트 카드 안의 액센트 박스. 시그널 블루 20% 테두리에 5% 바탕, `rounded-md`, 모노 0.68rem 액센트 라벨 아래 0.875rem/500 한 문장. **카드에서 유일하게 색을 쓰는 자리**이며, 채용 담당자가 카드 하나에서 반드시 읽어야 할 한 줄을 여기에 둔다. 이 블록을 카드마다 여러 개 두거나 다른 색으로 복제하면 The Signal Rule이 깨진다.

## Do's and Don'ts

### Do:

- **Do** 시스템이 아는 값(날짜·개수·태그·스택·상태·경로)은 Geist Mono로, 사람이 쓴 문장은 Geist로 조판한다.
- **Do** 새 중립색은 hue 260, chroma 0.001–0.018 범위에서 만든다.
- **Do** 카드를 정지 e2 / 호버 e3 두 단으로만 운용하고, 호버 이동은 4px 이내로 제한한다.
- **Do** 새 전환에 `--ease-out-soft`와 200ms/300ms 중 하나를 쓴다.
- **Do** 프로젝트에 `status`와 `statusNote`를 붙여 지금 접근 가능한지 밝힌다.
- **Do** 긴 텍스트에 상한을 둔다 — 설명 62ch, 빈 상태 42ch.
- **Do** 새 인터랙티브 요소에 `focus-visible` 링을 주고, 새 애니메이션을 `prefers-reduced-motion` 블록에서 무력화한다.
- **Do** 수치가 세로로 나열되는 곳에 `tabular-nums`를 확인한다.
- **Do** 인쇄 대상 화면의 장식 요소에 `.no-print`를 붙인다.

### Don't:

- **Don't** 시그널 블루로 넓은 면을 칠하거나 분위기를 낸다. 가리키는 자리에만 쓴다.
- **Don't** 상태 3색(라이브·아카이브·깃허브)을 배지 밖으로 꺼내 강조색으로 쓴다.
- **Don't** 차트 hex 팔레트를 UI 토큰으로 바꾸거나, 액센트를 차트 계열색으로 끌어다 쓴다.
- **Don't** 섹션을 카드로 감싼다. 구분은 선 한 줄로 한다. 상자 안의 상자는 없다.
- **Don't** `rgba(0,0,0,...)` 그림자나 검정 그림자를 새로 만든다.
- **Don't** 카드 그리드를 3열 이상으로 쪼갠다. 1열 → `md`에서 2열, 여기서 끝난다.
- **Don't** 사람이 쓴 서술 문장을 모노스페이스로 조판한다.
- **Don't** 새 반지름·지속 시간·이징을 발명한다. 사다리와 두 값 안에서 고른다.
- **Don't** 본문 링크의 밑줄을 지운다.
- **Don't** 그레인 오버레이의 불투명도를 눈에 띄게 올린다. 알아채는 순간 실패다.
