import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isLoading: false });
      } else {
        set({ token: null, user: null, isLoading: false });
      }
    } catch (error) {
      set({ token: null, user: null, isLoading: false });
    }
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { access_token, user } = response.data;

    await AsyncStorage.setItem('access_token', access_token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    set({ token: access_token, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));
