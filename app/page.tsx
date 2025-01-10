// app/page.tsx
"use client"
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  return (
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to Our Restaurant</h1>
        {session ? (
            <>
              <p>Signed in as {session.user.name} ({session.user.role})</p>
              <button onClick={() => signOut()}>Sign out</button>
              <div style={{ marginTop: '1rem' }}>session
                <Link href="/user">Go to User Dashboard</Link>
                <br />
                <Link href="/admin">Go to Admin Dashboard</Link>
                <br />
                <Link href="/service">Go to Service Staff Dashboard</Link>
                <br />
                <Link href="/kitchen">Go to Kitchen Dashboard</Link>
                <br />
                <Link href="/bar">Go to Bar Dashboard</Link>
              </div>
            </>
        ) : (
            <>
              <p>You are not signed in.</p>
              <button onClick={() => signIn()}>Sign in</button>
            </>
        )}
      </div>
  );
}
