
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2 } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="py-24 px-4 overflow-hidden relative">
      <div className="container mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white shadow-inner">
                <Building2 className="h-5 w-5 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest">Join 500+ Institutions</span>
            </div>
            
            <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight">
              Ready to modernize your school operations?
            </h2>
            
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              Deployment takes less than 24 hours. Start your institutional transformation today with SchoolOS.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-16 px-10 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white border-none rounded-2xl shadow-xl shadow-blue-600/20 transition-all">
                  Initialize Terminal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold bg-transparent text-white border-white/20 hover:bg-white/5 transition-all rounded-2xl">
                Speak to Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
