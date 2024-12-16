// src/services/api.ts

import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.url === '/login/') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    try {
      const response = await api.post('/login/', formData.toString());
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'Authentication failed');
      }
      throw error;
    }
  },
};

export const chatApi = {
  sendMessage: async (question: string, sessionId?: number) => {
    try {
      const response = await api.post('/chat/query/', JSON.stringify({ 
        question,
        session_id: sessionId 
      }));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'Failed to send message');
      }
      throw error;
    }
  },
};

export const sessionApi = {
  getUserSessions: async () => {
    try {
      const response = await api.get(`user/chat/sessions`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch sessions');
      }
      throw error;
    }
  },

  getSessionMessages: async (sessionId: number) => {
    try {
      const response = await api.get(`user/chat/sessions/${sessionId}/qa`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch session messages');
      }
      throw error;
    }
  },

  deleteSession: async (sessionId: number, token: string | null) => {
    try {
      const response = await api.delete(`/chat/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'Failed to delete session');
      }
      throw error;
    }
  },
};

export default api;