import apiClient from './apiClient';

export const categoriesAPI = {
  getCategories: () => apiClient.get('/categories'),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`),
  getParentCategories: () => apiClient.get('/categories/parent')
};
