// app/bar/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Receipt {
    id: number;
    status: string;
    time_taken: number;
}

const BarPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [receipts, setReceipts] = useState<Receipt[]>([]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user.role !== 'bar') {
            router.push('/');
        } else {
            fetchReceipts();
        }
    }, [session, status]);

    const fetchReceipts = async () => {
        try {
            const res = await fetch('/api/bar/receipts');
            const data = await res.json();
            setReceipts(data);
        } catch (error) {
            console.error('Failed to fetch bar receipts:', error);
        }
    };

    const handleStart = async (receipt_id: number) => {
        try {
            const res = await fetch('/api/bar/receipts/start', {
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
            const res = await fetch('/api/bar/receipts/complete', {
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

    const handleSettle = async (receipt_id: number) => {
        try {
            const res = await fetch('/api/bar/receipts/settle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receipt_id }),
            });
            if (res.ok) {
                fetchReceipts();
            }
        } catch (error) {
            console.error('Failed to settle receipt:', error);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Bar Dashboard</h1>

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
                            {receipt.status === 'completed' && (
                                <button onClick={() => handleSettle(receipt.id)}>Settle</button>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default BarPage;
