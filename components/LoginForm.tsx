'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
    redirect?: string;
}

export default function LoginForm({ redirect = '/dashboard' }: LoginFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            router.push(redirect);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>Welcome back</h1>
                <p className="text-secondary" style={{ fontWeight: 500 }}>Please enter your details to sign in.</p>
            </div>

            {error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    fontWeight: 600
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                    <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            outline: 'none',
                            fontSize: '0.9375rem',
                            background: 'var(--panel)',
                            color: 'var(--foreground)',
                            transition: 'all 0.2s ease'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
                        <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>Forgot password?</a>
                    </div>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            outline: 'none',
                            fontSize: '0.9375rem',
                            background: 'var(--panel)',
                            color: 'var(--foreground)',
                            transition: 'all 0.2s ease'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: '0.5rem', padding: '1rem' }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9375rem' }}>
                <span className="text-secondary" style={{ fontWeight: 500 }}>Don't have an account? </span>
                <a href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create account</a>
            </div>
        </div>
    );
}
