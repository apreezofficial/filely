import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { findFileBySlug } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const slug = params.id;
    const fileRecord = findFileBySlug(slug);

    if (!fileRecord || !fs.existsSync(fileRecord.localPath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fileRecord.localPath);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': fileRecord.type || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${fileRecord.name}"`,
        },
    });
}
