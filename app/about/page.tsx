import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { getAbout } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'About'
}

export default function AboutPage() {
  const about = getAbout()
  const contacts = [
    about.location ? { icon: MapPin, label: about.location, href: undefined } : null,
    about.email ? { icon: Mail, label: about.email, href: `mailto:${about.email}` } : null,
    about.github ? { icon: GithubIcon, label: 'GitHub', href: about.github } : null
  ].filter(Boolean) as { icon: typeof MapPin; label: string; href?: string }[]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader title="About" description="어떤 기술을 쓰는지보다, 어떤 기준으로 일하고 결정하는지를 소개합니다." />

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="rounded-lg border border-brand/30 bg-brand/5 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">The person behind the records</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em]">{about.name}</h2>
          <p className="mt-2 font-mono text-sm text-brand">{about.role}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6 lg:col-span-2">
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
