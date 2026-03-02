
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Sidebar } from '@/components/dashboard/sidebar';
import { 
  Bell, 
  Search, 
  User, 
  Menu, 
  ChevronRight, 
  Settings, 
  LogOut,
  Sparkles,
  Command,
  ChevronsUpDown,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl animate-pulse">
            <Building2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Terminal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa] selection:bg-blue-600 selection:text-white antialiased overflow-hidden">
      {/* Subtle Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />

      {/* Collapsible Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/60 transition-all duration-500 ease-in-out lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
        isSidebarOpen ? "w-72" : "w-[80px]",
        !isSidebarOpen && "lg:w-[80px]",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar collapsed={!isSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out",
        isSidebarOpen ? "lg:pl-72" : "lg:pl-[80px]"
      )}>
        {/* Premium Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-slate-500" />
            </Button>
            
            {/* Context Breadcrumb / School Switcher */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-all group">
                <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Building2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{user.school?.name || 'Academic Institution'}</span>
                <ChevronsUpDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>

            <div className="h-10 flex-1 max-w-md relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input 
                placeholder="Command palette... (⌘K)" 
                className="pl-10 h-10 border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-600/20 transition-all rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-4">
            <Button variant="ghost" size="icon" className="relative group rounded-xl hover:bg-slate-100 transition-colors" onClick={() => toast.success('Institutional alerts are synchronized.')}>
              <Bell className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </Button>
            
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1">{user.first_name} {user.last_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.role.replace('_', ' ')}</p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <User className="h-5 w-5" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-slate-200 shadow-2xl p-2">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Account Settings</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer" onClick={() => router.push('/dashboard/settings/profile')}>
                  <User className="mr-2 h-4 w-4" /> <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" /> <span>Institution Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" /> <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
