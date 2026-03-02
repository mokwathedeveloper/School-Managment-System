'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/site/header';
import { cn } from '@/lib/utils';
import { Building2, Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl animate-pulse">
            <Building2 className="h-6 w-6" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa] selection:bg-blue-600 selection:text-white antialiased overflow-hidden">
      {/* Collapsible Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/60 transition-all duration-500 ease-in-out lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
        isSidebarOpen ? "w-72" : "w-[80px]",
        "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar collapsed={!isSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out",
        isSidebarOpen ? "lg:pl-72" : "lg:pl-[80px]"
      )}>
        <Header variant="dashboard" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-24 md:pt-28 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
