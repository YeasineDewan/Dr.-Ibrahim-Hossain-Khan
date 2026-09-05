import type { Metadata, Viewport } from 'next';
import './globals.css';
import './motion.css';
import { Noto_Sans_Bengali } from 'next/font/google';
import { LanguageProvider } from '../lib/translations';

const bangla = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bangla', preload: true });

export const metadata: Metadata = {
  title: 'Dr. Ibrahim Clinic | Human healthcare in Accra',
  description:
    'Thoughtful medical care, preventive medicine and personalised wellness from Dr. Ibrahim Clinic in Accra.',
  generator: 'Dr. Ibrahim Clinic',
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8faf9',
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bangla.variable}`}
      style={{
        ['--font-current' as any]: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}>
      <head>
        <link rel="preconnect" href="/" />
        <link rel="dns-prefetch" href="/" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23174b78'/><path d='M50 25v30m0 0v30m-20-20h30' stroke='white' stroke-width='8' stroke-linecap='round'/></svg>" />
        <link rel="apple-touch-icon" href="/ico.png" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" fetchPriority="high" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
