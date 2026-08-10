import { ImageResponse } from 'next/og'
import { getAbout } from '@/lib/content-data'

export const alt = '김지희 — Backend Developer 포트폴리오'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Satori 기본 폰트는 한글 글리프를 그리지 못한다. 빌드 시 Noto Sans KR을 받아오되,
 * 네트워크가 막히면 null을 돌려주고 라틴 문자만으로 카드를 구성한다. 빌드는 절대 실패하지 않는다.
 */
async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&display=swap', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(8000)
    }).then((res) => res.text())
    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1]
    if (!url) return null
    return await fetch(url, { signal: AbortSignal.timeout(8000) }).then((res) => res.arrayBuffer())
  } catch {
    return null
  }
}

export default async function OpengraphImage() {
  const about = getAbout()
  const korean = await loadKoreanFont()
  const headline = korean ? `${about.name}의 개발 포트폴리오` : about.role

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#1c1e22',
          padding: '72px 80px',
          fontFamily: korean ? 'Noto Sans KR' : 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: 12,
              background: '#eceef1',
              color: '#1c1e22',
              fontSize: 30,
              fontWeight: 700
            }}
          >
            {'>'}
          </div>
          <div style={{ fontSize: 26, color: '#9aa0a8', letterSpacing: 1 }}>{about.role}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              fontSize: korean ? 74 : 92,
              fontWeight: 700,
              color: '#eceef1',
              letterSpacing: -2,
              lineHeight: 1.12
            }}
          >
            {headline}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 25, color: '#9aa0a8' }}>
            {['Projects', 'Engineering', 'Study Notes', 'Quality'].map((label, index) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {index > 0 ? <div style={{ color: '#4b5058' }}>/</div> : null}
                <div>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 46, height: 3, background: '#6f95dd', borderRadius: 2 }} />
          <div style={{ fontSize: 23, color: '#6f95dd' }}>{about.email}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: korean ? [{ name: 'Noto Sans KR', data: korean, weight: 700, style: 'normal' }] : undefined
    }
  )
}
