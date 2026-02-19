import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export type User = {
    id: string;
    name: string;
    email: string;
    password: string; // Plain for demo, but indexed in db
    createdAt: string;
};

export type FileRecord = {
    id: string;
    originalName: string;
    fileName: string;
    size: string;
    type: string;
    uploadedAt: string;
    expiresAt: string | null;
    userId: string | null;
    slug: string;
};

function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ files: [], users: [] }, null, 2));
    }
}

export function getDb() {
    ensureDb();
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    // Ensure both collections exist
    if (!data.files) data.files = [];
    if (!data.users) data.users = [];
    return data;
}

export function saveDb(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getFiles(): FileRecord[] {
    return getDb().files;
}

export function saveFileRecord(record: FileRecord) {
    const db = getDb();
    db.files.push(record);
    saveDb(db);
}

export function getUsers(): User[] {
    return getDb().users;
}

export function saveUser(user: User) {
    const db = getDb();
    db.users.push(user);
    saveDb(db);
}

export function findUserByEmail(email: string): User | undefined {
    return getUsers().find(u => u.email === email);
}

export function findFileBySlug(slug: string): FileRecord | undefined {
    const files = getFiles();
    return files.find(f => f.slug === slug);
}

export function findFileById(id: string): FileRecord | undefined {
    const files = getFiles();
    return files.find(f => f.id === id);
}
