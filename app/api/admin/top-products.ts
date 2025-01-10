// app/api/admin/top-products.ts
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
                `SELECT p.id, p.name, COUNT(oi.product_id) as total_ordered
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 GROUP BY p.id, p.name
                 ORDER BY total_ordered DESC
                 LIMIT 10`
            );
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching top products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
