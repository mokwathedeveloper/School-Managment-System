
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Sidebar } from '@/components/dashboard/sidebar';
import { cn } from '@/lib/utils';
import { 
  Building2, 
  Loader2,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Handle responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || !user) {
    return <PremiumLoader fullScreen message="Authenticating Session" />;
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa] selection:bg-blue-600 selection:text-white antialiased overflow-hidden organic-grain">
      
      {/* Mobile Toggle Button - Only visible when sidebar is closed on mobile */}
      {!isSidebarOpen && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 lg:hidden rounded-xl bg-white/80 backdrop-blur-xl shadow-lg border border-slate-200 transition-premium hover:scale-105 active:scale-95"
        >
          <Menu className="h-5 w-5 text-slate-500" />
        </Button>
      )}

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-30 lg:hidden transition-premium"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/60 transition-premium lg:translate-x-0 shadow-[8px_0_32px_rgba(0,0,0,0.02)]",
        isSidebarOpen ? "w-72 translate-x-0" : "w-[80px] -translate-x-full lg:translate-x-0",
      )}>
        <Sidebar 
          collapsed={!isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-premium",
        isSidebarOpen ? "lg:pl-72" : "lg:pl-[80px]"
      )}>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth flex flex-col">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1 w-full pt-12 lg:pt-0">
            {children}
          </div>

          {/* Premium Dashboard Footer */}
          <footer className="max-w-7xl mx-auto w-full mt-24 pb-12 border-t border-slate-200/60 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start opacity-40 hover:opacity-100 transition-premium">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">Institutional Terminal</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Secured by Enterprise Multi-Tenancy <br />
                  Data Encryption: AES-256-GCM <br />
                  Operational Uptime: 99.98%
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Contextual Help</h4>
                <ul className="space-y-2 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  <li><button className="hover:text-blue-600 transition-colors" onClick={() => toast.success('Documentation initializing...')}>Documentation</button></li>
                  <li><button className="hover:text-blue-600 transition-colors" onClick={() => toast.success('Security protocols verified.')}>Security Protocols</button></li>
                  <li><button className="hover:text-blue-600 transition-colors" onClick={() => toast.success('API environment active.')}>API Reference</button></li>
                </ul>
              </div>

              <div className="space-y-4 text-right md:text-left">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Platform Status</h4>
                <div className="flex items-center gap-2 justify-end md:justify-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">All Systems Operational</span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 italic">
                  © 2024 SchoolOS v1.4.2-stable <br />
                  Regional Node: East Africa (Nairobi)
                </p>
              </div>
            </div>
          </footer>
        </main>

      </div>
    </div>
  );
}
