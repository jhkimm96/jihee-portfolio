import Link from 'next/link'
import { getAbout } from '@/lib/content-data'

export default function AboutPage() {
  const about = getAbout()

  return (
    <main>
      <h1>{about.name}</h1>
      <p>{about.role}</p>
      {about.email && <p>{about.email}</p>}
      {about.github && <a href={about.github}>GitHub</a>}
      <article dangerouslySetInnerHTML={{ __html: about.content }} />
      <Link href="/resume">이력서 자세히 보기</Link>
      {about.portfolioFile && <a href={about.portfolioFile}>포트폴리오 PDF 다운로드</a>}
    </main>
  )
}
