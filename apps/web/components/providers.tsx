'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { AuthProvider } from './auth-provider';
import { TenantProvider } from './tenant-provider';
import { NotificationProvider } from './notification-provider';
import { toast, Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error: any) => {
        const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
        toast.error(`Terminal Error: ${message}`, {
            style: {
                borderRadius: '16px',
                background: '#fff',
                color: '#0f172a',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '1px solid #f1f5f9',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
            }
        });
      },
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-right" />
          </NotificationProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
