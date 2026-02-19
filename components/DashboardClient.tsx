'use client';

import { useState } from 'react';

interface FileRecord {
    id: string;
    originalName: string;
    size: string;
    uploadedAt: string;
    expiresAt: string | null;
    type: string;
    slug: string;
}

interface DashboardClientProps {
    initialFiles: FileRecord[];
}

export default function DashboardClient({ initialFiles }: DashboardClientProps) {
    const [files] = useState<FileRecord[]>(initialFiles);

    const totalSize = files.reduce((acc, f) => {
        const value = parseFloat(f.size);
        return acc + (f.size.includes('KB') ? value / 1024 : value);
    }, 0);
    const storageLimit = 1024; // 1 GB in MB
    const storagePercent = (totalSize / storageLimit) * 100;

    const copyUrl = (slug: string) => {
        const url = `${window.location.origin}/f/${slug}`;
        navigator.clipboard.writeText(url);
        alert('URL Copied!');
    };

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>My Files</h1>
                    <p className="text-secondary" style={{ fontSize: '1.125rem', fontWeight: 500 }}>Manage and share your public file links from one place.</p>
                </div>
                <a href="/" className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Upload New File
                </a>
            </div>

            <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                {files.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <p className="text-secondary">No files uploaded yet.</p>
                        <a href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Upload your first file</a>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>File Name</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>Size</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>Upload Date</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr key={file.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: 'var(--shadow)' }}>
                                                {file.type?.startsWith('image/') ? '🖼️' : '📄'}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '1rem' }}>{file.originalName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>{file.size}</td>
                                    <td style={{ padding: '1.25rem 2rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.625rem',
                                            borderRadius: '99px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: !file.expiresAt ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: !file.expiresAt ? '#16a34a' : '#d97706'
                                        }}>
                                            {!file.expiresAt ? 'Permanent' : 'Expiring'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => copyUrl(file.slug)}>
                                                Copy URL
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Storage Used</h3>
                            <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                {storagePercent.toFixed(1)}% of 1 GB used ({totalSize.toFixed(2)} MB)
                            </p>
                        </div>
                        <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </div>
                    </div>
                    <div style={{ height: '10px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(storagePercent, 100)}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--primary-hover))' }}></div>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Go Premium</h3>
                            <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Get 100 GB storage and direct downloads.</p>
                        </div>
                        <div style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04', padding: '0.5rem', borderRadius: '8px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Upgrade to Pro</button>
                </div>
            </div>
        </div>
    );
}
