import { NextResponse } from 'next/server';
import { findFileBySlug } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const existing = findFileBySlug(slug);
    return NextResponse.json({ available: !existing });
}
