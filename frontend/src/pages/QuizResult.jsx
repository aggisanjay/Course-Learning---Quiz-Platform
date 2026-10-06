import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Info
} from 'lucide-react';
import { quizApi } from '../services/quizApi';
import ScoreCard from '../components/quiz/ScoreCard';
import QuizOption from '../components/quiz/QuizOption';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';

export const QuizResult = () => {
  const { idOrSlug, resultId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await quizApi.getQuizResultById(resultId);
      if (res.success && res.data.result) {
        setResult(res.data.result);

        // If passed, trigger celebratory confetti!
        if (res.data.result.passed) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#4F46E5', '#10B981', '#38BDF8', '#F59E0B'],
            });
          } catch {
            // Ignore confetti error
          }
        }
      } else {
        throw new Error('Quiz result not found');
      }
    } catch (err) {
      console.error('Error loading quiz result:', err);
      setError(err.message || 'Failed to retrieve quiz results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="w-full h-56 rounded-3xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <ErrorState
        title="Result Unavailable"
        message={error || 'Could not load quiz assessment results.'}
        onRetry={fetchResult}
      />
    );
  }

  const course = result.courseId;
  const courseSlugOrId = course?.slug || course?._id || idOrSlug;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <Link
          to={`/courses/${courseSlugOrId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course: {course?.title || 'Course'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to={`/courses/${courseSlugOrId}/quiz`}>
            <Button variant="secondary" size="sm" icon={RotateCcw}>
              Retry Quiz
            </Button>
          </Link>
          <Link to={`/courses/${courseSlugOrId}`}>
            <Button variant="primary" size="sm" icon={BookOpen}>
              Course Overview
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Score & Metrics Summary */}
      <ScoreCard result={result} />

      {/* Question Review Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Question Review
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review correct answers and detailed explanations for every question.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {result.answers?.length || 0} Questions
          </span>
        </div>

        <div className="space-y-6">
          {result.answers?.map((item, idx) => {
            const isCorrect = item.isCorrect;

            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4 transition-all ${
                  isCorrect
                    ? 'border-emerald-200/80 dark:border-emerald-900/40'
                    : 'border-rose-200/80 dark:border-rose-900/40'
                }`}
              >
                {/* Question title & correctness indicator */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-relaxed">
                      {item.questionText}
                    </h3>
                  </div>

                  <Badge variant={isCorrect ? 'success' : 'danger'} dot>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>

                {/* Options display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[0, 1, 2, 3].map((optIdx) => {
                    const isOptionCorrect = optIdx === item.correctOption;
                    const isOptionSelected = optIdx === item.selectedOption;
                    const isWrongSelection = isOptionSelected && !isOptionCorrect;

                    let bgStyle =
                      'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500';
                    let icon = null;

                    if (isOptionCorrect) {
                      bgStyle =
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-medium';
                      icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
                    } else if (isWrongSelection) {
                      bgStyle =
                        'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 font-medium';
                      icon = <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${bgStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-black/5 dark:bg-white/5 flex items-center justify-center font-bold">
                            {['A', 'B', 'C', 'D'][optIdx]}
                          </span>
                          <span className="line-clamp-2">
                            Option {['A', 'B', 'C', 'D'][optIdx]}
                            {isOptionCorrect && ' (Correct Answer)'}
                            {isWrongSelection && ' (Your Choice)'}
                          </span>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {item.explanation && (
                  <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block mb-0.5 font-semibold">
                        Explanation:
                      </strong>
                      <p>{item.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Navigation CTAs */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to={`/courses/${courseSlugOrId}/quiz`} className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" icon={RotateCcw} className="w-full sm:w-auto">
            Retry Quiz (Fresh Attempt)
          </Button>
        </Link>
        <Link to={`/courses/${courseSlugOrId}`} className="w-full sm:w-auto">
          <Button variant="primary" size="lg" icon={BookOpen} className="w-full sm:w-auto">
            Back to Course
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
