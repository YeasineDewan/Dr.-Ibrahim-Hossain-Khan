import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | DR.IBRAHIM HOSSAIN',
  description: 'The page you are looking for does not exist. Return to DR.IBRAHIM HOSSAIN clinic homepage for dermatology and integrative medicine services in Dhaka, Bangladesh.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="page-section" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <h1 style={{ fontSize: 64, fontWeight: 800, background: 'linear-gradient(135deg, #14b8a6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ marginTop: 10, fontSize: 22, color: '#0f172a' }}>
          Page not found
        </h2>
        <p style={{ marginTop: 10, color: '#647985', lineHeight: 1.6 }}>
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to expert dermatology and integrative medicine care.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
            padding: '12px 24px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #14b8a6, #6366f1)',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}>
          Return to homepage
        </Link>
      </div>
    </main>
  );
}
