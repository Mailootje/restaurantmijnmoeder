// app/api/receipts/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session || (session.user.role !== 'service' && session.user.role !== 'admin')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { order_id } = req.body as { order_id: number };

        if (!order_id) {
            return res.status(400).json({ error: 'Missing order_id' });
        }

        try {
            const [result]: any = await pool.query(
                'INSERT INTO receipts (order_id) VALUES (?)',
                [order_id]
            );
            res.status(201).json({ receipt_id: result.insertId });
        } catch (error) {
            console.error('Error creating receipt:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
