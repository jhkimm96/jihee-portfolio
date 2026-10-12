# Outbox/Inbox 기존2편 보완

사용자 후속 “응 다음”: 직전 제안한 실제 중복방지 조건/현행 적용 범위의 실행 승인.
publish-study/승인된 bounded 장면 구조/Ponytail/WRC 적용. 새코드/페이지/UI/로드맵/백엔드 변경 없음.

| 파일 | 질문과 범위 |
| --- | --- |
| msa/outbox-inbox-when-needed | 발행과 중복 반영은 왜 별개인가? 상품7/E7/판매수10→11과동시exists경합, 실제unique/트랜잭션 조건 |
| msa/outbox-inbox-per-service | 어떤 경로를 확인해야 하나? 현재 주요5서비스경로, 과거표와달라진payment환불/정산gRPC, 단정하지않는검증조건 |

원본URL/date 보존, updatedAt10/9. 전수검증 표현은 실제 주요경로 확인으로 제한.
“product만Inbox필요”/“키만있으면자연멱등”/“Outbox면무조건전달보장” 단정 보완.
작성전 변경점과 범위를 commentary로 안내. 사용자 일괄진행 요청에 따라 재승인 반복하지 않음.

## 조사

2026-10-09 AWS Outbox/원저자microservices.io IdempotentConsumer/PostgreSQL18unique·격리자료 대조.
검색 공개설명자료는 쉬운 접근 탐색만. 기술판단은 원자료와프로젝트코드.
product Handler/판매수서비스/processedEntity/저장Adapter/JpaRepository/baseline전체,
Handler단위테스트전체(최초/이미처리/환불mock분기, 실제동시DB검증아님), Producer전체.
order 결제승인Processor/ProcessedService/OrderOutboxAppender/OutboxEventAppender/Relay,
OrderAdapter/OrderPersistence/OutboxAdapter/OutboxPersistence/baseline전체.
payment KafkaPublisher/OrderEventConsumer전체:현재환불요청경로; 환불내부전수분석아님.
settlement 판매자등록gRPCAdapter전체, user 등록서비스/Facade/V4deliveryIDunique전체.
업무DB제약·같은TX·충돌롤백/재처리 조건과 source선언/운영실측을 구분.
동일eventId와 다른eventId업무중복/외부효과/이력보관기간/다른사건갱신경합도 구분.

완료: 전체91개/타입/격리빌드232페이지/메타데이터·HTML·앞뒤·선수·관련·원본날짜/민감정보 자동 검사 통과.
본문/초안/직접근거24파일/관련diff 범위 검사. 토큰·이메일·개인경로 후보 없음, 실제Secret값·내부주소 복사 없음.
공개2파일 커밋2490221, push 없음. 원본URL/date 보존, 신규Study 없음.
공개2파일만 로컬커밋, push 없음. 운영DB/백엔드테스트/동시·장애·부하시험/브라우저UI 미실시.
