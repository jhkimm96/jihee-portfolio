'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ProjectEntry } from '@/lib/content'

type NodeKey = 'api' | 'search' | 'rbac' | 'data' | 'ui' | 'ops'
type ProjectKey = 'prompthub' | 'career-link' | 'help-desk' | 'student-portfolio'

type NodeContent = {
  title: string
  category: string
  description: string
  project: ProjectKey
  summary: string
  role: string
  verified: string
  stack: string
}

type FlowStage = {
  label: string
  title: string
  description: string
}

type ProjectView = {
  meta: string
  role: string
  stack: string
  media: { src?: string; label: string }[]
  stages: string[]
  flow: FlowStage[]
}

const nodeContent: Record<NodeKey, NodeContent> = {
  api: {
    title: 'API 설계',
    category: 'BOUNDARY',
    description: '기능을 나누기 전에 서비스의 경계를 먼저 확인합니다.',
    project: 'career-link',
    summary: '지원자와 운영자의 흐름을 하나의 서비스로 연결',
    role: '어드민 공통 기반 · 지원자 CRUD · API 연결',
    verified: '권한별 메뉴와 지원자 흐름 연결',
    stack: 'Spring Boot · PostgreSQL · Next.js'
  },
  search: {
    title: '검색·추천',
    category: 'DISCOVERY',
    description: '검색과 추천은 화면보다 데이터 흐름을 먼저 봅니다.',
    project: 'prompthub',
    summary: '검색 인덱스와 개인화 추천으로 이어지는 데이터 흐름',
    role: '상품 검색 · RRF · 개인화 추천',
    verified: '증분 색인·RRF·추천 실패 폴백 확인',
    stack: 'Java · Spring Boot · PostgreSQL · Elasticsearch'
  },
  rbac: {
    title: '권한·RBAC',
    category: 'CONTROL',
    description: '사용자와 메뉴의 관계를 데이터 구조로 관리합니다.',
    project: 'help-desk',
    summary: '역할에 따라 보이는 업무 범위와 메뉴를 연결',
    role: '메뉴 · 역할 · 사용자 권한 조회',
    verified: '하위 메뉴 권한 재귀 처리 확인',
    stack: 'Spring Boot · MyBatis · MySQL · React'
  },
  data: {
    title: '데이터 모델링',
    category: 'SOURCE OF TRUTH',
    description: '원본 데이터와 검색용 사본의 책임을 나눕니다.',
    project: 'prompthub',
    summary: '상품 원본과 검색 인덱스가 서로 다른 역할을 갖는 구조',
    role: '상품 도메인 · 원본/검색 데이터 경계',
    verified: 'PostgreSQL 원본과 Elasticsearch 책임 경계 확인',
    stack: 'PostgreSQL · Elasticsearch · pgvector'
  },
  ui: {
    title: '화면 연결',
    category: 'EXPERIENCE',
    description: '사용자가 보는 화면까지 연결되어야 구현이 끝납니다.',
    project: 'student-portfolio',
    summary: '학생 활동 데이터가 화면과 출력물로 이어지는 구조',
    role: '요구사항 조율 · 데이터 매핑 · Vue3 화면 · PDF 출력',
    verified: '작성 데이터부터 PDF 출력까지 연결',
    stack: 'Java · MyBatis · TIBERO · Vue3'
  },
  ops: {
    title: '운영 검증',
    category: 'VERIFY',
    description: '배포 이후의 실패 조건과 검증 결과도 남깁니다.',
    project: 'prompthub',
    summary: '서비스를 운영 환경까지 연결하고 동작을 다시 확인',
    role: '실행 검증 · 장애 폴백 · 배포 기록',
    verified: '검색 장애 시 PostgreSQL 폴백 확인',
    stack: 'Docker · GitHub Actions · GHCR'
  }
}

const nodeKeys: NodeKey[] = ['api', 'search', 'rbac', 'data', 'ui', 'ops']
const priorityNodeKeys: NodeKey[] = ['search', 'rbac']

