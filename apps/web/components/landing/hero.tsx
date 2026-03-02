'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Building2, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20 organic-grain">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10 px-4 md:px-6 text-center space-y-10 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-600 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Enterprise Institutional Operating System</span>
        </div>
        
        <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-slate-900 leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Precision for <br />
            <span className="text-blue-600 italic">Modern Schools.</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            The high-performance terminal for educational leadership. Automate complex workflows, secure institutional data, and scale operations with elite technical precision.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="premium" size="lg" className="w-full h-16 px-10 rounded-2xl shadow-2xl shadow-blue-600/20 group">
              Initialize Terminal
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl border-2 font-black uppercase tracking-widest text-xs">
            Documentation
          </Button>
        </div>

        {/* High-Contrast Trust Metrics */}
        <div className="pt-24 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto animate-in fade-in duration-1000 delay-700">
            <MetricItem label="Active Nodes" value="500+" icon={Building2} />
            <MetricItem label="Secure Identities" value="1.2M" icon={ShieldCheck} />
            <MetricItem label="Fee Throughput" value="KES 4B" icon={Zap} />
            <MetricItem label="System Uptime" value="99.9%" icon={Sparkles} />
        </div>
      </div>
    </header>
  );
}

function MetricItem({ label, value, icon: Icon }: any) {
    return (
        <div className="flex flex-col items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-premium shadow-sm">
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{label}</span>
            </div>
        </div>
    );
}
