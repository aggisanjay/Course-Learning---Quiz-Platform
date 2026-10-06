const Progress = require('../models/Progress');
const Course = require('../models/Course');

class ProgressService {
  /**
   * Get progress for a specific course
   */
  async getCourseProgress(userId, courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        completedLessons: [],
        completed: false,
        progressPercentage: 0
      });
    }

    const totalLessons = course.lessons.length;
    const completedCount = progress.completedLessons.length;
    const calculatedPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const isCompleted = totalLessons > 0 && completedCount >= totalLessons;

    if (
      progress.progressPercentage !== calculatedPercentage ||
      progress.completed !== isCompleted
    ) {
      progress.progressPercentage = calculatedPercentage;
      progress.completed = isCompleted;
      progress.updatedAt = new Date();
      await progress.save();
    }

    return {
      progress,
      totalLessons,
      completedCount,
      percentage: calculatedPercentage,
      isCompleted
    };
  }

  /**
   * Mark a lesson as completed
   */
  async completeLesson(userId, courseId, lessonId) {
    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify lesson exists in course
    const lessonExists = course.lessons.some(
      (l) => l._id.toString() === lessonId.toString()
    );
    if (!lessonExists) {
      const error = new Error('Lesson not found in this course');
      error.statusCode = 404;
      throw error;
    }

    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [],
        completed: false,
        progressPercentage: 0
      });
    }

    const alreadyCompleted = progress.completedLessons.some(
      (id) => id.toString() === lessonId.toString()
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push(lessonId);
    }

    const totalLessons = course.lessons.length;
    const completedCount = progress.completedLessons.length;
    progress.progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    progress.completed = totalLessons > 0 && completedCount >= totalLessons;
    progress.updatedAt = new Date();

    await progress.save();

    return {
      progress,
      totalLessons,
      completedCount,
      percentage: progress.progressPercentage,
      isCompleted: progress.completed,
      justCompletedCourse: progress.completed && !alreadyCompleted && completedCount === totalLessons
    };
  }

  /**
   * Get overall user progress across all courses
   */
  async getUserOverallProgress(userId) {
    const allCourses = await Course.find({}, '_id title slug thumbnail difficulty lessons category');
    const userProgressList = await Progress.find({ userId });

    const progressMap = new Map();
    userProgressList.forEach((p) => {
      progressMap.set(p.courseId.toString(), p);
    });

    let totalLessonsAcrossAll = 0;
    let completedLessonsAcrossAll = 0;
    let completedCoursesCount = 0;
    let enrolledCoursesCount = 0;

    const courseBreakdown = allCourses.map((course) => {
      const courseIdStr = course._id.toString();
      const progress = progressMap.get(courseIdStr);
      const totalLessons = course.lessons.length;
      totalLessonsAcrossAll += totalLessons;

      let completedCount = 0;
      let percentage = 0;
      let isCompleted = false;

      if (progress && progress.completedLessons.length > 0) {
        enrolledCoursesCount += 1;
        completedCount = progress.completedLessons.length;
        completedLessonsAcrossAll += completedCount;
        percentage = progress.progressPercentage;
        isCompleted = progress.completed;
        if (isCompleted) {
          completedCoursesCount += 1;
        }
      }

      return {
        courseId: course._id,
        courseTitle: course.title,
        courseSlug: course.slug,
        thumbnail: course.thumbnail,
        category: course.category,
        difficulty: course.difficulty,
        totalLessons,
        completedCount,
        percentage,
        isCompleted,
        updatedAt: progress ? progress.updatedAt : null
      };
    });

    const overallPercentage =
      totalLessonsAcrossAll > 0
        ? Math.round((completedLessonsAcrossAll / totalLessonsAcrossAll) * 100)
        : 0;

    return {
      enrolledCoursesCount,
      completedCoursesCount,
      totalCoursesCount: allCourses.length,
      totalLessonsAcrossAll,
      completedLessonsAcrossAll,
      overallPercentage,
      courseBreakdown
    };
  }
}

module.exports = new ProgressService();