const projectViews: Record<ProjectKey, ProjectView> = {
  prompthub: {
    meta: 'TEAM PROJECT / PRODUCT + AI SERVICE',
    role: 'product-service 상품·검색 도메인 · ai-service 개인화 추천',
    stack: 'Java 21 · Spring Boot · PostgreSQL · Elasticsearch · pgvector',
    media: [
      { src: '/prompthub/images/search-recommendation/00-overview.png', label: '서비스 흐름 개요' },
      { src: '/prompthub/images/search-recommendation/01-indexing.png', label: '상품 변경과 증분 색인' },
      { src: '/prompthub/images/search-recommendation/02-search.png', label: '하이브리드 검색' },
      { src: '/prompthub/images/search-recommendation/03-ranking.png', label: '검색 결과 정렬' },
      { src: '/prompthub/images/search-recommendation/04-recommendation.png', label: '개인화 추천' }
    ],
    stages: ['상품 도메인', '검색 인덱스', '추천', '결과 화면'],
    flow: [
      { label: 'PROBLEM / 배경', title: '상품 정보가 검색과 추천으로 이어져야 했습니다.', description: '상품 도메인의 변경이 검색 인덱스와 결과 화면에 어떤 순서로 반영되는지 먼저 정리했습니다.' },
      { label: 'CHOICE / 선택', title: '원본 데이터와 검색 사본의 책임을 나눴습니다.', description: 'PostgreSQL은 원본과 임베딩을 보관하고 Elasticsearch는 검색 문서를 담당하도록 경계를 두었습니다.' },
      { label: 'BUILD / 구현', title: '상품·검색·개인화 추천을 각 책임에 맞게 구현했습니다.', description: '증분 색인, RRF 하이브리드 검색, 활동 가중치 기반 추천을 product-service와 ai-service에 나눠 구현했습니다.' },
      { label: 'VERIFY / 검증', title: '검색과 추천의 실패가 상품 조회로 번지지 않게 확인했습니다.', description: '검색 분석기 불일치와 추천 실패 조건을 트러블슈팅과 리뷰 기록으로 검증하고 폴백 동작을 확인했습니다.' }
    ]
  },
  'career-link': {
    meta: 'TEAM PROJECT / APPLICANT + ADMIN',
    role: '어드민 공통 기반 · 이력서·자소서·스크랩 CRUD · Next.js 초기 셋업',
    stack: 'Spring Boot · PostgreSQL · JWT · Next.js',
    media: [
      { label: '실제 화면은 공개되지 않았습니다.' },
      { label: '저장소와 담당 범위 연결' },
      { label: '지원자 입력에서 관리자 확인까지' }
    ],
    stages: ['역할과 권한', '공통 기반', '지원자 CRUD', '화면 연결'],
    flow: [
      { label: 'PROBLEM / 배경', title: '세 역할이 같은 정보를 서로 다른 목적에 맞게 확인해야 했습니다.', description: '구직자·기업·관리자 흐름을 구분하고, 공통 기반과 지원자 기능의 담당 범위를 먼저 정리했습니다.' },
      { label: 'CHOICE / 선택', title: '반복되는 관리 기능을 공통 기반으로 묶었습니다.', description: '권한별 메뉴와 공통코드 관리를 어드민 공통 기반으로 설계해 도메인 CRUD와 분리했습니다.' },
      { label: 'BUILD / 구현', title: '지원자 이력서·자소서와 공고 스크랩을 구현했습니다.', description: '백엔드 CRUD와 Next.js 15 / React 18 프론트엔드 프로젝트 초기 셋업을 담당했습니다.' },
      { label: 'VERIFY / 검증', title: '공동 작업 범위와 개인 담당을 구분해 기록했습니다.', description: 'JWT와 다른 공동 기능은 전체 프로젝트 기록과 개인 담당 범위를 나눠 공개하고 있습니다.' }
    ]
  },
  'help-desk': {
    meta: 'INTERNAL SERVICE / ACCESS CONTROL',
    role: 'Help Desk 스키마 · RBAC · 메뉴 조회 · 공통코드와 API',
    stack: 'Java 21 · Spring Boot · MyBatis · MySQL · React · Next.js',
    media: [
      { label: '실제 화면은 사내 시스템이라 공개하지 않습니다.' },
      { label: '역할과 프로젝트 범위' },
      { label: '메뉴 권한 조회 흐름' }
    ],
    stages: ['인증 범위', '권한 구조', '업무 요청', '처리 상태'],
    flow: [
      { label: 'PROBLEM / 배경', title: '트리형 하위 메뉴의 권한을 수동으로 부여하면 누락될 수 있었습니다.', description: '메뉴가 늘어날수록 화면 조건문과 수동 권한 관리만으로는 누락을 찾기 어려웠습니다.' },
      { label: 'CHOICE / 선택', title: '권한을 데이터 구조에서 조회하도록 설계했습니다.', description: '메뉴·역할·사용자 매핑과 권한별 메뉴 조회 뷰를 두고, 관리자 권한은 하위 메뉴까지 재귀 처리했습니다.' },
      { label: 'BUILD / 구현', title: '업무 범위와 RBAC, 공통 API를 구현했습니다.', description: '고객·담당자·내부 대표자의 조회 범위를 프로젝트 데이터로 나누고 MyBatis 매퍼와 API를 구현했습니다.' },
      { label: 'VERIFY / 검증', title: '메뉴 구조 변경 뒤에도 관리자 권한이 이어지는지 확인했습니다.', description: '정량적인 운영 개선 수치는 확보하지 않았고, 구조적 변경과 공개 범위만 기록했습니다.' }
    ]
  },
  'student-portfolio': {
    meta: 'INTERNAL SERVICE / DATA TO DOCUMENT',
    role: '요구사항 조율 · 데이터·화면 설계 · 조회 쿼리 · PDF 출력',
    stack: 'Java · Spring eGovFrame · MyBatis · TIBERO · Vue3 · html2pdf.js',
    media: [
      { label: '실제 화면은 교육기관 내부 시스템이라 공개하지 않습니다.' },
      { label: '이수 데이터와 역량 점수' },
      { label: '작성부터 출력까지의 흐름' }
    ],
    stages: ['활동 데이터', '역량 점수', '템플릿 화면', 'PDF 출력'],
    flow: [
      { label: 'PROBLEM / 배경', title: '수기 이수 현황을 학생별 포트폴리오로 연결해야 했습니다.', description: '학생별 활동을 추적하고 화면과 출력물에 반영할 수 있는 데이터 흐름이 필요했습니다.' },
      { label: 'CHOICE / 선택', title: '학사 원본은 조회 전용으로 두었습니다.', description: '이수 데이터를 역량 점수와 선택 템플릿에 연결하되 기존 학사 원본 시스템은 변경하지 않았습니다.' },
      { label: 'BUILD / 구현', title: '데이터·화면 설계와 PDF 출력을 함께 구현했습니다.', description: '요구사항을 조율하고 ERD, 조회 쿼리, Vue3 화면 흐름, PDF 출력 기능을 담당했습니다.' },
      { label: 'VERIFY / 검증', title: '작성부터 출력까지 담당자에게 직접 시연했습니다.', description: '출력 품질의 정량 지표는 기록되지 않아 수치로 주장하지 않고 확인한 범위만 공개합니다.' }
    ]
  }
}

