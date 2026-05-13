import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User'; // upewnij się, że ścieżka jest OK

describe('User Model - Hashing Logic (SRP)', () => {
    let mongoServer;

    // Przygotowanie środowiska (Arrange)
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should encrypt password when a new user is created', async () => {
        // --- ARRANGE (Przygotuj) ---
        const plainPassword = 'TajneHaslo123!';
        const userData = {
            username: 'TestowyUser',
            email: 'test@voyager.pl',
            password: plainPassword
        };

        // --- ACT (Działaj) ---
        const user = new User(userData);
        await user.save(); // Tu odpala się Twój middleware .pre('save')

        // --- ASSERT (Sprawdź / Asercja) ---
        // Hasło nie może być takie samo jak surowy tekst
        expect(user.password).not.toBe(plainPassword);

        // Sprawdzamy, czy hasło wygląda na zahashowane (bcrypt zazwyczaj daje 60 znaków)
        expect(user.password.length).toBeGreaterThan(20);

        // Sprawdzamy metodę matchPassword, którą masz w modelu
        const isMatch = await user.matchPassword(plainPassword);
        expect(isMatch).toBe(true);
    });
});