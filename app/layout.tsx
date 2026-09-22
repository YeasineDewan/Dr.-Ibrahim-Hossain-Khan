import type { Metadata, Viewport } from 'next';
import './globals.css';
import './motion.css';
import { Noto_Sans_Bengali } from 'next/font/google';
import { LanguageProvider } from '../lib/translations';
import { AuthProvider } from '../components/auth/AuthProvider';
import { Analytics } from '@vercel/analytics/react';
import { JsonLd } from '../components/json-ld';

const bangla = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bangla', preload: true, display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://dribrahimhossain.com'),
  title: {
    default: 'Dr. Ibrahim Hossain | Skin, Venereal disease & Integrative Medicine Specialist',
    template: '%s | Dr. Ibrahim Hossain',
  },
  description:
    'Dr. Ibrahim Hossain — Skin, Venereal disease & Integrative Medicine Specialist. Dermatology, veneral medicine and integrative care in Dhaka, Bangladesh. PRP therapy, psoriasis, vitiligo, IBS, hormonal optimization, infertility support and family medicine. Book your consultation today.',
  keywords: [
    'Dr. Ibrahim Hossain',
    'Dr. Ibrahim Hossain Khan',
    'dermatologist Dhaka',
    'skin specialist Bangladesh',
    'VD specialist Bangladesh',
    'venereologist Dhaka',
    'integrative medicine Bangladesh',
    'PRP therapy Bangladesh',
    'PRP hair restoration Dhaka',
    'psoriasis treatment Bangladesh',
    'vitiligo treatment Dhaka',
    'IBS treatment Bangladesh',
    'infertility care Bangladesh',
    'hormonal optimization Dhaka',
    'family medicine Bangladesh',
    'preventive care Bangladesh',
    'holistic medicine Dhaka',
    'wellness clinic Bangladesh',
    'trichologist Dhaka',
    'aesthetic medicine Bangladesh',
    'hair loss treatment Dhaka',
    'clinical dermatologist Bangladesh',
    'Dhanmondi dermatologist',
    'Banglamotor clinic',
    'Uttara clinic',
    'Dhaka healthcare',
    'Bangladesh dermatology',
    'skin clinic Dhaka',
    'medical clinic Bangladesh',
    'doctor Dhaka',
    'telehealth Bangladesh',
    'evidence-based dermatology',
    'regenerative medicine Bangladesh',
    'lifestyle medicine Bangladesh',
    'nutrition planning Bangladesh',
    'patient-centered care Dhaka',
  ],
  authors: [{ name: 'Dr. Ibrahim Hossain', url: 'https://dribrahimhossain.com' }],
  creator: 'Dr. Ibrahim Hossain',
  publisher: 'Dr. Ibrahim Hossain',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dribrahimhossain.com',
    siteName: 'Dr. Ibrahim Hossain',
    title: 'Dr. Ibrahim Hossain | Skin, Venereal disease & Integrative Medicine Specialist',
    description:
      'Dr. Ibrahim Hossain — Skin, Venereal disease & Integrative Medicine Specialist. PRP therapy, psoriasis, vitiligo, IBS, family medicine and personalized wellness in Dhaka, Bangladesh.',
    images: [
      {
        url: '/logo-256.png',
        width: 256,
        height: 256,
        alt: 'Dr. Ibrahim Hossain',
      },
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t0aIFTDc6pB1akFlYbJx4hrSfNncT0.png',
        width: 1200,
        height: 630,
        alt: 'Dr. Ibrahim Hossain - Dermatologist in Dhaka, Bangladesh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Ibrahim Hossain | Skin, Venereal disease & Integrative Medicine Specialist',
    description:
      'Dr. Ibrahim Hossain — Skin, Venereal disease & Integrative Medicine Specialist. PRP therapy, psoriasis, vitiligo, IBS and family medicine in Dhaka, Bangladesh.',
    images: ['/logo-256.png'],
    creator: '@dribrahimhossain',
  },
  alternates: {
    canonical: 'https://dribrahimhossain.com',
    languages: {
      en: 'https://dribrahimhossain.com',
      bn: 'https://dribrahimhossain.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.facebook.com" />
        <link rel="preconnect" href="https://www.instagram.com" />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://yt3.ggpht.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="alternate" hrefLang="en" href="https://dribrahimhossain.com" />
        <link rel="alternate" hrefLang="bn" href="https://dribrahimhossain.com" />
        <link rel="alternate" hrefLang="x-default" href="https://dribrahimhossain.com" />
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
        <Analytics />
        <JsonLd />
      </body>
    </html>
  );
}
 