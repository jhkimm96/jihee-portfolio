---
status: approved
approved_at: 2026-11-12T01:21
files:
  - lib/project-showcase.ts
  - lib/project-showcase.test.ts
  - components/project-showcase-panel.tsx
  - components/home-interactive.tsx
  - app/page.tsx
  - app/projects/[slug]/page.tsx
  - components/site-nav.tsx
  - app/globals.css
  - components/theme-provider.tsx
  - app/layout.tsx
  - DESIGN.md
tests_first:
  - impl: lib/project-showcase.ts
    test: lib/project-showcase.test.ts
---

# 홈 1번 시안 + 대표 프로젝트 상세 첫 화면 + 사이트 전체 색

## 1. 파일
- 새로 만들 파일: `lib/project-showcase.ts`(대표 프로젝트 4개 소개 자료), `lib/project-showcase.test.ts`, `components/project-showcase-panel.tsx`
- 고칠 파일: `components/home-interactive.tsx`(1번 홈), `app/page.tsx`(기록 개수 전달), `app/projects/[slug]/page.tsx`(첫 화면 패널), `components/site-nav.tsx`(이력서 메뉴), `app/globals.css`(색 변수, 옛 홈 CSS 삭제), `components/theme-provider.tsx`(밝은 화면 기본), `app/layout.tsx`(주소창 색), `DESIGN.md`(색 설명)

## 2. 이름과 흐름
- `projectShowcases`: 대표 프로젝트 4개의 소개 자료(meta, role, media, flow). 홈 카드와 상세 첫 화면이 같이 쓴다. 키 순서가 대표 프로젝트 순서다.
- `HomeInteractive`: 첫 화면 → 경력 요약 띠 → 대표 프로젝트 카드 넘기기(`scrollProjectCards`) → 바로가기.
- `ShowcaseProjectTabs`: 대표 프로젝트 4개 링크 탭. 지금 프로젝트를 표시한다.
- `ProjectShowcasePanel`: 그림 넘기기(`moveMedia`) + 소개(children) + 문제→선택→구현→검증 단계.
- `ShowcaseMediaFrame`: 그림 한 장. 공개 화면이 없으면 설명과 단계 이름만.

## 3. 기존 코드와의 연관
- `home-interactive.tsx`의 `projectViews`를 소개 자료로 옮긴다. 기술 목록은 MDX `stack`을 쓴다.
- 상세 페이지의 제목·설명·기술·버튼은 소개 자료가 있으면 패널 안으로 옮긴다(중복 방지).
- `--ink-*` 변수는 공통 색 변수를 따르게 바꾼다. 페이지 클래스는 그대로 둔다.

## 4. 빼는 것 (ponytail)
- 기업별 포트폴리오 페이지(없음, 직무별 이력서로 연결), 캐러셀 라이브러리(CSS 스크롤), 정보처리기사 학습 화면 색, 차트 색.
- 옛 홈 CSS와 시스템 맵, "INK SIGNAL / RECORD" 장식은 지운다.

## 5. 읽히는 코드
- "showcase(소개 자료)" 한 용어로 데이터·컴포넌트·테스트를 통일한다. 홈 컴포넌트는 화면 순서대로 읽힌다.

## 6. 루브릭 예측
- dead-code: 위험 → 옛 홈 CSS·시스템 맵 삭제로 해소
- duplication-semantic: 괜찮음 → 소개 자료 한 곳
- cohesion-coupling: 괜찮음 → 자료와 화면 분리
- 나머지 11개: 해당 없음(서버 API·엔티티·외부 연동 없는 화면 작업)

## 7. 테스트
- 먼저: `lib/project-showcase.test.ts`
  - 소개 자료가 있는 프로젝트는 모두 실제 프로젝트 글이 있다
  - 모든 프로젝트 흐름은 문제·선택·구현·검증 네 단계다
  - 그림 경로마다 public 폴더에 실제 파일이 있다
- 구현 후: 390px·1280px, 밝은·어두운 화면에서 홈·상세·기술 노트 직접 확인
