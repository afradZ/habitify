const request = require('supertest');
const app     = require('../src/index'); 
describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@test.com', password: 'secret123' })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@test.com' });
  });

  it('should login with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'bob@test.com', password: 'passw0rd' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@test.com', password: 'passw0rd' })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('bob@test.com');
  });

  it('should reject invalid login', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Eve', email: 'eve@test.com', password: 'hushhush' });

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'eve@test.com', password: 'wrong' })
      .expect(400);
  });
});
