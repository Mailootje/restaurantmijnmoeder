// app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'customer' | 'admin' | 'service' | 'kitchen' | 'bar'>('customer');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Account created successfully! You can now sign in.');
                setUsername('');
                setPassword('');
                setRole('customer');
                // Optionally redirect to sign-in page
                // router.push('/auth/signin');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            console.error('Error signing up:', err);
            setError('Something went wrong');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        required
                        style={styles.input}
                    >
                        <option value="customer">Customer</option>
                        <option value="service">Service Staff</option>
                        <option value="kitchen">Kitchen Staff</option>
                        <option value="bar">Bar Staff</option>
                        {/* Add other roles as needed */}
                    </select>
                </div>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}
                <button type="submit" style={styles.button}>Sign Up</button>
            </form>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '400px',
        margin: '5rem auto',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '0.75rem',
        fontSize: '1rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#28a745',
        color: '#fff',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '1rem',
    },
    success: {
        color: 'green',
        marginBottom: '1rem',
    },
};

export default SignUpPage;
