import type { Metadata, Viewport } from 'next';
import './globals.css';
import './motion.css';
import { Noto_Sans_Bengali } from 'next/font/google';
import { LanguageProvider } from '../lib/translations';
import { AuthProvider } from '../components/auth/AuthProvider';

const bangla = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bangla', preload: true, display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://dribrahimhossain.com'),
  title: {
    default: 'DR.IBRAHIM HOSSAIN | Board-Certified Dermatologist & Integrative Medicine Specialist in Bangladesh',
    template: '%s | DR.IBRAHIM HOSSAIN',
  },
  description:
    'Expert dermatology, veneral medicine and integrative care by Dr. Ibrahim Hossain Khan in Dhaka, Bangladesh. Board-certified consultant dermatologist specializing in PRP therapy, psoriasis management, vitiligo treatment, IBS care, hormonal optimization, infertility support and family medicine. Book your consultation today.',
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
  creator: 'DR.IBRAHIM HOSSAIN',
  publisher: 'DR.IBRAHIM HOSSAIN',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dribrahimhossain.com',
    siteName: 'DR.IBRAHIM HOSSAIN',
    title: 'DR.IBRAHIM HOSSAIN | Dermatologist & Integrative Medicine Specialist in Dhaka, Bangladesh',
    description:
      'Expert dermatology, veneral medicine and integrative care by Dr. Ibrahim Hossain Khan. PRP therapy, psoriasis, vitiligo, IBS, family medicine and personalized wellness in Dhaka, Bangladesh.',
    images: [
      {
        url: '/logo-256.png',
        width: 256,
        height: 256,
        alt: 'DR.IBRAHIM HOSSAIN',
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
    title: 'DR.IBRAHIM HOSSAIN | Dermatologist & Integrative Medicine Specialist in Dhaka, Bangladesh',
    description:
      'Expert dermatology, veneral medicine and integrative care by Dr. Ibrahim Hossain Khan. PRP therapy, psoriasis, vitiligo, IBS and family medicine in Dhaka, Bangladesh.',
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
  category: 'health',
  classification: 'Medical Clinic',
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8faf9',
  userScalable: true,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalBusiness',
      '@id': 'https://dribrahimhossain.com/#organization',
      name: 'DR.IBRAHIM HOSSAIN Clinic',
      description: 'Skin, Veneral & Integrative Medicine Specialist in Dhaka, Bangladesh.',
      url: 'https://dribrahimhossain.com',
      telephone: '+8801719395553',
      email: 'hello@dribrahim.clinic',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'House 45, Road 22, Dhanmondi',
        addressLocality: 'Dhaka',
        addressRegion: 'Dhaka Division',
        postalCode: '1209',
        addressCountry: 'BD',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      image: '/logo-256.png',
      sameAs: [
        'https://www.facebook.com/dribrahimhossainkhan/',
        'https://www.instagram.com/dribrahimhossain',
        'https://www.youtube.com/@dr.ibrahimhossain',
      ],
      physician: {
        '@type': 'Physician',
        name: 'Dr. Ibrahim Hossain',
        credential: 'M.Sc · Skin & VD Integrative Medicine Consultant',
        specialty: 'Dermatology and Integrative Medicine',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'House 45, Road 22, Dhanmondi',
          addressLocality: 'Dhaka',
          addressRegion: 'Dhaka Division',
          postalCode: '1209',
          addressCountry: 'BD',
        },
        telephone: '+8801719395553',
      },
      priceRange: '৳৳',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '2000',
        bestRating: '5',
        worstRating: '1',
      },
      areaServed: [
        {
          '@type': 'City',
          name: 'Dhaka',
        },
        {
          '@type': 'City',
          name: 'Dhanmondi',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Dermatology Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'PRP Therapy',
              description: 'Platelet-rich plasma therapy for hair restoration and skin rejuvenation',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Psoriasis Treatment',
              description: 'Long-term psoriasis management and flare control',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Vitiligo Treatment',
              description: 'Personalized vitiligo care and pigmentation therapy',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'IBS & Gut Health',
              description: 'Integrative gut health management and digestive wellness',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Integrative Medicine',
              description: 'Whole-person care combining conventional and evidence-based complementary therapies',
            },
          },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://dribrahimhossain.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://dribrahimhossain.com',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dribrahimhossain.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Where is Dr. Ibrahim Hossain\'s clinic located in Bangladesh?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Dr. Ibrahim Hossain\'s clinic is located at House 45, Road 22, Dhanmondi, Dhaka 1209, Bangladesh. Additional chambers are available at Banglamotor and Uttara in Dhaka.',
          },
        },
        {
          '@type': 'Question',
          name: 'What skin conditions does Dr. Ibrahim Hossain treat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Dr. Ibrahim Hossain specializes in treating psoriasis, vitiligo, acne, hair loss, scalp disorders, pigmentation issues, and other skin conditions. He also provides veneral medicine and integrative medicine services.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Dr. Ibrahim offer PRP therapy in Dhaka?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Dr. Ibrahim Hossain offers platelet-rich plasma (PRP) therapy for hair restoration and skin rejuvenation at his Dhaka clinic. He is a qualified trichologist and dermatologist providing evidence-led regenerative treatments.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I book an appointment with Dr. Ibrahim Hossain?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can book an appointment online through our website, call us at +880 1719-939553, or visit our Dhanmondi clinic during operating hours (Mon-Fri 8:00 AM - 5:00 PM).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is integrative medicine and does Dr. Ibrahim provide it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Integrative medicine combines conventional medical treatments with evidence-based complementary therapies. Dr. Ibrahim creates personalized care plans that connect symptoms, lifestyle, prevention and treatment for whole-person wellness in Dhaka, Bangladesh.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Dr. Ibrahim treat IBS and gut health issues?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Dr. Ibrahim Hossain provides comprehensive IBS and gut health management with lifestyle mapping, nutrition-aware guidance and measured follow-up milestones as part of his integrative medicine services in Dhaka.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the consultation fees for dermatology in Dhaka?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Consultation fees vary by service. PRP therapy starts from ৳12,000, psoriasis treatment from ৳8,500, and preventive wellness from ৳7,500. Contact the clinic directly for exact pricing and package details.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many sessions of PRP therapy are needed for hair restoration?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most patients require 4-6 PRP sessions spaced 4-6 weeks apart for optimal hair restoration results. Dr. Ibrahim will create a personalized treatment plan during your consultation based on your specific needs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can psoriasis be completely cured?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'While psoriasis is a chronic condition, it can be effectively managed with evidence-based treatments. Dr. Ibrahim provides long-term flare control plans including topical treatments, systemic therapies and lifestyle modifications to help you achieve clear skin.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is vitiligo treatment available in Dhaka?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Dr. Ibrahim Hossain provides compassionate vitiligo care at his Dhaka clinic. Treatment includes detailed skin assessment, personalized care planning, and integrative approaches to support repigmentation and skin health confidence.',
          },
        },
        {
          '@type': 'Question',
          name: 'What payment methods are accepted at the clinic?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We accept Visa, MasterCard, bKash and Nagad. Payment can be made at the clinic during your visit. For specific insurance or payment plan inquiries, please contact our clinic directly.',
          },
        },
      ],
    },
  ],
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
        <link rel="preload" href="/logo-128.webp" as="image" type="image/webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
