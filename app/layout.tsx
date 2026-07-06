import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/nav'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '김지희 | Backend Developer',
  description: 'Spring Boot 기반 백엔드 개발자 포트폴리오'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
