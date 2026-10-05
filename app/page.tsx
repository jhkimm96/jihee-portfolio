import { HomeInteractive } from '@/components/home-interactive'
import { getAllProjects } from '@/lib/content-data'

const projectOrder = [
  'prompthub', 'career-link', 'help-desk', 'student-portfolio',
  'competency-education', 'admission-system', 'erp-inventory'
]
const featuredProjectSlugs = projectOrder.slice(0, 4)

export default function HomePage() {
  const projects = getAllProjects().sort((a, b) => {
    const aOrder = projectOrder.indexOf(a.slug)
    const bOrder = projectOrder.indexOf(b.slug)
    return (aOrder === -1 ? Infinity : aOrder) - (bOrder === -1 ? Infinity : bOrder)
  })
  const featuredProjects = projects.filter((project) => featuredProjectSlugs.includes(project.slug))

  return <HomeInteractive projects={featuredProjects} />
}
