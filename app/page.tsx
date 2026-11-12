import { Anton } from 'next/font/google'
import { HomeInteractive } from '@/components/home-interactive'
import { projectShowcases } from '@/lib/project-showcase'
import {
  getProjectBySlug,
  getPublishedStudy,
  getPublishedDecisions,
  getPublishedTroubleshooting,
  getPublishedReviews
} from '@/lib/content-data'

// 큰 이름 글씨에만 쓰는 좁은 글꼴이라 홈에서만 불러온다.
const displayFont = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display' })

export default function HomePage() {
  const featuredProjects = Object.keys(projectShowcases).flatMap((slug) => getProjectBySlug(slug) ?? [])
  const recordCounts = {
    study: getPublishedStudy().length,
    decisions: getPublishedDecisions().length,
    troubleshooting: getPublishedTroubleshooting().length,
    reviews: getPublishedReviews().length
  }

  return (
    <div className={`home ${displayFont.variable}`}>
      <HomeInteractive projects={featuredProjects} recordCounts={recordCounts} />
    </div>
  )
}
