import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getAll: () => api.get('/user'),
  getById: (id: string) => api.get(`/user/${id}`),
  create: (data: any) => api.post('/user', data),
  update: (id: string, data: any) => api.put(`/user/${id}`, data),
  delete: (id: string) => api.delete(`/user/${id}`),
};

export const postApi = {
  getAll: () => api.get('/post'),
  getById: (id: string) => api.get(`/post/${id}`),
  create: (data: any) => api.post('/post', data),
  update: (id: string, data: any) => api.put(`/post/${id}`, data),
  delete: (id: string) => api.delete(`/post/${id}`),
};

export const paymentApi = {
  getAll: () => api.get('/payments'),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (data: any) => api.post('/payments', data),
  update: (id: string, data: any) => api.put(`/payments/${id}`, data),
  delete: (id: string) => api.delete(`/payments/${id}`),
};

export const transactionApi = {
  getAll: () => api.get('/transfer'),
  getById: (id: string) => api.get(`/transfer/${id}`),
  create: (data: any) => api.post('/transfer', data),
  update: (id: string, data: any) => api.put(`/transfer/${id}`, data),
  delete: (id: string) => api.delete(`/transfer/${id}`),
}; 