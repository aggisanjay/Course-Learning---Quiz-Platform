import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  PlayCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { progressApi } from '../services/progressApi';
import { courseApi } from '../services/courseApi';
import { quizApi } from '../services/quizApi';
import Card, { CardContent } from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import CourseCard from '../components/courses/CourseCard';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallProgress, setOverallProgress] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [quizStats, setQuizStats] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [progressRes, coursesRes, quizStatsRes] = await Promise.all([
        progressApi.getOverallProgress(),
        courseApi.getCourses(),
        quizApi.getQuizStats().catch(() => ({ data: { averageScore: 0, totalQuizzesTaken: 0, recentResults: [] } }))
      ]);

      if (progressRes.success) setOverallProgress(progressRes.data);
      if (coursesRes.success) setAllCourses(coursesRes.data.courses || []);
      if (quizStatsRes.success) setQuizStats(quizStatsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load your learning dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute greeting based on local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard Unavailable"
        message={error}
        onRetry={fetchDashboardData}
      />
    );
  }

  // Filter in-progress courses (courses with >0% progress and not 100%)
  const inProgressCourses = allCourses.filter(
    (c) => c.userProgress && c.userProgress.percentage > 0 && !c.userProgress.completed
  );

  return (
    <div className="space-y-10">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{greeting}, {user?.name?.split(' ')[0] || 'Learner'}</span>
            <span className="text-indigo-600 dark:text-indigo-400">👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continue learning and keep your streak going.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/courses">
            <Button variant="secondary" size="md" icon={BookOpen}>
              Browse All Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Courses */}
        <Card className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {overallProgress?.enrolledCoursesCount || 0}
            </span>
            <span className="text-xs text-slate-400">
              of {overallProgress?.totalCoursesCount || allCourses.length} available
            </span>
          </div>
        </Card>

        {/* Completed Courses */}
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Courses Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {overallProgress?.completedCoursesCount || 0}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {overallProgress?.totalCoursesCount > 0
                ? `${Math.round(((overallProgress?.completedCoursesCount || 0) / overallProgress.totalCoursesCount) * 100)}% finished`
                : '0% finished'}
            </span>
          </div>
        </Card>

        {/* Overall Progress */}
        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {overallProgress?.overallPercentage || 0}%
            </span>
            <span className="text-xs text-slate-400">
              {overallProgress?.completedLessonsAcrossAll || 0} / {overallProgress?.totalLessonsAcrossAll || 0} Lessons
            </span>
          </div>
          <ProgressBar value={overallProgress?.overallPercentage || 0} size="sm" />
        </Card>

        {/* Quiz Average */}
        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Quiz Average</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {quizStats?.averageScore || 0}%
            </span>
            <span className="text-xs text-slate-400">
              {quizStats?.totalQuizzesTaken || 0} attempts
            </span>
          </div>
        </Card>
      </div>

      {/* Continue Learning Section */}
      {inProgressCourses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Continue Learning
            </h2>
            <span className="text-xs text-slate-500">
              {inProgressCourses.length} in progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <Card key={course._id} hoverEffect className="overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={
                        course.thumbnail && !course.thumbnail.includes('photo-1579468118864')
                          ? course.thumbnail
                          : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <Badge variant={course.difficulty}>{course.difficulty}</Badge>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {course.shortDescription}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-slate-500">Course Completion</span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {course.userProgress?.percentage || 0}%
                        </span>
                      </div>
                      <ProgressBar value={course.userProgress?.percentage || 0} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link to={`/courses/${course.slug || course._id}`}>
                    <Button variant="primary" size="md" className="w-full justify-center" icon={ArrowRight} iconPosition="right">
                      Continue
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Available / Enrolled Courses Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Explore Courses
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any topic to begin learning and practice with timed quizzes.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.slice(0, 6).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>

      {/* Recent Quiz Attempts (if any) */}
      {quizStats?.recentResults && quizStats.recentResults.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Recent Quiz Attempts
            </h2>
            <Link
              to="/progress"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full Analytics
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {quizStats.recentResults.map((attempt) => (
              <div
                key={attempt._id}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
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
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {attempt.courseId?.title || 'Course Quiz'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={attempt.passed ? 'success' : 'warning'}>
                    {attempt.passed ? 'Passed' : 'Needs Practice'}
                  </Badge>
                  <Link
                    to={`/courses/${attempt.courseId?._id || attempt.courseId}/quiz/result/${attempt._id}`}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View Review
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

export default Dashboard;
