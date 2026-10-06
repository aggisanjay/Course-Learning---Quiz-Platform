const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const quizRoutes = require('./routes/quizRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB & auto-seed if needed
const Course = require('./models/Course');
const User = require('./models/User');
const Progress = require('./models/Progress');
const QuizResult = require('./models/QuizResult');
const { coursesData } = require('./seeds/seedData');

const initServer = async () => {
  await connectDB();
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      console.log('[LearnFlow] Empty database detected. Auto-seeding courses & demo data...');
      let demoUser = await User.findOne({ email: 'demo@learnflow.com' });
      if (!demoUser) {
        demoUser = await User.create({
          name: 'Alex Johnson',
          email: 'demo@learnflow.com',
          password: 'Demo@12345'
        });
      }
      const created = await Course.insertMany(coursesData);
      console.log(`[LearnFlow] Auto-seeded ${created.length} courses!`);

      const reactCourse = created[0];
      const completedIds = [reactCourse.lessons[0]._id, reactCourse.lessons[1]._id, reactCourse.lessons[2]._id];
      await Progress.create({
        userId: demoUser._id,
        courseId: reactCourse._id,
        completedLessons: completedIds,
        completed: false,
        progressPercentage: Math.round((completedIds.length / reactCourse.lessons.length) * 100),
        updatedAt: new Date()
      });

      await QuizResult.create({
        userId: demoUser._id,
        courseId: reactCourse._id,
        score: 5,
        totalQuestions: 6,
        correctAnswers: 5,
        incorrectAnswers: 1,
        percentage: 83,
        passed: true,
        timeSpentSeconds: 240,
        answers: reactCourse.quiz.questions.map((q, idx) => ({
          questionIndex: idx,
          questionText: q.questionText,
          selectedOption: idx === 1 ? (q.correctAnswerIndex === 0 ? 1 : 0) : q.correctAnswerIndex,
          correctOption: q.correctAnswerIndex,
          isCorrect: idx !== 1,
          explanation: q.explanation
        })),
        completedAt: new Date(Date.now() - 7200000)
      });
    }
  } catch (err) {
    console.error('[LearnFlow] Auto-seed note:', err.message);
  }
};

initServer();

// CORS configuration - allow all origins dynamically to support Vercel preview & production URLs
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

// Handle preflight OPTIONS requests
app.options('*', cors());

// Body parser
app.use(express.json());

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LearnFlow REST API'
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[LearnFlow Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server running in dev
});

module.exports = app;
