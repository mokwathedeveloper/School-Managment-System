'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Bell, Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Initializing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden relative">
      {/* Sidebar Overlay (Mobile Only) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex max-w-md relative group hidden sm:flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search student, staff, or invoice..." 
                className="pl-10 h-10 border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 ml-4">
            <Button variant="ghost" size="icon" className="relative group hidden sm:flex" onClick={() => alert('Notifications coming soon!')}>
              <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-8 w-px bg-border mx-1 md:mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold truncate max-w-[150px]">{user.first_name} {user.last_name}</p>
                <p className="text-[10px] text-muted-foreground opacity-75 truncate max-w-[150px]">{user.email}</p>
              </div>
              <div 
                className="h-9 w-9 md:h-10 md:w-10 rounded-full border bg-muted/50 flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={() => alert('Profile settings coming soon!')}
              >
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
