const Course = require('../models/Course');
const Progress = require('../models/Progress');
const QuizResult = require('../models/QuizResult');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @route   GET /api/courses
 * @desc    Get all courses with optional search, category & difficulty filters
 * @access  Public (optional user progress if authenticated)
 */
const getCourses = async (req, res, next) => {
  try {
    const { search, category, difficulty } = req.query;
    const filter = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    const courses = await Course.find(filter)
      .select('-quiz.questions.correctAnswerIndex -quiz.questions.explanation')
      .sort({ createdAt: -1 });

    // If user is authenticated, attach their progress
    let userProgressMap = new Map();
    if (req.user) {
      const progressList = await Progress.find({ userId: req.user._id });
      progressList.forEach((p) => {
        userProgressMap.set(p.courseId.toString(), p);
      });
    }

    const coursesWithProgress = courses.map((course) => {
      const courseObj = course.toObject();
      const progress = userProgressMap.get(course._id.toString());

      courseObj.lessonCount = course.lessons ? course.lessons.length : 0;
      courseObj.userProgress = progress
        ? {
            completedLessonsCount: progress.completedLessons.length,
            percentage: progress.progressPercentage,
            completed: progress.completed
          }
        : {
            completedLessonsCount: 0,
            percentage: 0,
            completed: false
          };

      return courseObj;
    });

    return sendSuccess(res, { courses: coursesWithProgress }, 'Courses fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/courses/:idOrSlug
 * @desc    Get single course details by ID or slug
 * @access  Public (with user progress if authenticated)
 */
const getCourse = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let course;

    // Check if ID is a valid Mongo ObjectId, otherwise lookup by slug
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(idOrSlug).select(
        '-quiz.questions.correctAnswerIndex -quiz.questions.explanation'
      );
    }
    
    if (!course) {
      course = await Course.findOne({ slug: idOrSlug.toLowerCase() }).select(
        '-quiz.questions.correctAnswerIndex -quiz.questions.explanation'
      );
    }

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    const courseObj = course.toObject();

    // Attach user progress and quiz attempts if logged in
    if (req.user) {
      const progress = await Progress.findOne({
        userId: req.user._id,
        courseId: course._id
      });

      const recentAttempts = await QuizResult.find({
        userId: req.user._id,
        courseId: course._id
      })
        .sort({ completedAt: -1 })
        .limit(5)
        .select('-answers');

      courseObj.userProgress = progress
        ? {
            completedLessons: progress.completedLessons,
            completedLessonsCount: progress.completedLessons.length,
            percentage: progress.progressPercentage,
            completed: progress.completed
          }
        : {
            completedLessons: [],
            completedLessonsCount: 0,
            percentage: 0,
            completed: false
          };

      courseObj.recentQuizAttempts = recentAttempts;
    } else {
      courseObj.userProgress = {
        completedLessons: [],
        completedLessonsCount: 0,
        percentage: 0,
        completed: false
      };
      courseObj.recentQuizAttempts = [];
    }

    return sendSuccess(res, { course: courseObj }, 'Course details fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/courses/:idOrSlug/lessons
 * @desc    Get lessons list for course
 * @access  Public
 */
const getCourseLessons = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let course;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(idOrSlug, 'title slug lessons');
    }
    if (!course) {
      course = await Course.findOne({ slug: idOrSlug.toLowerCase() }, 'title slug lessons');
    }

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    return sendSuccess(
      res,
      {
        courseId: course._id,
        courseTitle: course.title,
        courseSlug: course.slug,
        lessons: course.lessons
      },
      'Lessons fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/courses/:idOrSlug/lessons/:lessonId
 * @desc    Get specific lesson content with navigation pointers
 * @access  Public (authenticated user sees completion state)
 */
const getLessonDetail = async (req, res, next) => {
  try {
    const { idOrSlug, lessonId } = req.params;
    let course;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(idOrSlug);
    }
    if (!course) {
      course = await Course.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    const sortedLessons = course.lessons.slice().sort((a, b) => a.order - b.order);
    const currentIndex = sortedLessons.findIndex(
      (l) => l._id.toString() === lessonId || l.order.toString() === lessonId
    );

    if (currentIndex === -1) {
      return sendError(res, 'Lesson not found', 404);
    }

    const currentLesson = sortedLessons[currentIndex];
    const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;

    let isCompleted = false;
    let completedLessonIds = [];

    if (req.user) {
      const progress = await Progress.findOne({
        userId: req.user._id,
        courseId: course._id
      });

      if (progress) {
        completedLessonIds = progress.completedLessons.map((id) => id.toString());
        isCompleted = completedLessonIds.includes(currentLesson._id.toString());
      }
    }

    return sendSuccess(
      res,
      {
        course: {
          id: course._id,
          title: course.title,
          slug: course.slug,
          totalLessons: sortedLessons.length,
          allLessons: sortedLessons.map((l) => ({
            _id: l._id,
            order: l.order,
            title: l.title,
            duration: l.duration,
            isCompleted: completedLessonIds.includes(l._id.toString())
          }))
        },
        lesson: currentLesson,
        isCompleted,
        prevLesson: prevLesson ? { _id: prevLesson._id, title: prevLesson.title, order: prevLesson.order } : null,
        nextLesson: nextLesson ? { _id: nextLesson._id, title: nextLesson.title, order: nextLesson.order } : null
      },
      'Lesson retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourse,
  getCourseLessons,
  getLessonDetail
};
