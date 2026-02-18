import { NextResponse } from 'next/server';
import { getFiles } from '@/lib/db';

export async function GET() {
    const files = getFiles();
    // In a real app, we would filter by the current user's ID
    // For now, we return all files for the demo
    return NextResponse.json({ files });
}
