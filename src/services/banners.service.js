import apiClient from './apiClient';

export const bannersAPI = {
  getBanners: (params = {}) => apiClient.get('/banners', { params }),
  getBannerById: (id) => apiClient.get(`/banners/${id}`),
  createBanner: (data) => apiClient.post('/banners', data),
  updateBanner: (id, data) => apiClient.put(`/banners/${id}`, data),
  reorderBanners: (bannerOrders) => apiClient.put('/banners/reorder', { bannerOrders }),
  deleteBanner: (id) => apiClient.delete(`/banners/${id}`),
  uploadImage: (id, formData) => apiClient.post(`/banners/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};
