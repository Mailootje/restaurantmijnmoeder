// app/user/reservations/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ReservationsPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [people, setPeople] = useState(1);

    if (status === 'loading') return <div>Loading...</div>;

    if (!session || session.user.role !== 'customer') {
        router.push('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const reservationDate = `${date} ${time}`;
        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reservation_date: reservationDate, number_of_people: people }),
            });
            if (res.ok) {
                alert('Reservation made successfully!');
                setDate('');
                setTime('');
                setPeople(1);
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Failed to make reservation:', error);
            alert('Failed to make reservation');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Make a Reservation</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date: </label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                    <label>Time: </label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div>
                    <label>Number of People: </label>
                    <input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} min="1" required />
                </div>
                <button type="submit">Reserve</button>
            </form>
        </div>
    );
};

export default ReservationsPage;
