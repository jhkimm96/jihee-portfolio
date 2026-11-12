// 홈의 대표 프로젝트 카드와 프로젝트 상세 첫 화면이 함께 쓰는 소개 자료. 키 순서가 대표 프로젝트 순서다.
// 공개 화면이 없는 프로젝트는 src 없이 설명만 두고, 가짜 화면을 만들지 않는다.

export type ShowcaseMedia = { src?: string; label: string }

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
      { label: '실제 화면은 공개되지 않았습니다.' },
      { label: '저장소와 담당 범위 연결' },
      { label: '지원자 입력에서 관리자 확인까지' }
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
      { label: '실제 화면은 사내 시스템이라 공개하지 않습니다.' },
      { label: '역할과 프로젝트 범위' },
      { label: '메뉴 권한 조회 흐름' }
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
      { label: '실제 화면은 교육기관 내부 시스템이라 공개하지 않습니다.' },
      { label: '이수 데이터와 역량 점수' },
      { label: '작성부터 출력까지의 흐름' }
    ],
    flow: [
      { label: 'PROBLEM / 배경', stage: '활동 데이터', title: '수기 이수 현황을 학생별 포트폴리오로 연결해야 했습니다.', description: '학생별 활동을 추적하고 화면과 출력물에 반영할 수 있는 데이터 흐름이 필요했습니다.' },
      { label: 'CHOICE / 선택', stage: '역량 점수', title: '학사 원본은 조회 전용으로 두었습니다.', description: '이수 데이터를 역량 점수와 선택 템플릿에 연결하되 기존 학사 원본 시스템은 변경하지 않았습니다.' },
      { label: 'BUILD / 구현', stage: '템플릿 화면', title: '데이터·화면 설계와 PDF 출력을 함께 구현했습니다.', description: '요구사항을 조율하고 ERD, 조회 쿼리, Vue3 화면 흐름, PDF 출력 기능을 담당했습니다.' },
      { label: 'VERIFY / 검증', stage: 'PDF 출력', title: '작성부터 출력까지 담당자에게 직접 시연했습니다.', description: '출력 품질의 정량 지표는 기록되지 않아 수치로 주장하지 않고 확인한 범위만 공개합니다.' }
    ]
  }
}
