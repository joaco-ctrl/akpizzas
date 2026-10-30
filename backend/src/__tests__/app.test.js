jest.mock('../config/database', () => ({ query: jest.fn() }));

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-express-app';

const request = require('supertest');
const database = require('../config/database');
const app = require('../app');

describe('Express app', () => {
    beforeEach(() => database.query.mockReset());

    test('health informa disponibilidad de la base de datos', async () => {
        database.query.mockImplementation((sql, callback) => callback(null, [{ 1: 1 }]));
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });

    test('responde 404 JSON para rutas inexistentes', async () => {
        const response = await request(app).get('/ruta-inexistente');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Ruta no encontrada' });
    });
});
