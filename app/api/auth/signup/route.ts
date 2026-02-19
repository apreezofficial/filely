import { NextResponse } from 'next/server';
import { findUserByEmail, saveUser, User } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        const newUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            password, // In a real app, hash this!
            createdAt: new Date().toISOString(),
        };

        saveUser(newUser);

        const response = NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });

        // Set auth cookie
        response.cookies.set('auth_token', newUser.id, {
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
            httpOnly: false, // Accessible by client JS for simple demo UI checks
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
