import { describe, it, expect, vi } from 'vitest';
import aiService from '../services/aiService';

describe('AI Service - Dependency Injection Test', () => {
    it('should generate waypoints using an injected mock client', async () => {
        // --- ARRANGE (Przygotuj) ---

        // Tworzymy udawanego klienta AI (Mock)
        const mockGroqClient = {
            chat: {
                completions: {
                    create: vi.fn().mockResolvedValue({
                        choices: [{
                            message: {
                                content: JSON.stringify({
                                    waypoints: [{
                                        name: 'Injected Point',
                                        location: { lat: 50, lng: 20 },
                                        description: 'Test'
                                    }]
                                })
                            }
                        }]
                    })
                }
            }
        };

        // WSTRZYKUJEMY mocka do serwisu
        aiService.setClient(mockGroqClient);

        const mockTrip = { origin: { address: 'A' }, destination: { address: 'B' }, aiSettings: {} };
        const mockUser = { preferences: { interests: [] } };

        // --- ACT (Działaj) ---
        const result = await aiService.generateWaypoints(mockTrip, mockUser);

        // --- ASSERT (Sprawdź) ---
        expect(result[0].name).toBe('Injected Point');
        // Sprawdzamy, czy nasz udawany klient został wywołany
        expect(mockGroqClient.chat.completions.create).toHaveBeenCalled();
    });
});