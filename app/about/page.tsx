import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GitFork, Mail, MapPin, Download } from 'lucide-react'
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
    about.github ? { icon: GitFork, label: 'GitHub', href: about.github } : null
  ].filter(Boolean) as { icon: typeof MapPin; label: string; href?: string }[]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow="Profile" title="About" />

      <div className="mt-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            {about.name}
            <span className="ml-2 font-mono text-sm font-normal text-brand">{about.role}</span>
          </h2>
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

        <div
          className="text-base leading-relaxed text-foreground/90 text-pretty"
          dangerouslySetInnerHTML={{ __html: about.content }}
        />

        <div className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button asChild>
            <Link href="/resume">
              이력서 자세히 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          {about.portfolioFile ? (
            <Button asChild variant="outline">
              <Link href={about.portfolioFile} target="_blank" rel="noopener noreferrer">
                <Download className="size-4" />
                포트폴리오 PDF
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
