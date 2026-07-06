import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllProjects, getProjectBySlug, getTroubleshootingForProject } from '@/lib/content-data'

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [project.thumbnail] : []
    }
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const troubleshootingByCategory = getTroubleshootingForProject(project.slug)
  const categories = Object.keys(troubleshootingByCategory)

  return (
    <main>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>
        {project.period} · {project.team} · {project.role}
      </p>
      <ul>
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <p>
        Status: {project.status} — {project.statusNote}
      </p>
      <a href={project.github}>GitHub</a>

      <section dangerouslySetInnerHTML={{ __html: project.content }} />

      <section>
        <h2>트러블슈팅</h2>
        {categories.length === 0 ? (
          <p>아직 작성된 트러블슈팅이 없습니다.</p>
        ) : (
          categories.map((category) => (
            <div key={category}>
              <h3>{category}</h3>
              <ul>
                {troubleshootingByCategory[category].map((entry) => (
                  <li key={entry.slug}>
                    <a href={`/troubleshooting/${entry.slug}`}>{entry.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </main>
  )
}
