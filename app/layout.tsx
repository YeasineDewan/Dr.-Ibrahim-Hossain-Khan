import type { Metadata, Viewport } from 'next'
import './globals.css'
import './motion.css'
import { Noto_Sans_Bengali } from 'next/font/google'
import { LanguageProvider } from '../lib/translations'

const bangla = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bangla' })

export const metadata: Metadata = {
  title: 'Dr. Ibrahim Clinic | Human healthcare in Accra',
  description: 'Thoughtful medical care, preventive medicine and personalised wellness from Dr. Ibrahim Clinic in Accra.',
  generator: 'Dr. Ibrahim Clinic',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8faf9',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
        <html lang="en" suppressHydrationWarning className={`${bangla.variable}`} style={{ ['--font-current' as any]: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <head>
        <link rel="preconnect" href="/" />
        <link rel="dns-prefetch" href="/" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
