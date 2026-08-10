import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, CircleDashed } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { getAllProjects, getLearningPaths } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Learning Paths',
  description: '프로젝트를 처음부터 끝까지 이해하기 위한 순서 있는 학습 경로입니다.'
}

const statusLabel = { draft: '작성 중', growing: '확장 중', ready: '학습 가능' } as const

export default function LearningPathsPage() {
  const paths = getLearningPaths()
  const byProject = new Map(paths.map((path) => [path.project, path]))
  const projects = getAllProjects()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader title="Learning Paths" description="주제별 문서를 무작정 읽지 않고, 프로젝트의 데이터 흐름과 선행 지식에 맞춰 단계별로 학습합니다." count={paths.length} />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {projects.map((project) => {
          const path = byProject.get(project.slug)
          if (!path) {
            return (
              <article key={project.slug} className="rounded-lg border border-dashed border-border p-5">
                <div className="flex items-center justify-between"><CircleDashed className="size-5 text-muted-foreground" /><span className="font-mono text-xs text-muted-foreground">준비 중</span></div>
                <h2 className="mt-4 text-lg font-semibold">{project.title} 전체 이해</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">필수 문서와 선후 관계가 충분해지면 학습 경로를 공개합니다.</p>
                <Link href={`/projects/${project.slug}`} className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground">현재 프로젝트 보기 <ArrowRight className="size-3.5" /></Link>
              </article>
            )
          }
          const itemCount = path.stages.reduce((sum, stage) => sum + stage.items.length, 0)
          return (
            <Link key={project.slug} href={`/study/paths/${project.slug}`} className="group rounded-xl border border-brand/25 bg-brand/5 p-5 transition-colors hover:border-brand/60">
              <div className="flex items-center justify-between"><BookOpen className="size-5 text-brand" /><span className="font-mono text-xs text-brand">{statusLabel[path.status]}</span></div>
              <h2 className="mt-4 text-lg font-semibold">{path.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{path.summary}</p>
              <div className="mt-4 flex items-center justify-between font-mono text-xs text-muted-foreground"><span>{path.stages.length}단계 · {itemCount}개 자료</span><span className="inline-flex items-center gap-1 group-hover:text-foreground">경로 보기 <ArrowRight className="size-3.5" /></span></div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
