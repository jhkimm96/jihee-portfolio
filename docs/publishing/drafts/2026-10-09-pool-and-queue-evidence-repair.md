# 연결 풀/비동기 큐 기존2편 보완

사용자 후속 “응 다음”: 직전 제안한 연결 풀/비동기 큐 묶음의 실행 승인.
이미 승인된 짧은 장면 구조의 bounded 편집. 새로운 아키텍처/앱 코드/로드맵/UI 변경 없음.
publish-study, brainstorming, Ponytail, Write Readable Code의 기존흐름/최소범위 원칙 적용.

| 기존파일 | 질문/답/조건 |
| --- | --- |
| cs/connection-pool-bottleneck | 연결 증가=완료 개선인가? 풀 획득/점유/SQL호출/DB내부를 구분. 같은부하·DB여유·안전한 거래 경계 확인 |
| cs/async-throughput-and-queue-latency | 접수와 완료가 왜 다른가? 번호7 타임라인/처리율과 유입량/큐 제한. 독립처리와 공유 자원 한계 명시 |

두 URL/date 유지, updatedAt10/9. 선수/관련/회상 보완. 기존 읽기 순서 사용.
Instagram2원본 접근 실패. 실험 수치는 검증된 오류라고 하지 않고 제외, 설명용 값으로 교체.
HikariCP공식 README/PoolSizing, Java21 ThreadPoolExecutor, Spring현행 ThreadPoolTaskExecutor API 조사.
검색 설명자료는 접근 관점 탐색만. 기술 판단은 공식 근거 사용.

## 프로젝트 근거

config의 product-service.yml 전체와 상품 main의 튜닝 옵션 검색.
명시적 튜닝 미확인과 실행중 기본값/충분성 미검증을 구분.
AI SettlementRunExecutionConfig/SettlementChatApplicationService/AiSettlementProperties 전체 확인.
큐0/고정최대실행수/AbortPolicy/거절 처리/AcceptedRun 반환, 실제기능 활성화 미확인 구분.
메모리큐/내구성/Kafka Lag을 동일한 보장으로 설명하지 않음.

완료: 전체91개 테스트/타입/격리빌드232페이지/메타데이터/HTML/앞뒤·선수·관련/산술/민감정보 점검 통과.
공개2파일 커밋1eadf2f. 원본URL/date 유지, 새 페이지 없음. 합계108줄 감소.
본문/초안/직접 근거4파일/관련diff 좁은 민감정보 검사 통과. 실제 Secret 값·내부 주소 복사 없음.
공개2파일만 로컬커밋. 운영/백엔드 테스트/부하/브라우저 시각검증/push 없음.
