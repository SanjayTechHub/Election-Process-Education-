const request = require('supertest');
const app = require('../server');

describe('Election Assistant API Tests', () => {
  test('Health endpoint returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('Chat endpoint returns 400 if message missing', async () => {
    const res = await request(app).post('/api/chat').send({ role: 'voter' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('Google search endpoint returns array (mocked if no keys)', async () => {
    const res = await request(app).get('/api/search?q=election');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});