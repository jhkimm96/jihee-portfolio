---
status: approved
approved_at: 2026-11-18T15:42:38
files:
  - lib/project-showcase.ts
  - lib/project-showcase.test.ts
  - app/page.tsx
  - app/globals.css
  - components/project-showcase-panel.tsx
  - app/projects/[slug]/page.tsx
  - content/*/project.mdx
  - public/*/images/*
  - public/prompthub/videos/search-flow.gif
tests_first: []
---
# 전체 프로젝트 이미지 반영안

2026-11-18 사용자가 최종 이미지와 반영을 승인했다. 이 계획대로 포트폴리오에 반영하고 검증 후 커밋·push한다.

## 1. 파일

- `C:/cowork/portfolio/public/{project}/images/`: 검토 완료한 개요 PNG와 실제 UI 캡처 추가. 사내 프로젝트는 실제 화면과 개인정보 없이 개념도만 공개한다.
- `C:/cowork/portfolio/lib/project-showcase.ts`: 기존 4개 자료의 빈 이미지 슬롯을 채우고 나머지 4개 프로젝트에 기존 형식의 소개 자료를 추가한다. 이미지 없는 중복 슬롯은 제거한다.
- `C:/cowork/portfolio/content/{project}/project.mdx`: 대표 이미지가 없는 프로젝트와 PromptHub, Career Link의 thumbnail을 연결한다. 경력 본문과 성과 수치는 변경하지 않는다.
- `C:/cowork/portfolio/app/page.tsx`: 모든 프로젝트에 소개 자료가 생겨도 홈 대표 4개는 기존 featured 설정으로 유지한다.
- `C:/cowork/portfolio/components/project-showcase-panel.tsx`: 기존 이미지 프레임에 원본 이미지 링크를 제공한다. 새 모달이나 라이브러리를 추가하지 않는다.
- `C:/cowork/portfolio/app/projects/[slug]/page.tsx`: 이미지 대체 텍스트를 실제 화면과 개념도에 모두 맞는 소개 이미지 표현으로 정리한다.
- `C:/cowork/portfolio/lib/project-showcase.test.ts`: 기존 4개 가정을 8개 프로젝트와 이미지 연결 검증으로 갱신한다.
- 승인 후 `docs/code-plans/2026-11-18-project-overview-images.md`에 이 계획을 저장한다.

## 2. 함수와 흐름

새 비즈니스 함수는 만들지 않는다. `HomePage`는 소개 자료의 프로젝트를 조회한 뒤 featured인 프로젝트만 홈에 전달한다. `ShowcaseMediaFrame`은 등록된 이미지를 표시하고 선택하면 원본을 연다. `ProjectShowcasePanel`의 기존 이전·다음 동작을 그대로 재사용한다.

## 3. 재사용과 충돌

`ProjectShowcase`, `media`, `flow`, next/image와 현재 갤러리를 재사용한다. 현재 홈이 소개 자료의 전체 키를 사용하는 점을 보완해 대표 프로젝트가 뜻하지 않게 8개로 늘어나지 않게 한다. 관련 없는 사용자 변경은 건드리지 않는다.

## 4. 최소 구현

새 모달, 새 UI 라이브러리, 가짜 서비스 화면은 추가하지 않는다. 자기장 서바이벌은 이미 공개한 실제 게임 이미지를 활용한다. PromptHub는 기존 고해상도 상품 화면을 대표 이미지로, README의 검색 GIF를 선택해서 볼 수 있는 시연 자료로 사용한다. 첫 화면은 정지 이미지로 둔다. Career Link는 기존 프론트엔드 화면을 사용한다.

## 5. 읽히는 코드

새 추상화 없이 `media.src`와 설명 라벨로 공개 범위를 드러낸다. 실제 UI 캡처에는 시연용 데이터임을 명시한다. 사내 프로젝트에는 공개 설명용 개념도임을 표시한다. 팀 기능과 본인 기여를 구분한다.

## 6. 루브릭 예측

| 항목 | 예측 | 근거 |
|---|---|---|
| controller-thin | 해당 없음 | 서버 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음 | 도메인 엔티티 변경 없음 |
| http-semantics | 해당 없음 | HTTP 응답 변경 없음 |
| logging-quality | 해당 없음 | 런타임 로그 변경 없음 |
| exception-discipline | 해당 없음 | 예외 처리 추가 없음 |
| layer-separation | 괜찮음 | 정적 소개 자료와 표시 컴포넌트 분리 유지 |
| dead-code | 괜찮음 | 참조되는 이미지만 추가, 빈 중복 슬롯 제거 |
| duplication-semantic | 괜찮음 | 기존 이미지 갤러리 재사용 |
| diagnosability | 괜찮음 | 파일 경로와 존재 여부를 테스트로 검증 |
| integration-robustness | 해당 없음 | 공개 포트폴리오에 외부 API 연동 추가 없음 |
| service-boundary | 해당 없음 | 서비스 및 DB 경계 변경 없음 |
| value-object-design | 해당 없음 | 기존 미디어 타입 유지 |
| polymorphism-opportunity | 해당 없음 | 새 조건 분기 정책 없음 |
| cohesion-coupling | 괜찮음 | 콘텐츠와 표시 로직의 기존 경계 유지 |

## 7. 검증

새 도메인 규칙이 없어 별도 규칙 테스트를 먼저 추가하지 않는다. 기존 소개 자료 테스트에서 전체 프로젝트의 자료 존재, 네 단계 흐름, 이미지 파일 존재를 확인한다. 빌드와 타입 검사를 수행한다. 390px와 1280px에서 이미지 잘림, 갤러리 이동, 키보드 원본 링크를 확인한다. 커밋 직전 변경 파일과 이미지 공개 내용을 검토한다.

## 캡처 근거와 한계

- PromptHub 대표 이미지: 기존 `C:/programmers_prj/prompthub 화면/전체상품.png`를 사용한다. 검토 화면의 WebP는 해상도와 형식만 최적화했으며 내용은 바꾸지 않았다. 임의 시연 데이터를 새로 넣은 상품 목록 캡처는 대표 이미지에서 제외한다.
- PromptHub 검색 시연: 팀 백엔드 저장소 develop 브랜치 README의 `docs/demo/search-flow.gif` 원본이다. 400×225, 13.2초이므로 고해상도 대표 이미지와 구분해 시연으로 제공한다.
- PromptHub 비슷한 상품: 기존 상품 상세 프론트엔드에 격리된 캡처 브라우저에서만 예시 API 응답을 사용해 준비한 보충 화면이다. 실제 추천 알고리즘 결과를 증명하는 자료는 아니다. 애플리케이션 소스와 운영 DB를 수정하지 않았다.
- PromptHub 팀 아키텍처: README의 `docs/architecture/images/system-architecture.png` 원본을 재사용할 수 있다. 팀 전체 인프라로 표시하고 개인 담당은 product-service와 ai-service로 구분한다. 주문·결제, AI 검수, 정산 GIF는 존재를 확인했지만 개인 담당이 아니므로 이번 개인 기여 중심 갤러리에 추가하지 않는다.
- Career Link: 기존 프론트엔드를 실행해 메인과 지원자 이력서 목록·작성, 자기소개서 작성, 스크랩, 기업 공고·지원자·통계·소속회원, 관리자 메뉴·공통코드·사용자 관리 12개 화면을 캡처했다. 격리된 브라우저의 API 시연 데이터를 사용했으며 실제 계정과 운영 DB는 변경하지 않았다. 기업 화면은 팀 서비스 흐름으로 소개하고, 메뉴·공통코드와 지원자 CRUD는 확인된 개인 담당 범위와 연결한다. 해당 캡처는 로그인·백엔드 저장이나 권한 검증의 증거가 아니다.
- 두 실제 UI 캡처는 현재 로컬 프론트엔드 실행으로 준비했다. Docker 백엔드로 연결한 실제 실행 검증은 아직 수행하지 않았다.
- Help Desk와 교육·입시·ERP 개념도는 기존 프로젝트 문서의 확인된 담당 범위로 작성했다.
- 자기장 서바이벌 화면의 캡처용 체력·효과 시간은 기존 공개 문서와 같은 설명을 유지한다.

## 기존 자료 조사 (2026-11-18)

| 프로젝트 | 확인한 기존 자료 | 이번 선택 |
|---|---|---|
| PromptHub | 최신 원격 README에 GIF 4개와 아키텍처 PNG, 로컬 고해상도 화면 PNG 10개 | 기존 상품 화면, 기존 검색 GIF, 개인 추천 관련 보충 화면과 기존 기술 그림 |
| Career Link | 백엔드 main 저장소에 PNG/GIF 없음. 프론트엔드 main에는 로고, 로그인 버튼, 공고 카드용 이미지 등 6개만 있고 완성 화면 캡처 없음 | 기존 앱의 메인·지원자·기업·관리자 화면 12개와 개인 기여 개념도. 프로젝트 상세의 기존 갤러리로 넘겨보기 |
| Help Desk | 공개 가능한 실제 시스템 화면을 현재 확보하지 못함 | 사용자·역할·메뉴 조회 흐름 개념도 |
| 학생 포트폴리오 | 공개 가능한 실제 시스템 화면을 현재 확보하지 못함 | 이수 데이터 → 템플릿 → PDF 개념도 |
| 대학 역량기반 교육 | 공개 가능한 실제 시스템 화면을 현재 확보하지 못함 | 학사 원본 조회 경계와 담당 API 개념도 |
| 대학 입시지원 | 공개 가능한 실제 시스템 화면을 현재 확보하지 못함 | 지원자 중심 담당 기능 지도 |
| ERP 재고관리 | 공개 가능한 실제 시스템 화면을 현재 확보하지 못함 | 선임 개발자와 함께한 운영 보조 범위 개념도 |
| 자기장 서바이벌 | 포트폴리오에 기존 start/warning/late/result PNG 4개 | 기존 플레이 화면 재사용 |

출처: https://github.com/prgrms-be-adv-devcourse/beadv6_6_3JMT_BE/blob/develop/README.md

저장소에 화면 캡처가 없다는 사실이 실제 서비스 화면 자체가 없다는 뜻은 아니다. 공개 가능한 자료를 현재 확보했는지와 실행해서 캡처할 수 있는지를 구분한다.

갤러리가 있는 상세에서는 같은 대표 이미지의 본문 앞 중복 표시를 생략한다. 홈 카드 안에는 원본 링크를 중첩하지 않고 상세 갤러리에서만 제공한다. 모바일 이미지 선택과 원본 링크의 누르는 높이는 44px 이상으로 둔다.
