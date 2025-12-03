const express = require('express');
const Quiz = require('../models/Quiz');
const Response = require('../models/Response');
const auth = require('../middleware/auth');
const { shuffleArray } = require('../utils/shuffle');
const { autoGrade } = require('../utils/autoGrade');

const router = express.Router();

// Create quiz (instructor)
router.post('/', auth(['instructor', 'admin']), async (req, res) => {
  try {
    const quiz = await Quiz.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List quizzes (public)
router.get('/', auth(), async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title description durationSeconds course');
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz to take - questions shuffled
router.get('/:id/take', auth('student'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const shuffledQuestions = shuffleArray(
      quiz.questions.map((q, index) => ({
        index,
        text: q.text,
        options: q.options,
        difficulty: q.difficulty,
        marks: q.marks
      }))
    );
    res.json({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      durationSeconds: quiz.durationSeconds,
      questions: shuffledQuestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz (auto-grade + store response)
router.post('/:id/submit', auth('student'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const { answers, startedAt } = req.body;
    const grading = autoGrade(quiz, answers || []);
    const finishedAt = new Date();

    const response = await Response.create({
      quiz: quiz._id,
      student: req.user.id,
      answers: grading.answers,
      score: grading.score,
      maxScore: grading.maxScore,
      percentage: grading.percentage,
      startedAt: startedAt ? new Date(startedAt) : null,
      finishedAt
    });

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


