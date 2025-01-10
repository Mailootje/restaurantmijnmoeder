// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import pool from '../../../../lib/db'; // Adjust the path as necessary
import bcrypt from 'bcryptjs';
import { UserRole } from '@/types/user'; // Adjust the path as necessary
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) { // Updated to include 'req'
                if (!credentials) return null;
                const [rows] = await pool.execute(
                    'SELECT * FROM users WHERE username = ?',
                    [credentials.username]
                );
                const user = (rows as any[])[0];
                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    // Convert id to string and include points
                    return {
                        id: String(user.id),
                        name: user.username,
                        role: user.role as UserRole,
                        points: user.points || 0 // Ensure points is included
                    };
                }
                return null;
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: { id: string; name: string; role: UserRole; points: number } }): Promise<JWT> {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.points = user.points; // Optionally include points in the JWT
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
                // Optionally include points
                (session as any).user.points = token.points as number;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
