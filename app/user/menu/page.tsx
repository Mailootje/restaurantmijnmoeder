// app/user/menu/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
}

const MenuPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [menu, setMenu] = useState<Product[]>([]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user.role !== 'customer') {
            router.push('/');
        } else {
            fetchMenu();
        }
    }, [session, status]);

    const fetchMenu = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) {
                throw new Error('Failed to fetch menu');
            }
            const data: Product[] = await res.json();
            setMenu(data);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session || session.user.role !== 'customer') {
        return null; // Or a loading indicator while redirecting
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Menu</h2>
            <ul>
                {menu.map(item => (
                    <li key={item.id}>
                        {item.name} - ${item.price.toFixed(2)}
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '2rem' }}>
                <h3>Download Menu</h3>
                <a href="/api/menu/download" download>
                    <button>Download Menu PDF</button>
                </a>
                <div style={{ marginTop: '1rem' }}>
                    <QRCodeSVG value="http://yourdomain.com/user/menu" />
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
