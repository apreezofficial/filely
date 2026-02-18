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

    // Hide local path for safety and rename storedFileName to fileName
    const { localPath, storedFileName, ...rest } = file;
    const safeFile = { ...rest, fileName: storedFileName };

    return NextResponse.json(safeFile);
}
