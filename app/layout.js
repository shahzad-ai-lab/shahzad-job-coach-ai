import './globals.css'

export const metadata = {
  title: 'Alfalah AI — Come to Success | Free AI Career Platform',
  description: 'Alfalah AI (الفلاح) — Free AI-powered career platform for all humanity. Resume analysis, skills assessment, career coaching, visa pathways, 195 countries. No login. Zero data stored.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Alfalah AI' },
  openGraph: {
    title: 'Alfalah AI — Come to Success',
    description: 'Free AI career platform serving all humanity — from labor to C-suite, age 10 to 100, 195 countries.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#0F0C29',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Alfalah AI" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  )
}
