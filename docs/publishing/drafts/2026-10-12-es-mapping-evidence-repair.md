# ES 매핑 기존 글 보완

- 승인: 앞서 제안한 같은 상품의 text/keyword 비교와 현행 매핑 대조에 사용자 `다음`.
- 공개 범위: content/study/es/mapping-and-field-types.mdx 한 파일. URL/date 유지, updatedAt10/12.
- 질문: 단어 검색과 이름 전체 비교는 왜 다른가? 답: 동일 원본을 목적에 맞는 방식으로 색인.
- 상품7의 원본1개→text/keyword 분기 장면과 검색 결과3개 비교. 옵션 짝은 선택 토글.
- 실제 분석 출력이 아닌 이해용 분리, match/term/매핑 JSON의 출처와 역할 설명.
- Nori/strict 무조건 권장, 모든 keyword 기본256, 파일변경 자동적용,
  모든 매핑 변경 불가와 alias만으로 무중단 완료 단정 제외.
- 외부 근거: Elastic 현행 공식 text/keyword/multi-fields/term/match/dynamic/
  ignore_above/update-mappings/nested/릴리스 문서. 일반 검색의 설명 관점도 확인,
  비공식 자료의 문구/그림/수치를 사용하지 않음. 릴리스 최신 항목9.5.5 확인.
- 프로젝트 근거5파일: 상품 매핑, bootstrap, query builder, bootstrap 통합 테스트,
  테스트 지원파일. 이미지9.4.3 선언과 운영 실행 버전 구분.
- 민감정보: 공개 MDX/관련 diff/직접 인용 근거5파일 좁은 검사 후보 없음.
- 백엔드/실제ES 요청/운영 설정 조회 미실시. 예시 결과는 공식 동작에 따른 가정.
- 앱/UI/새페이지/로드맵 변경 없음. 포트폴리오 테스트91개/타입/격리빌드232페이지 통과.
- 생성 콘텐츠/HTML의 질문·날짜·공개상태·토글5개·선수·앞뒤탐색·근거 확인 통과.
- 공개 한 파일 커밋14d15cf, push 없음. 원문57줄 감소. 브라우저 시각 QA 미실시.
