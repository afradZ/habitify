// backend/src/index.js

require('dotenv').config();
const express          = require('express');
const cors             = require('cors');
const connectDB        = require('./config/db');

// Routers
const authRouter       = require('./routes/auth');
const tasksRouter      = require('./routes/tasks');
const habitsRouter     = require('./routes/habits');
const analyticsRouter  = require('./routes/analytics');

const app = express();
connectDB();

// CORS & body parsing
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mount API routes
app.use('/api/auth',      authRouter);
app.use('/api/tasks',     tasksRouter);
app.use('/api/habits',    habitsRouter);
app.use('/api/analytics', analyticsRouter);

// Health check
app.get('/', (req, res) => res.send('Habitify API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

