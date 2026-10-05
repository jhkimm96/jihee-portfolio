import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { getAbout, getResume } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'About'
}

export default function AboutPage() {
  const about = getAbout()
  const resume = getResume()
  const contacts = [
    about.location ? { icon: MapPin, label: about.location, href: undefined } : null,
    about.email ? { icon: Mail, label: about.email, href: `mailto:${about.email}` } : null,
    about.github ? { icon: GithubIcon, label: 'GitHub', href: about.github } : null
  ].filter(Boolean) as { icon: typeof MapPin; label: string; href?: string }[]

  return (
    <div className="ink-signal-page ink-signal-about mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader title="About" description="프로젝트 뒤에서 어떤 기준으로 일하는 사람인지 소개합니다." />

      <div className="mt-8 grid gap-8 md:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="overflow-hidden rounded-lg border border-border bg-brand/5 px-6 pt-6">
          <p className="text-xs font-semibold text-brand">Software Engineer</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.06em]">{about.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">백엔드에서 시작해 서비스의 화면, 데이터, 운영까지 연결하는 개발자</p>
          <Image src="/character-v2.png" alt="팔짱을 낀 김지희의 일러스트 캐릭터" width={420} height={420} sizes="(min-width: 1024px) 280px, 220px" className="mx-auto mt-5 h-48 w-auto object-contain lg:h-64" />
          <div className="-mx-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border bg-background px-6 py-4">
            {contacts.map((contact) =>
              contact.href ? (
                <Link
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <contact.icon className="size-3.5" />
                  {contact.label}
                </Link>
              ) : (
                <span key={contact.label} className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <contact.icon className="size-3.5" />
                  {contact.label}
                </span>
              )
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="text-base leading-relaxed text-foreground/90 text-pretty" dangerouslySetInnerHTML={{ __html: about.content }} />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['책임감', '맡은 일의 끝과 운영 이후까지 생각합니다.'],
              ['소통', '맥락을 공유하고 함께 기준을 맞춥니다.'],
              ['검증', 'AI의 제안도 문서와 실행 결과로 다시 확인합니다.']
            ].map(([title, text]) => (
              <div key={title} className="rounded-md border border-border bg-card p-4">
                <p className="font-mono text-xs text-brand">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="border-t border-border pt-8 md:col-span-2" aria-labelledby="experience-title">
          <h2 id="experience-title" className="text-2xl font-bold tracking-tight">경력과 프로젝트</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {resume.experience.map((entry) => <div key={`${entry.company}-${entry.period}`} className="border-l-2 border-brand pl-4">
              <p className="text-xs font-semibold text-brand">{entry.period}</p>
              <h3 className="mt-1 font-semibold">{entry.company}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{entry.role}</p>
              <p className="mt-2 text-sm leading-relaxed">{entry.description}</p>
            </div>)}
          </div>
        </section>

        <section id="skills" className="border-t border-border pt-8 md:col-span-2" aria-labelledby="skills-title">
          <h2 id="skills-title" className="text-2xl font-bold tracking-tight">기술 스택</h2>
          <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {resume.skills.map((group) => <div key={group.group} className="bg-card p-5">
              <h3 className="text-sm font-semibold text-brand">{group.group}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{group.items.join(' · ')}</p>
            </div>)}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6 md:col-span-2">
          <Button asChild>
            <Link href="/resume">
              이력서 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <span className="font-mono text-xs text-muted-foreground">Backend 중심 · Fullstack · Infrastructure · Architecture 방향</span>
        </div>
      </div>
    </div>
  )
}
