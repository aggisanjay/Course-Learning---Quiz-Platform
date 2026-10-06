const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  getCourseLessons,
  getLessonDetail
} = require('../controllers/courseController');
const {
  getCourseQuiz,
  submitQuiz,
  getCourseQuizResults
} = require('../controllers/quizController');
const { optionalProtect, protect } = require('../middleware/authMiddleware');

// Courses public / optionally personalized
router.get('/', optionalProtect, getCourses);
router.get('/:idOrSlug', optionalProtect, getCourse);
router.get('/:idOrSlug/lessons', optionalProtect, getCourseLessons);
router.get('/:idOrSlug/lessons/:lessonId', optionalProtect, getLessonDetail);

// Course quiz routes (authenticated)
router.get('/:courseId/quiz', protect, getCourseQuiz);
router.post('/:courseId/quiz/submit', protect, submitQuiz);
router.get('/:courseId/quiz/results', protect, getCourseQuizResults);

module.exports = router;
