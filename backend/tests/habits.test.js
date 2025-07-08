const request = require('supertest');
const app     = require('../src/index');
const User    = require('../src/models/User');
const Habit   = require('../src/models/Habit');
const jwt     = require('jsonwebtoken');

describe('Habits API', () => {
  let token, userId;

  beforeEach(async () => {
    const user = new User({ name: 'HabitTester', email: 'h@test.com', password: 'secret' });
    await user.save();
    userId = user._id.toString();
    token  = jwt.sign({ id: userId }, process.env.JWT_SECRET);
  });

  it('rejects creating a habit without auth', async () => {
    await request(app).post('/api/habits').send({ name: 'Read', frequency: 'daily' }).expect(401);
  });

  it('creates, lists, and check-ins a habit', async () => {
    // create
    const create = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Read', frequency: 'daily' })
      .expect(201);

    expect(create.body).toMatchObject({ name: 'Read', frequency: 'daily', owner: userId });

    const habitId = create.body._id;

    // fetch all
    const list = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body[0]._id).toBe(habitId);

    // check in
    const checkin = await request(app)
      .post(`/api/habits/${habitId}/checkin`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(checkin.body.checkIns).toHaveLength(1);
  });
});
