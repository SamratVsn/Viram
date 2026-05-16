import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Viram'
const SITE_URL = 'https://viram.app'
const DEFAULT_DESC = 'Viram is a gamified productivity app that turns your goals into milestones. Build discipline, track habits, and reclaim your focus with avatar-based motivation.'
const DEFAULT_OG_IMAGE = 'https://viram.app/og-image.jpg'

export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonical = SITE_URL,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Turn Your Goals Into Milestones`

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@viramapp" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}
