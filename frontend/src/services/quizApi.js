import api from './api';

export const quizApi = {
  getQuiz: (courseId) => api.get(`/courses/${courseId}/quiz`),
  submitQuiz: (courseId, data) => api.post(`/courses/${courseId}/quiz/submit`, data),
  getCourseQuizResults: (courseId) => api.get(`/courses/${courseId}/quiz/results`),
  getQuizResultById: (resultId) => api.get(`/quiz/results/${resultId}`),
  getQuizStats: () => api.get('/quiz/stats'),
};
