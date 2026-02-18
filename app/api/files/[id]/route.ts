import { NextResponse } from 'next/server';
import { findFileBySlug } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const slug = params.id;
    const file = findFileBySlug(slug);

    if (!file) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Hide local path for safety
    const { localPath, ...safeFile } = file;

    return NextResponse.json(safeFile);
}
