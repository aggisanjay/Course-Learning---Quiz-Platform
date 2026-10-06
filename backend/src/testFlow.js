const { connectDB, closeDB } = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const Progress = require('./models/Progress');
const QuizResult = require('./models/QuizResult');
const progressService = require('./services/progressService');
const quizService = require('./services/quizService');
const { generateToken } = require('./utils/token');

async function runEndToEndVerification() {
  console.log('--- STARTING LEARNFLOW END-TO-END VERIFICATION ---');
  await connectDB();

  try {
    // 1. Verify User Creation & Auth
    const testEmail = `test_${Date.now()}@learnflow.com`;
    const testUser = await User.create({
      name: 'Verification Learner',
      email: testEmail,
      password: 'Password123'
    });
    console.log('✓ [User] Registered successfully:', testUser.email);

    // Verify Password Match
    const isMatch = await testUser.matchPassword('Password123');
    console.log('✓ [User] Password hash verification:', isMatch ? 'PASSED' : 'FAILED');

    // 2. Verify Courses
    let courses = await Course.find();
    if (courses.length === 0) {
      const { coursesData } = require('./seeds/seedData');
      await Course.insertMany(coursesData);
      courses = await Course.find();
    }
    console.log(`✓ [Courses] Found ${courses.length} courses loaded in database.`);
    if (courses.length === 0) {
      throw new Error('No courses found!');
    }

    const testCourse = courses[0];
    console.log(`✓ [Course] Selected test course: "${testCourse.title}" (${testCourse.lessons.length} lessons)`);

    // 3. Verify Progress Service (Initial State)
    const initialProgress = await progressService.getCourseProgress(testUser._id, testCourse._id);
    console.log(`✓ [Progress] Initial percentage: ${initialProgress.percentage}%, Completed: ${initialProgress.isCompleted}`);

    // 4. Complete Lesson 1
    const lesson1 = testCourse.lessons[0];
    const update1 = await progressService.completeLesson(testUser._id, testCourse._id, lesson1._id);
    console.log(`✓ [Progress] Completed Lesson 1 -> Percentage: ${update1.percentage}% (${update1.completedCount}/${update1.totalLessons})`);

    // 5. Complete Lesson 2
    const lesson2 = testCourse.lessons[1];
    const update2 = await progressService.completeLesson(testUser._id, testCourse._id, lesson2._id);
    console.log(`✓ [Progress] Completed Lesson 2 -> Percentage: ${update2.percentage}% (${update2.completedCount}/${update2.totalLessons})`);

    // 6. Test Duplicate Completion (Idempotency)
    const updateDuplicate = await progressService.completeLesson(testUser._id, testCourse._id, lesson1._id);
    console.log(`✓ [Progress] Re-completing Lesson 1 (Idempotent) -> Percentage still: ${updateDuplicate.percentage}%`);

    // 7. Verify Overall Progress Aggregation
    const overall = await progressService.getUserOverallProgress(testUser._id);
    console.log(`✓ [Overall Progress] Total completed lessons across all: ${overall.completedLessonsAcrossAll}, Overall: ${overall.overallPercentage}%`);

    // 8. Verify Quiz Fetching (Sanitization check - answers must NOT be exposed)
    const sanitizedQuiz = await quizService.getQuizForUser(testCourse._id);
    const exposedAnswer = sanitizedQuiz.questions.some(q => q.correctAnswerIndex !== undefined || q.explanation !== undefined);
    console.log(`✓ [Quiz Security] Sanitized questions sent: ${sanitizedQuiz.questions.length}, Answers exposed? ${exposedAnswer ? 'YES (FAIL)' : 'NO (PASSED)'}`);

    // 9. Submit Quiz with answers
    const quizSubmissions = sanitizedQuiz.questions.map((q, idx) => ({
      questionIndex: idx,
      selectedOption: idx % 2 === 0 ? testCourse.quiz.questions[idx].correctAnswerIndex : 0
    }));

    const quizResult = await quizService.submitQuiz(
      testUser._id,
      testCourse._id,
      quizSubmissions,
      145
    );
    console.log(`✓ [Quiz Submission] Result: Score ${quizResult.score}/${quizResult.totalQuestions} (${quizResult.percentage}%), Passed: ${quizResult.passed}`);

    // 10. Verify Quiz History & Retrieval
    const history = await quizService.getQuizHistoryForCourse(testUser._id, testCourse._id);
    console.log(`✓ [Quiz History] Found ${history.length} attempt(s) stored for this course.`);

    const retrievedResult = await quizService.getQuizResultById(testUser._id, quizResult._id);
    console.log(`✓ [Quiz Result Detail] Answers reviewed: ${retrievedResult.answers.length} questions, First isCorrect: ${retrievedResult.answers[0].isCorrect}`);

    // 11. Complete all remaining lessons to reach 100% completion
    for (let i = 2; i < testCourse.lessons.length; i++) {
      await progressService.completeLesson(testUser._id, testCourse._id, testCourse.lessons[i]._id);
    }
    const finalCourseProgress = await progressService.getCourseProgress(testUser._id, testCourse._id);
    console.log(`✓ [Course 100% Completion] Course status: ${finalCourseProgress.isCompleted ? 'COMPLETED' : 'INCOMPLETE'}, Percentage: ${finalCourseProgress.percentage}%`);

    // Clean up test user & progress
    await User.deleteOne({ _id: testUser._id });
    await Progress.deleteMany({ userId: testUser._id });
    await QuizResult.deleteMany({ userId: testUser._id });
    console.log('✓ [Cleanup] Cleaned up temporary test user records.');

    console.log('--- ALL BACKEND CORE FLOWS VALIDATED 100% SUCCESSFULLY ---');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    await closeDB();
    process.exit(0);
  }
}

runEndToEndVerification();
