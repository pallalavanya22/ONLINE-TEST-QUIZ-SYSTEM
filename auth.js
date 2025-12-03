const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const apiLimiter = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', apiLimiter, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      // If email already exists, treat this as a soft success so the client UX is smooth.
      // We do NOT create a new user; we simply return the existing one.
      return res.status(200).json({
        id: existing._id,
        name: existing.name,
        email: existing.email,
        role: existing.role,
        alreadyRegistered: true
      });
    }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', apiLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user._id, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '6h' });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


