export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    preferences?: {
        interests: string[];
        travelStyle: {
            avoidPaidAttractions: boolean;
            onlyHiddenGems: boolean;
            kidFriendly: boolean;
            disabilityAccess: boolean;
            preferWalking: boolean;
        };
        personalNotes: string;
    };
}

export interface Waypoint {
    _id: string;
    name: string;
    location?: { lat: number; lng: number };
    description?: string;
    order_index: number;
    visited: boolean;
}

export interface Trip {
    _id: string;
    title: string;
    origin: { address: string; lat?: number; lng?: number };
    destination: { address: string; lat?: number; lng?: number };
    startDate?: string;
    endDate?: string;
    budget: number;
    status: 'planowana' | 'w trakcie' | 'zakończona';
    aiSettings: {
        intensity: number;
        extraTimeTolerance: number;
        numberOfPoints: number;
    };
    waypoints?: Waypoint[]; // Virtual populate z backendu
}