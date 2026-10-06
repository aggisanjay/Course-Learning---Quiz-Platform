const quizService = require('../services/quizService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @route   GET /api/courses/:courseId/quiz
 * @desc    Get sanitized quiz questions for a course
 * @access  Private
 */
const getCourseQuiz = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const quizData = await quizService.getQuizForUser(courseId);
    return sendSuccess(res, quizData, 'Quiz questions fetched successfully');
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

/**
 * @route   POST /api/courses/:courseId/quiz/submit
 * @desc    Submit answers for a course quiz
 * @access  Private
 */
const submitQuiz = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { answers, timeSpentSeconds } = req.body;

    if (!Array.isArray(answers)) {
      return sendError(res, 'Answers array is required', 400);
    }

    const result = await quizService.submitQuiz(
      req.user._id,
      courseId,
      answers,
      timeSpentSeconds || 0
    );

    return sendSuccess(res, { result }, 'Quiz submitted successfully', 201);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

/**
 * @route   GET /api/courses/:courseId/quiz/results
 * @desc    Get all quiz attempts for a course
 * @access  Private
 */
const getCourseQuizResults = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const history = await quizService.getQuizHistoryForCourse(req.user._id, courseId);
    return sendSuccess(res, { history }, 'Quiz history fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/quiz/results/:resultId
 * @desc    Get specific quiz result with question breakdown
 * @access  Private
 */
const getQuizResultById = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    const result = await quizService.getQuizResultById(req.user._id, resultId);
    return sendSuccess(res, { result }, 'Quiz result fetched successfully');
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

/**
 * @route   GET /api/quiz/stats
 * @desc    Get aggregated user quiz performance stats
 * @access  Private
 */
const getUserQuizStats = async (req, res, next) => {
  try {
    const stats = await quizService.getUserQuizStats(req.user._id);
    return sendSuccess(res, stats, 'User quiz metrics fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourseQuiz,
  submitQuiz,
  getCourseQuizResults,
  getQuizResultById,
  getUserQuizStats
};
