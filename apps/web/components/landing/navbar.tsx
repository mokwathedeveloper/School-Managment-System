
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Menu, X, ChevronRight, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-2xl border border-slate-200/50 px-4 md:px-6 py-3 rounded-2xl shadow-2xl shadow-slate-900/5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">SchoolOS</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
          <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#workflow" className="hover:text-blue-600 transition-colors">Workflow</Link>
          <Link href="#faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors px-2">Login</Link>
          <Link href="/login">
            <Button size="sm" className="rounded-xl px-5 font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white border-none">Get Started</Button>
          </Link>
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300 mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 text-base font-bold text-slate-600">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 flex items-center justify-between">
              Features <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="#workflow" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 flex items-center justify-between">
              Workflow <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 flex items-center justify-between">
              FAQ <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="text-blue-600 pt-4 border-t flex items-center justify-between">
              Login to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
