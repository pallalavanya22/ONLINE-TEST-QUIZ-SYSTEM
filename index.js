const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Online Quiz API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/analytics', analyticsRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online_quiz';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });


