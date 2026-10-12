# ES 자동완성 기존 글 보완

- 승인: 앞서 제안한 search-suggest-autocomplete 후속 작업에 사용자 “응 이어서해줘”.
- 공개 한 파일: content/study/es/search-suggest-autocomplete.mdx. 기존 URL/date 유지, updatedAt10/12.
- 핵심 질문: 입력한 글자에서 어떤 상품명을 제안할까? 입력→후보→선택, 이름/단어 시작,
  늦은 응답 덮어쓰기, 실제 API 경로를 짧은 장면으로 설명. 실행 응답·현재 UI 동작 아님.
- Completion 기본 정답/매 키 요청·교정시점 강제/미정의 korean·trigram 예제,
  저장만 분해하면 모든 한글입력 일치 단정 제외. 선택지·초성·교정은 선택 토글.
- Elastic 현행 공식 match_phrase_prefix/suggesters/search_as_you_type/edge_ngram/Nori/
  릴리스9.5.5와 MDN AbortController/IME 입력 이벤트 대조.
- 직접 근거9파일: ProductController, ProductQueryService, ProductSearchQueryBuilder,
  ElasticsearchProductSearchQuerier, products-v1-mapping.json, ProductSearchQueryBuilderTest,
  ProductQueryServiceTest, ElasticsearchProductSearchQuerierIntegrationTest, ElasticsearchIntegrationTestSupport.
- 실제 경로는 상품 name 조회/판매량 내림차순/최대5문서 뒤 이름 중복 제거.
  입력 trim/소문자화, 빈입력/실패 빈목록. 최소2글자 제한 없음. 인기검색어 로그와 구분.
- 테스트 선언 이미지9.4.3과 운영버전 구분. 백엔드 테스트/ES요청/실제토큰·응답·성능/
  프론트IME·debounce·응답순서·브라우저 QA 미실시. 앱/UI/백엔드/새페이지/로드맵 변경 없음.
- 91개 테스트/타입/격리빌드232페이지/생성 메타데이터·HTML·날짜·토글4개·선수·앞뒤 연결 통과.
- 공개본/초안/관련diff/직접 근거9파일 좁은 고위험 민감정보 패턴 검사 통과.
  관련 Secret 값 파일은 열지 않음. 실제 운영 안전성 전수검사라는 뜻은 아니다.
- 공개 한 파일 커밋 ec6d742, push 없음. 내부 dirty 파일은 보존한다.

## 전체 진행 수 산정 기준

- 원본79편: 2026-10-07-body-review.md 본문표의 MDX 링크를 중복 제거.
- 후속보완: 감사 커밋75800d3 이후 공개 Study 변경경로와 원본79편의 교집합.
  이번 공개본까지32편, 아직 그 이후 변경 이력이 없는 글47편.
- 이 수는 후속 편집 이력이지 모든 기술·운영·브라우저 검증의 완료율이 아니다.
  47편에는 이미 구조 유지 판정을 받은 캐시 파일럿도 포함되며, 모두 전면 재작성할 필요는 없다.
- 전체79편 본문 읽기는 완료. 핵심 CS 백로그는 게시·학습 링크가 연결됐으며,
  미작성 심화 백로그와 실제 운영 시험은 별도다. 전체 사이트 빌드 페이지 수와 Study 수를 섞지 않는다.
