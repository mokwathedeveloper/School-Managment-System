'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="py-32 bg-white relative overflow-hidden organic-grain">
      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto rounded-[3.5rem] bg-slate-900 p-12 md:p-24 text-center text-white relative overflow-hidden group shadow-2xl shadow-slate-900/30">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative z-10 space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Ready for Deployment</span>
            </div>

            <div className="space-y-6">
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight">
                    Initialize your <br /> 
                    <span className="text-blue-500 italic text-5xl md:text-8xl">Institutional OS.</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                    Deploy SchoolOS today and transform your educational institution into a high-performance, data-driven ecosystem.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="premium" size="lg" className="w-full h-16 px-12 rounded-2xl shadow-2xl shadow-blue-600/40 text-sm font-black uppercase tracking-[0.2em] group/btn">
                  Initialize Terminal
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white border-none font-black uppercase tracking-widest text-[10px]">
                Request Technical Brief
              </Button>
            </div>

            <div className="pt-12 flex items-center justify-center gap-8 opacity-40">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001 Ready</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-white" />
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">GDPR Compliant</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
