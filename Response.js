const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [
      {
        questionIndex: Number,
        selectedIndex: Number,
        correct: Boolean,
        marksAwarded: Number
      }
    ],
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    startedAt: Date,
    finishedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Response', responseSchema);


