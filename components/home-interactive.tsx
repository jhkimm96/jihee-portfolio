'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ProjectEntry } from '@/lib/content'
import { projectShowcases } from '@/lib/project-showcase'
import { ShowcaseMediaFrame } from '@/components/project-showcase-panel'

export type RecordCounts = { study: number; decisions: number; troubleshooting: number; reviews: number }

const careerSummary = [
  { href: '/about#experience', label: 'EXPERIENCE', title: 'Java 웹 서비스', text: '교육·채용·업무 시스템과 팀 프로젝트' },
  { href: '/projects', label: 'PROJECTS', title: '7개 프로젝트', text: '대표 사례부터 흐름으로 확인' },
  { href: '/resume', label: 'CREDENTIALS', title: 'AWS SAA · SQLD', text: '자격과 실무 경험을 구분' },
  { href: 'mailto:jhkimm96@gmail.com', label: 'CONTACT', title: '이메일로 연락', text: 'jhkimm96@gmail.com' }
]

const visibleStackCount = 4

export function HomeInteractive({ projects, recordCounts }: { projects: ProjectEntry[]; recordCounts: RecordCounts }) {
  const projectTrack = useRef<HTMLDivElement>(null)

  function scrollProjectCards(direction: number) {
    const track = projectTrack.current
    if (!track) return
    track.scrollBy({ left: direction * (track.clientWidth / 3), behavior: 'smooth' })
  }

  const shortcuts = [
    { href: '/resume/backend', title: '이력서', text: '링크로 열고 PDF로 저장' },
    { href: '/resume', title: '직무별 이력서', text: 'Backend · Fullstack · Architecture' },
    { href: '/study', title: '기술 노트', text: `공부한 개념 글 ${recordCounts.study}개` },
    { href: '/engineering', title: '개발 기록', text: `결정 ${recordCounts.decisions} · 트러블슈팅 ${recordCounts.troubleshooting} · 리뷰 ${recordCounts.reviews}` }
  ]

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div>
          <p className="home-who">BACKEND DEVELOPER / SEOUL, KR</p>
          <p className="home-name" aria-hidden="true">JIHEE KIM<span>.</span></p>
          <h1 id="home-title">검색·추천·권한을 설계하고 데이터와 화면을 연결하는 개발자, 김지희입니다.</h1>
          <p className="home-lead">PromptHub에서는 상품·검색·개인화 추천을 두 서비스의 책임으로 나누어 구현했고, Career Link에서는 권한별 메뉴와 지원자 기능을 만들었습니다. Java와 Spring 기반 백엔드를 중심으로 서비스의 화면과 운영 검증까지 연결합니다.</p>
          <div className="home-actions">
            <a className="home-primary" href="#home-projects">대표 프로젝트 보기 ↓</a>
            <Link href="/about#skills">기술과 경력 보기 ↗</Link>
          </div>
        </div>
        <div className="home-visual">
          <Image src="/character-v2.png" alt="팔짱을 낀 김지희 캐릭터 그림" width={1269} height={1239} sizes="(min-width: 768px) 420px, 80vw" priority />
        </div>
      </section>

      <section className="home-summary" aria-label="경력 요약">
        {careerSummary.map((item) => (
          <a key={item.label} href={item.href}>
            <small>{item.label}</small>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </a>
        ))}
      </section>

      <section className="home-projects" id="home-projects" aria-labelledby="home-projects-title">
        <div className="home-projects-head">
          <div>
            <h2 id="home-projects-title">대표 프로젝트를 흐름으로 보여줍니다.</h2>
            <Link href="/projects">더 많은 프로젝트 보기 ↗</Link>
          </div>
          <div className="home-arrows">
            <button type="button" aria-label="이전 프로젝트" onClick={() => scrollProjectCards(-1)}><ArrowLeft className="size-4" /></button>
            <button type="button" aria-label="다음 프로젝트" onClick={() => scrollProjectCards(1)}><ArrowRight className="size-4" /></button>
          </div>
        </div>
        <div className="home-project-track" ref={projectTrack}>
          {projects.map((project, index) => {
            const showcase = projectShowcases[project.slug]
            const hiddenStackCount = project.stack.length - visibleStackCount
            return (
              <Link key={project.slug} className="home-project-card" href={`/projects/${project.slug}`}>
                <ShowcaseMediaFrame title={project.title} media={showcase.media[0]} stages={showcase.flow.map((step) => step.stage)} />
                <div className="home-project-body">
                  <small>{String(index + 1).padStart(2, '0')} · {showcase.meta}</small>
                  <strong>{project.title}</strong>
                  <p>{showcase.role}</p>
                  <div className="home-chips">
                    {project.stack.slice(0, visibleStackCount).map((item) => <span key={item}>{item}</span>)}
                    {hiddenStackCount > 0 ? <span>+{hiddenStackCount}</span> : null}
                  </div>
                  <em>상세 사례 보기 <ArrowUpRight className="size-3.5" /></em>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="home-shortcuts" aria-label="바로가기">
        {shortcuts.map((shortcut) => (
          <Link key={shortcut.title} href={shortcut.href}>
            <strong>{shortcut.title}</strong>
            <span>{shortcut.text}</span>
          </Link>
        ))}
      </section>
    </>
  )
}
