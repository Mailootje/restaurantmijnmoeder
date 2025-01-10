// app/api/admin/predictions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query(
                'SELECT prediction_date, predicted_visitors FROM predictions ORDER BY prediction_date DESC'
            );
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching predictions:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
