const db = require('./tests/setup');

beforeAll(async ()  => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async ()  => await db.closeDatabase());
