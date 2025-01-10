// app/user/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '../../../types/user'; // Adjust the path as necessary

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'loading') return; // Do nothing while loading
        if (!session) {
            // If not authenticated, redirect to home or sign-in page
            router.push('/auth/signin');
        } else if (session.user.role !== 'customer') {
            // If authenticated but not a customer, redirect or show unauthorized message
            router.push('/');
        } else {
            // If authenticated and a customer, fetch user data
            fetchUserData();
        }
    }, [session, status]);

    const fetchUserData = async () => {
        try {
            const res = await fetch(`/api/users/${session.user.id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data: User = await res.json();
            setUser(data);
        } catch (err: any) {
            console.error('Error fetching user data:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>No user data available.</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>User Profile</h2>
            <p>Username: {user.name}</p>
            <p>Points: {user.points}</p>
            {/* Implement points redemption and other profile features here */}
        </div>
    );
};

export default ProfilePage;
