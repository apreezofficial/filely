'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate login process
        setTimeout(() => {
            // Set mock auth cookie
            document.cookie = "auth_token=mock_session_token; path=/; max-age=3600";

            // Get redirect target or default to dashboard
            const redirect = searchParams.get('redirect') || '/dashboard';
            router.push(redirect);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 120px)',
            padding: '2rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome back</h1>
                    <p className="text-secondary">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                outline: 'none',
                                fontSize: '0.9375rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                            <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--primary)' }}>Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                outline: 'none',
                                fontSize: '0.9375rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <span className="text-secondary">Don't have an account? </span>
                    <a href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 500 }}>Create account</a>
                </div>
            </div>
        </div>
    );
}
