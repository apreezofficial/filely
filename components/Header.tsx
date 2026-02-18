'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='));
            setIsLoggedIn(hasToken);
        };

        checkAuth();
        // Listen for changes (rough implementation for demo)
        const interval = setInterval(checkAuth, 2000);
        return () => clearInterval(interval);
    }, []);

    const logout = () => {
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsLoggedIn(false);
        router.push('/auth/login');
    };

    return (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={() => router.push('/')} className="cursor-pointer">
                <img
                    src="/logo.jpg"
                    alt="Filely Logo"
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        cursor: 'pointer'
                    }}
                />
                <span style={{ fontWeight: 600, fontSize: '1.125rem', cursor: 'pointer' }}>Filely</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <nav style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="/" className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Upload</a>
                    {isLoggedIn && (
                        <a href="/dashboard" className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Dashboard</a>
                    )}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {!isLoggedIn ? (
                        <a href="/auth/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Login</a>
                    ) : (
                        <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Logout</button>
                    )}
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
            </div>
        </header>
    );
}
