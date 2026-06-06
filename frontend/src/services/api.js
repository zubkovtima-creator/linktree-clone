import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/');

      if (isAuthRoute) {
        error.userMessage = error.response?.data?.message || 'Неверные данные для входа';
      } else {
        error.userMessage = 'Сессия истекла. Войдите снова.';
        if (onUnauthorized) {
          onUnauthorized();
        }
      }
    } else if (status === 404) {
      error.userMessage = 'Не найдено';
    } else if (status >= 500) {
      error.userMessage = 'Что-то пошло не так';
    } else if (!error.userMessage) {
      error.userMessage = error.response?.data?.message || 'Произошла ошибка';
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Произошла ошибка') {
  return error?.userMessage || error?.response?.data?.message || fallback;
}

export async function register(email, username, password) {
  const { data } = await api.post('/auth/register', { email, username, password });
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export default api;
