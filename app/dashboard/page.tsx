'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFiles() {
            try {
                const res = await fetch('/api/user/files');
                const data = await res.json();
                setFiles(data.files);
            } catch (err) {
                console.error('Failed to fetch files');
            } finally {
                setLoading(false);
            }
        }
        fetchFiles();
    }, []);

    const totalSize = files.reduce((acc, f) => acc + parseFloat(f.size), 0);
    const storageLimit = 1024; // 1 GB in MB
    const storagePercent = (totalSize / storageLimit) * 100;

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>My Files</h1>
                    <p className="text-secondary">Manage and share your permanent file URLs.</p>
                </div>
                <a href="/" className="btn btn-primary">
                    + Upload New File
                </a>
            </div>

            <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your files...</div>
                ) : files.length === 0 ? (
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
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                                {file.type?.startsWith('image/') ? '🖼️' : '📄'}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{file.name}</span>
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
                                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => {
                                                const url = `${window.location.origin}/f/${file.slug}`;
                                                navigator.clipboard.writeText(url);
                                                alert('URL Copied!');
                                            }}>
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

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem' }}>
                <div className="card" style={{ flex: 1, padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Storage Used</h3>
                    <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                        {storagePercent.toFixed(1)}% of 1 GB used ({totalSize.toFixed(2)} MB)
                    </p>
                    <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(storagePercent, 100)}%`, height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                </div>

                <div className="card" style={{ flex: 1, padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Go Premium</h3>
                    <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Get 100 GB storage and direct downloads.</p>
                    <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Upgrade</button>
                </div>
            </div>
        </div>
    );
}
