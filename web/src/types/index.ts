// src/types/index.ts

export interface Trip {
    _id?: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: number;
    activities: string[];
    aiSuggestions?: string;
}

export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthResponse {
    token: string;
    user: User;
}