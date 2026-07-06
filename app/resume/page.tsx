import type { Metadata } from 'next'
import { GitFork, Mail, MapPin } from 'lucide-react'
import { PrintButton } from '@/components/print-button'
import { formatDate } from '@/lib/format'
import { getAbout, getResume } from '@/lib/content-data'

export const metadata: Metadata = {
  title: 'Resume'
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-brand">{children}</h2>
}

export default function ResumePage() {
  const about = getAbout()
  const resume = getResume()

  return (
    <div className="print-container mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="no-print mb-8 flex items-center justify-between border-b border-border pb-4">
        <p className="font-mono text-xs text-muted-foreground">
          브라우저 인쇄에서 &ldquo;PDF로 저장&rdquo;을 선택하면 최신 이력서를 내보낼 수 있습니다.
        </p>
        <PrintButton />
      </div>

      <div className="print-page">
        <header className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight">{about.name}</h1>
          <p className="mt-1 font-mono text-sm text-brand">{about.role}</p>
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
                <GitFork className="size-3.5" />
                {about.github.replace('https://', '')}
              </span>
            ) : null}
          </div>
          {resume.summary ? (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">{resume.summary}</p>
          ) : null}
        </header>

        <section className="py-6">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
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
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-3">
            {resume.skills.map((skill) => (
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

        <section className="border-t border-border py-6">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-4">
            {resume.education.map((edu) => (
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

        {resume.certificates && resume.certificates.length > 0 ? (
          <section className="border-t border-border py-6">
            <SectionTitle>Certificates</SectionTitle>
            <div className="space-y-3">
              {resume.certificates.map((cert) => (
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
