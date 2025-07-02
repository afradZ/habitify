require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

// middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// parse JSON bodies
app.use(express.json());

// mount auth routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// simple test
app.get('/', (req, res) => {
  res.send('Habitify API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// after creating app, before any routes:
app.set('json spaces', 2);

app.use(express.json());
// … mount routers, etc.

const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

 app.get('/', (req, res) => res.send('Habitify API running'));

 const habitsRouter = require('./routes/habits');
 app.use('/api/habits', habitsRouter);
