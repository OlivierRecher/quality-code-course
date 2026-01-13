import request from 'supertest';
import { app } from './app';

describe('Tests end-to-end', () => {
    it('should create a user', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'John Doe', email: 'john@example.com' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('john@example.com');
    });

    it('should retrieve a created user', async () => {
        const createResponse = await request(app)
            .post('/users')
            .send({ name: 'Jane Doe', email: 'jane@example.com' });

        const userId = createResponse.body.id;

        const getResponse = await request(app)
            .get(`/users/${userId}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.id).toBe(userId);
        expect(getResponse.body.name).toBe('Jane Doe');
    });

    it('should create a circle', async () => {
        const response = await request(app)
            .post('/circles')
            .send({ name: 'My Circle' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('My Circle');
    });

    it('should allow a user to join a circle', async () => {
        const userRes = await request(app)
            .post('/users')
            .send({ name: 'Alice', email: 'alice@example.com' });
        const userId = userRes.body.id;

        const circleRes = await request(app)
            .post('/circles')
            .send({ name: 'Readers Club' });
        const circleId = circleRes.body.id;

        const joinRes = await request(app)
            .put(`/circles/${circleId}/users/${userId}`)
            .send();

        expect(joinRes.status).toBe(204);
    });
});
