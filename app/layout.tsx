import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Filely | Permanent File Storage",
  description: "Upload your files and get a permanent URL. No account needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="glass" style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid var(--border)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>F</div>
            <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>Filely</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/" className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Upload</a>
              <a href="/dashboard" className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Dashboard</a>
            </nav>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              🔔
            </div>
          </div>
        </header>
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
