import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Award, Target } from 'lucide-react';
import Badge from '../ui/Badge';

export const ScoreCard = ({ result }) => {
  const {
    score = 0,
    totalQuestions = 0,
    correctAnswers = 0,
    incorrectAnswers = 0,
    percentage = 0,
    passed = false,
    timeSpentSeconds = 0,
  } = result;

  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  let feedbackMessage = 'Keep studying and try again!';
  if (percentage >= 90) {
    feedbackMessage = 'Excellent work! Outstanding mastery of the course.';
  } else if (percentage >= 70) {
    feedbackMessage = 'Great job! You have successfully passed the quiz.';
  } else if (percentage >= 50) {
    feedbackMessage = 'Good effort — keep practicing to achieve full mastery.';
  }

  // Calculate stroke dash for circular radial indicator
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left side: radial circle score */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated percentage progress stroke */}
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              className={passed ? 'text-emerald-500' : 'text-amber-500'}
              strokeWidth="12"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-extrabold text-slate-900 dark:text-white"
            >
              {percentage}%
            </motion.span>
            <span className="text-xs font-semibold text-slate-400">Score</span>
          </div>
        </div>

        <div className="mt-3">
          <Badge
            variant={passed ? 'success' : 'warning'}
            dot
            className="text-xs px-3 py-1 uppercase tracking-wide font-bold"
          >
            {passed ? 'Passed' : 'Needs Practice'}
          </Badge>
        </div>
      </div>

      {/* Middle/Right: Metric Breakdown */}
      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {passed ? 'Congratulations!' : 'Quiz Completed'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
            {feedbackMessage}
          </p>
        </div>

        {/* 4 Summary stat boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>Score</span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {score} / {totalQuestions}
            </p>
          </div>

          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct</span>
            </div>
            <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
              {correctAnswers}
            </p>
          </div>

          <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40">
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mb-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>Incorrect</span>
            </div>
            <p className="text-base font-bold text-rose-700 dark:text-rose-300">
              {incorrectAnswers}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Time Used</span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {timeFormatted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
