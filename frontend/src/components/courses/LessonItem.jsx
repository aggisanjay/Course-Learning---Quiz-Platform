import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, PlayCircle } from 'lucide-react';

export const LessonItem = ({
  lesson,
  courseIdOrSlug,
  isCompleted = false,
  isCurrent = false,
  index = 1,
}) => {
  return (
    <Link
      to={`/courses/${courseIdOrSlug}/lessons/${lesson._id || lesson.order}`}
      className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
        isCurrent
          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700/60 ring-2 ring-indigo-500/20'
          : isCompleted
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center gap-3.5">
        {/* Status Icon */}
        <div className="shrink-0">
          {isCompleted ? (
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : isCurrent ? (
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <PlayCircle className="w-5 h-5 animate-pulse" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-semibold text-xs">
              {lesson.order || index}
            </div>
          )}
        </div>

        {/* Title and description */}
        <div>
          <h4
            className={`text-sm font-semibold transition-colors ${
              isCurrent
                ? 'text-indigo-700 dark:text-indigo-300'
                : isCompleted
                ? 'text-slate-800 dark:text-slate-200'
                : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
            }`}
          >
            {lesson.order ? `${lesson.order}. ` : ''}
            {lesson.title}
          </h4>
          {lesson.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {lesson.description}
            </p>
          )}
        </div>
      </div>

      {/* Duration & status badge */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        {lesson.duration && (
          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {lesson.duration}
          </span>
        )}
        {isCompleted && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
            Completed
          </span>
        )}
      </div>
    </Link>
  );
};

export default LessonItem;
