const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    // check for existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already registered' });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // create & save
    user = new User({ name, email, password: hash });
    await user.save();
    // sign jwt
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // basic validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    // sign jwt
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
