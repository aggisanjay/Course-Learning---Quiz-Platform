import React from 'react';
import { BookOpen, HelpCircle, Award, Compass } from 'lucide-react';
import Button from './Button';

const iconMap = {
  course: BookOpen,
  quiz: HelpCircle,
  award: Award,
  compass: Compass,
};

export const EmptyState = ({
  icon = 'compass',
  title = 'No items found',
  description = 'There is currently no data to display here.',
  actionLabel,
  onAction,
  className = '',
}) => {
  const IconComponent = iconMap[icon] || Compass;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
