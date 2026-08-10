/**
 * 사이트의 정본 URL. metadataBase, canonical, og:url, sitemap이 전부 이 값을 쓴다.
 *
 * Vercel은 프로덕션 배포에 VERCEL_PROJECT_PRODUCTION_URL을 자동으로 넣어주므로
 * 대시보드에 아무것도 설정하지 않아도 실제 도메인이 잡힌다. 도메인을 직접 지정하고
 * 싶을 때만 NEXT_PUBLIC_SITE_URL을 설정한다(커스텀 도메인 등).
 *
 * 로컬 폴백 포트는 package.json의 dev/start와 같은 4000이다.
 */
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'http://localhost:4000')
