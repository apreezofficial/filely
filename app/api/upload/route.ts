import { NextResponse } from 'next/server';
import { processUpload } from '@/lib/storage';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const isGuest = formData.get('isGuest') === 'true';
        const customSlug = formData.get('customSlug') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const record = await processUpload(file, isGuest, customSlug);

        return NextResponse.json({
            ...record,
            url: `${new URL(request.url).origin}/f/${record.slug}`
        });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
