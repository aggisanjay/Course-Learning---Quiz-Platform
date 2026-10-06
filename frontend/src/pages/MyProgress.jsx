import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  LineChart,
  Award,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { progressApi } from '../services/progressApi';
import { quizApi } from '../services/quizApi';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

export const MyProgress = () => {
  const [overallProgress, setOverallProgress] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgressData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [progressRes, quizRes] = await Promise.all([
        progressApi.getOverallProgress(),
        quizApi.getQuizStats(),
      ]);

      if (progressRes.success) setOverallProgress(progressRes.data);
      if (quizRes.success) setQuizStats(quizRes.data);
    } catch (err) {
      console.error('Failed to load progress analytics:', err);
      setError(err.message || 'Unable to load progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="w-64 h-8 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="w-full h-80 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Analytics Unavailable"
        message={error}
        onRetry={fetchProgressData}
      />
    );
  }

  const courseBreakdown = overallProgress?.courseBreakdown || [];

  // Chart data format
  const chartData = courseBreakdown.map((c) => ({
    name: c.courseTitle.length > 18 ? `${c.courseTitle.slice(0, 15)}...` : c.courseTitle,
    fullName: c.courseTitle,
    percentage: c.percentage,
    completed: c.completedCount,
    total: c.totalLessons,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Learning Analytics & Progress
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track your completion rates, quiz performance, and course milestones.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span>Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {overallProgress?.overallPercentage || 0}%
          </p>
          <div className="mt-3">
            <ProgressBar value={overallProgress?.overallPercentage || 0} size="sm" />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span>Lessons Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {overallProgress?.completedLessonsAcrossAll || 0}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Out of {overallProgress?.totalLessonsAcrossAll || 0} total curriculum lessons
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span>Courses Completed</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {overallProgress?.completedCoursesCount || 0} / {overallProgress?.totalCoursesCount || 0}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Fully finished courses
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span>Quiz Average</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {quizStats?.averageScore || 0}%
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Across {quizStats?.totalQuizzesTaken || 0} total attempts
          </p>
        </Card>
      </div>

      {/* Course Completion Chart */}
      {chartData.length > 0 && (
        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Course Progress Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visual comparison of lesson completion percentage across all courses
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs border border-slate-800 shadow-xl">
                          <p className="font-bold text-sm mb-1">{data.fullName}</p>
                          <p className="text-indigo-300 font-semibold">Progress: {data.percentage}%</p>
                          <p className="text-slate-400">
                            {data.completed} of {data.total} lessons completed
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.percentage === 100 ? '#10B981' : entry.percentage > 0 ? '#6366F1' : '#334155'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Detailed Course Breakdown Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Curriculum Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Granular lesson counts and completion states for each individual course
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {courseBreakdown.map((item) => (
            <div
              key={item.courseId}
              className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.thumbnail && !item.thumbnail.includes('photo-1579468118864')
                      ? item.thumbnail
                      : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={item.courseTitle}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={item.difficulty}>{item.difficulty}</Badge>
                    {item.isCompleted && (
                      <Badge variant="success" dot>
                        Completed
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {item.courseTitle}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {item.completedCount} of {item.totalLessons} lessons completed
                  </p>
                </div>
              </div>

              {/* Progress Bar & CTA */}
              <div className="flex items-center gap-6 w-full md:w-72">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Completion</span>
                    <span className={item.isCompleted ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'}>
                      {item.percentage}%
                    </span>
                  </div>
                  <ProgressBar value={item.percentage} size="sm" />
                </div>

                <Link to={`/courses/${item.courseSlug || item.courseId}`}>
                  <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
                    Open
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyProgress;
