// app/kitchen/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Receipt {
    id: number;
    status: string;
    time_taken: number;
}

const KitchenPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [receipts, setReceipts] = useState<Receipt[]>([]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user.role !== 'kitchen') {
            router.push('/');
        } else {
            fetchReceipts();
        }
    }, [session, status]);

    const fetchReceipts = async () => {
        try {
            const res = await fetch('/api/kitchen/receipts');
            const data = await res.json();
            setReceipts(data);
        } catch (error) {
            console.error('Failed to fetch receipts:', error);
        }
    };

    const handleStart = async (receipt_id: number) => {
        try {
            const res = await fetch('/api/kitchen/receipts/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receipt_id }),
            });
            if (res.ok) {
                fetchReceipts();
            }
        } catch (error) {
            console.error('Failed to start receipt:', error);
        }
    };

    const handleComplete = async (receipt_id: number) => {
        try {
            const res = await fetch('/api/kitchen/receipts/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receipt_id }),
            });
            if (res.ok) {
                fetchReceipts();
            }
        } catch (error) {
            console.error('Failed to complete receipt:', error);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Kitchen Dashboard</h1>

            <section>
                <h2>Receipts</h2>
                <ul>
                    {receipts.map(receipt => (
                        <li key={receipt.id}>
                            Receipt #{receipt.id} - Status: {receipt.status} - Time Taken: {receipt.time_taken} mins
                            {receipt.status === 'pending' && (
                                <button onClick={() => handleStart(receipt.id)}>Start</button>
                            )}
                            {receipt.status === 'in_progress' && (
                                <button onClick={() => handleComplete(receipt.id)}>Complete</button>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default KitchenPage;
