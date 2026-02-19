import { cookies } from 'next/headers';
import { getFiles } from '@/lib/db';
import DashboardClient from '@/components/DashboardClient';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_token')?.value;

    if (!userId) {
        redirect('/auth/login?redirect=/dashboard');
    }

    const allFiles = getFiles();
    const userFiles = allFiles.filter(f => f.userId === userId);

    return <DashboardClient initialFiles={userFiles} />;
}

