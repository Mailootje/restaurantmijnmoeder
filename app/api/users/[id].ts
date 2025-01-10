// app/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { getSession } from 'next-auth/react';

interface User {
    id: number;
    points: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const session = await getSession({ req });

    if (!session || session.user.id !== Number(id) && session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const [rows]: any = await pool.query(
                'SELECT id, points FROM users WHERE id = ?',
                [id]
            );
            if (rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(rows[0]);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
