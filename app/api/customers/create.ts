// app/api/customers/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    // Only admins or service staff can create customer accounts
    if (!session || !['admin', 'service'].includes(session.user.role)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { username, password, role } = req.body as { username: string; password: string; role: string };

        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        try {
            const [result]: any = await pool.query(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, role]
            );
            res.status(201).json({ user_id: result.insertId });
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(409).json({ error: 'Username already exists' });
            } else {
                console.error('Error creating customer:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
