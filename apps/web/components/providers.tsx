'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { AuthProvider } from './auth-provider';
import { toast } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1, // Minimize noise on network flickers
        refetchOnWindowFocus: false,
      },
    },
    // Global error handling for all queries and mutations
    queryCache: new QueryCache({
      onError: (error: any) => {
        const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
        toast.error(`Operation Failed: ${message}`);
      },
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
