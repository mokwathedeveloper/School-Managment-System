'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: any;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const savedUser = localStorage.getItem('user');
      const token = Cookies.get('access_token');
      
      if (token && savedUser) {
        try {
          // If we have a token, we should verify it with the backend
          // Assuming an endpoint that returns the current user context
          const response = await apiClient.get('/users/profile');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Session validation failed:', error);
          // If validation fails (e.g., token expired), clear everything
          logout();
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      console.log('Attempting login to:', apiClient.defaults.baseURL + '/auth/login');
      const response = await apiClient.post('/auth/login', credentials);
      const { access_token, user } = response.data;
      
      // Store token in secure cookie
      Cookies.set('access_token', access_token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response) {
        console.error('Login API error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Login network error (no response):', error.request);
      } else {
        console.error('Login request setup error:', error.message);
      }
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
