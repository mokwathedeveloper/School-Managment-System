'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import apiClient from '@/lib/api-client';

interface TenantSettings {
  name: string;
  logo_url?: string;
  primary_color?: string;
  currency?: string;
  timezone?: string;
}

interface TenantContextType {
  settings: TenantSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TenantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user?.school_id) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    try {
      // Assuming endpoint to fetch current school/tenant settings
      const response = await apiClient.get(`/schools/${user.school_id}`);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch tenant settings:', error);
      // Fallback to basic info from user object
      setSettings({
        name: user.school?.name || 'Institutional Terminal',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user?.school_id]);

  return (
    <TenantContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
