import { create } from 'zustand';
import api from '@/lib/axios';

type Role = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPERADMIN';

interface User {
    name:string
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  register: (name:string, email: string, password: string, role: Role) => Promise<void>;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  register: async (name, email, password, role) => {
    try {
      set({ loading: true });
      const res = await api.post('/auth/register', {name, email, password, role });
      set({ user: res.data.user, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Registration failed' });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password, role) => {
    try {
      set({ loading: true });
      const res = await api.post(`/auth/login?role=${role}`, { email, password });
      set({ user: res.data.user, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Login failed' });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null });
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  },

  getMe: async () => {
    try {
      set({ loading: true });
      const res = await api.get('/user/me');
      set({ user: res.data.user, error: null });
    } catch (err: any) {
      set({ user: null, error: 'Not authenticated' });
    } finally {
      set({ loading: false });
    }
  }
}));
