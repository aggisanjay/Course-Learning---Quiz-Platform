const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  selectedOption: {
    type: Number,
    required: true
  },
  correctOption: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  incorrectAnswers: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    default: false
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  answers: [quizAnswerSchema],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

quizResultSchema.index({ userId: 1, courseId: 1, completedAt: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
