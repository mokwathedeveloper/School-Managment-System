'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Building2, 
  Menu, 
  X, 
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  variant?: 'landing' | 'dashboard';
}

export function Header({ variant = 'landing' }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Capabilities', href: '/#features' },
    { name: 'Institutional Workflow', href: '/#workflow' },
    { name: 'Compliance', href: '/#faq' },
  ];

  const logo = (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20 transition-premium group-hover:scale-110 active:scale-95 group-hover:rotate-3">
        <Building2 className="h-6 w-6" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">SchoolOS</span>
    </Link>
  );

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-premium",
      scrolled ? "py-4 px-4 md:px-8" : "py-8 px-4 md:px-8"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between transition-premium px-6 py-3 rounded-[2rem]",
        scrolled ? "bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)]" : "bg-transparent"
      )}>
        {logo}

        {variant === 'landing' && (
          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="hover:text-blue-600 transition-premium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-blue-600 transition-premium group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {variant === 'landing' ? (
            <>
              <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-blue-600 transition-premium px-2">Access Portal</Link>
              <Link href="/login">
                <Button variant="premium" size="sm" className="rounded-xl px-6 shadow-xl shadow-blue-600/10">Initialize OS</Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl border-2 border-slate-50 bg-white shadow-sm cursor-default group transition-premium hover:border-blue-100">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] leading-none group-hover:text-blue-600 transition-colors">Node Operational</span>
            </div>
          )}

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 border-2 border-transparent active:border-blue-100">
                  <Menu className="h-6 w-6 text-slate-900" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="rounded-l-[3rem] border-none shadow-2xl p-10 flex flex-col bg-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <SheetHeader className="mb-16 text-left relative z-10">
                  <SheetTitle>{logo}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-10 relative z-10">
                  {variant === 'landing' && navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      className="text-3xl font-black text-slate-900 hover:text-blue-600 transition-premium flex items-center justify-between group"
                    >
                      {link.name}
                      <ChevronRight className="h-8 w-8 text-slate-200 group-hover:text-blue-600 group-hover:translate-x-2 transition-premium" />
                    </Link>
                  ))}
                  <div className="mt-auto pt-10 border-t border-slate-50">
                    <Link 
                        href="/login" 
                        className="flex flex-col gap-4"
                    >
                        <Button variant="premium" size="lg" className="rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20">
                            Initialize Portal
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                  </div>
                </div>
                <div className="mt-auto relative z-10">
                    <div className="flex items-center gap-3 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">End-to-End Secure</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Enterprise Encryption Active</p>
                        </div>
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
