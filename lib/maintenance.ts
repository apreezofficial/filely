import fs from 'fs';
import { getFiles } from '@/lib/db';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function pruneExpiredFiles() {
    const files = getFiles();
    const now = new Date();

    const expiredFiles = files.filter(f => f.expiresAt && new Date(f.expiresAt) <= now);
    const remainingFiles = files.filter(f => !f.expiresAt || new Date(f.expiresAt) > now);

    for (const file of expiredFiles) {
        if (fs.existsSync(file.localPath)) {
            try {
                fs.unlinkSync(file.localPath);
                console.log(`Deleted expired file: ${file.name}`);
            } catch (err) {
                console.error(`Failed to delete file: ${file.localPath}`, err);
            }
        }
    }

    // Update DB
    fs.writeFileSync(DB_PATH, JSON.stringify({ files: remainingFiles }, null, 2));

    return {
        deletedCount: expiredFiles.length,
        remainingCount: remainingFiles.length
    };
}
