---
status: approved
approved_at: 2026-10-08T12:51+09:00
files:
  - content/study/cs/log-collection-and-search.mdx
  - content/study/cs/kibana-data-view-and-saved-objects.mdx
  - content/study/cs/actuator-health-and-readiness.mdx
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

# 관측성 수집, 검색, 앱 상태 확인 연결

사용자가 2026-10-08 신규3편 게시와 로드맵 연결 계획을 승인했다.
본문 승인 근거: `docs/publishing/drafts/2026-10-08-observability-collection-discover-health.md`.

## 1. 파일

위 신규 MDX 3개, 읽기 순서 데이터와 정책 테스트만 변경한다.
기존 Study, 프로젝트 Learning Path, 백엔드, 공통 스킬과 UI는 변경하지 않는다.

## 2. 함수와 흐름

새 함수를 만들지 않는다. `studyReadingOrder.cs`에 추적 ID 다음 수집 → Kibana → Actuator를 넣는다.
`getStudyRoadmapSlugs`가 명시 순서를 펼치고 `getTrackRoadmapPosts`가 존재하는 글을 단계별로 선택한다.
`getStudyRoadmapContext`가 선수, 이전과 다음 글을 연결한다. 기존 종료 절차 글로 이어진다.
`orderStudyPosts`의 카테고리 정렬도 기존 데이터를 그대로 사용한다.

## 3. 기존 코드와의 연관

기존 Study 화면, 로드맵 화면과 콘텐츠 스키마를 재사용한다. 신규 슬러그 충돌은 없다.
검색 이벤트 파이프라인은 행동 이벤트 상세, Graceful Shutdown은 종료 중 요청 보호로 구분한다.
두 기존 글을 복제하거나 개편하지 않는다. 다른 작업의 초안과 dirty 파일을 커밋하지 않는다.

## 4. Ponytail 최소 범위

새 컴포넌트, 이미지 파일, 라이브러리, 일반화된 로드맵 도우미는 필요하지 않다.
정적 Mermaid/화면 스케치와 기존 토글을 사용한다. 백엔드 실행이나 실제 운영 변경도 하지 않는다.

## 5. 읽히는 코드

기존 배열과 함수 이름을 유지하고 새 슬러그는 각 글의 역할을 드러낸다.
테스트 이름에 학습 순서 정책을 쓰며 정렬 방식이나 UI 동작은 바꾸지 않는다.

## 6. 루브릭 예측

| 항목 | 예상 | 이유 |
| --- | --- | --- |
| controller-thin | 해당 없음 | 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음 | 엔티티 변경 없음 |
| http-semantics | 해당 없음 | HTTP 처리 변경 없음 |
| logging-quality | 해당 없음 | 앱 로그 구현 변경 없음 |
| exception-discipline | 해당 없음 | 예외 처리 변경 없음 |
| layer-separation | 괜찮음 | 순서 데이터와 기존 콘텐츠 조회를 재사용 |
| dead-code | 괜찮음 | 존재하는 공개 글만 순서에 연결 |
| duplication-semantic | 괜찮음 | 정렬과 탐색 로직을 복제하지 않음 |
| diagnosability | 해당 없음 | 런타임 오류 처리 변경 없음 |
| integration-robustness | 해당 없음 | 서비스 통신 변경 없음 |
| service-boundary | 해당 없음 | 서비스 경계 변경 없음 |
| value-object-design | 해당 없음 | 도메인 값 모델 변경 없음 |
| polymorphism-opportunity | 해당 없음 | 타입 분기 변경 없음 |
| cohesion-coupling | 괜찮음 | 기존 순서 배열에만 학습 정책 추가 |

## 7. 테스트와 확인

구현 전: `추적 ID 다음에 수집, Kibana 탐색, 앱 상태 확인 순서로 읽는다`를 추가하고 실패를 확인한다.
기존 명시 파일 존재/중복 금지/미작성 글 제외/선수·이전·다음 테스트는 재사용한다.
구현 후: 전체 테스트, TypeScript 검사, 콘텐츠 build, 새3편의 생성 결과와 선수/관련 링크 확인.
게시 초안/공개3편/승인 diff의 민감정보를 점검한다. 직접 인용하는 실제 프로젝트 설정 원문은 없다.
브라우저 접근이 차단되어 실제 화면과 Mermaid 렌더링 확인은 별도 미완료로 보고한다.
