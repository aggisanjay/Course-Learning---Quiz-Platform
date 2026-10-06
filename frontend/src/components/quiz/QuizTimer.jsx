import React, { useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

export const QuizTimer = ({
  secondsLeft,
  setSecondsLeft,
  onTimeUp,
  isSubmitted,
}) => {
  useEffect(() => {
    if (isSubmitted || secondsLeft <= 0) return;

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isSubmitted, onTimeUp, setSecondsLeft]);

  // Format mm:ss
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isCritical = secondsLeft <= 30 && secondsLeft > 0;
  const isWarning = secondsLeft <= 60 && secondsLeft > 30;

  return (
    <div
      role="timer"
      aria-label="Quiz remaining time"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold border transition-colors ${
        isCritical
          ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
          : isWarning
          ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400'
          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
      ) : (
        <Timer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      )}
      <span>{formattedTime}</span>
    </div>
  );
};

export default QuizTimer;
