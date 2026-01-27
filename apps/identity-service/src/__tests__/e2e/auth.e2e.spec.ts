import request from 'supertest';
import { createApp } from '../../app';
import { clearDatabase } from '../helpers/clear-db';

describe('Auth E2E', () => {
  const app = createApp();

  beforeEach(async () => {
    await clearDatabase();
  });

  it('should register, login and access /auth/me', async () => {
    // 1️⃣ Register
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        email: 'e2e@test.com',
        password: '12345678',
        role: 'ADMIN',
      });
    expect(registerResponse.status).toBe(201);

    // 2️⃣ Login
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'e2e@test.com',
        password: '12345678',
      });
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.accessToken).toBeDefined();

    const token = loginResponse.body.data.accessToken;

    // 3️⃣ /me
    const meResponse = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(meResponse.status).toBe(200);
  });
});
