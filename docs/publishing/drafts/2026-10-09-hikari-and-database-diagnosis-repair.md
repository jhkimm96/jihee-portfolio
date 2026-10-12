# HikariCP 기초 / DB 진단 기존2편

사용자 “다음”: 직전 제안한 두 편의 실행 승인. 기존URL/date 유지, updatedAt10/9.
publish-study와 승인된 brainstorming bounded 장면 구조 적용. Ponytail/WRC로 새코드/UI/로드맵 확장 없음.

| 파일 | 질문 / 핵심 답 / 최소 조건 |
| --- | --- |
| database/connection-pool-hikaricp | 닫아도 다음 연결을 다시 맺나? 건강한 풀 연결의 정상반납은 재사용. 장애·수명에 따른 폐기와 실제DataSource 선택 구분 |
| cs/database-bottleneck-diagnosis | 어디서 기다렸나? 같은요청·측정경계와 DB증거 연결. 다른분포p95 합산/차감으로 내부시간 구하지 않음 |

외부 근거: 2026-10-09 HikariCP공식 README/ProxyConnection반환 구현,
Spring Boot SQL/metrics, PostgreSQL18 monitoring/EXPLAIN. 공식 구현dev는
반환 흐름 확인용이며 프로젝트 사용 패치 버전과 동일하다고 쓰지 않음.
검색 설명자료는 참고 관점 탐색만. 기술 판단은 공식 자료.
프로젝트 build.gradle의 Boot4.1.0/DataJPA 선언, 중앙 product-service.yml 전체 직접 대조.
최종DataSource/의존성패치/풀값/부하 충분성 미검증. 기존 팀 판단 주장은 근거 없어 제외.
EXPLAIN ANALYZE 실제 실행 위험 본문 명시. DB접속/부하/운영 명령 실행 없음.

완료: 전체91개/타입/격리빌드232페이지/생성 HTML/질문·토글·선수·관련·앞뒤/원본 날짜/민감정보 자동 점검 통과.
공개2파일 커밋87224b6, push 없음. 두 편 합계20줄 감소. 새 페이지 없음.
본문/초안/직접 프로젝트 근거2파일/관련diff 검사, 실제값·내부주소 복사 없음.
Prometheus 공식 histograms 문서로 백분위/분포 추정 조건도 대조했다.
공개2파일만 로컬커밋. 내부기록/다른dirty 보존. 브라우저검증/push 없음.
