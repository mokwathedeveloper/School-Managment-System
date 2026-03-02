
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white pt-20">
      {/* Organic Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10 px-4 md:px-6 text-center space-y-8 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-[11px] font-bold tracking-wider uppercase">The Future of Institutional Operations</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          Precision management for <span className="text-blue-600">modern schools.</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          SchoolOS is the high-performance operating system for educational institutions. Automate workflows, secure your data, and scale with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-14 px-8 text-lg font-bold shadow-xl shadow-blue-600/10 hover:shadow-blue-600/20 transition-all bg-blue-600 text-white border-none rounded-2xl">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white text-slate-900 border-slate-200 hover:bg-slate-50 transition-all rounded-2xl">
            Book a Demo
          </Button>
        </div>

        {/* Floating Metrics Preview */}
        <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black text-slate-900">500+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Institutions</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black text-slate-900">1.2M</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Students</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black text-slate-900">KES 4B+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Processed</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black text-slate-900">99.9%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Uptime</span>
            </div>
        </div>
      </div>
    </header>
  );
}
