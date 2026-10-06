const Course = require('../models/Course');
const QuizResult = require('../models/QuizResult');

class QuizService {
  /**
   * Get quiz without revealing correct answers
   */
  async getQuizForUser(courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }

    if (!course.quiz || !course.quiz.questions || course.quiz.questions.length === 0) {
      const error = new Error('No quiz configured for this course');
      error.statusCode = 404;
      throw error;
    }

    // Sanitize questions - DO NOT expose correctAnswerIndex or explanation
    const sanitizedQuestions = course.quiz.questions.map((q, index) => ({
      questionIndex: index,
      questionText: q.questionText,
      options: q.options
    }));

    return {
      courseId: course._id,
      courseTitle: course.title,
      title: course.quiz.title,
      instructions: course.quiz.instructions,
      timeLimitMinutes: course.quiz.timeLimitMinutes,
      passingScore: course.quiz.passingScore,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    };
  }

  /**
   * Submit quiz, validate answers on the backend, and persist result
   */
  async submitQuiz(userId, courseId, submittedAnswers, timeSpentSeconds = 0) {
    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }

    const quiz = course.quiz;
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      const error = new Error('Course quiz not found');
      error.statusCode = 404;
      throw error;
    }

    const totalQuestions = quiz.questions.length;
    let correctCount = 0;
    const answerReviews = [];

    quiz.questions.forEach((question, index) => {
      // Find what the user submitted for this index
      const submission = submittedAnswers.find(
        (a) => a.questionIndex === index
      );

      const selectedOption =
        submission && submission.selectedOption !== undefined && submission.selectedOption !== null
          ? Number(submission.selectedOption)
          : -1;

      const isCorrect = selectedOption === question.correctAnswerIndex;
      if (isCorrect) {
        correctCount += 1;
      }

      answerReviews.push({
        questionIndex: index,
        questionText: question.questionText,
        selectedOption,
        correctOption: question.correctAnswerIndex,
        isCorrect,
        explanation: question.explanation || ''
      });
    });

    const incorrectCount = totalQuestions - correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passingScore = quiz.passingScore || 70;
    const passed = percentage >= passingScore;

    // Create a new QuizResult document to preserve attempt history
    const quizResult = await QuizResult.create({
      userId,
      courseId,
      score: correctCount,
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      percentage,
      passed,
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      answers: answerReviews,
      completedAt: new Date()
    });

    return quizResult;
  }

  /**
   * Get all past quiz attempts for a course
   */
  async getQuizHistoryForCourse(userId, courseId) {
    return await QuizResult.find({ userId, courseId })
      .sort({ completedAt: -1 })
      .select('-answers');
  }

  /**
   * Get a specific quiz result with full answers breakdown
   */
  async getQuizResultById(userId, resultId) {
    const result = await QuizResult.findOne({ _id: resultId, userId })
      .populate('courseId', 'title slug thumbnail category');
    
    if (!result) {
      const error = new Error('Quiz result not found');
      error.statusCode = 404;
      throw error;
    }

    return result;
  }

  /**
   * Get overall quiz performance metrics for user
   */
  async getUserQuizStats(userId) {
    const results = await QuizResult.find({ userId });
    
    if (results.length === 0) {
      return {
        totalQuizzesTaken: 0,
        averageScore: 0,
        passedCount: 0,
        recentResults: []
      };
    }

    const totalQuizzesTaken = results.length;
    const passedCount = results.filter((r) => r.passed).length;
    const totalPercentage = results.reduce((acc, curr) => acc + curr.percentage, 0);
    const averageScore = Math.round(totalPercentage / totalQuizzesTaken);

    const recentResults = await QuizResult.find({ userId })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('courseId', 'title slug thumbnail');

    return {
      totalQuizzesTaken,
      averageScore,
      passedCount,
      recentResults
    };
  }
}

module.exports = new QuizService();
