require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Habitify API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// This code initializes an Express server, connects to a MongoDB database using Mongoose, and sets up a basic route that responds with a message when accessed. The server listens on a specified port, defaulting to 5000 if not provided in the environment variables.