
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
  ChevronRight
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
    { name: 'Features', href: '/#features' },
    { name: 'Workflow', href: '/#workflow' },
    { name: 'FAQ', href: '/#faq' },
  ];

  const logo = (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105 active:scale-95">
        <Building2 className="h-5 w-5" />
      </div>
      <span className="text-xl font-black tracking-tighter text-slate-900">SchoolOS</span>
    </Link>
  );

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      scrolled ? "py-3 px-4 md:px-8" : "py-6 px-4 md:px-8"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 px-4 md:px-6 py-3 rounded-2xl",
        scrolled ? "bg-white/80 backdrop-blur-2xl border border-slate-200/50 shadow-2xl shadow-slate-900/5" : "bg-transparent"
      )}>
        {logo}

        {variant === 'landing' && (
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="hover:text-blue-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {variant === 'landing' ? (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors px-2">Login</Link>
              <Link href="/login">
                <Button size="sm" className="rounded-xl px-5 font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white border-none">Get Started</Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Operational</span>
            </div>
          )}

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                  <Menu className="h-6 w-6 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="rounded-l-[2rem] border-none shadow-2xl p-8">
                <SheetHeader className="mb-12">
                  <SheetTitle>{logo}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8">
                  {variant === 'landing' && navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      className="text-2xl font-black text-slate-900 hover:text-blue-600 transition-colors flex items-center justify-between"
                    >
                      {link.name}
                      <ChevronRight className="h-6 w-6 text-slate-300" />
                    </Link>
                  ))}
                  <Link 
                    href="/login" 
                    className="text-2xl font-black text-blue-600 pt-8 border-t flex items-center justify-between"
                  >
                    Get Started
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
