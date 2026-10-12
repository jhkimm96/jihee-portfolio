# ES 집계 기존 글 보완

- 승인: 앞서 제안한 aggregation-log-analysis의 기록/고유값/오차/현행로그 근거 대조에 `다음`.
- 공개 한 파일: content/study/es/aggregation-log-analysis.mdx. 원본URL/date 유지 updatedAt10/12.
- 기록E1~E5의 검색5번, 사용자표시2개, 검색어3/2 묶음 장면. 실제로그/ES응답 아님.
- 집계 범위/size0/누락·중복/고유표시와 실제사람/날짜기준 구분. cardinality 근사와 threshold,
  TOP10/terms오차 단정 정리. 타임존경계와 가정 데이터 산술 확인.
- 현행 공식 Elastic 집계/terms/cardinality/date_histogram/릴리스9.5.5 확인.
  일반 공개설명 검색은 이해 관점 참고, 비공식 문구·그림·수치를 사용하지 않음.
- 공개 미구현 설계 결정문과 관련 main소스/로그설정 SEARCH_EXECUTED·behavior-events·behavior-logs 검색 대조.
- 직접 근거6파일: GatewayAccessLog/Factory/Writer, logstash.yaml, ES배포yaml, 공개 행동로그 설계문.
  gateway 운영로그와 검색 행동로그를 구분. 파일 존재≠배포/적재/집계검증. actual ES이미지 선언9.4.3.
- 좁은 민감정보 검사: 공개MDX/관련diff/근거6파일. 고위험 패턴 후보 없음.
  근거의 내부 주소/Secret 참조는 공개문에 제외하고 공개문 재점검 통과. Secret 값 파일 미열람.
- 앱/UI/로드맵/새페이지/로그수집코드 변경 없음. 본문35줄 감소.
- 91개/타입/내부링크/HTTP본문JSON/격리빌드232페이지/생성데이터·HTML·장면·날짜·토글5개·근거·앞뒤 통과.
- 공개 한 파일 커밋0884535, push 없음. 실제backend/ES/Kibana/브라우저QA 미실시.
