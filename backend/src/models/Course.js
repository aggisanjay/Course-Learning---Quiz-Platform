const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    default: '15 mins'
  },
  content: {
    type: String,
    required: true
  }
});

const quizQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [val => val.length === 4, 'Must provide exactly 4 options']
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Course Assessment Quiz'
  },
  instructions: {
    type: String,
    default: 'Test your understanding of the concepts covered in this course. You can retry the quiz anytime.'
  },
  timeLimitMinutes: {
    type: Number,
    default: 10
  },
  passingScore: {
    type: Number,
    default: 70
  },
  questions: [quizQuestionSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Full-Stack', 'Database', 'AI & Data', 'DevOps']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  estimatedDuration: {
    type: String,
    required: true
  },
  lessons: [lessonSchema],
  quiz: quizSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for search and category filtering
courseSchema.index({ title: 'text', description: 'text', category: 'text' });
courseSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Course', courseSchema);
