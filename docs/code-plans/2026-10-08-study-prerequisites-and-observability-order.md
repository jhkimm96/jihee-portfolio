---
status: approved
approved_at: 2026-10-08T02:14
files:
  - lib/study-roadmap.ts
  - lib/study-roadmap.test.ts
tests_first:
  - impl: lib/study-roadmap.ts
    test: lib/study-roadmap.test.ts
---

# 승인된 Study 선수 순서와 관측성 연결

사용자가 이전 턴의 7개 항목 계획과 7편 콘텐츠 범위를 `승인`했다.
승인 메시지 시각은 도구에서 제공되지 않아 approved_at은 승인 후 처음 확인한 로컬 시각이다.
콘텐츠 초안: `docs/publishing/drafts/2026-10-08-java-visuals-observability.md`.

## 1. 파일

- `lib/study-roadmap.ts`: 다섯 단계의 제목/설명/카테고리, 명시된 글 순서만 수정.
- `lib/study-roadmap.test.ts`: 선수 순서와 새 관측성 세 편의 연결을 테스트.

## 2. 함수와 실행 흐름

- `getStudyRoadmapSlugs`: 단계 → 카테고리 → 명시된 글의 순서로 펼침. 구현 재사용.
- `getExplicitRoadmapPosts`, `getTrackRoadmapPosts`: 실제 게시 글만 선택. 구현 재사용.
- `getStudyRoadmapContext`: 선수와 이전/다음 링크 계산. 구현 재사용.
- `orderStudyPosts`: 카테고리별 명시된 순서 정렬. 구현 재사용.
- Java/runtime → JPA/Spring/testing → database/ES → MSA/CS → 운영의 다섯 단계 유지.
- JVM의 reachability를 heap reclaim보다 앞에 두고, CS에 새 관측성 세 편을 추가한다.

## 3. 기존 연결과 충돌

Study 목록, roadmap 페이지, StudyRoadmapView, 상세 페이지가 같은 모듈을 읽는다.
UI와 스키마는 변경하지 않는다. 기존 캐시 네 편은 연속된 순서를 유지한다.
명시된 신규 파일이 없는 동안은 파일 존재 테스트가 실패할 수 있으므로 콘텐츠 작성 후 함께 검증한다.
기존 MDX URL/작성일과 승인 밖 워킹트리 변경은 보존한다.

## 4. 최소 구현

새 DAG 정렬기, 탐색 UI, 외부 라이브러리, 서버 변경은 제외한다.
기존 배열과 테스트만 수정하고 함수나 추상화를 추가하지 않는다.

## 5. 읽히는 코드

기존 이름을 유지한다. 단계 제목과 설명은 실제 카테고리 순서와 일치시킨다.
테스트 이름에 `Java 선수 → 구현`, `JPA → OSIV`, `Kafka → 관측성 → 운영` 정책을 직접 쓴다.

## 6. 루브릭 예측

| 항목 | 판정 | 이유 |
| --- | --- | --- |
| controller-thin | 해당 없음 | 컨트롤러 변경 없음 |
| entity-encapsulation | 해당 없음 | 엔티티 변경 없음 |
| http-semantics | 해당 없음 | HTTP 응답 변경 없음 |
| logging-quality | 해당 없음 | 실행 로그 코드 변경 없음 |
| exception-discipline | 해당 없음 | 예외 처리 변경 없음 |
| layer-separation | 괜찮음 | 기존 순서 데이터와 UI 경계 유지 |
| dead-code | 괜찮음 | 미사용 함수나 새 계층 추가 없음 |
| duplication-semantic | 괜찮음 | 모든 화면이 공통 순서 함수를 계속 사용 |
| diagnosability | 해당 없음 | 실행 오류 처리 변경 없음 |
| integration-robustness | 해당 없음 | 외부 통신 추가 없음 |
| service-boundary | 해당 없음 | 서비스 간 접근 변경 없음 |
| value-object-design | 해당 없음 | 데이터 모델이나 매개변수 변경 없음 |
| polymorphism-opportunity | 해당 없음 | 새로운 상태 분기 없음 |
| cohesion-coupling | 괜찮음 | 순서 한 곳과 대응 테스트만 변경 |

## 7. 테스트

구현 전 작성하고 실패 확인:

- Java 코드 읽기와 CompletableFuture를 공유 Future 구현보다 먼저 읽는다.
- 영속성 컨텍스트를 OSIV보다 먼저 읽는다.
- GC 도달 가능성을 메모리 회수보다 먼저 읽는다.
- 관측성은 신호, JSON 로그, 추적 ID 순서로 Kafka 뒤와 운영 앞에 둔다.

구현 후: 기존 캐시 연속 순서/파일 존재/중복/선수·이전·다음 테스트,
전체 npm test, TypeScript 검사, 콘텐츠 빌드. 화면 검수는 브라우저 접근 가능 여부와 분리 보고한다.
