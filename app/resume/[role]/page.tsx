import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Mail, MapPin } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { PrintButton } from '@/components/print-button'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { SITE_URL } from '@/lib/site'
import {
  getAbout,
  getResume,
  getResumeVariants,
  getResumeVariantBySlug,
  getPickTarget
} from '@/lib/content-data'

export function generateStaticParams() {
  return getResumeVariants().map((variant) => ({ role: variant.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params
  const variant = getResumeVariantBySlug(role)
  if (!variant) return {}
  return { title: `${variant.label} — Resume`, description: variant.summary }
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-brand">{children}</h2>
}

export default async function ResumeRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const variant = getResumeVariantBySlug(role)
  if (!variant) notFound()

  const about = getAbout()
  const base = getResume()
  const variants = getResumeVariants()
  const skills = variant.skills ?? base.skills

  return (
    <div className="print-container mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="inline-flex rounded-md border border-border bg-card p-1">
          {variants.map((item) => (
            <Link
              key={item.slug}
              href={`/resume/${item.slug}`}
              className={cn(
                'rounded-sm px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                item.slug === variant.slug
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <PrintButton />
      </div>

      <div className="print-page">
        <header className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-[-0.02em]">{about.name}</h1>
          <p className="mt-1 font-mono text-sm text-brand">{variant.headline ?? variant.label}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
            {about.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {about.location}
              </span>
            ) : null}
            {about.email ? (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {about.email}
              </span>
            ) : null}
            {about.github ? (
              <span className="inline-flex items-center gap-1.5">
                <GithubIcon className="size-3.5" />
                {about.github.replace('https://', '')}
              </span>
            ) : null}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">{variant.summary}</p>
        </header>

        <section className="py-6">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.group} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <p className="font-mono text-xs text-muted-foreground">{skill.group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 font-mono text-[0.7rem] font-medium text-secondary-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {variant.picks.length > 0 ? (
          <section className="border-t border-border py-6">
            <SectionTitle>대표 사례</SectionTitle>
            <div className="flex flex-col">
              {variant.picks.map((pick, index) => {
                const target = getPickTarget(pick.type, pick.slug)
                if (!target) return null
                const title = pick.headline ?? target.title
                return (
                  <Link
                    key={`${pick.type}-${pick.slug}`}
                    href={target.href}
                    className="group flex gap-4 border-t border-border py-4 first:border-t-0 first:pt-0"
                  >
                    <span className="pt-0.5 font-mono text-sm text-brand tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-semibold transition-colors group-hover:text-brand">{title}</span>
                        <span className="font-mono text-xs text-muted-foreground">{pick.type}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">{pick.summary}</p>
                      <p className="mt-1.5 truncate font-mono text-[0.7rem] text-muted-foreground/80">
                        {SITE_URL.replace('https://', '')}
                        {target.href}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : null}

        <section className="border-t border-border py-6">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-6">
            {base.experience.map((exp) => (
              <div key={`${exp.company}-${exp.period}`} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <p className="font-mono text-xs text-muted-foreground sm:pt-0.5">{exp.period}</p>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-sm font-semibold">{exp.company}</h3>
                    <span className="font-mono text-xs text-muted-foreground">· {exp.role}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                  {exp.highlights && exp.highlights.length > 0 ? (
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-foreground/80">
                      {exp.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border py-6">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-4">
            {base.education.map((edu) => (
              <div key={edu.school} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <p className="font-mono text-xs text-muted-foreground sm:pt-0.5">{edu.period}</p>
                <div>
                  <h3 className="text-sm font-semibold">{edu.school}</h3>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {base.certificates && base.certificates.length > 0 ? (
          <section className="border-t border-border py-6">
            <SectionTitle>Certificates</SectionTitle>
            <div className="space-y-3">
              {base.certificates.map((cert) => (
                <div key={cert.name} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <p className="font-mono text-xs text-muted-foreground sm:pt-0.5">{formatDate(cert.date)}</p>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-sm font-semibold">{cert.name}</h3>
                    {cert.issuer ? <span className="font-mono text-xs text-muted-foreground">· {cert.issuer}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
