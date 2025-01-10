// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route'; // Adjust the path as necessary
import pool from '../../../../lib/db'; // Adjust the path as necessary
import bcrypt from 'bcryptjs';
import { UserRole } from '../../../../types/user'; // Adjust the path as necessary

interface SignupRequestBody {
    username: string;
    password: string;
    role: string;
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        console.log('Session:', session); // Debugging statement

        // Only admins or service staff can create customer accounts via sign-up page
        if (!session || !['admin', 'service'].includes(session.user.role)) {
            console.log('Unauthorized attempt to sign up');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: SignupRequestBody = await request.json();
        const { username, password, role } = body;

        console.log('Received sign-up data:', { username, role }); // Debugging statement

        if (!username || !password || !role) {
            console.log('Missing fields in sign-up data');
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Validate role
        const validRoles: UserRole[] = ['admin', 'service', 'kitchen', 'bar', 'customer'];
        if (!validRoles.includes(role as UserRole)) {
            console.log('Invalid role provided:', role);
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        try {
            const [result]: any = await pool.query(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, role]
            );
            console.log('User created with ID:', result.insertId);
            return NextResponse.json({ user_id: result.insertId }, { status: 201 });
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log('Duplicate username:', username);
                return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
            } else {
                console.error('Error creating customer:', error);
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
            }
        }
    } catch (error: any) {
        console.error('Unexpected error in sign-up route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Optionally, handle other HTTP methods if needed
export async function GET(request: Request) {
    return NextResponse.json({ message: 'Method GET Not Allowed' }, { status: 405 });
}
