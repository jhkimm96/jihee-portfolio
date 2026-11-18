// 홈의 대표 프로젝트 카드와 프로젝트 상세 첫 화면이 함께 쓰는 소개 자료.
// 기존 화면, 시연용 데이터와 공개 설명용 개념도는 이미지 설명에서 구분한다.

export type ShowcaseMedia = { src?: string; label: string; description?: string }

export type ShowcaseStep = {
  label: string
  stage: string
  title: string
  description: string
}

export type ProjectShowcase = {
  tag: string
  meta: string
  role: string
  media: ShowcaseMedia[]
  flow: ShowcaseStep[]
}

export const projectShowcases: Record<string, ProjectShowcase> = {
  prompthub: {
    tag: '상품 · 검색 · 추천',
    meta: 'TEAM PROJECT / PRODUCT + AI SERVICE',
    role: 'product-service 상품·검색 도메인 · ai-service 개인화 추천',
    media: [
      { src: '/prompthub/images/products-screen.png', label: '기존 화면 / 전체 상품과 개인화 추천', description: '기존에 보관된 실제 상품 화면입니다. 본인 담당은 product-service와 ai-service입니다.' },
      { src: '/prompthub/videos/search-flow.gif', label: '기존 검색 시연 GIF', description: '팀 저장소 README의 검색 시연 원본입니다. 400×225 해상도의 기존 자료입니다.' },
      { src: '/prompthub/images/product-detail-screen.png', label: '기존 화면 / 상품 상세', description: '기존에 보관된 실제 상품 상세 화면입니다.' },
      { src: '/prompthub/images/similar-products-screen.png', label: '상품 상세 / 비슷한 상품', description: '기존 프론트엔드에 시연용 API 응답을 채운 보충 화면입니다. 실제 추천 알고리즘 결과를 검증한 자료는 아닙니다.' },
      { src: '/prompthub/images/search-recommendation/00-overview.png', label: '서비스 흐름 개요' },
      { src: '/prompthub/images/search-recommendation/01-indexing.png', label: '상품 변경과 증분 색인' },
      { src: '/prompthub/images/search-recommendation/02-search.png', label: '하이브리드 검색' },
      { src: '/prompthub/images/search-recommendation/03-ranking.png', label: '검색 결과 정렬' },
      { src: '/prompthub/images/search-recommendation/04-recommendation.png', label: '개인화 추천' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '상품 도메인', title: '상품 정보가 검색과 추천으로 이어져야 했습니다.', description: '상품 도메인의 변경이 검색 인덱스와 결과 화면에 어떤 순서로 반영되는지 먼저 정리했습니다.' },
      { label: 'CHOICE / 선택', stage: '검색 인덱스', title: '원본 데이터와 검색 사본의 책임을 나눴습니다.', description: 'PostgreSQL은 원본과 임베딩을 보관하고 Elasticsearch는 검색 문서를 담당하도록 경계를 두었습니다.' },
      { label: 'BUILD / 구현', stage: '추천', title: '상품·검색·개인화 추천을 각 책임에 맞게 구현했습니다.', description: '증분 색인, RRF 하이브리드 검색, 활동 가중치 기반 추천을 product-service와 ai-service에 나눠 구현했습니다.' },
      { label: 'VERIFY / 검증', stage: '결과 화면', title: '검색과 추천의 실패가 상품 조회로 번지지 않게 확인했습니다.', description: '검색 분석기 불일치와 추천 실패 조건을 트러블슈팅과 리뷰 기록으로 검증하고 폴백 동작을 확인했습니다.' }
    ]
  },
  'career-link': {
    tag: '채용 매칭 · 관리자',
    meta: 'TEAM PROJECT / APPLICANT + ADMIN',
    role: '어드민 공통 기반 · 이력서·자소서·스크랩 CRUD · Next.js 초기 셋업',
    media: [
      { src: '/career-link/images/main.png', label: '메인 / 채용공고 탐색', description: '시연용 기업과 공고 데이터로 실행한 기존 UI입니다. 팀 서비스 전체의 진입 화면입니다.' },
      { src: '/career-link/images/applicant-resumes.png', label: '지원자 / 이력서 목록', description: '기존 UI에 시연용 데이터를 사용했습니다. 본인 담당 지원자 이력서 CRUD와 연결됩니다.' },
      { src: '/career-link/images/applicant-resume-form.png', label: '지원자 / 이력서 작성', description: '경력과 스킬 입력을 보여주는 시연 화면입니다. 실제 지원서나 저장 완료 기록이 아닙니다.' },
      { src: '/career-link/images/applicant-cover-letter-form.png', label: '지원자 / 자기소개서 작성', description: '항목 추가와 입력을 보여주는 시연 화면입니다. 본인 담당 지원자 자소서 CRUD와 연결됩니다.' },
      { src: '/career-link/images/applicant-scraps.png', label: '지원자 / 관심 공고 스크랩', description: '기존 UI에 시연용 공고를 표시했습니다. 본인 담당 공고 스크랩 기능과 연결됩니다.' },
      { src: '/career-link/images/employer-jobs.png', label: '기업 / 채용공고 관리', description: '시연용 데이터로 확인한 팀 전체 기능입니다. 기업 화면 전체를 개인 기여로 주장하지 않습니다.' },
      { src: '/career-link/images/employer-applications.png', label: '기업 / 지원자 관리', description: '시연용 지원자 데이터를 표시한 팀 전체 기능입니다.' },
      { src: '/career-link/images/employer-dashboard.png', label: '기업 / 통계 대시보드', description: '기존 차트 UI를 실행한 팀 전체 기능입니다. 수치는 화면 설명을 위한 시연용 값입니다.' },
      { src: '/career-link/images/employer-members.png', label: '기업 / 소속회원 관리', description: '시연용 회원 데이터로 확인한 팀 전체 기능입니다.' },
      { src: '/career-link/images/admin-menu.png', label: '관리자 / 권한별 메뉴 관리', description: '기존 UI에 시연용 메뉴를 표시했습니다. 본인 담당 권한별 메뉴 관리와 연결됩니다.' },
      { src: '/career-link/images/admin-common-code.png', label: '관리자 / 공통코드 관리', description: '기존 UI에 시연용 코드를 표시했습니다. 본인 담당 어드민 공통 기반과 연결됩니다.' },
      { src: '/career-link/images/admin-users.png', label: '관리자 / 사용자 관리', description: '시연용 회원 데이터를 표시한 팀 전체 기능입니다.' },
      { src: '/career-link/images/service-overview.png', label: '서비스 흐름과 본인 담당 범위', description: '확인된 개인 기여를 요약한 개념도입니다. 기업 기능과 인증 전체는 팀 작업과 구분합니다.' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '역할과 권한', title: '세 역할이 같은 정보를 서로 다른 목적에 맞게 확인해야 했습니다.', description: '구직자·기업·관리자 흐름을 구분하고, 공통 기반과 지원자 기능의 담당 범위를 먼저 정리했습니다.' },
      { label: 'CHOICE / 선택', stage: '공통 기반', title: '반복되는 관리 기능을 공통 기반으로 묶었습니다.', description: '권한별 메뉴와 공통코드 관리를 어드민 공통 기반으로 설계해 도메인 CRUD와 분리했습니다.' },
      { label: 'BUILD / 구현', stage: '지원자 CRUD', title: '지원자 이력서·자소서와 공고 스크랩을 구현했습니다.', description: '백엔드 CRUD와 Next.js 15 / React 18 프론트엔드 프로젝트 초기 셋업을 담당했습니다.' },
      { label: 'VERIFY / 검증', stage: '화면 연결', title: '공동 작업 범위와 개인 담당을 구분해 기록했습니다.', description: 'JWT와 다른 공동 기능은 전체 프로젝트 기록과 개인 담당 범위를 나눠 공개하고 있습니다.' }
    ]
  },
  'help-desk': {
    tag: '권한 · 업무 흐름',
    meta: 'INTERNAL SERVICE / ACCESS CONTROL',
    role: 'Help Desk 스키마 · RBAC · 메뉴 조회 · 공통코드와 API',
    media: [
      { src: '/help-desk/images/service-overview.png', label: '역할과 권한 처리 흐름', description: '공개 설명용 개념도입니다. 실제 사내 화면과 고객 데이터를 포함하지 않았습니다.' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '인증 범위', title: '트리형 하위 메뉴의 권한을 수동으로 부여하면 누락될 수 있었습니다.', description: '메뉴가 늘어날수록 화면 조건문과 수동 권한 관리만으로는 누락을 찾기 어려웠습니다.' },
      { label: 'CHOICE / 선택', stage: '권한 구조', title: '권한을 데이터 구조에서 조회하도록 설계했습니다.', description: '메뉴·역할·사용자 매핑과 권한별 메뉴 조회 뷰를 두고, 관리자 권한은 하위 메뉴까지 재귀 처리했습니다.' },
      { label: 'BUILD / 구현', stage: '업무 요청', title: '업무 범위와 RBAC, 공통 API를 구현했습니다.', description: '고객·담당자·내부 대표자의 조회 범위를 프로젝트 데이터로 나누고 MyBatis 매퍼와 API를 구현했습니다.' },
      { label: 'VERIFY / 검증', stage: '처리 상태', title: '메뉴 구조 변경 뒤에도 관리자 권한이 이어지는지 확인했습니다.', description: '정량적인 운영 개선 수치는 확보하지 않았고, 구조적 변경과 공개 범위만 기록했습니다.' }
    ]
  },
  'student-portfolio': {
    tag: '활동 데이터 · PDF 출력',
    meta: 'INTERNAL SERVICE / DATA TO DOCUMENT',
    role: '요구사항 조율 · 데이터·화면 설계 · 조회 쿼리 · PDF 출력',
    media: [
      { src: '/student-portfolio/images/service-overview.png', label: '이수 데이터에서 포트폴리오 PDF까지', description: '공개 설명용 개념도입니다. 실제 교육기관 화면과 학생 데이터를 포함하지 않았습니다.' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '활동 데이터', title: '수기 이수 현황을 학생별 포트폴리오로 연결해야 했습니다.', description: '학생별 활동을 추적하고 화면과 출력물에 반영할 수 있는 데이터 흐름이 필요했습니다.' },
      { label: 'CHOICE / 선택', stage: '역량 점수', title: '학사 원본은 조회 전용으로 두었습니다.', description: '이수 데이터를 역량 점수와 선택 템플릿에 연결하되 기존 학사 원본 시스템은 변경하지 않았습니다.' },
      { label: 'BUILD / 구현', stage: '템플릿 화면', title: '데이터·화면 설계와 PDF 출력을 함께 구현했습니다.', description: '요구사항을 조율하고 ERD, 조회 쿼리, Vue3 화면 흐름, PDF 출력 기능을 담당했습니다.' },
      { label: 'VERIFY / 검증', stage: 'PDF 출력', title: '작성부터 출력까지 담당자에게 직접 시연했습니다.', description: '출력 품질의 정량 지표는 기록되지 않아 수치로 주장하지 않고 확인한 범위만 공개합니다.' }
    ]
  },
  'competency-education': {
    tag: '교육과정과 학사 연동',
    meta: 'INTERNAL SERVICE / EDUCATION DATA',
    role: '요구사항 협의 / 데이터 설계 / API와 조회 SQL',
    media: [
      { src: '/competency-education/images/service-overview.png', label: '서비스 흐름과 본인 담당 범위', description: '공개 설명용 개념도입니다. 실제 내부 시스템 화면과 업무 데이터를 포함하지 않았습니다.' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '업무 기준', title: '담당 기능의 범위부터 확인해야 했습니다.', description: '학과와 행정부서의 실제 업무 흐름을 확인해 개발 기준을 정리했습니다.' },
      { label: 'CHOICE / 선택', stage: '조회 경계', title: '기존 학사 원본은 조회 전용으로 연동했습니다.', description: '원본 스키마를 변경하지 않고 필요한 데이터를 읽도록 뷰와 접근 권한을 구성했습니다.' },
      { label: 'BUILD / 구현', stage: '데이터와 API', title: '담당 테이블과 API, 조회 SQL을 구현했습니다.', description: '교육과정, 직무, 능력단위의 테이블과 제약조건을 설계하고 Spring과 MyBatis로 연결했습니다.' },
      { label: 'VERIFY / 검증', stage: '담당 기능 검증', title: '정리한 업무 기준으로 개발과 검증을 진행했습니다.', description: '후속 성공지원시스템의 기획과 설계에도 참여했으며 정량적인 일정 및 성능 개선은 주장하지 않습니다.' }
    ]
  },
  'admission-system': {
    tag: '지원자와 입시 업무',
    meta: 'INTERNAL SERVICE / ADMISSIONS',
    role: 'Nexacro 업무 화면 / Java와 SQL 데이터 처리',
    media: [
      { src: '/admission-system/images/service-overview.png', label: '서비스 흐름과 본인 담당 범위', description: '공개 설명용 개념도입니다. 실제 내부 시스템 화면과 업무 데이터를 포함하지 않았습니다.' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '지원자 정보', title: '여러 입시 업무 화면에서 지원자 정보를 관리해야 했습니다.', description: '지원자 현황, 전적대학 이력, 합격 결과와 제출서류를 다루는 업무입니다.' },
      { label: 'CHOICE / 선택', stage: '화면과 데이터', title: '업무 화면과 데이터 처리 흐름을 연결했습니다.', description: 'Nexacro 화면과 Java 및 SQL을 연결하고 기존 개인정보 암호화 요구사항을 반영했습니다.' },
      { label: 'BUILD / 구현', stage: '담당 기능', title: '지원자와 합격자, 서류 관리 기능을 개발했습니다.', description: '전적대학 정보 CRUD와 입학사정대장 및 기관 관리 기능에도 참여했습니다.' },
      { label: 'VERIFY / 검증', stage: '확인 범위', title: '담당 업무 기능의 구현 범위를 기록했습니다.', description: '처리량이나 운영 개선 수치는 확인되지 않아 개인 성과로 주장하지 않습니다.' }
    ]
  },
  'erp-inventory': {
    tag: '재고와 자산 운영',
    meta: 'INTERNAL SERVICE / ERP OPERATIONS',
    role: '선임 개발자와 운영 보조 / 조회 로직 수정',
    media: [
      { src: '/erp-inventory/images/service-overview.png', label: '서비스 흐름과 본인 담당 범위', description: '공개 설명용 개념도입니다. 실제 내부 시스템 화면과 업무 데이터를 포함하지 않았습니다.' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '기존 운영', title: '운영 중인 재고와 자산 기능을 유지해야 했습니다.', description: '기존 데이터 구조와 업무 조회 및 연동 흐름을 파악했습니다.' },
      { label: 'CHOICE / 선택', stage: '변경 확인', title: '선임 개발자와 기존 변경 이력을 확인했습니다.', description: '기존 운영을 유지하면서 필요한 조회 로직과 후속 기능을 수정하는 역할이었습니다.' },
      { label: 'BUILD / 구현', stage: '조회 수정', title: '조회 로직 수정과 유지보수에 참여했습니다.', description: '재고와 자산 기능의 운영, 기존 연동 검증과 후속 수정을 보조했습니다.' },
      { label: 'VERIFY / 검증', stage: '기여 범위', title: '개인 역할을 운영 보조로 한정해 기록했습니다.', description: '모듈 단독 설계나 다른 개발자의 성능 개선을 개인 성과로 포함하지 않습니다.' }
    ]
  },
  'zone-survival': {
    tag: '게임 규칙과 검증',
    meta: 'PERSONAL PROJECT / GAME SIMULATION',
    role: '규칙 방향 결정 / 플레이와 봇 비교 / 기록 체계',
    media: [
      { src: '/zone-survival/images/late.png', label: '기존 플레이 화면 / 후반 생존', description: '고정 시드 시뮬레이션 장면입니다. 체력과 효과 시간은 캡처용 값입니다.' },
      { src: '/zone-survival/images/start.png', label: '기존 시작 화면', description: '규칙과 아이템 안내 및 닉네임 입력 화면입니다.' },
      { src: '/zone-survival/images/warning.png', label: '기존 플레이 화면 / 폭격 예고', description: '고정 시드 시뮬레이션으로 재현한 장면입니다.' },
      { src: '/zone-survival/images/result.png', label: '기존 결과 화면', description: '결과 화면의 숫자는 화면 구성을 보여주기 위한 예시 값입니다.' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '생존 규칙', title: '가만히 있어도 생존할 수 있는 규칙의 허점을 발견했습니다.', description: '첫 버전에서 가만히 있는 봇이 500판 중 101판을 클리어했습니다.' },
      { label: 'CHOICE / 선택', stage: '재현 기준', title: '같은 시드와 입력으로 수정 전후를 비교했습니다.', description: '직접 플레이한 소감과 고정 시드 봇 시뮬레이션을 함께 확인했습니다.' },
      { label: 'BUILD / 구현', stage: '규칙과 기록', title: 'Claude Code와 함께 게임 및 검증 도구를 구현했습니다.', description: '자기장, 폭격, 추적자와 아이템의 규칙을 수정하고 사망 원인과 피해를 기록했습니다.' },
      { label: 'VERIFY / 검증', stage: '봇 비교', title: '가만히 있는 봇의 클리어가 0/500으로 줄었습니다.', description: '수정 이유를 balance-log로 남겼으며 사람 플레이어 기준의 난이도는 아직 검증 중입니다.' }
    ]
  }
}
