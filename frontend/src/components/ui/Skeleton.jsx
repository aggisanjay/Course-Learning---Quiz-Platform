import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const CourseCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-5 flex flex-col justify-between h-[380px]">
      <div>
        <Skeleton className="w-full h-44 rounded-xl mb-4" />
        <div className="flex gap-2 mb-3">
          <Skeleton className="w-20 h-5 rounded-full" />
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
        <Skeleton className="w-3/4 h-6 mb-2 rounded-lg" />
        <Skeleton className="w-full h-4 mb-1 rounded-md" />
        <Skeleton className="w-2/3 h-4 rounded-md" />
      </div>
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Skeleton className="w-24 h-4 rounded-md" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const CourseDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-2/3 h-10 rounded-xl" />
        <Skeleton className="w-full h-5 rounded-lg" />
        <Skeleton className="w-4/5 h-5 rounded-lg" />
        <div className="pt-4">
          <Skeleton className="w-full h-3 rounded-full mb-2" />
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-12 h-4 rounded-md" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="w-40 h-7 rounded-lg mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-full h-18 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

export const QuizSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="w-36 h-6 rounded-lg" />
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>
      <Skeleton className="w-full h-3 rounded-full" />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6">
        <Skeleton className="w-3/4 h-8 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-full h-14 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Skeleton className="w-24 h-10 rounded-xl" />
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <Skeleton className="w-64 h-8 rounded-xl mb-2" />
        <Skeleton className="w-80 h-5 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="w-48 h-6 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
