# 김지희 | Engineering Portfolio

Spring Boot 기반 백엔드 프로젝트와 그 안에서 내린 설계 결정, 해결한 문제, 코드 리뷰와 학습 기록을 모은 개인 포트폴리오입니다.

[포트폴리오](https://jiheeportfolio.vercel.app) · [GitHub](https://github.com/jhkimm96)

## 먼저 볼 프로젝트

| 프로젝트 | 본인 담당 범위 | 코드와 기록 |
| --- | --- | --- |
| PromptHub | 상품 도메인, Elasticsearch 검색, pgvector 의미 검색, 독립 ai-service 개인화 추천 | [백엔드](https://github.com/prgrms-be-adv-devcourse/beadv6_6_3JMT_BE) · [프로젝트 기록](https://jiheeportfolio.vercel.app/projects/prompthub) |
| Career Link | 권한별 메뉴와 공통코드 등 어드민 기반, 지원자 이력서·자소서·스크랩 CRUD, 프론트 초기 셋업 | [백엔드](https://github.com/hha6571/career-link) · [프론트엔드](https://github.com/jhkimm96/career-link-ui) · [프로젝트 기록](https://jiheeportfolio.vercel.app/projects/career-link) |

두 프로젝트 모두 팀 프로젝트입니다. 프로젝트 전체 기능과 개인 기여 범위는 각 소개 문서에서 구분합니다.

## 이 저장소의 구성

포트폴리오 자체는 Next.js App Router, React, TypeScript, Tailwind CSS와 Velite로 구현했습니다. MDX 문서를 빌드 시 수집하며, 콘텐츠 스키마와 주요 로직은 Vitest로 검증합니다.

| 읽을 내용 | 위치 |
| --- | --- |
| 프로젝트 소개와 담당 범위 | [`content/prompthub/project.mdx`](content/prompthub/project.mdx), [`content/career-link/project.mdx`](content/career-link/project.mdx) |
| 설계 결정, 문제 해결, 리뷰, 품질 측정 | 각 프로젝트의 `decisions/`, `troubleshooting/`, `reviews/`, `quality/` |
| 기술 학습 기록 | [`content/study/`](content/study/) |
| 소개와 역할별 이력서 | [`content/profile/`](content/profile/) |
| 콘텐츠 스키마 | [`content/schemas.ts`](content/schemas.ts), [`velite.config.ts`](velite.config.ts) |
| 페이지와 공통 UI | [`app/`](app/), [`components/`](components/) |

기술 기록은 문제, 선택지, 선택한 이유와 검증 결과를 함께 남깁니다. 과거 기록은 작성 당시의 상태를 다룰 수 있으므로 글의 날짜와 후속 문서를 함께 확인해 주세요.

## 로컬 실행

```bash
npm ci
npm run dev
```

개발 서버는 `http://localhost:4000`에서 열립니다. `predev`는 기존 4000번 포트 사용 프로세스를 종료하므로 해당 포트를 다른 작업이 사용 중인지 먼저 확인합니다.

검증과 프로덕션 빌드:

```bash
npm test
npx tsc --noEmit
npm run build
```

실행 스크립트와 의존성은 [`package.json`](package.json)을 기준으로 합니다.

## 연락

- GitHub: [jhkimm96](https://github.com/jhkimm96)
