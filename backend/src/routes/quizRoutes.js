const express = require('express');
const router = express.Router();
const {
  getQuizResultById,
  getUserQuizStats
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/results/:resultId', getQuizResultById);
router.get('/stats', getUserQuizStats);

module.exports = router;
