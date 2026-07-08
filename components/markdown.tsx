'use client'

import { useEffect, useRef, useState } from 'react'

type LightboxContent = { type: 'image'; src: string; alt: string } | { type: 'svg'; markup: string }

let mermaidInitialized = false

async function renderMermaidDiagrams(container: HTMLElement) {
  const blocks = container.querySelectorAll<HTMLElement>('pre code.language-mermaid')
  if (blocks.length === 0) return

  const mermaid = (await import('mermaid')).default

  if (!mermaidInitialized) {
    const isDark = document.documentElement.classList.contains('dark')
    mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default' })
    mermaidInitialized = true
  }

  let index = 0
  for (const block of Array.from(blocks)) {
    const pre = block.closest('pre')
    if (!pre) continue
    const source = block.textContent ?? ''
    const id = `mermaid-diagram-${Date.now()}-${index++}`
    try {
      const { svg } = await mermaid.render(id, source)
      const wrapper = document.createElement('div')
      wrapper.className = 'mermaid-diagram'
      wrapper.innerHTML = svg
      pre.replaceWith(wrapper)
    } catch {
      const notice = document.createElement('p')
      notice.className = 'mermaid-error'
      notice.textContent = '다이어그램을 렌더링하지 못했습니다.'
      pre.insertAdjacentElement('afterend', notice)
    }
  }
}

export function Markdown({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<LightboxContent | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    renderMermaidDiagrams(container)
  }, [content])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement
        setLightbox({ type: 'image', src: img.src, alt: img.alt })
        return
      }
      const diagram = target.closest('.mermaid-diagram')
      if (diagram) {
        setLightbox({ type: 'svg', markup: diagram.innerHTML })
      }
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    if (!lightbox) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightbox])

  return (
    <>
      <div ref={containerRef} className="prose-content" dangerouslySetInnerHTML={{ __html: content }} />
      {lightbox ? (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label="확대 보기">
          <button type="button" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="닫기">
            ✕
          </button>
          {lightbox.type === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="lightbox-content"
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <div
              className="lightbox-content"
              onClick={(event) => event.stopPropagation()}
              dangerouslySetInnerHTML={{ __html: lightbox.markup }}
            />
          )}
        </div>
      ) : null}
    </>
  )
}
