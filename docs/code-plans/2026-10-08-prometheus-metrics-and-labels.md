---
status: approved
approved_at: 2026-10-08T13:18+09:00
files:
  - content/study/cs/prometheus-metric-scraping.mdx
  - content/study/cs/metric-label-cardinality.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

# 숫자 수집과 Label 설계의 학습 순서

사용자가 신규2편 게시와 로드맵 연결을 승인했다.
본문 범위는 `docs/publishing/drafts/2026-10-08-prometheus-metrics-and-labels.md`다.

## 1. 파일

위 신규 MDX2편과 로드맵 순서/정책 테스트만 변경한다.
기존 공개 글, 프로젝트 Learning Path, 공통 스킬, 백엔드와 배포는 변경하지 않는다.

## 2. 함수와 흐름

새 함수를 만들지 않는다. `studyReadingOrder.cs`에서 Actuator → Graceful Shutdown은 유지한다.
그 뒤에 Prometheus 수집 → Label 설계를 넣고 기존 UTC 글로 이어간다.
`getStudyRoadmapSlugs`가 순서를 펼치고 `getTrackRoadmapPosts`가 존재하는 단계별 글을 선택한다.
`getExplicitRoadmapPosts`와 `getStudyRoadmapContext`가 공개 글의 선수/이전/다음 연결을 제공한다.
`orderStudyPosts`의 기존 카테고리 정렬과 화면도 재사용한다.

## 3. 기존 코드와의 연관

기존 관측성 글은 신호별 질문, DB 병목 글은 진단에 집중하고 이번 글의 관련 읽기로 연결한다.
기존 글을 복제하거나 개편하지 않는다. 승인된 새 슬러그 충돌은 없다.
다른 작업의 초안과 기존 dirty 문서는 커밋하지 않는다.

## 4. Ponytail 최소 범위

새 UI/이미지/모션/라이브러리 설치와 일반화된 도우미를 제외한다.
기존 Mermaid와 details를 사용한다. 운영 endpoint 호출, 클러스터 변경과 백엔드 테스트 실행은 하지 않는다.

## 5. 읽히는 코드

슬러그는 수집과 Label 조합의 역할을 드러내고 테스트 이름에는 학습 순서를 쓴다.
기존 함수와 배열을 그대로 사용하며 수집 구현 자체를 포트폴리오 코드에 추가하지 않는다.
학습용 Counter는 값4 → 코드2줄 → 값5를 연결하고 실제 프로젝트 지표와 구분한다.

## 6. 루브릭 예측

| 항목 | 예상 | 이유 |
| --- | --- | --- |
| controller-thin | 해당 없음 | 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음 | 엔티티 변경 없음 |
| http-semantics | 해당 없음 | HTTP 처리 변경 없음 |
| logging-quality | 해당 없음 | 앱 로그 구현 변경 없음 |
| exception-discipline | 해당 없음 | 예외 처리 변경 없음 |
| layer-separation | 괜찮음 | 기존 순서 데이터와 콘텐츠 조회를 재사용 |
| dead-code | 괜찮음 | 실제 공개 파일만 순서에 넣음 |
| duplication-semantic | 괜찮음 | 정렬과 탐색 로직을 복제하지 않음 |
| diagnosability | 해당 없음 | 런타임 오류 처리 변경 없음 |
| integration-robustness | 해당 없음 | 서비스 통신 변경 없음 |
| service-boundary | 해당 없음 | 서비스 경계 변경 없음 |
| value-object-design | 해당 없음 | 도메인 값 모델 변경 없음 |
| polymorphism-opportunity | 해당 없음 | 타입 분기 변경 없음 |
| cohesion-coupling | 괜찮음 | 기존 배열에 학습 정책만 추가 |

## 7. 테스트와 확인

구현 전: `앱 상태와 종료 절차 뒤에 수치 수집과 Label 설계 순서로 읽는다`를 추가해 실패를 확인한다.
기존 파일 존재/중복 금지/미작성 글 제외/선수·이전·다음과 이전 관측성 정책 테스트는 유지한다.
구현 후: 전체 테스트, TypeScript 검사, 기존 dev와 분리한 콘텐츠 build, 생성2편의 공개 상태와 링크 확인.
민감정보는 공개 초안/MDX/승인 diff와 직접 인용된 예제를 점검한다.
이미 준비된 Micrometer/Java 의존성이 있으면 격리된 학습 예제의 Counter 증가를 검증한다.
없으면 새 설치하지 않고 미실행 범위를 보고한다. 운영 수집과 화면 검증을 완료로 쓰지 않는다.
