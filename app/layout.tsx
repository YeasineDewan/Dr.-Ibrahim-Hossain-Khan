import type { Metadata, Viewport } from 'next';
import './globals.css';
import './motion.css';
import { Noto_Sans_Bengali } from 'next/font/google';
import { LanguageProvider } from '../lib/translations';
import { AuthProvider } from '../components/auth/AuthProvider';

const bangla = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bangla', preload: true });

export const metadata: Metadata = {
  title: 'DR.IBRAHIM HOSSAIN | Human healthcare in Accra',
  description:
    'Thoughtful medical care, preventive medicine and personalised wellness from DR.IBRAHIM HOSSAIN in Accra.',
  generator: 'DR.IBRAHIM HOSSAIN',
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8faf9',
  userScalable: true,
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
        <link rel="icon" type="image/png" sizes="32x32" href="/ico-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/ico-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/ico-64.png" />
        <link rel="preload" href="/logo-128.png" as="image" type="image/png" fetchPriority="high" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
