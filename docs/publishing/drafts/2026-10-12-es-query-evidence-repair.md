# ES 검색 조건/순위 기존 글 보완

- 승인: 앞서 제안한 query-dsl-and-relevance의 후보→제외→정렬/현행경로 대조에 `다음`.
- 공개 파일: content/study/es/query-dsl-and-relevance.mdx 한 편. URL/date 유지 updatedAt10/12.
- 질문: 같은 검색어인데 어떤 상품은 빠지고 어떤 상품은 먼저 나오는가?
- 상품7~11 후보, 예산/유형/판매 조건 뒤 상품7/8, 관련도와 가격순/추가 점수로 순서변화.
  이해용 조건 순서이지 ES 실행계획 아님. 점수는 임의 가정, actual BM25/실측 결과 아님.
- filter항상캐시/should조건/multi_match단순합산/sort무조건점수제거/TF-IDF선형 단정 정리.
- 후보와 순위, score_mode/boost_mode, 글로벌 인기와 개인화, 설명용 schema와 actual 구분.
- 현행 공식 Elastic bool/multi_match/function_score/sort/querycache/similarity/릴리스9.5.5 조사.
  일반검색과 공개설명도 참고, 비공식 문구·그림·수치 복제하지 않음.
- 직접 근거4파일: query builder/querier/builder test/test지원. 글자 경로와 조건부 의미검색
  순위병합을 구분. 테스트이미지9.4.3 선언, runtime값/ES/backend 실행 검증 미실시.
- 좁은 민감정보 검사 공개MDX/관련diff/직접근거4파일 후보 없음. 내부링크/요청JSON 검증 통과.
- 설명용5상품의 후보/가격순/가정 점수 산술 확인. 실제 검색 측정이 아님.
- 앱/UI/새페이지/로드맵/의존성 변경 없음. 원문86줄 감소.
- 포트폴리오91개/타입/격리빌드232페이지/생성콘텐츠·HTML·장면·요청·날짜·토글5개·선수·앞뒤 통과.
- 공개 한 파일 커밋1c615bc, push 없음. 브라우저 시각QA/운영검색 검증 미실시.
