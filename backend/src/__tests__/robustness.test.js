import { describe, it, expect, vi } from 'vitest';
import aiService from '../services/aiService';

describe('AI Service - Robustness & Data Integrity', () => {

    it('should handle AI response with coordinates as strings (Auto-correction)', async () => {
        // --- ARRANGE ---
        // AI "pomyliło się" i wysłało liczby w cudzysłowie
        const dirtyMockClient = {
            chat: {
                completions: {
                    create: vi.fn().mockResolvedValue({
                        choices: [{
                            message: {
                                content: JSON.stringify({
                                    waypoints: [{
                                        name: 'Zamek',
                                        location: { lat: "50.123", lng: "19.456" }, // STRINGS!
                                        description: 'Test'
                                    }]
                                })
                            }
                        }]
                    })
                }
            }
        };
        aiService.setClient(dirtyMockClient);

        // --- ACT ---
        const result = await aiService.generateWaypoints({ origin:{}, destination:{}, aiSettings:{} }, { preferences:{} });

        // --- ASSERT ---
        // Sprawdzamy, czy Twoja logika sparsowała to na Number (kluczowe dla MongoDB i Map!)
        expect(typeof result[0].location.lat).toBe('number');
        expect(result[0].location.lat).toBe(50.123);
    });

    it('should throw a clear error when AI returns malformed JSON', async () => {
        // --- ARRANGE ---
        // AI wysłało tekst zamiast poprawnego JSONa
        const brokenMockClient = {
            chat: {
                completions: {
                    create: vi.fn().mockResolvedValue({
                        choices: [{
                            message: { content: "I'm sorry, I cannot fulfill this request." }
                        }]
                    })
                }
            }
        };
        aiService.setClient(brokenMockClient);

        // --- ACT & ASSERT ---
        // Sprawdzamy, czy serwis rzuca błędem, a nie "wywala" całego serwera (Crash)
        await expect(aiService.generateWaypoints({ origin:{}, destination:{}, aiSettings:{} }, { preferences:{} }))
            .rejects.toThrow();
    });
});