'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FileViewPage() {
    const params = useParams();
    const slug = params.id as string;
    const [file, setFile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFile() {
            try {
                const res = await fetch(`/api/files/${slug}`);
                if (!res.ok) throw new Error('File not found');
                const data = await res.json();
                setFile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchFile();
    }, [slug]);

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
                <p>Loading file details...</p>
            </div>
        );
    }

    if (error || !file) {
        return (
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>404 - File Not Found</h1>
                    <p className="text-secondary">The link you followed might have expired or is incorrect.</p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Home</a>
                </div>
            </div>
        );
    }

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
                    {file.type?.startsWith('image/') ? '🖼️' : '📄'}
                </div>

                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{file.fileName}</h1>
                <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                    {file.size} • Shared via Filely
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
                        <span style={{ fontWeight: 500 }}>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Status</span>
                        <span style={{ fontWeight: 500, color: file.expiresAt ? '#d97706' : '#16a34a' }}>
                            {file.expiresAt ? 'Temporary' : 'Permanent'}
                        </span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Expiry</span>
                        <span style={{ fontWeight: 500 }}>
                            {file.expiresAt ? new Date(file.expiresAt).toLocaleDateString() : 'Never'}
                        </span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>ID</span>
                        <span style={{ fontWeight: 500 }}>{file.id}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a
                        href={`/api/download/${slug}`}
                        className="btn btn-primary"
                        style={{ flex: 1, textDecoration: 'none' }}
                        download
                    >
                        Download File
                    </a>
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
