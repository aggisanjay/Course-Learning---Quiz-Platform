import React from 'react';
import { GraduationCap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-10 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">LearnFlow</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Learn. Practice. Track your progress.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <Link to="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Explore Courses
            </Link>
            <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              My Dashboard
            </Link>
            <Link to="/progress" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Analytics
            </Link>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
            Built with modern React, Express & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
