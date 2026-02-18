import { NextResponse } from 'next/server';
import { pruneExpiredFiles } from '@/lib/maintenance';

export async function GET(request: Request) {
    // In a real app, add a secret key check here
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { ... }

    try {
        const stats = await pruneExpiredFiles();
        return NextResponse.json({
            success: true,
            message: 'Pruning completed',
            ...stats
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
