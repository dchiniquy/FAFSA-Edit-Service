const request = require('supertest');
const createApp = require('../../src/app');

const app = createApp();

describe('GET /health', () => {
  it('returns 200 with an ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('unknown routes', () => {
  it('returns 404', async () => {
    const response = await request(app).get('/not-a-real-route');
    expect(response.status).toBe(404);
  });
});
