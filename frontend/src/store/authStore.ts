import { create } from 'zustand';
import { apiClient, User, LoginData, RegisterData } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  login: async (data: LoginData) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.login(data);
      const user = await apiClient.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Login failed', 
        isLoading: false,
        isAuthenticated: false
      });
    }
  },
  
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.register(data);
      await apiClient.login({ username: data.email, password: data.password });
      const user = await apiClient.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Registration failed', 
        isLoading: false,
        isAuthenticated: false
      });
    }
  },
  
  logout: () => {
    apiClient.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  fetchUser: async () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('access_token')) {
      return;
    }
    
    set({ isLoading: true });
    try {
      const user = await apiClient.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      apiClient.logout();
    }
  }
})); 