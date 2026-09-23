import Link from 'next/link'
import { ArrowRight, FileText, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/project-card'
import { PostCard } from '@/components/post-card'
import {
  getAbout,
  getAllProjects,
  getPublishedDecisions,
  getPublishedQuality,
  getPublishedReviews,
  getPublishedTroubleshooting,
  getPublishedStudy,
  getProjectTitle,
  getResumeVariants
} from '@/lib/content-data'
import { withCounts } from '@/lib/record-types'

export default function HomePage() {
  const about = getAbout()
  const featured = getAllProjects().filter((project) => project.featured)
  const resumeVariants = getResumeVariants()

  const troubleshooting = getPublishedTroubleshooting()
  const decisions = getPublishedDecisions()
  const reviews = getPublishedReviews()
  const quality = getPublishedQuality()

  const evidence = withCounts({
    troubleshooting: troubleshooting.length,
    decisions: decisions.length,
    reviews: reviews.length,
    quality: quality.length
  })

  const recentActivity = [
    ...troubleshooting.map((post) => ({
      href: `/troubleshooting/${post.slug}`,
      type: 'Troubleshooting',
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      badges: [
        { label: 'Troubleshooting' },
        { label: getProjectTitle(post.project), kind: 'project' as const },
        { label: post.category, kind: 'category' as const }
      ]
    })),
    ...getPublishedDecisions().map((entry) => ({
      href: `/decisions/${entry.slug}`,
      type: 'Decision',
      title: entry.title,
      date: entry.date,
      summary: entry.summary,
      tags: entry.tags,
      badges: [
        { label: 'Decision' },
        { label: getProjectTitle(entry.project), kind: 'project' as const },
        { label: entry.category, kind: 'category' as const }
      ]
    })),
    ...getPublishedReviews().map((post) => ({
      href: `/reviews/${post.slug}`,
      type: 'Review',
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      badges: [{ label: 'Review' }, { label: getProjectTitle(post.project), kind: 'project' as const }]
    })),
    ...getPublishedStudy().map((post) => ({
      href: `/study/${post.slug}`,
      type: 'Study',
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      badges: [{ label: 'Study' }, { label: post.category, kind: 'category' as const }]
    })),
    ...getPublishedQuality().map((entry) => ({
      href: `/quality/${entry.slug}`,
      type: 'Quality',
      title: entry.title,
      date: entry.date,
      summary: entry.summary,
      tags: entry.tags,
      badges: [
        { label: 'Quality' },
        { label: getProjectTitle(entry.project), kind: 'project' as const },
        { label: entry.scope, kind: 'category' as const }
      ]
    }))
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="relative isolate border-b border-border pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="hero-ambient" aria-hidden="true" />
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-brand">
              <span className="inline-block size-2 rounded-full bg-status-live shadow-[0_0_0_4px_color-mix(in_oklab,var(--status-live)_15%,transparent)]" />
              Open to backend opportunities
            </div>
            <h1 className="max-w-[18ch] text-4xl font-bold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
              문제를 풀고,
              <br />
              <span className="text-brand">판단을</span> 남깁니다.
            </h1>
            <p className="mt-5 font-mono text-sm text-brand">{about.name} · {about.role}</p>
            {/* 스택 나열이 아니라 이 사이트가 무엇을 하는 곳인지를 먼저 말한다. */}
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              이 포트폴리오는 결과물을 전시하는 곳이 아니라, 문제를 어떻게 이해하고 설계를 어떻게 결정했는지 확인하는 기록입니다.
              맡은 일을 끝까지 책임지고, 동료와 소통하며, 근거를 남기는 개발자의 작업 방식을 담았습니다.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/projects">
                  프로젝트 보기
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/resume">
                  <FileText className="size-4" />
                  이력서
                </Link>
              </Button>
              {about.github ? (
                <Button asChild variant="ghost">
                  <Link href={about.github} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="size-4" />
                    GitHub
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="hero-dossier" aria-label="포트폴리오 읽는 법">
            <div className="hero-dossier-pin" aria-hidden="true" />
            {/* 사진 대신 포트폴리오의 태도를 대표하는 자체 캐릭터를 사용한다. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/character-backend.png" alt="팔짱을 끼고 서 있는 백엔드 개발자 캐릭터" className="hero-character" />
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-brand">read me like this</p>
            <p className="relative z-10 mt-4 max-w-[12rem] text-lg font-semibold leading-snug">예쁜 결과보다<br />설명 가능한 선택</p>
            <div className="relative z-10 mt-6 space-y-2 font-mono text-xs text-muted-foreground">
              <p><span className="text-brand">01</span> 문제의 크기</p>
              <p><span className="text-brand">02</span> 선택한 이유</p>
              <p><span className="text-brand">03</span> 확인한 결과</p>
            </div>
            <span className="hero-dossier-sticker">no stock photos</span>
          </div>
        </div>

        {resumeVariants.length > 0 ? (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            지원 직무별 이력서{' '}
            {resumeVariants.map((variant, index) => (
              <span key={variant.slug}>
                {index > 0 ? (
                  <span className="mx-1.5 text-border" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                <Link
                  href={`/resume/${variant.slug}`}
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-brand"
                >
                  {variant.label}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        {/* 포지셔닝을 세는 단위로 바꾼다. 개수는 콘텐츠에서 파생되므로 썩지 않는다. */}
        {evidence.length > 0 ? (
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            {evidence.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group/ev flex flex-col gap-1 bg-background px-3 py-3 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <span className="underline-offset-4 group-hover/ev:underline">{item.label}</span>
                <span className="text-lg font-medium tabular-nums text-foreground">{item.count}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-8 border-b border-border py-14 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16" aria-labelledby="about-teaser-title">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Who I am</p>
          <h2 id="about-teaser-title" className="mt-3 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">안녕하세요,<br />{about.name}입니다.</h2>
          <p className="mt-4 font-mono text-xs text-muted-foreground">{about.role} · {about.location}</p>
        </div>
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-foreground/90 sm:text-xl">
            한 번 맡은 일은 끝까지 책임지고, 혼자 빠르게 결정하기보다 필요한 맥락을 공유하며 함께 더 나은 답을 찾습니다.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            AI 도구는 최신 기술과 대안을 빠르게 탐색하고 공부하는 데 활용하지만, 생성된 결과를 그대로 믿지 않습니다.
            공식 문서와 실행 결과를 다시 확인한 뒤, 서비스의 제약과 팀의 맥락에 맞는 결정은 직접 내립니다.
            이 사이트에는 그 판단 과정과 검증 기록을 남깁니다.
          </p>
          <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-brand underline-offset-4 hover:underline">
            나에 대해 더 보기 <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="grid gap-3 border-b border-border py-8 sm:grid-cols-3">
        {[
          { icon: Search, title: '문제부터 읽기', text: '기능보다 먼저, 해결해야 했던 문제와 제약을 확인합니다.' },
          { icon: ShieldCheck, title: '근거로 검증하기', text: '결정, 장애 대응, 품질 기록을 원문으로 따라갑니다.' },
          { icon: Sparkles, title: '면접으로 이어가기', text: '각 경험의 대안, 실패 조건, 본인 기여 범위를 구분합니다.' }
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg border border-border bg-card/60 p-4">
            <Icon className="mb-5 size-4 text-brand" />
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="border-b border-border py-12 sm:py-16" aria-labelledby="focus-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Engineering focus</p>
            <h2 id="focus-title" className="mt-2 text-2xl font-semibold tracking-tight">제가 다뤄온 문제</h2>
          </div>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">01 — 06</span>
        </div>
        <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['01', 'API와 도메인 경계'],
            ['02', '인증과 권한'],
            ['03', '검색과 추천'],
            ['04', '데이터 동기화'],
            ['05', '장애 격리와 폴백'],
            ['06', '배포와 운영 검증']
          ].map(([number, label]) => (
            <div key={label} className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 transition-colors hover:border-brand/50 hover:bg-brand/5">
              <span className="font-mono text-xs text-brand">{number}</span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border py-14 sm:py-20" aria-labelledby="skills-title">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">My skills</p>
            <h2 id="skills-title" className="mt-2 text-2xl font-semibold tracking-tight">한 영역에 머물지 않는 개발자</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">경력과 프로젝트 기록을 기준으로, 직접 다룬 영역과 확장 중인 방향을 구분해 보여드립니다.</p>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
            {[
              { number: '01', title: 'Backend', status: '직접 구현', items: 'Java · Spring · Spring Boot · MyBatis · REST API · 도메인 설계' },
              { number: '02', title: 'Frontend', status: '직접 구현 / 협업', items: 'React · Next.js · TypeScript · Vue3 · JavaScript · 화면과 API 연결' },
              { number: '03', title: 'Data & Integration', status: '직접 설계', items: 'Oracle · MariaDB · TIBERO · MySQL · PostgreSQL · ERD · SQL' },
              { number: '04', title: 'Infrastructure', status: '구축 경험 / 확장 중', items: 'Jenkins · Ubuntu · Git · SVN · Docker · 배포 환경 검증' },
              { number: '05', title: 'Architecture', status: '설계와 학습', items: 'RBAC · 데이터 동기화 · 서비스 경계 · 검색·추천 파이프라인' },
              { number: '06', title: 'AI-assisted Engineering', status: '검증하며 활용', items: 'OpenAI API · Embedding · pgvector · AI 탐색 · 실행 결과 재검증' }
            ].map((skill) => (
            <div key={skill.title} className="bg-card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs text-brand">{skill.number}</span>
                <span className="rounded-full border border-border px-2 py-1 font-mono text-[0.65rem] text-muted-foreground">{skill.status}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{skill.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{skill.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-brand">Recent projects</p>
            <h2 className="text-xl font-semibold tracking-tight">최근 프로젝트</h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            전체 보기
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">아직 대표로 지정된 프로젝트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
          <Link href="/search" className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
            전체 검색
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {recentActivity.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">아직 작성된 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {recentActivity.map((item) => (
              <PostCard
                key={`${item.type}-${item.href}`}
                href={item.href}
                title={item.title}
                date={item.date}
                summary={item.summary}
                tags={item.tags}
                badges={item.badges}
              />
            ))}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-lg border border-brand/30 bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
        <div className="absolute -right-8 -top-10 size-36 rounded-full border border-brand/50" aria-hidden="true" />
        <div className="relative max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Keep in touch</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">더 깊이 이야기하고 싶다면</h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">프로젝트의 코드와 판단 기록을 먼저 살펴보고, 궁금한 점은 편하게 연락 주세요.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/about">About me <ArrowRight className="size-4" /></Link>
            </Button>
            {about.email ? <Button asChild variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link href={`mailto:${about.email}`}>이메일 보내기</Link></Button> : null}
          </div>
        </div>
      </section>
    </div>
  )
}
