const express = require('express');
const router = express.Router();
const {
  getUserOverallProgress,
  getCourseProgress,
  completeLesson
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getUserOverallProgress);
router.get('/:courseId', getCourseProgress);
router.post('/:courseId/lessons/:lessonId/complete', completeLesson);

module.exports = router;
