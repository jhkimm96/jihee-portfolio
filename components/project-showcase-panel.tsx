'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ProjectShowcase, ShowcaseMedia } from '@/lib/project-showcase'

const twoDigits = (index: number) => String(index + 1).padStart(2, '0')

export function ShowcaseMediaFrame({ title, media, stages }: { title: string; media: ShowcaseMedia; stages: string[] }) {
  if (media.src) {
    return (
      <div className="showcase-frame">
        <Image src={media.src} alt={`${title} ${media.label}`} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-contain" unoptimized={media.src.endsWith('.gif')} />
      </div>
    )
  }

  return (
    <div className="showcase-frame showcase-frame-text">
      <div>
        <strong>{title}</strong>
        <p>{media.label}</p>
      </div>
      <ol>
        {stages.map((stage) => <li key={stage}>{stage}</li>)}
      </ol>
    </div>
  )
}

// 탭은 링크다. 다른 대표 프로젝트를 고르면 그 상세 페이지로 이동해 주소만으로 같은 화면이 열린다.
export function ShowcaseProjectTabs({ projects, currentSlug }: { projects: { slug: string; title: string; tag: string }[]; currentSlug: string }) {
  return (
    <nav className="showcase-tabs" aria-label="대표 프로젝트">
      {projects.map((project, index) => (
        <Link key={project.slug} href={`/projects/${project.slug}`} aria-current={project.slug === currentSlug ? 'page' : undefined}>
          <small>{twoDigits(index)}</small>
          <strong>{project.title}</strong>
          <span>{project.tag}</span>
        </Link>
      ))}
    </nav>
  )
}

export function ProjectShowcasePanel({ title, showcase, children }: { title: string; showcase: ProjectShowcase; children: ReactNode }) {
  const [mediaIndex, setMediaIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const media = showcase.media[mediaIndex]
  const step = showcase.flow[stepIndex]
  const stages = showcase.flow.map((item) => item.stage)

  function moveMedia(direction: number) {
    setMediaIndex((current) => (current + direction + showcase.media.length) % showcase.media.length)
  }

  return (
    <section className="showcase" aria-label={`${title} 프로젝트 요약`}>
      <div className="showcase-top">
        <figure className="showcase-media">
          <a href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`${title} ${media.label} 원본 보기`} className="block">
            <ShowcaseMediaFrame title={title} media={media} stages={stages} />
          </a>
          <figcaption className="showcase-media-bar">
            <select aria-label="프로젝트 이미지 선택" value={mediaIndex} onChange={(event) => setMediaIndex(Number(event.target.value))} className="showcase-media-picker">
              {showcase.media.map((item, index) => <option key={item.src ?? item.label} value={index}>{item.label}</option>)}
            </select>
            <span className="showcase-media-controls">
              <button type="button" aria-label="이전 그림" onClick={() => moveMedia(-1)}><ArrowLeft className="size-4" /></button>
              {twoDigits(mediaIndex)} / {String(showcase.media.length).padStart(2, '0')}
              <button type="button" aria-label="다음 그림" onClick={() => moveMedia(1)}><ArrowRight className="size-4" /></button>
            </span>
            <span className="sr-only" aria-live="polite">{media.label}</span>
          </figcaption>
          {media.description ? <p className="showcase-media-description">{media.description}</p> : null}
          <a className="showcase-media-original" href={media.src} target="_blank" rel="noopener noreferrer">원본 이미지 크게 보기 ↗</a>
        </figure>
        <div className="showcase-info">{children}</div>
      </div>

      <div className="showcase-steps" role="tablist" aria-label="프로젝트 흐름">
        {showcase.flow.map((item, index) => (
          <button key={item.label} type="button" role="tab" aria-selected={stepIndex === index} onClick={() => setStepIndex(index)}>
            <i aria-hidden="true" />
            <small>{twoDigits(index)} / {item.label.split(' / ')[0]}</small>
            <strong>{item.stage}</strong>
          </button>
        ))}
      </div>
      <div className="showcase-step" role="tabpanel">
        <small>{step.label}</small>
        <strong>{step.title}</strong>
        <p>{step.description}</p>
      </div>
    </section>
  )
}
