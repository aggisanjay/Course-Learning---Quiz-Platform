const progressService = require('../services/progressService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @route   GET /api/progress
 * @desc    Get current user overall learning progress
 * @access  Private
 */
const getUserOverallProgress = async (req, res, next) => {
  try {
    const summary = await progressService.getUserOverallProgress(req.user._id);
    return sendSuccess(res, summary, 'Overall progress fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/progress/:courseId
 * @desc    Get user progress for a specific course
 * @access  Private
 */
const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const result = await progressService.getCourseProgress(req.user._id, courseId);
    return sendSuccess(res, result, 'Course progress fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/progress/:courseId/lessons/:lessonId/complete
 * @desc    Mark a lesson as completed
 * @access  Private
 */
const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const result = await progressService.completeLesson(req.user._id, courseId, lessonId);
    return sendSuccess(res, result, 'Lesson marked as completed successfully');
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

module.exports = {
  getUserOverallProgress,
  getCourseProgress,
  completeLesson
};
