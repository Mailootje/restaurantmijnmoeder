// app/api/menu/download.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import PDFDocument from 'pdfkit';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    // Allow access to menu download for authenticated customers
    if (!session || session.user.role !== 'customer') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const [products]: any = await pool.query('SELECT * FROM products ORDER BY created_at DESC');

            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=menu.pdf');

            doc.pipe(res);

            doc.fontSize(20).text('Restaurant Menu', { align: 'center' });
            doc.moveDown();

            products.forEach((product: any) => {
                doc.fontSize(14).text(`${product.name} - $${product.price.toFixed(2)}`);
            });

            doc.end();
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
