import './globals.css'

export const metadata = {
  title: 'Job Coach AI 2026 — Free AI Career Coach',
  description: '16 free AI career tools. Upload resume, paste job description, get ATS score, cover letter, interview prep, salary strategy, visa pathways and more. No login. No data stored.',
  manifest: '/manifest.json',
  themeColor: '#0F0C29',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Job Coach AI' },
  openGraph: {
    title: 'Job Coach AI 2026 — 16 Free AI Career Tools',
    description: 'Free AI career coach for all humanity. Resume analysis, interview prep, salary negotiation, visa pathways.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Job Coach AI" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  )
}
