import api from './api';

export const courseApi = {
  getCourses: (params = {}) => api.get('/courses', { params }),
  getCourse: (idOrSlug) => api.get(`/courses/${idOrSlug}`),
  getCourseLessons: (idOrSlug) => api.get(`/courses/${idOrSlug}/lessons`),
  getLessonDetail: (idOrSlug, lessonId) => api.get(`/courses/${idOrSlug}/lessons/${lessonId}`),
};
