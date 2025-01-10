// app/api/kitchen/receipts/start.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session || session.user.role !== 'kitchen') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { receipt_id } = req.body as { receipt_id: number };

        if (!receipt_id) {
            return res.status(400).json({ error: 'Missing receipt_id' });
        }

        try {
            await pool.query(
                'UPDATE receipts SET status = ? WHERE id = ? AND status = ?',
                ['in_progress', receipt_id, 'pending']
            );
            res.status(200).json({ message: 'Receipt started' });
        } catch (error) {
            console.error('Error starting receipt:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
