const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const QuizResult = require('../models/QuizResult');
const { coursesData } = require('./seedData');

dotenv.config();

const seed = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Progress.deleteMany({});
    await QuizResult.deleteMany({});

    console.log('[Seed] Creating demo user...');
    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'demo@learnflow.com',
      password: 'Demo@12345'
    });
    console.log(`[Seed] Demo user created: ${demoUser.email} (Password: Demo@12345)`);

    console.log('[Seed] Inserting 6 courses with lessons and quizzes...');
    const createdCourses = await Course.insertMany(coursesData);
    console.log(`[Seed] Successfully inserted ${createdCourses.length} courses!`);

    // Create realistic initial progress for demo user on Course 0 (React Fundamentals)
    const reactCourse = createdCourses[0];
    const completedLessonIds = [
      reactCourse.lessons[0]._id,
      reactCourse.lessons[1]._id,
      reactCourse.lessons[2]._id
    ];
    const reactPercentage = Math.round((completedLessonIds.length / reactCourse.lessons.length) * 100);

    await Progress.create({
      userId: demoUser._id,
      courseId: reactCourse._id,
      completedLessons: completedLessonIds,
      completed: false,
      progressPercentage: reactPercentage,
      updatedAt: new Date()
    });

    // Also 1 completed lesson on Node.js course
    const nodeCourse = createdCourses[1];
    await Progress.create({
      userId: demoUser._id,
      courseId: nodeCourse._id,
      completedLessons: [nodeCourse.lessons[0]._id],
      completed: false,
      progressPercentage: Math.round((1 / nodeCourse.lessons.length) * 100),
      updatedAt: new Date(Date.now() - 3600000)
    });

    // Create 1 realistic quiz attempt for React course
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
        selectedOption: idx === 1 ? (q.correctAnswerIndex === 0 ? 1 : 0) : q.correctAnswerIndex, // 1 deliberate incorrect
        correctOption: q.correctAnswerIndex,
        isCorrect: idx !== 1,
        explanation: q.explanation
      })),
      completedAt: new Date(Date.now() - 7200000)
    });

    console.log('[Seed] Seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Email:    demo@learnflow.com');
    console.log('Password: Demo@12345');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seed();
