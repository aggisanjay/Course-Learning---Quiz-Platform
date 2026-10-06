import React from 'react';

export const QuestionNavigator = ({
  totalQuestions,
  currentIndex,
  onSelectIndex,
  answers = {}, // map of { [index]: selectedOption }
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Array.from({ length: totalQuestions }).map((_, i) => {
        const isCurrent = i === currentIndex;
        const isAnswered = answers[i] !== undefined && answers[i] !== null;

        let style =
          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300';

        if (isCurrent) {
          style =
            'bg-indigo-600 text-white font-bold border-indigo-600 shadow-sm shadow-indigo-600/30 ring-2 ring-indigo-500/40';
        } else if (isAnswered) {
          style =
            'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border-indigo-300 dark:border-indigo-800';
        }

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelectIndex(i)}
            aria-label={`Jump to Question ${i + 1}`}
            className={`w-9 h-9 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer ${style}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionNavigator;
