import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2 mb-8">
        The page you are looking for does not exist or may have been moved. Let's get you back on track!
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" size="lg" icon={Home}>
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/courses">
          <Button variant="secondary" size="lg" icon={BookOpen}>
            Browse Courses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
