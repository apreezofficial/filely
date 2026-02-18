import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export type FileRecord = {
    id: string;
    originalName: string;
    storedFileName: string;
    size: string;
    type: string;
    uploadedAt: string;
    expiresAt: string | null;
    userId: string | null;
    slug: string;
    localPath: string;
};

function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ files: [] }, null, 2));
    }
}

export function getFiles(): FileRecord[] {
    ensureDb();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data).files;
}

export function saveFileRecord(record: FileRecord) {
    ensureDb();
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    db.files.push(record);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function findFileBySlug(slug: string): FileRecord | undefined {
    const files = getFiles();
    return files.find(f => f.slug === slug);
}

export function findFileById(id: string): FileRecord | undefined {
    const files = getFiles();
    return files.find(f => f.id === id);
}
