import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Courses from '../pages/Courses';
import CourseDetail from '../pages/CourseDetail';
import LessonDetail from '../pages/LessonDetail';
import Quiz from '../pages/Quiz';
import QuizResult from '../pages/QuizResult';
import MyProgress from '../pages/MyProgress';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/courses" replace />
          )
        }
      />

      {/* Auth routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Courses Catalog & Overview (Public / optionally personalized) */}
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:idOrSlug" element={<CourseDetail />} />

      {/* Protected Learning & Quiz Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:idOrSlug/lessons/:lessonId"
        element={
          <ProtectedRoute>
            <LessonDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:idOrSlug/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:idOrSlug/quiz/result/:resultId"
        element={
          <ProtectedRoute>
            <QuizResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <MyProgress />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
