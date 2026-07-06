import { getResume } from '@/lib/content-data'
import { PrintButton } from '@/components/print-button'

export default function ResumePage() {
  const resume = getResume()

  return (
    <main>
      <PrintButton />

      <section>
        <h1>Experience</h1>
        {resume.experience.map((item) => (
          <div key={`${item.company}-${item.period}`}>
            <h2>{item.company}</h2>
            <p>
              {item.period} · {item.role}
            </p>
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h1>Education</h1>
        {resume.education.map((item) => (
          <div key={`${item.school}-${item.period}`}>
            <h2>{item.school}</h2>
            <p>
              {item.period} · {item.degree}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h1>Skills</h1>
        {resume.skills.map((group) => (
          <div key={group.group}>
            <h2>{group.group}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {resume.certificates && resume.certificates.length > 0 && (
        <section>
          <h1>Certificates</h1>
          {resume.certificates.map((cert) => (
            <p key={cert.name}>
              {cert.name} · {cert.date}
            </p>
          ))}
        </section>
      )}
    </main>
  )
}
