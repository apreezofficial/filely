import { NextResponse } from 'next/server';
import { getFiles } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_token')?.value;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allFiles = getFiles();
    const userFiles = allFiles.filter(f => f.userId === userId);

    return NextResponse.json({ files: userFiles });
}
