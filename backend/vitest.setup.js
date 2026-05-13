import { vi } from 'vitest';

// Globalne zmienne środowiskowe
process.env.GROQ_API_KEY = 'mock_key';
process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

// GLOBALNY MOCK DLA GROQ (Zasada: Abstraction Layer)
vi.mock('groq-sdk', () => {
    const MockCreate = vi.fn().mockResolvedValue({
        choices: [{
            message: {
                content: JSON.stringify({
                    waypoints: [{ name: 'Global Mock Point', location: { lat: 1, lng: 1 }, description: 'Test' }]
                })
            }
        }]
    });

    class MockGroq {
        constructor() {
            this.chat = { completions: { create: MockCreate } };
        }
    }

    // Eksportujemy tak, żeby obsłużyć require() i import
    return {
        default: MockGroq,
        Groq: MockGroq
    };
});