// components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const NavBar = () => {
    const { data: session } = useSession();

    return (
        <nav style={styles.nav}>
            <ul style={styles.ul}>
                <li style={styles.li}>
                    <Link href="/">Home</Link>
                </li>
                {session ? (
                    <>
                        {session.user.role === 'admin' && (
                            <li style={styles.li}>
                                <Link href="/admin">Admin Dashboard</Link>
                            </li>
                        )}
                        {session.user.role === 'service' && (
                            <li style={styles.li}>
                                <Link href="/service">Service Staff Dashboard</Link>
                            </li>
                        )}
                        {session.user.role === 'kitchen' && (
                            <li style={styles.li}>
                                <Link href="/kitchen">Kitchen Dashboard</Link>
                            </li>
                        )}
                        {session.user.role === 'bar' && (
                            <li style={styles.li}>
                                <Link href="/bar">Bar Dashboard</Link>
                            </li>
                        )}
                        {session.user.role === 'customer' && (
                            <li style={styles.li}>
                                <Link href="/user">User Dashboard</Link>
                            </li>
                        )}
                        <li style={styles.li}>
                            <button onClick={() => signOut()} style={styles.button}>Sign Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li style={styles.li}>
                            <Link href="/auth/signin">Sign In</Link>
                        </li>
                        <li style={styles.li}>
                            <Link href="/auth/signup">Sign Up</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        padding: '1rem',
        backgroundColor: '#333',
    },
    ul: {
        display: 'flex',
        listStyle: 'none',
        gap: '1rem',
        margin: 0,
        padding: 0,
    },
    li: {
        color: '#fff',
    },
    button: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#0070f3',
        color: '#fff',
        cursor: 'pointer',
    },
};

export default NavBar;
