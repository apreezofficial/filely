import { NextResponse } from 'next/server';
import { findFileBySlug } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: slug } = await params;
    const file = findFileBySlug(slug);

    if (!file) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Return the record as is (localPath is gone from type)
    return NextResponse.json(file);
}
