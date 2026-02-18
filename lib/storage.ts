import fs from 'fs';
import path from 'path';
import { saveFileRecord, FileRecord, findFileBySlug } from './db';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export async function processUpload(
    file: File,
    isGuest: boolean,
    customSlug?: string
): Promise<FileRecord> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const id = Math.random().toString(36).substring(2, 9);
    const slug = customSlug || Math.random().toString(36).substring(2, 7);

    // Check slug availability
    if (customSlug && findFileBySlug(customSlug)) {
        throw new Error('Slug already taken');
    }

    const fileName = `${id}-${file.name}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    const now = new Date();
    const record: FileRecord = {
        id,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        uploadedAt: now.toISOString(),
        expiresAt: isGuest ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        userId: isGuest ? null : 'mock-user-123',
        slug,
        localPath: filePath
    };

    saveFileRecord(record);
    return record;
}
