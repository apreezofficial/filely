import { NextResponse } from 'next/server';
import { appendChunk, finalizeChunkedUpload } from '@/lib/storage';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const chunk = formData.get('chunk') as File;
        const uploadId = formData.get('uploadId') as string;
        const chunkIndex = parseInt(formData.get('chunkIndex') as string);
        const totalChunks = parseInt(formData.get('totalChunks') as string);

        // Metadata for finalization
        const fileName = formData.get('fileName') as string;
        const totalSize = parseInt(formData.get('totalSize') as string);
        const fileType = formData.get('fileType') as string;
        const isGuest = formData.get('isGuest') === 'true';
        const customSlug = formData.get('customSlug') as string;

        if (!chunk || !uploadId) {
            return NextResponse.json({ error: 'Missing chunk data' }, { status: 400 });
        }

        const buffer = Buffer.from(await chunk.arrayBuffer());
        await appendChunk(uploadId, chunkIndex, buffer);

        // If it's the last chunk, finalize
        if (chunkIndex === totalChunks - 1) {
            const cookieStore = await cookies();
            const userId = cookieStore.get('auth_token')?.value || null;

            const record = await finalizeChunkedUpload(
                uploadId,
                fileName,
                totalSize,
                fileType,
                isGuest,
                userId,
                customSlug
            );

            return NextResponse.json({
                ...record,
                url: `${new URL(request.url).origin}/f/${record.slug}`,
                finalized: true
            });
        }

        return NextResponse.json({ success: true, finalized: false });
    } catch (error: any) {
        console.error('Chunk Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Chunk upload failed' }, { status: 500 });
    }
}
