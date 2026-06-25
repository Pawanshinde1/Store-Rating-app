import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
};

export const storeAPI = {
  getStores: (params) => api.get('/stores', { params }),
  getStoreById: (id) => api.get(`/stores/${id}`),
  createStore: (data) => api.post('/stores', data),
  getOwnedStore: () => api.get('/stores/my-store'),
  getStoreRatings: (id) => api.get(`/stores/${id}/ratings`),
};

export const ratingAPI = {
  getUserRatings: () => api.get('/ratings'),
  getUserRating: (storeId) => api.get(`/ratings/${storeId}`),
  submitRating: (data) => api.post('/ratings', data),
  updateRating: (storeId, rating) => api.put(`/ratings/${storeId}`, { rating }),
};

export const dashboardAPI = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getStoreOwnerDashboard: () => api.get('/dashboard/store-owner'),
};
