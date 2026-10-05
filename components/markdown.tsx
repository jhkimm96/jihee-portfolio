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
      wrapper.tabIndex = 0
      wrapper.setAttribute('role', 'button')
      wrapper.setAttribute('aria-label', '다이어그램 확대 보기')
      wrapper.innerHTML = svg
      const svgEl = wrapper.querySelector('svg')
      if (svgEl) {
        // mermaid sets width:100% which shrinks the diagram (and its text) to
        // fit the narrow prose column. Render at natural size instead and let
        // the wrapper's overflow-x-auto handle diagrams wider than the column.
        const naturalWidth = svgEl.style.maxWidth
        if (naturalWidth) svgEl.style.width = naturalWidth
      }
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [lightbox, setLightbox] = useState<LightboxContent | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    renderMermaidDiagrams(container)
  }, [content])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
      image.tabIndex = 0
      image.setAttribute('role', 'button')
      image.setAttribute('aria-label', image.alt ? `${image.alt} 확대 보기` : '이미지 확대 보기')
    })

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
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const target = event.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('.mermaid-diagram')) {
        event.preventDefault()
        if (target.tagName === 'IMG') {
          const image = target as HTMLImageElement
          setLightbox({ type: 'image', src: image.src, alt: image.alt })
        } else {
          const diagram = target.closest('.mermaid-diagram')
          if (diagram) setLightbox({ type: 'svg', markup: diagram.innerHTML })
        }
      }
    }
    container.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('click', handleClick)
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [content])

  useEffect(() => {
    if (!lightbox) return
    previousFocusRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'Tab') {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [lightbox])

  return (
    <>
      <div ref={containerRef} className="prose-content" dangerouslySetInnerHTML={{ __html: content }} />
      {lightbox ? (
        <div ref={dialogRef} className="lightbox-overlay" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label="확대 보기">
          <button ref={closeButtonRef} type="button" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="닫기">
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
