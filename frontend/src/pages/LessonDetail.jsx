import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Clock,
  ArrowLeft,
  Menu,
  Check,
  Award
} from 'lucide-react';
import { courseApi } from '../services/courseApi';
import { progressApi } from '../services/progressApi';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import MarkdownViewer from '../components/ui/MarkdownViewer';

export const LessonDetail = () => {
  const { idOrSlug, lessonId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchLesson = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseApi.getLessonDetail(idOrSlug, lessonId);
      if (res.success && res.data) {
        setLessonData(res.data);
        setIsCompleted(res.data.isCompleted || false);
      } else {
        throw new Error('Lesson not found');
      }
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setError(err.message || 'Failed to load lesson content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug, lessonId]);

  const handleMarkCompleted = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to track and save your lesson progress.');
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    if (isCompleted || !lessonData) return;

    setIsCompleting(true);
    try {
      const res = await progressApi.completeLesson(
        lessonData.course.id,
        lessonData.lesson._id
      );

      if (res.success) {
        setIsCompleted(true);
        // Update local lesson list item state
        setLessonData((prev) => {
          if (!prev) return prev;
          const updatedAll = prev.course.allLessons.map((l) =>
            l._id === prev.lesson._id ? { ...l, isCompleted: true } : l
          );
          return {
            ...prev,
            course: {
              ...prev.course,
              allLessons: updatedAll,
            },
            isCompleted: true,
          };
        });

        if (res.data?.justCompletedCourse) {
          toast.success('🎉 Congratulations! You have completed all lessons in this course!');
        } else {
          toast.success('Lesson marked as completed! Progress saved.');
        }
      }
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      toast.error('Unable to save progress. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="w-48 h-6 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="w-3/4 h-10 rounded-xl" />
            <Skeleton className="w-full h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <ErrorState
        title="Lesson Unavailable"
        message={error || 'Could not find this lesson.'}
        onRetry={fetchLesson}
      />
    );
  }

  const { course, lesson, prevLesson, nextLesson } = lessonData;
  const completedCount = course.allLessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / course.allLessons.length) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Mobile Drawer Toggle */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <Link
          to={`/courses/${course.slug || course.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course: {course.title}</span>
        </Link>

        {/* Mobile lesson list button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          <Menu className="w-4 h-4 text-indigo-500" />
          <span>Lessons ({completedCount}/{course.allLessons.length})</span>
        </button>
      </div>

      {/* Main 2-Column Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Lesson Navigation Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:col-span-4 lg:block ${
            sidebarOpen ? 'block' : 'hidden'
          } bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Course Curriculum
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {completedCount} of {course.allLessons.length} lessons completed
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {progressPercent}%
            </span>
          </div>

          <ProgressBar value={progressPercent} size="sm" />

          {/* Lessons links list */}
          <div className="space-y-1.5 pt-2 max-h-[60vh] overflow-y-auto pr-1">
            {course.allLessons.map((item, idx) => {
              const isCurrentItem = item._id.toString() === lesson._id.toString();
              return (
                <Link
                  key={item._id}
                  to={`/courses/${course.slug || course.id}/lessons/${item._id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                    isCurrentItem
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                      : item.isCompleted
                      ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                        item.isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrentItem
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </div>
                    <span className="line-clamp-1">{item.title}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                    {item.duration}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to={`/courses/${course.slug || course.id}/quiz`}
              className="w-full py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-indigo-100/50 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Practice Course Quiz</span>
            </Link>
          </div>
        </aside>

        {/* Center Lesson Content Area */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          {/* Lesson Header */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Lesson {lesson.order} of {course.allLessons.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.duration}
                </span>
                {isCompleted && (
                  <Badge variant="success" dot>
                    Completed
                  </Badge>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lesson.title}
            </h1>

            {lesson.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lesson.description}
              </p>
            )}
          </div>

          {/* Reading Content Markdown / Text rendering */}
          <div className="py-2">
            <MarkdownViewer content={lesson.content} />
          </div>

          {/* Bottom Navigation & Complete Action Bar */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Previous Lesson Button */}
            {prevLesson ? (
              <Link
                to={`/courses/${course.slug || course.id}/lessons/${prevLesson._id}`}
                className="w-full sm:w-auto"
              >
                <Button variant="secondary" size="md" icon={ChevronLeft} className="w-full sm:w-auto">
                  Previous Lesson
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {/* Mark as Completed Button */}
            <Button
              variant={isCompleted ? 'success' : 'primary'}
              size="lg"
              isLoading={isCompleting}
              onClick={handleMarkCompleted}
              disabled={isCompleted}
              icon={CheckCircle2}
              className="w-full sm:w-auto px-6 font-semibold"
            >
              {isCompleted ? '✓ Completed' : 'Mark as Completed'}
            </Button>

            {/* Next Lesson Button */}
            {nextLesson ? (
              <Link
                to={`/courses/${course.slug || course.id}/lessons/${nextLesson._id}`}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  size="md"
                  icon={ChevronRight}
                  iconPosition="right"
                  className="w-full sm:w-auto"
                >
                  Next Lesson
                </Button>
              </Link>
            ) : (
              <Link to={`/courses/${course.slug || course.id}/quiz`} className="w-full sm:w-auto">
                <Button variant="primary" size="md" icon={Award} className="w-full sm:w-auto">
                  Take Course Quiz
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
