// app/auth/signin/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (res?.error) {
            setError('Invalid username or password');
        } else {
            router.push('/');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Sign In</h2>
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
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Sign In</button>
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
        backgroundColor: '#0070f3',
        color: '#fff',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '1rem',
    },
};

export default SignInPage;
