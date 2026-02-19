import { NextResponse } from 'next/server';
import { processUpload } from '@/lib/storage';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const isGuest = formData.get('isGuest') === 'true';
        const customSlug = formData.get('customSlug') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Limit check in code just in case (e.g. 50MB)
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 });
        }

        // Get user ID from cookie if it exists
        const cookieStore = await cookies();
        const userId = cookieStore.get('auth_token')?.value || null;

        const record = await processUpload(file, isGuest, userId, customSlug);

        return NextResponse.json({
            ...record,
            url: `${new URL(request.url).origin}/f/${record.slug}`
        });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
