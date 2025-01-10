// app/api/orders/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { getSession } from 'next-auth/react';

interface OrderItem {
    product_id: number;
    quantity: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session || (session.user.role !== 'service' && session.user.role !== 'admin')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        const { user_id, staff_id, items } = req.body as { user_id: number; staff_id: number; items: OrderItem[] };

        if (!user_id || !staff_id || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Missing fields or invalid items' });
        }

        try {
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                const [orderResult]: any = await connection.query(
                    'INSERT INTO orders (user_id, staff_id, total) VALUES (?, ?, ?)',
                    [user_id, staff_id, 0] // Initial total is 0
                );
                const orderId = orderResult.insertId;

                let total = 0;
                for (const item of items) {
                    const { product_id, quantity } = item;
                    const [productRows]: any = await connection.query(
                        'SELECT price FROM products WHERE id = ?',
                        [product_id]
                    );
                    if (productRows.length === 0) {
                        throw new Error(`Product with id ${product_id} not found`);
                    }
                    const price = productRows[0].price;
                    total += price * quantity;

                    await connection.query(
                        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
                        [orderId, product_id, quantity]
                    );
                }

                await connection.query(
                    'UPDATE orders SET total = ? WHERE id = ?',
                    [total, orderId]
                );

                // Update user points
                await connection.query(
                    'UPDATE users SET points = points + FLOOR(?) WHERE id = ?',
                    [total / 10, user_id] // Example: 1 point per $10 spent
                );

                await connection.commit();
                res.status(201).json({ id: orderId, total });
            } catch (error: any) {
                await connection.rollback();
                console.error('Transaction error:', error);
                res.status(500).json({ error: 'Transaction Failed' });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Database connection error:', error);
            res.status(500).json({ error: 'Database Connection Failed' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