function getProject(projects: ProjectEntry[], slug: ProjectKey): ProjectEntry {
  return projects.find((project) => project.slug === slug) ?? projects[0]
}

export function HomeInteractive({ projects }: { projects: ProjectEntry[] }) {
  const [selectedNode, setSelectedNode] = useState<NodeKey>('search')
  const [selectedProject, setSelectedProject] = useState<ProjectKey>('prompthub')
  const [mediaIndex, setMediaIndex] = useState(0)
  const [flowIndex, setFlowIndex] = useState(0)
  const node = nodeContent[selectedNode]
  const project = getProject(projects, selectedProject)
  const view = projectViews[selectedProject]
  const media = view.media[mediaIndex]
  const flow = view.flow[flowIndex]

  function selectProject(slug: ProjectKey) {
    setSelectedProject(slug)
    setMediaIndex(0)
    setFlowIndex(0)
  }

  function selectNode(key: NodeKey) {
    setSelectedNode(key)
    selectProject(nodeContent[key].project)
  }

  function moveMedia(direction: number) {
    setMediaIndex((current) => (current + direction + view.media.length) % view.media.length)
  }

  return (
    <div className="white-home">
      <section className="white-home-intro" aria-label="포트폴리오 소개와 핵심 근거">
        <section className="white-home-hero" aria-labelledby="home-title">
        <div className="white-home-copy">
          <p className="white-home-eyebrow">SOFTWARE ENGINEER / PORTFOLIO</p>
          <h1 id="home-title">검색·추천·권한을 설계하고<br /><em>데이터와 화면을 연결하는</em><br />개발자, 김지희입니다.</h1>
          <p className="white-home-lead">PromptHub에서는 상품·검색·개인화 추천을 두 서비스의 책임으로 나누어 구현했고, Career Link에서는 권한별 메뉴와 지원자 기능을 만들었습니다. Java와 Spring 기반 백엔드를 중심으로 서비스의 화면과 운영 검증까지 연결합니다.</p>
          <div className="white-home-actions">
            <a className="white-home-primary" href="#home-projects">대표 프로젝트 보기 ↓</a>
            <a className="white-home-secondary" href="/about#skills">기술과 경력 보기 ↗</a>
          </div>
        </div>

        <section className="white-system-map" id="system-map" aria-labelledby="system-map-title">
          <div className="white-map-head"><strong id="system-map-title">MY SYSTEM MAP</strong><span>SELECT A ROLE</span></div>
          <div className="white-map-guide" aria-label="대표 경로 안내">
            <span>START HERE</span>
            <strong>검색·추천 <b>→</b> 권한·RBAC</strong>
            <p>대표 사례에서 문제·내 구현·검증 근거까지 이어서 확인합니다.</p>
          </div>
          <div className="white-capability-canvas" aria-label="역할과 검증 결과를 연결한 업무 그래프">
            <svg className="white-map-connections" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <path className={`white-map-connection connection-api-data ${selectedNode === 'api' || selectedNode === 'data' ? 'is-active' : ''}`} d="M21 27 C35 18, 43 22, 50 32" />
              <path className={`white-map-connection connection-search-data ${selectedNode === 'search' || selectedNode === 'data' ? 'is-active' : ''}`} d="M79 27 C66 18, 58 22, 50 32" />
              <path className={`white-map-connection connection-api-rbac ${selectedNode === 'api' || selectedNode === 'rbac' ? 'is-active' : ''}`} d="M21 27 C24 42, 27 51, 29 68" />
              <path className={`white-map-connection connection-search-ui ${selectedNode === 'search' || selectedNode === 'ui' ? 'is-active' : ''}`} d="M79 27 C76 42, 73 51, 71 68" />
              <path className={`white-map-connection connection-rbac-ops ${selectedNode === 'rbac' || selectedNode === 'ops' ? 'is-active' : ''}`} d="M29 68 C40 77, 58 77, 71 68" />
              <path className={`white-map-connection connection-ui-ops ${selectedNode === 'ui' || selectedNode === 'ops' ? 'is-active' : ''}`} d="M71 68 C72 79, 76 82, 82 84" />
            </svg>
            <div className="white-capability-grid">
              {nodeKeys.map((key, index) => {
                const item = nodeContent[key]
                const isPriorityNode = priorityNodeKeys.includes(key)
                return <button key={key} className={`white-map-node white-map-node-${key} ${isPriorityNode ? 'is-priority' : ''}`} type="button" aria-pressed={selectedNode === key} onClick={() => selectNode(key)}><small>{String(index + 1).padStart(2, '0')} / {item.category}</small>{isPriorityNode ? <span className="white-map-node-route">대표 경로</span> : null}<strong>{item.title}</strong><span><b>MY ROLE</b>{item.role}</span><span><b>VERIFIED</b>{item.verified}</span></button>
              })}
            </div>
          </div>
          <div className="white-map-insight" aria-live="polite"><div className="white-map-insight-top"><strong>{node.description}</strong><span>CONNECTED PROJECT ↘</span></div><div className="white-map-related"><div><small>RELATED PROJECT</small><Link href={`/projects/${node.project}`}><strong>{getProject(projects, node.project).title}</strong></Link><em>{node.summary}</em><Link className="white-map-evidence-link" href={`/projects/${node.project}`}>근거 보기 ↗</Link></div><div className="white-map-role"><small>MY ROLE</small><strong>{node.role}</strong><em>{node.stack}</em></div></div></div>
        </section>
        </section>

        <section className="white-home-proof" aria-label="경력 요약">
        <a href="/about#experience"><small>EXPERIENCE</small><strong>Java 웹 서비스</strong><span>교육·채용·업무 시스템과 팀 프로젝트</span></a>
        <a href="/projects"><small>PROJECTS</small><strong>7개 프로젝트</strong><span>대표 사례부터 흐름으로 확인</span></a>
        <a href="/resume"><small>CREDENTIALS</small><strong>AWS SAA · SQLD</strong><span>자격과 실무 경험을 구분</span></a>
        <a href="mailto:jhkimm96@gmail.com"><small>CONTACT</small><strong>이메일로 연락</strong><span>jhkimm96@gmail.com</span></a>
        </section>

        <section className="white-home-stack" id="home-stack" aria-labelledby="home-stack-title"><div><strong id="home-stack-title">STACK IN PRACTICE</strong><span>기술 이름보다 실제 프로젝트에서 사용한 범위로 확인합니다.</span></div><div className="white-home-chips">{['Java', 'Spring Boot', 'PostgreSQL', 'Elasticsearch', 'Next.js', 'React · Vue3', 'AWS', 'Docker'].map((skill) => <Link key={skill} href="/about#skills">{skill}</Link>)}</div></section>
      </section>

      <section className="white-home-projects" id="home-projects" aria-labelledby="home-projects-title">
        <div className="white-project-heading"><p className="white-home-eyebrow">SELECTED PROJECTS</p><h2 id="home-projects-title">대표 프로젝트를 <em>흐름으로 보여줍니다.</em></h2><div className="white-project-heading-side"><p>프로젝트를 선택하면 실제 자료, 담당 범위, 사용 기술과 판단 사례가 같은 영역에서 함께 바뀝니다.</p><Link className="white-all-projects-link" href="/projects">더 많은 프로젝트 보기 <ArrowUpRight className="size-4" /></Link></div></div>
        <div className="white-project-area">
          <div className="white-project-list" role="list" aria-label="대표 프로젝트 목록">
            {(['prompthub', 'career-link', 'help-desk', 'student-portfolio'] as ProjectKey[]).map((slug, index) => { const item = getProject(projects, slug); return <button key={slug} type="button" aria-pressed={selectedProject === slug} onClick={() => selectProject(slug)}><span>{String(index + 1).padStart(2, '0')}</span><span><strong>{item.title}</strong><small>{slug === 'prompthub' ? '상품 · 검색 · 추천' : slug === 'career-link' ? '채용 매칭 · 관리자' : slug === 'help-desk' ? '권한 · 업무 흐름' : '활동 데이터 · PDF 출력'}</small></span></button> })}
          </div>
          <div className="white-project-detail" aria-live="polite">
            <div className="white-project-top">
              <div className="white-media-panel"><div className="white-media-meta"><span>PROJECT VISUAL / {project.title.toUpperCase()}</span><span>{media.src ? 'REAL IMAGE' : 'EXPLANATION ONLY'}</span></div><div className="white-media-frame">{media.src ? <Image src={media.src} alt={`${project.title} ${media.label}`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" /> : <div><strong>{project.title}</strong><span>{media.label}<br />가짜 화면이나 재생되지 않는 미디어는 만들지 않습니다.</span></div>}</div><div className="white-media-caption"><span>{media.label}</span><div><button type="button" aria-label="이전 프로젝트 미디어" onClick={() => moveMedia(-1)}><ArrowLeft className="size-4" /></button><span>{String(mediaIndex + 1).padStart(2, '0')} / {String(view.media.length).padStart(2, '0')}</span><button type="button" aria-label="다음 프로젝트 미디어" onClick={() => moveMedia(1)}><ArrowRight className="size-4" /></button></div></div></div>
              <article className="white-case-panel"><p className="white-home-eyebrow">{view.meta}</p><h3>{project.title}</h3><p>{project.description}</p><dl><div><dt>MY ROLE</dt><dd>{view.role}</dd></div><div><dt>STACK</dt><dd>{view.stack}</dd></div></dl><div className="white-case-links"><Link href={`/projects/${project.slug}`}>상세 사례 보기 <ArrowUpRight className="size-4" /></Link>{project.github ? <Link href={project.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight className="size-4" /></Link> : null}</div></article>
            </div>
            <div className="white-flow"><div className="white-flow-head"><strong>PROJECT FLOW CANVAS</strong><span>단계를 선택해 문제·선택·구현·검증을 확인합니다.</span></div><div className="white-flow-tabs" role="tablist" aria-label="프로젝트 흐름">{view.stages.map((stage, index) => <button key={stage} type="button" role="tab" aria-selected={flowIndex === index} aria-pressed={flowIndex === index} onClick={() => setFlowIndex(index)}><small>{String(index + 1).padStart(2, '0')} / {view.flow[index].label.split(' / ')[0]}</small><strong>{stage}</strong></button>)}</div><div className="white-flow-copy"><small>{flow.label}</small><h4>{flow.title}</h4><p>{flow.description}</p></div></div>
          </div>
        </div>
      </section>

      <section className="white-home-more" id="home-more" aria-label="더 살펴보기"><Link href="/about"><small>ABOUT</small><strong>경력과 일하는 기준</strong><span>현재 경험과 앞으로 확장하려는 방향을 구분해 읽습니다.</span></Link><Link href="/study"><small>STUDY</small><strong>개인 기술 지식창고</strong><span>기억이 흐릿한 개념을 검색하고 선수 개념부터 따라갑니다.</span></Link><Link href="/projects"><small>ALL PROJECTS</small><strong>전체 프로젝트 보기</strong><span>공개 가능한 범위와 비공개 사유를 함께 확인합니다.</span></Link></section>
    </div>
  )
}
