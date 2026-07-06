import Link from 'next/link'
import { getAllProjects, getPublishedTroubleshooting } from '@/lib/content-data'

export default function HomePage() {
  const featuredProjects = getAllProjects().filter((project) => project.featured)
  const recentTroubleshooting = getPublishedTroubleshooting().slice(0, 3)

  return (
    <main>
      <h1>김지희 — Backend Developer</h1>
      <p>Spring Boot 기반 백엔드 개발을 중심으로 MSA, DDD, Redis, Kafka, Kubernetes를 학습하고 구현합니다.</p>

      <section>
        <h2>대표 프로젝트</h2>
        {featuredProjects.length === 0 ? (
          <p>아직 대표로 지정된 프로젝트가 없습니다.</p>
        ) : (
          <ul>
            {featuredProjects.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>최근 트러블슈팅</h2>
        {recentTroubleshooting.length === 0 ? (
          <p>아직 작성된 글이 없습니다.</p>
        ) : (
          <ul>
            {recentTroubleshooting.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/troubleshooting/${entry.slug}`}>{entry.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
