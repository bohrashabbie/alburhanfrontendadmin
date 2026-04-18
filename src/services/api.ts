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

// Project images (many-per-project)
export interface ProjectImageOut {
  id: number;
  project_id: number;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export const listProjectImages = (projectId: number): Promise<ProjectImageOut[]> =>
  api.get(`/projects/${projectId}/images`).then((r) => r.data);

export const uploadProjectImage = async (
  projectId: number,
  file: File,
  options?: { sort_order?: number; is_active?: boolean },
): Promise<ProjectImageOut> => {
  const form = new FormData();
  form.append('file', file);
  if (options?.sort_order != null) form.append('sort_order', String(options.sort_order));
  if (options?.is_active != null) form.append('is_active', String(options.is_active));
  const { data } = await api.post<ProjectImageOut>(`/projects/${projectId}/images/upload`, form);
  return data;
};

export const deleteProjectImage = (imageId: number): Promise<void> =>
  api.delete(`/projects/images/${imageId}`).then((r) => r.data);

// Contact submissions
export const markAsRead = (id: number) =>
  api.put(`/contact-submissions/${id}/read`).then((r) => r.data);

export default api;
