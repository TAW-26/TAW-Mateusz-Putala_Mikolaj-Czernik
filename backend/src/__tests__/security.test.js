import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import User from '../models/User';
import Trip from '../models/Trip';
import jwt from 'jsonwebtoken';

describe('Security & Authorization - Access Control', () => {
    let mongoServer;
    let userA, userB;
    let tokenB;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Trip.deleteMany({});

        // ARRANGE: Tworzymy dwóch użytkowników
        userA = await User.create({
            username: 'UserA', email: 'a@v.pl', password: 'password123'
        });
        userB = await User.create({
            username: 'UserB', email: 'b@v.pl', password: 'password123'
        });

        // Generujemy token dla Użytkownika B (agresora)
        tokenB = jwt.sign({ id: userB._id }, process.env.JWT_SECRET || 'test_secret');
    });

    it('should NOT allow User B to delete User A\'s trip (Forbidden Access)', async () => {
        // ARRANGE: User A tworzy wycieczkę
        const tripA = await Trip.create({
            title: 'Sekretna wyprawa A',
            origin: { address: 'Kraków', lat: 50, lng: 19 },
            destination: { address: 'Warszawa', lat: 52, lng: 21 },
            user: userA._id // Właścicielem jest A
        });

        // ACT: User B próbuje usunąć wycieczkę Usera A
        const response = await request(app)
            .delete(`/api/trips/${tripA._id}`)
            .set('Authorization', `Bearer ${tokenB}`); // Token agresora

        // ASSERT: Oczekujemy błędu autoryzacji
        // Zależnie od Twojej implementacji to może być 401 lub 404 (ukrywanie istnienia zasobu)
        expect(response.status).toBeGreaterThanOrEqual(400);

        // Sprawdzamy, czy wycieczka nadal jest w bazie
        const tripStillExists = await Trip.findById(tripA._id);
        expect(tripStillExists).not.toBeNull();
    });
});