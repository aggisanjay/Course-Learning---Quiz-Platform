import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Clock,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  RotateCcw
} from 'lucide-react';
import { quizApi } from '../services/quizApi';
import { courseApi } from '../services/courseApi';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';
import QuizTimer from '../components/quiz/QuizTimer';
import QuizOption from '../components/quiz/QuizOption';
import QuestionNavigator from '../components/quiz/QuestionNavigator';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import { QuizSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';

export const Quiz = () => {
  const { idOrSlug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      // First resolve course to get courseId
      const courseRes = await courseApi.getCourse(idOrSlug);
      if (!courseRes.success || !courseRes.data.course) {
        throw new Error('Course not found');
      }
      const courseObj = courseRes.data.course;
      setCourse(courseObj);

      // Fetch sanitized quiz
      const quizRes = await quizApi.getQuiz(courseObj._id);
      if (quizRes.success && quizRes.data) {
        setQuizData(quizRes.data);
        const limitSeconds = (quizRes.data.timeLimitMinutes || 10) * 60;
        setSecondsLeft(limitSeconds);
      } else {
        throw new Error('No quiz found for this course');
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please log in to take the course quiz.');
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    fetchQuiz();
  }, [idOrSlug, isAuthenticated]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const handleSelectOption = (optionIndex) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting || isSubmitted || !quizData || !course) return;

    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      // Calculate elapsed time in seconds
      const elapsedSeconds = startTime
        ? Math.round((Date.now() - startTime) / 1000)
        : (quizData.timeLimitMinutes * 60) - secondsLeft;

      // Prepare payload
      const submittedAnswers = Object.entries(answers).map(([qIdx, optIdx]) => ({
        questionIndex: Number(qIdx),
        selectedOption: optIdx,
      }));

      const res = await quizApi.submitQuiz(course._id, {
        answers: submittedAnswers,
        timeSpentSeconds: Math.max(1, elapsedSeconds),
      });

      if (res.success && res.data.result) {
        setIsSubmitted(true);
        toast.success('Quiz submitted successfully!');
        navigate(`/courses/${course.slug || course._id}/quiz/result/${res.data.result._id}`);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      toast.error(err.message || 'Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (!isSubmitted && !isSubmitting) {
      toast.warning('Time is up! Submitting your quiz automatically...');
      handleSubmitQuiz();
    }
  };

  if (loading) {
    return <QuizSkeleton />;
  }

  if (error || !quizData || !course) {
    return (
      <ErrorState
        title="Quiz Unavailable"
        message={error || 'Could not load quiz for this course.'}
        onRetry={fetchQuiz}
      />
    );
  }

  const totalQuestions = quizData.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // 1. INTRO SCREEN BEFORE STARTING
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {course.title}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {quizData.title || 'Course Assessment Quiz'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              {quizData.instructions ||
                'Test your understanding of the concepts covered in this course. You can review your score and explanations upon completion.'}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <HelpCircle className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Questions</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {totalQuestions}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Time Limit</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {quizData.timeLimitMinutes} mins
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Passing Score</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {quizData.passingScore || 70}%
              </p>
            </div>
          </div>

          {/* Guidelines bullet points */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 text-left text-xs text-slate-600 dark:text-slate-400 space-y-1.5 max-w-md mx-auto">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Before you begin:</p>
            <p>• The timer starts as soon as you click Start Quiz.</p>
            <p>• You can freely navigate back and forth between questions.</p>
            <p>• The quiz will automatically submit when the timer expires.</p>
            <p>• Retries are unlimited and all attempts are safely recorded.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={`/courses/${course.slug || course._id}`}>
              <Button variant="ghost" size="lg">
                Back to Course
              </Button>
            </Link>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartQuiz}
              icon={ArrowRight}
              iconPosition="right"
              className="px-8 shadow-md shadow-indigo-600/30"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUIZ QUESTION SCREEN
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:px-6 shadow-sm">
        <div>
          <span className="text-xs text-slate-400 font-medium">
            {course.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h2>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              ({answeredCount}/{totalQuestions} answered)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <QuizTimer
            secondsLeft={secondsLeft}
            setSecondsLeft={setSecondsLeft}
            onTimeUp={handleTimeUp}
            isSubmitted={isSubmitted}
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            disabled={isSubmitting}
            icon={Send}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Progress Line */}
      <ProgressBar
        value={answeredCount}
        max={totalQuestions}
        size="sm"
      />

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Multiple Choice
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1 leading-snug">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* 4 Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <QuizOption
              key={idx}
              index={idx}
              optionText={option}
              isSelected={answers[currentQuestionIndex] === idx}
              onSelect={handleSelectOption}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation & Question Jumper */}
      <div className="space-y-4">
        {/* Number buttons navigator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-semibold text-slate-500">
            Jump to question:
          </span>
          <QuestionNavigator
            totalQuestions={totalQuestions}
            currentIndex={currentQuestionIndex}
            onSelectIndex={(idx) => setCurrentQuestionIndex(idx)}
            answers={answers}
          />
        </div>

        {/* Previous & Next Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            size="md"
            icon={ArrowLeft}
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              variant="primary"
              size="md"
              icon={Send}
              iconPosition="right"
              onClick={() => setShowSubmitModal(true)}
              isLoading={isSubmitting}
              className="px-6"
            >
              Finish & Submit
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={isSubmitting}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal Before Submission */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Quiz Assessment?"
        description={`You have answered ${answeredCount} of ${totalQuestions} questions.`}
      >
        <div className="space-y-4">
          {answeredCount < totalQuestions && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                You still have {totalQuestions - answeredCount} unanswered question(s). Unanswered questions will be scored as incorrect.
              </span>
            </div>
          )}

          <p className="text-xs text-slate-500">
            Once submitted, your answers will be validated by the server and you'll immediately see your score and explanations.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowSubmitModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitQuiz}
              isLoading={isSubmitting}
              icon={Send}
            >
              Yes, Submit Quiz
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Quiz;
