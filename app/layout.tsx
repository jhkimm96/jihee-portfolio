import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { getAbout } from '@/lib/content-data'
import { SITE_URL } from '@/lib/site'

const fontSans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const fontMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

const about = getAbout()

const description = `${about.name}의 포트폴리오, 트러블슈팅 기록, 학습 노트, 이력서를 한 곳에서 관리하는 사이트입니다.`

export const metadata: Metadata = {
  title: {
    default: `${about.name} — ${about.role}`,
    template: `%s — ${about.name}`
  },
  description,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: `${about.name} — ${about.role}`,
    title: `${about.name} — ${about.role}`,
    description
  },
  twitter: {
    card: 'summary_large_image',
    title: `${about.name} — ${about.role}`,
    description
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#181a20' }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <a href="#main" className="skip-link no-print">
            본문 바로가기
          </a>
          <div className="grain-overlay no-print" aria-hidden="true" />
          <div className="flex min-h-dvh flex-col">
            <SiteNav />
            <main id="main" className="flex-1 scroll-mt-20">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
