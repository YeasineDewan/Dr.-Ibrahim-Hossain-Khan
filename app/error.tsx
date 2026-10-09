'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[v0] Application route error');
  }, []);

  return (
    <main className="page-section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 32 }}>
      <div className="premium-card" style={{ maxWidth: 560, width: '100%', padding: 40, textAlign: 'center' }}>
        <span className="icon-halo" style={{ width: 64, height: 64, margin: '0 auto 18px', display: 'grid', placeItems: 'center' }}>
          <AlertTriangle size={28} aria-hidden="true" />
        </span>
        <p className="section-eyebrow">Something went wrong</p>
        <h1 style={{ marginTop: 10 }}>We couldn&apos;t load this page</h1>
        <p className="muted" style={{ marginTop: 12, lineHeight: 1.7 }}>
          Please try again. If the problem continues, return to the clinic homepage and contact our care team.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
          <button className="btn btn-primary" onClick={() => reset()}>
            <RefreshCw size={16} aria-hidden="true" /> Try again
          </button>
          <Link className="btn btn-ghost" href="/">
            <ArrowLeft size={16} aria-hidden="true" /> Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
