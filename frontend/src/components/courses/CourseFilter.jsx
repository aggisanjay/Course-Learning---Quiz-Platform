import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const categories = ['All', 'Frontend', 'Backend', 'Database', 'AI & Data', 'Full-Stack'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const CourseFilter = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  onClearFilters,
  totalResults,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* Top Bar: Proportional Search Bar + Level Filter + Result Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Compact, proportional Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, topics, or skills..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side: Difficulty Level pills & Result Count */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
          {/* Level Pills */}
          <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase px-1.5 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Level:
            </span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Total Counter & Clear Action */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
              {totalResults} {totalResults === 1 ? 'course' : 'courses'}
            </span>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Reset all search filters"
              >
                <X className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs: Sleek Horizontal Pill Group */}
      <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto pb-0.5 no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 mr-1">
          Category:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;
