import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const letters = ['A', 'B', 'C', 'D'];

export const QuizOption = ({
  optionText,
  index,
  isSelected = false,
  onSelect,
  disabled = false,
  // Review mode props
  isReview = false,
  isCorrect = false,
  isWrongSelected = false,
}) => {
  const letter = letters[index] || `${index + 1}`;

  let containerStyles =
    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200';
  let badgeStyles =
    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-900/60 dark:group-hover:text-indigo-300';

  if (isReview) {
    if (isCorrect) {
      containerStyles =
        'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20';
      badgeStyles = 'bg-emerald-600 text-white';
    } else if (isWrongSelected) {
      containerStyles =
        'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20';
      badgeStyles = 'bg-rose-600 text-white';
    } else {
      containerStyles = 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 opacity-60';
      badgeStyles = 'bg-slate-200 dark:bg-slate-800 text-slate-400';
    }
  } else if (isSelected) {
    containerStyles =
      'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/30';
    badgeStyles = 'bg-indigo-600 text-white font-bold shadow-sm';
  }

  return (
    <motion.button
      type="button"
      whileHover={disabled ? {} : { scale: 1.005 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
      onClick={() => !disabled && onSelect && onSelect(index)}
      disabled={disabled}
      className={`group w-full text-left p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all cursor-pointer disabled:cursor-default select-none ${containerStyles}`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${badgeStyles}`}
        >
          {isReview && isCorrect ? (
            <Check className="w-5 h-5" />
          ) : isReview && isWrongSelected ? (
            <X className="w-5 h-5" />
          ) : (
            letter
          )}
        </div>
        <span className="text-sm sm:text-base font-medium leading-relaxed">
          {optionText}
        </span>
      </div>

      {isSelected && !isReview && (
        <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}
    </motion.button>
  );
};

export default QuizOption;
