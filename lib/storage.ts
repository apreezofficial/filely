import fs from 'fs';
import path from 'path';
import { saveFileRecord, FileRecord, findFileBySlug } from './db';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const TEMP_DIR = path.join(process.cwd(), 'public', 'uploads', 'temp');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

export async function appendChunk(
    uploadId: string,
    chunkIndex: number,
    buffer: Buffer
): Promise<void> {
    const chunkPath = path.join(TEMP_DIR, `${uploadId}.part`);
    // Use appendFileSync to keep it simple, or createWriteStream for better perf
    fs.appendFileSync(chunkPath, buffer);
}

export async function finalizeChunkedUpload(
    uploadId: string,
    originalName: string,
    totalSize: number,
    type: string,
    isGuest: boolean,
    userId: string | null,
    customSlug?: string
): Promise<FileRecord> {
    const id = Math.random().toString(36).substring(2, 9);
    const slug = customSlug || Math.random().toString(36).substring(2, 7);

    if (customSlug && findFileBySlug(customSlug)) {
        throw new Error('Slug already taken');
    }

    const fileName = `${id}-${originalName}`;
    const finalPath = path.join(UPLOADS_DIR, fileName);
    const tempPath = path.join(TEMP_DIR, `${uploadId}.part`);

    if (!fs.existsSync(tempPath)) {
        throw new Error('Upload data not found');
    }

    // Move temp file to final destination
    fs.renameSync(tempPath, finalPath);

    const now = new Date();
    const record: FileRecord = {
        id,
        originalName: originalName,
        fileName,
        size: totalSize < 1024 * 1024
            ? `${(totalSize / 1024).toFixed(2)} KB`
            : `${(totalSize / (1024 * 1024)).toFixed(2)} MB`,
        type: type,
        uploadedAt: now.toISOString(),
        expiresAt: isGuest ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        userId: userId,
        slug,
    };

    saveFileRecord(record);
    return record;
}

export async function processUpload(
    file: File,
    isGuest: boolean,
    userId: string | null,
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
        originalName: file.name,
        fileName,
        size: file.size < 1024 * 1024
            ? `${(file.size / 1024).toFixed(2)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        uploadedAt: now.toISOString(),
        expiresAt: isGuest ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        userId: userId,
        slug,
    };

    saveFileRecord(record);
    return record;
}
