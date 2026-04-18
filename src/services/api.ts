import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = async (username: string, password: string) => {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  const { data } = await api.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

export const getMe = () => api.get('/auth/me').then((r) => r.data);

// Generic CRUD
export const getAll = (endpoint: string, params?: Record<string, any>) =>
  api.get(`/${endpoint}`, { params }).then((r) => r.data);

export const getOne = (endpoint: string, id: number) =>
  api.get(`/${endpoint}/${id}`).then((r) => r.data);

export const create = (endpoint: string, data: any) =>
  api.post(`/${endpoint}`, data).then((r) => r.data);

export const update = (endpoint: string, id: number, data: any) =>
  api.put(`/${endpoint}/${id}`, data).then((r) => r.data);

export const remove = (endpoint: string, id: number) =>
  api.delete(`/${endpoint}/${id}`).then((r) => r.data);

// Media
export interface MediaFileOut {
  id: number;
  filename: string;
  original_name: string | null;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: number | null;
  created_at: string;
}

export const uploadFile = async (file: File, folder?: string): Promise<MediaFileOut> => {
  const form = new FormData();
  form.append('file', file);
  if (folder) form.append('folder', folder);
  const { data } = await api.post<MediaFileOut>('/media/upload', form);
  return data;
};

// Contact submissions
export const markAsRead = (id: number) =>
  api.put(`/contact-submissions/${id}/read`).then((r) => r.data);

export default api;
