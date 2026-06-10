import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import User from '../models/User';

describe('Auth API - Integration Tests', () => {
    let mongoServer;

    beforeAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        await mongoose.connect('mongodb://localhost:27017/smart-voyager-auth-test');
    }, 30000);

    afterAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.db.dropDatabase();
            await mongoose.disconnect();
        }
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should login successfully and return a JWT token', async () => {
        const password = 'SecretPassword123';
        const user = new User({
            username: 'LoginTester',
            email: 'login@voyager.pl',
            password: password
        });
        await user.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@voyager.pl',
                password: password
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});