// app/service/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface OrderItem {
    product_id: number;
    quantity: number;
}

interface Order {
    id: number;
    user_id: number;
    staff_id: number;
    status: string;
    total: number;
    created_at: string;
}

const ServicePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user.role !== 'service') {
            router.push('/');
        } else {
            fetchOrders();
            fetchProducts();
        }
    }, [session, status]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleCreateOrder = async () => {
        // Implement order creation logic
        // For simplicity, create a dummy order
        const newOrder = {
            user_id: 1, // Replace with actual user_id
            staff_id: session?.user.id,
            items: [{ product_id: 1, quantity: 2 }], // Replace with actual items
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });
            if (res.ok) {
                const data = await res.json();
                setOrders([...orders, { ...newOrder, id: data.id, status: 'pending', total: data.total, created_at: new Date().toISOString() }]);
            }
        } catch (error) {
            console.error('Failed to create order:', error);
        }
    };

    const handleCreateCustomer = async () => {
        try {
            const res = await fetch('/api/customers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });
            if (res.ok) {
                alert('Customer account created');
                setUsername('');
                setPassword('');
                setRole('customer');
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Failed to create customer:', error);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Service Staff Dashboard</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Create Order</h2>
                <button onClick={handleCreateOrder}>Create Dummy Order</button>
                {/* Implement a form to create orders manually */}
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Current Orders</h2>
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            Order #{order.id} - Status: {order.status} - Total: ${order.total.toFixed(2)}
                            {/* Actions: Create Receipt, Settle */}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Create Customer Account</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateCustomer(); }}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="customer">Customer</option>
                        {/* Add other roles if needed */}
                    </select>
                    <button type="submit">Create Account</button>
                </form>
            </section>
        </div>
    );
};

export default ServicePage;
