import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

const categoryFallbacks = {
  Frontend: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  Backend: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
  Database: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
  'AI & Data': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
  'Full-Stack': 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=80',
};

export const CourseCard = ({ course }) => {
  const defaultFallback = categoryFallbacks[course.category] || categoryFallbacks.Frontend;
  
  // Guard against known broken 404 unsplash URL
  const initialThumb =
    course.thumbnail && !course.thumbnail.includes('photo-1579468118864')
      ? course.thumbnail
      : defaultFallback;

  const [imgSrc, setImgSrc] = useState(initialThumb);

  const progress = course.userProgress || { percentage: 0, completed: false };
  const isEnrolled = progress.percentage > 0;
  const isCompleted = progress.completed || progress.percentage === 100;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-950/40 hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Course Thumbnail Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={imgSrc}
            alt={course.title}
            onError={() => setImgSrc(defaultFallback)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <Badge variant="primary" className="bg-slate-900/80 text-white border-white/10 backdrop-blur-md">
              {course.category}
            </Badge>
            <Badge variant={course.difficulty} className="backdrop-blur-md">
              {course.difficulty}
            </Badge>
          </div>

          {isCompleted && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <CheckCircle className="w-3.5 h-3.5" />
              Completed
            </div>
          )}
        </div>

        {/* Content body */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            {course.shortDescription || course.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.estimatedDuration}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {course.lessonCount || course.lessons?.length || 0} Lessons
            </span>
          </div>

          {/* Progress Bar (if enrolled) */}
          {isEnrolled && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Your Progress</span>
                <span className={isCompleted ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'}>
                  {progress.percentage}%
                </span>
              </div>
              <ProgressBar value={progress.percentage} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-5 pt-0">
        <Link
          to={`/courses/${course.slug || course._id}`}
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            isCompleted
              ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
              : isEnrolled
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20'
              : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
          }`}
        >
          <span>{isCompleted ? 'Review Course' : isEnrolled ? 'Continue Learning' : 'Start Course'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default CourseCard;
