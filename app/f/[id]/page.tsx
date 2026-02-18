'use client';

import { useParams } from 'next/navigation';

export default function FileViewPage() {
    const params = useParams();
    const fileId = params.id;

    // Mock file data
    const file = {
        name: 'project-q4-report.pdf',
        size: '2.4 MB',
        type: 'PDF Document',
        uploadedAt: 'Oct 24, 2023',
        expiresAt: null, // null means permanent
        downloads: 128
    };

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(0, 102, 255, 0.05)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    margin: '0 auto 1.5rem auto'
                }}>
                    📄
                </div>

                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{file.name}</h1>
                <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                    {file.type} • {file.size} • Shared via Filely
                </p>

                <div style={{
                    background: 'var(--background)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    textAlign: 'left'
                }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Uploaded</span>
                        <span style={{ fontWeight: 500 }}>{file.uploadedAt}</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Status</span>
                        <span style={{ fontWeight: 500, color: '#16a34a' }}>Permanent</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Downloads</span>
                        <span style={{ fontWeight: 500 }}>{file.downloads}</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Expiry</span>
                        <span style={{ fontWeight: 500 }}>Never</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }}>
                        Download File
                    </button>
                    <button className="btn btn-outline" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                    }}>
                        Copy Link
                    </button>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.875rem' }}>
                        <span className="text-secondary">Want to share your own files? </span>
                        <a href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Try Filely Free</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
