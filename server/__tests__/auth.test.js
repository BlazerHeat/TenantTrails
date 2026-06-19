import { describe, it, expect, beforeAll } from 'vitest';

const BASE = 'http://localhost:5000/api';
const TEST_USER = {
  name: 'Test User',
  email: `testuser_${Date.now()}@example.com`,
  password: 'testpass123',
};

describe('Auth API', () => {
  let token;

  it('should sign up a new user and return a JWT', async () => {
    const res = await fetch(`${BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER),
    });

    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe(TEST_USER.email);
    token = body.token;
  });

  it('should login with the same credentials and return a JWT', async () => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password }),
    });

    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe(TEST_USER.email);
  });
});

describe('Protected Routes', () => {
  it('should return 401 when accessing /apartments without a token', async () => {
    const res = await fetch(`${BASE}/apartments`);
    expect(res.status).toBe(401);
  });
});
