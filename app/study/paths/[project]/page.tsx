import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Markdown } from '@/components/markdown'
import { getLearningPathByProject, getLearningPaths, getPickTarget, getProjectTitle } from '@/lib/content-data'
import type { LearningPathImportance } from '@/lib/content'

const importanceLabel: Record<LearningPathImportance, string> = {
  required: '필수',
  'deep-dive': '심화',
  reference: '참고'
}

export function generateStaticParams() {
  return getLearningPaths().map((path) => ({ project: path.project }))
}

export async function generateMetadata({ params }: { params: Promise<{ project: string }> }): Promise<Metadata> {
  const { project } = await params
  const path = getLearningPathByProject(project)
  return path ? { title: path.title, description: path.summary } : {}
}

export default async function LearningPathDetailPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params
  const path = getLearningPathByProject(project)
  if (!path) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/study/paths" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" />Learning Paths</Link>
      <header className="mt-6 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-balance">{path.title}</h1>
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground text-pretty">{path.summary}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {getProjectTitle(project)} · 최종 검증 {path.updatedAt} · {path.stages.length}단계
        </p>
      </header>

      <ol className="mt-8 space-y-6">
        {path.stages.map((stage, index) => {
          const resolved = stage.items.map((item) => ({ item, target: getPickTarget(item.type, item.slug) }))
          return (
            <li key={stage.id} id={stage.id} className="scroll-mt-24 rounded-xl border border-border bg-card p-5">
              <div className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm text-primary-foreground">{index + 1}</span><div><h2 className="text-lg font-semibold">{stage.title}</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{stage.goal}</p></div></div>
              <div className="mt-5 divide-y divide-border rounded-md border border-border">
                {resolved.map(({ item, target }) => target ? (
                  <Link key={`${item.type}-${item.slug}`} href={target.href} className="flex items-center justify-between gap-4 px-3 py-3 text-sm hover:bg-secondary/60"><span>{target.title}</span><span className="flex shrink-0 items-center gap-2"><span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground">{importanceLabel[item.importance as LearningPathImportance]}</span><ArrowRight className="size-3.5 text-muted-foreground" /></span></Link>
                ) : (
                  <div key={`${item.type}-${item.slug}`} className="px-3 py-3 text-sm text-destructive">연결할 문서를 찾지 못했습니다: {item.slug}</div>
                ))}
              </div>
            </li>
          )
        })}
      </ol>
      <article className="mt-10"><Markdown content={path.content} /></article>
    </div>
  )
}
