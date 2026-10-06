import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  HelpCircle,
  PlayCircle,
  ArrowRight,
  Award,
  Sparkles
} from 'lucide-react';
import { courseApi } from '../services/courseApi';
import { useAuthStore } from '../store/authStore';
import LessonItem from '../components/courses/LessonItem';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { CourseDetailSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';

export const CourseDetail = () => {
  const { idOrSlug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseApi.getCourse(idOrSlug);
      if (res.success && res.data.course) {
        setCourse(res.data.course);
      } else {
        throw new Error('Course not found');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Failed to retrieve course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [idOrSlug]);

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (error || !course) {
    return (
      <ErrorState
        title="Course Unavailable"
        message={error || 'Could not find this course.'}
        onRetry={fetchCourseData}
      />
    );
  }

  const lessons = course.lessons || [];
  const completedLessons = course.userProgress?.completedLessons || [];
  const completedLessonIds = completedLessons.map((id) => id.toString());
  const progressPercentage = course.userProgress?.percentage || 0;
  const isCompleted = course.userProgress?.completed || progressPercentage === 100;

  // Find next lesson to continue: first lesson not yet completed
  const firstIncompleteLesson =
    lessons.find((l) => !completedLessonIds.includes(l._id.toString())) || lessons[0];

  const continueLessonUrl = firstIncompleteLesson
    ? `/courses/${course.slug || course._id}/lessons/${firstIncompleteLesson._id}`
    : '#';

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Course Hero Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Background accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{course.category}</Badge>
              <Badge variant={course.difficulty}>{course.difficulty}</Badge>
              {isCompleted && (
                <Badge variant="success" dot className="font-bold">
                  ✓ Course Completed
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>

            {/* Meta info pills */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                {course.estimatedDuration} total
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                {lessons.length} lessons
              </span>
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                {course.quiz?.questions?.length || 6} quiz questions
              </span>
            </div>
          </div>

          {/* Action CTAs & Progress Card */}
          <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shrink-0">
            {/* Large Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Course Progress</span>
                <span className={isCompleted ? 'text-emerald-500 font-bold' : 'text-indigo-600 dark:text-indigo-400 font-bold'}>
                  {progressPercentage}%
                </span>
              </div>
              <ProgressBar value={progressPercentage} size="md" />
              <p className="text-[11px] text-slate-400 text-right">
                {completedLessonIds.length} of {lessons.length} lessons completed
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-2 pt-2">
              <Link to={continueLessonUrl} className="block">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  icon={PlayCircle}
                >
                  {isCompleted
                    ? 'Review Lessons'
                    : progressPercentage > 0
                    ? 'Continue Learning'
                    : 'Start Learning'}
                </Button>
              </Link>

              {/* Secondary CTA: Take Quiz */}
              <Link to={`/courses/${course.slug || course._id}/quiz`} className="block">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full justify-center border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50"
                  icon={HelpCircle}
                >
                  Take Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Course Curriculum Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Course Content
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Work through the lessons sequentially to master this topic.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {lessons.length} Lessons
          </span>
        </div>

        <div className="space-y-2.5">
          {lessons.map((lesson, idx) => {
            const isLessonDone = completedLessonIds.includes(lesson._id.toString());
            const isNextToLearn = firstIncompleteLesson && firstIncompleteLesson._id.toString() === lesson._id.toString();

            return (
              <LessonItem
                key={lesson._id || idx}
                lesson={lesson}
                courseIdOrSlug={course.slug || course._id}
                isCompleted={isLessonDone}
                isCurrent={isNextToLearn}
                index={idx + 1}
              />
            );
          })}
        </div>
      </section>

      {/* Recent Quiz Attempts (if any) */}
      {course.recentQuizAttempts && course.recentQuizAttempts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              Your Quiz Attempts for this Course
            </h2>
            <Link
              to={`/courses/${course.slug || course._id}/quiz`}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Take Quiz Again
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {course.recentQuizAttempts.map((attempt) => (
              <div
                key={attempt._id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      attempt.passed
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {attempt.percentage}%
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Score: {attempt.score} / {attempt.totalQuestions}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={attempt.passed ? 'success' : 'warning'}>
                    {attempt.passed ? 'Passed' : 'Needs Practice'}
                  </Badge>
                  <Link
                    to={`/courses/${course.slug || course._id}/quiz/result/${attempt._id}`}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CourseDetail;
