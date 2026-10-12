# ES 분석기 기존 글 보완

- 승인: 앞서 제안한 analyzer-and-nori의 단어 생성 장면/잘못된 예시/현재 근거 구분에 `다음`.
- 공개 파일: content/study/es/analyzer-and-nori.mdx 한 편, URL/date 유지, updatedAt10/12.
- 상품7 이름에 PRO를 붙이고 공백 분리/소문자 정리/검색어 비교 장면. 공식 규칙의 예상값이며
  실행한 ES 응답이 아님. Nori/현재 프로젝트 출력과 구분. 새 앱/컴포넌트/의존성 없음.
- 분석기 이름이 다르면 반드시0건, standard면 한글 실패/mixed면 상품검색 보장,
  미실행 Nori 토큰 결과와 동의어 즉시반영 단정 제외. 설치와 필드 설정/검증 분리.
- 공식 Elastic 분석구성/standard/search_analyzer/Nori·tokenizer/analyzer/분석API/
  whitespace/lowercase/동의어/릴리스 문서 확인. 최신 릴리스 항목9.5.5.
- 일반 검색의 한국어 설명 자료는 문제→분석→확인 전개 참고, 문구/그림/출력 복제 없음.
- 프로젝트5파일 직접 대조: 매핑/bootstrap/query builder/bootstrap통합테스트/테스트지원.
  테스트이미지9.4.3과 운영버전 구분. runtime플러그인/토큰/검색품질/백엔드 실행 미확인.
- 좁은 민감정보 검사: 공개원문/관련diff/직접인용5파일 후보 없음. 내부링크와 HTTP본문JSON 파싱 통과.
- 테스트91개/타입/격리빌드232페이지/생성데이터·HTML·날짜·토글4개·장면·요청·선수·앞뒤 통과.
- 외부 폰트 fetch cache timeout 경고1회, 빌드exit0. 브라우저/폰트 표시 시각QA 미실시.
- 공개 한 파일 커밋9dfb19d, push 없음. 원문65줄 감소. 기존dirty와 내부기록 보존.
