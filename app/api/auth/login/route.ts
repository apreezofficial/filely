import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = findUserByEmail(email);

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email }
        });

        // Set auth cookie
        response.cookies.set('auth_token', user.id, {
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
            httpOnly: false,
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
