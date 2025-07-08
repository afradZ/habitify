const request = require('supertest');
const app     = require('../src/index');         
const User    = require('../src/models/User');
const Task    = require('../src/models/Task');
const jwt     = require('jsonwebtoken');

describe('Tasks API', () => {
  let token, userId;

  beforeEach(async () => {
    // create a fresh user and token before each test
    const u = new User({ name: 'Tester', email: 't@test.com', password: 'secret' });
    await u.save();
    userId = u._id.toString();
    token  = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('rejects list without token', async () => {
    await request(app).get('/api/tasks').expect(401);
  });

  it('creates a task and returns it', async () => {
    const payload = {
      title:       'Hello',
      description: 'desc',
      dueDate:     new Date().toISOString(),
      recurrence:  'none'
    };
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(201);

    expect(res.body).toMatchObject({
      title:       'Hello',
      description: 'desc',
      recurrence:  'none',
      completed:   false,
      owner:       userId
    });
  });

  it('lists tasks for that user', async () => {
    // create two tasks
    for (let i = 1; i <= 2; i++) {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title:       `Task ${i}`,
          description: '',
          dueDate:     new Date().toISOString(),
          recurrence:  'none'
        });
        expect(201);
    }

    const list = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body).toHaveLength(2);
    expect(list.body[0]).toHaveProperty('title', 'Task 1');
  });

  it('updates a task\'s completed flag', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title:       'Updatable',
        description: '',
        dueDate:     new Date().toISOString(),
        recurrence:  'none'
      });

    const id = create.body._id;
    const updated = await request(app)
      .put(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true })
      .expect(200);

    expect(updated.body.completed).toBe(true);
  });

  it('deletes a task', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title:       'To Delete',
        description: '',
        dueDate:     new Date().toISOString(),
        recurrence:  'none'
      });

    const id = create.body._id;
    await request(app)
      .delete(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // verify it is gone
    const list = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(list.body.find(t => t._id === id)).toBeUndefined();
  });
});
