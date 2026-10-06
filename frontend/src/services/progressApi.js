import api from './api';

export const progressApi = {
  getOverallProgress: () => api.get('/progress'),
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
  completeLesson: (courseId, lessonId) =>
    api.post(`/progress/${courseId}/lessons/${lessonId}/complete`),
};
