import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { findFileBySlug } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: slug } = await params;
    const fileRecord = findFileBySlug(slug);
    if (!fileRecord) {
        return new NextResponse('File not found', { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', fileRecord.fileName);

    if (!fs.existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // We serve the file with its original content type
    // and 'inline' disposition so it displays in browser/src tags instead of forcing a download
    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': fileRecord.type || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${fileRecord.originalName}"`,
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
