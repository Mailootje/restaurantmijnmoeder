// app/user/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const UserPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <div>Loading...</div>;

    if (!session || session.user.role !== 'customer') {
        router.push('/');
        return null;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>User Dashboard</h1>
            <p>Welcome, {session.user.name}</p>
            <button onClick={() => signOut()}>Sign out</button>
            <nav style={{ marginTop: '1rem' }}>
                <ul>
                    <li>
                        <Link href="/user/reservations">Make a Reservation</Link>
                    </li>
                    <li>
                        <Link href="/user/menu">View Menu</Link>
                    </li>
                    <li>
                        <Link href="/user/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default UserPage;
