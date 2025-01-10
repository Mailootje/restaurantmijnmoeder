// app/api/reservations/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session || session.user.role !== 'customer') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { reservation_date, number_of_people } = req.body as { reservation_date: string; number_of_people: number };

        if (!reservation_date || !number_of_people) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const user_id = session.user.id;

        try {
            await pool.query(
                'INSERT INTO reservations (user_id, reservation_date, number_of_people) VALUES (?, ?, ?)',
                [user_id, reservation_date, number_of_people]
            );
            res.status(201).json({ message: 'Reservation created' });
        } catch (error) {
            console.error('Error creating reservation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
