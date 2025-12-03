const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  difficulty: { type: Number, default: 1 }, // 1-easy,2-medium,3-hard
  marks: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    durationSeconds: { type: Number, required: true },
    course: String,
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);


