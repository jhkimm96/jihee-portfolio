# 기존 CS 근거/설명 보완3편

사용자의 전체 승인과 후속 “다음”에 따라 기존 감사 후보를 이어 처리한다.
publish-study/brainstorming의 승인된 짧은 장면 구조 적용. Ponytail/Write Readable Code로
근거 확인 범위를 제한하고 새 UI/헬퍼/백엔드 변경 없이 기존3편만 보완한다.

| 파일 | 질문과 보완 |
| --- | --- |
| cs/graceful-shutdown-and-traffic-draining.mdx | 기존 요청 보호만으로 부족한 이유. 민지/지수와 A/B 장면, 종료·대상변경 병행, preStop 포함 예산 |
| cs/redis-ttl-and-eviction.mdx | TTL과 공간 정책 구분. 같은 상품키/유입량/만료와 축출, 내부 한도와 컨테이너 한도 |
| cs/replication-lag-and-read-after-write.mdx | 저장과 복제본 가시성 구분. 수신/적용/snapshot, 동기 flush와 apply의 조건 |

URL/date 유지, updatedAt10/9. 질문/선수/관련/회상 보완. 로드맵/앱 코드 변경 없음.
첫 화면은 상황/한 줄 답/조건, 개별 장면의 변화 뒤 이유, 선택적 세부만 토글.
기존 Instagram3원본 접근 실패로 숫자 미확인. 숫자는 삭제하고 학습 예시로 교체했다.
숫자를 검증해 오류로 판정했다는 뜻은 아님. 공식 자료를 기술적 사실의 근거로 사용.

## 직접 근거와 한계

- 2026-10-09 Spring Boot 현행 종료 문서/Kubernetes Pod 종료 흐름.
  product Deployment 전체와 관련 앱/중앙 config 파일의 종료 옵션 검색.
  Boot4.1.0 선언/Pod30초/preStop 없음과 실행 중 최종 설정 미확인을 구분.
- Redis 공식 eviction/EXPIRE. redis StatefulSet 전체:7.4-alpine태그/AOF/256Mi.
  매니페스트에 maxmemory/정책 미명시와 실제 서버 설정 미확인을 구분.
- PostgreSQL18 WAL/standby/admin functions. postgres StatefulSet 전체와
  상품 서비스/main·관련config·postgres인프라 복제/라우팅 검색.
  1Pod와 실제 DB복제 구성 없음은 동일하지 않음. 검색 범위 미확인으로만 기록.
- 일반 검색에서 설명 자료 탐색. 블로그/검색 요약으로 기술적 사실 단정하지 않음.
- backend/Redis/DB/배포 실험/브라우저 화면 검증 없음. 민감정보 자동 검사와
  전체91개 테스트/타입/격리빌드/메타데이터·HTML·링크 점검 후 공개3파일만 커밋.

상태: 완료. 공개3파일 커밋 d7e4875, push 없음.
전체91개 테스트/타입/격리빌드(232페이지)/3편 HTML·질문·토글·앞뒤·선수·관련 링크/원본 날짜 보존 통과.
공개 본문/초안/직접 근거3파일/관련diff 민감정보 자동 검사 통과. 내부 주소·Secret 실제 값 복사 없음.
빌드 중 외부 Google 폰트 fetch cache timeout 경고1회, 빌드는 exit0으로 완료.
브라우저 UI/폰트 렌더링/실제 운영 시험은 미검증.
