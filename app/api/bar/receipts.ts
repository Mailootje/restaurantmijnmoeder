// app/api/bar/receipts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { getSession } from 'next-auth/react';

interface Receipt {
    id: number;
    status: string;
    time_taken: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session || session.user.role !== 'bar') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query(
                `SELECT r.id, r.status, TIMESTAMPDIFF(MINUTE, o.created_at, NOW()) as time_taken
                 FROM receipts r
                 JOIN orders o ON r.order_id = o.id
                 WHERE r.status IN ('pending', 'in_progress', 'completed')`
            );
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching bar receipts:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
