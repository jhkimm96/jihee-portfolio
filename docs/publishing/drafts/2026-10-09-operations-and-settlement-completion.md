---
status: completed
approved_by: "사용자 기존 CS 백로그 일괄 진행 승인"
---

# 배포/운영과 정산/배치 게시 범위

사용자 요청으로 재승인 질문 없이 승인된 콘텐츠 계약을 적용한다. 새9편/기존6편,
URL/date 보존, 로드맵/표시 이름/테스트/계획 파일 변경. 앱·백엔드·운영 시스템/push 제외.

| Study | 핵심 질문 |
| --- | --- |
| `docker/multi-stage-build` | 앱을 실행할 때 왜 개발 도구까지 함께 보내지 않을까? |
| `kubernetes/pod-lifecycle` | 앱이 켜진 것과 요청을 받을 준비가 된 것은 어떻게 구분할까? |
| `kubernetes/deployment-vs-statefulset` | Pod 교체를 직접 하지 않고 Deployment나 StatefulSet에 맡기는 이유는? |
| `kubernetes/service-and-ingress` | 앱 교체 뒤 요청 주소를 매번 바꾸지 않아도 되는 이유는? |
| `kubernetes/storage-secret-configmap` | 실행 이미지 밖에 데이터와 환경 설정을 두는 이유는? |
| `kubernetes/resource-requests-and-limits` | requests와 limits는 각각 어떤 자원을 제한할까? |
| `kubernetes/oom-killed-and-java-memory` | 메모리 때문에 재시작하는 앱에서 힙과 컨테이너 한도를 어떻게 구분할까? |
| `kubernetes/cronjob-schedule-and-idempotency` | CronJob의 일정과 중복 처리 방지는 왜 별개일까? |
| `kubernetes/deployment-operational-verification` | 배포 뒤 앱이 정상인지 어떤 순서로 확인할까? |
| `spring/spring-batch-chunk-processing` | Chunk는 무엇을 묶고 실패하면 어디까지 되돌릴까? |
| `batch/transaction-and-settlement-model` | 거래 내역과 판매자에게 줄 정산 결과는 왜 나눠 저장할까? |
| `batch/settlement-period-boundaries` | 일별 정산의 날짜와 배치 실행 날짜는 왜 분리할까? |
| `batch/reconciliation-and-result-verification` | 계산 전 원본과 계산 후 결과가 맞는지 어떻게 확인할까? |
| `batch/failed-delivery-and-idempotent-retry` | 실패한 정산 전달만 안전하게 다시 보내려면 무엇을 보관할까? |
| `batch/job-step-and-restart-identity` | Job, Step, JobInstance와 JobExecution은 재시작에서 무엇을 구분할까? |

## 조사 원칙과 근거

- 공식 Docker 이미지/컨테이너/멀티스테이지 문서, Kubernetes Pod/Probe/Deployment/StatefulSet/Service/Ingress/PV/ConfigMap/Secret/자원/CronJob 문서를 2026-10-09 확인.
- Java21 BigDecimal/메모리 진단, Spring Batch 안정판6.0.5 Chunk/JobInstance/Step재시작,
  Stripe 대사/멱등 API의 서로 다른 계약을 확인. 검색의 블로그/영상은 쉬운 설명 접근 탐색만 사용.
- 프로젝트 루트 Dockerfile/build.gradle/settlement build.gradle, product Deployment/Service,
  settlement CronJob/Runner/Period/JobConfig/StepConfig/Reader/Processor/Writer,
  계산 모델·서비스/원본·계산 대사 모델·서비스·Tasklet/전달 모델·서비스,
  Job 파라미터/Launcher/Restarter와 user-service 등록 Facade/서비스를 직접 읽었다.
- 소스 대사 Tasklet 테스트의 성공/실패 검증 항목을 읽음. 백엔드 테스트 실행은 하지 않음.
- 원본 대사는 집계 비교이며 같은 건수·금액인 다른 소스까지 완전 검출한다고 쓰지 않음.
- 기간은 실제 프로젝트 주간과 일별 학습 예제를 구분. 업무완료와 전달완료도 구분.
- Batch6.1 preview를 안정판으로 설명하지 않음. 프로젝트 Boot4.1.0 선언과 실제 Batch 패치 해석 미확인을 구분.
- Secret 실제 값을 열지 않았고 참조만 사용. 초기 감사와 상충하는 현행 CronJob 파일 존재를 반영.

## 검증

새 순서/표시 이름 테스트3개 실패 확인 → 전체91개 통과, 타입 검사 통과.
격리 빌드 통과(전체232페이지, 신규 Study9편 + 카테고리1개).
15편 공개 HTML/메타데이터/토글/앞뒤·선수·관련 연결/원본 날짜 보존과 공개 범위 민감정보 검사 통과.
로드맵은 처음1단계만 렌더링하므로 6단계 버튼과 전달 데이터/순서 단위 테스트를 확인했다.
처음 전체 href를 요구한 검사는 초기 렌더링 구조와 맞지 않아 위 실제 구조로 수정해 재검사했다.
첫 격리 복사본에는 next.config.mjs가 누락돼 콘텐츠 모듈을 찾지 못했다.
실제 설정 파일을 복사한 뒤 전체 빌드 통과. 앱 코드 결함이나 설정 변경은 아님.
승인20파일 커밋 f946379, push 없음. 기존 dirty 기록 제외.
브라우저 시각 검증/Java 예제 실행/클러스터 적용·장애 실험/운영 효과 검증은 수행하지 않는다.
