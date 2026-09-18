import apiClient from './apiClient';

export const ordersAPI = {
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  getMyOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`),
  trackOrder: (data) => apiClient.post('/orders/track', data),
  requestReturn: (id, data) => apiClient.post(`/orders/${id}/return-request`, data),
  processReturn: (id, data) => apiClient.put(`/orders/${id}/process-return`, data)
};
