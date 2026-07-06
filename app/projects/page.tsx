import type { Metadata } from 'next'
import { PageHeader, EmptyState } from '@/components/page-header'
import { ProjectCard } from '@/components/project-card'
import { getAllProjects } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Projects',
  description: '설계와 구현을 맡은 백엔드 프로젝트 모음입니다.'
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        description="설계와 구현을 직접 맡은 백엔드 중심 프로젝트입니다. Featured 프로젝트를 먼저, 이후 최신순으로 정렬됩니다."
        count={projects.length}
      />

      {projects.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 등록된 프로젝트가 없습니다." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
