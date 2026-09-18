import apiClient from './apiClient';

export const reviewsAPI = {
  createReview: (reviewData) => apiClient.post('/reviews', reviewData),
  getMyReviews: () => apiClient.get('/reviews/my-reviews'),
  updateReview: (id, reviewData) => apiClient.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`)
};
