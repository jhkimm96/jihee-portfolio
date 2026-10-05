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
    <div className="ink-signal-page ink-signal-projects mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Projects"
        description="실무와 팀 프로젝트에서 만든 서비스, 맡은 범위, 해결한 문제를 한눈에 살펴보세요."
        count={projects.length}
      />

      {projects.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="아직 등록된 프로젝트가 없습니다." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
