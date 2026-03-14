import './globals.css'

export const metadata = {
  title: 'Job Coach AI',
  description: 'Upload your resume. Paste the job. Land the interview.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  )
}
