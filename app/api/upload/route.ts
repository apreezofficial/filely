import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isGuest = formData.get('isGuest') === 'true';

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const id = Math.random().toString(36).substring(2, 7);
    const now = new Date();

    const response = {
        id,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: now.toISOString(),
        url: `http://localhost:3001/f/${id}`,
    };

    if (isGuest) {
        const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        // @ts-ignore
        response.expiresAt = expiryDate.toISOString();
    }

    return NextResponse.json(response);
}
