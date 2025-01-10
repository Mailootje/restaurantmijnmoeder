// types/index.d.ts

import NextAuth from 'next-auth';
import { UserRole } from './user'; // Adjust the path as necessary

declare module 'next-auth' {
    interface Session {
        user: {
            id: string; // Changed from number to string
            name: string;
            role: UserRole;
            points: number; // Added points
        };
    }

    interface User {
        id: string; // Changed from number to string
        name: string;
        role: UserRole;
        points: number;
    }
}

declare namespace NodeJS {
    interface ProcessEnv {
        DB_HOST: string;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_NAME: string;
        NEXTAUTH_SECRET: string;
        NEXTAUTH_URL: string;
        // Add other environment variables here if needed
    }
}
