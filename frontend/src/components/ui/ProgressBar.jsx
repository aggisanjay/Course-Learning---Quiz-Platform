import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  showLabel = false,
  color = 'indigo',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
  };

  // Automatically switch to emerald if complete
  const effectiveColor = percentage === 100 ? 'emerald' : color;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-slate-900 dark:text-white">{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${
          sizeClasses[size] || sizeClasses.md
        }`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full transition-colors ${
            colorClasses[effectiveColor] || colorClasses.indigo
          }`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
