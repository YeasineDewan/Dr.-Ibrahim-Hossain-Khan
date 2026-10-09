'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8faf9', color: '#0f172a' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ maxWidth: 520 }}>
            <p style={{ color: '#0f9f93', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 12 }}>Dr. Ibrahim Hossain Clinic</p>
            <h1 style={{ fontSize: 36, margin: '12px 0' }}>We&apos;re restoring this page</h1>
            <p style={{ color: '#647985', lineHeight: 1.7 }}>A temporary error interrupted the application. Please try again.</p>
            <button onClick={() => reset()} style={{ marginTop: 20, border: 0, borderRadius: 10, padding: '12px 20px', background: '#0f9f93', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
