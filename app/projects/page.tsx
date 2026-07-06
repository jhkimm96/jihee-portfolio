import Link from 'next/link'
import { getAllProjects } from '@/lib/content-data'

export default function ProjectsPage() {
  const projects = getAllProjects()

  if (projects.length === 0) {
    return (
      <main>
        <h1>Projects</h1>
        <p>아직 작성된 프로젝트가 없습니다.</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            <p>{project.description}</p>
            <span>{project.status}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
