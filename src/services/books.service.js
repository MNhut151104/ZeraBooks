import apiClient from './apiClient';

export const booksAPI = {
  getBooks: (params) => apiClient.get('/books', { params }),
  getBookById: (id) => apiClient.get(`/books/${id}`),
  getBookReviews: (id) => apiClient.get(`/books/${id}/reviews`),
  getFeaturedBooks: () => apiClient.get('/books/featured'),
  getBestsellers: () => apiClient.get('/books/bestsellers'),
  getRelatedBooks: (id) => apiClient.get(`/books/${id}/related`)
};
