// types/user.ts

export type UserRole = 'admin' | 'service' | 'kitchen' | 'bar' | 'customer';

export interface User {
    id: number;
    name: string;
    role: UserRole;
    points: number;
}
