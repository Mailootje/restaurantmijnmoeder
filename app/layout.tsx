// app/layout.tsx
'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import NavBar from '../components/NavBar';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SessionProvider>
            <NavBar />
            {children}
        </SessionProvider>
        </body>
        </html>
    );
}
