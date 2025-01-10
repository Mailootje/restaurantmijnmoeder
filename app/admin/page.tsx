// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Visit {
    visit_date: string;
    count: number;
}

interface Product {
    id: number;
    name: string;
    total_ordered: number;
}

interface Prediction {
    prediction_date: string;
    predicted_visitors: number;
}

const AdminPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [visits, setVisits] = useState<Visit[]>([]);
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user.role !== 'admin') {
            router.push('/');
        } else {
            fetchData();
        }
    }, [session, status]);

    const fetchData = async () => {
        try {
            const visitsRes = await fetch('/api/admin/visits');
            const visitsData = await visitsRes.json();
            setVisits(visitsData);

            const productsRes = await fetch('/api/admin/top-products');
            const productsData = await productsRes.json();
            setTopProducts(productsData);

            const predictionsRes = await fetch('/api/admin/predictions');
            const predictionsData = await predictionsRes.json();
            setPredictions(predictionsData);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Administrator Dashboard</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Daily Visits</h2>
                <ul>
                    {visits.map((visit) => (
                        <li key={visit.visit_date}>
                            {visit.visit_date}: {visit.count} visitors
                        </li>
                    ))}
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Top Products</h2>
                <ul>
                    {topProducts.map((product) => (
                        <li key={product.id}>
                            {product.name}: {product.total_ordered} orders
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Crowd Level Predictions</h2>
                <ul>
                    {predictions.map((prediction) => (
                        <li key={prediction.prediction_date}>
                            {prediction.prediction_date}: {prediction.predicted_visitors} predicted visitors
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminPage;
