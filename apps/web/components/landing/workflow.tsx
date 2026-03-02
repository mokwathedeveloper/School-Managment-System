'use client';

import React from 'react';
import { CheckCircle2, Layout, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: "Institutional Onboarding",
    description: "Provision your school node and configure the core identity registry in under 5 minutes.",
    icon: Layout
  },
  {
    title: "Data Synchronization",
    description: "Migrate legacy records or initialize fresh registries with our bulk ingestion tools.",
    icon: Zap
  },
  {
    title: "Operational Autonomy",
    description: "Initialize automated billing, scheduling, and communication protocols across all departments.",
    icon: ShieldCheck
  }
];

export function Workflow() {
  return (
    <section id="workflow" className="py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Engineered for <span className="text-blue-500 italic">speed.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed uppercase tracking-widest">
            Deploy elite institutional control in three distinct phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-px bg-white/10 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 group">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 rounded-[2rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 transition-premium group-hover:scale-110 group-hover:rotate-6">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Phase 0{i + 1}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-xs mx-auto text-sm">
                        {step.description}
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
            <div className="inline-flex items-center gap-3 p-2 pl-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Ready to initialize?</p>
                <button className="h-10 px-6 rounded-xl bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 hover:text-white transition-all">
                    Start Onboarding
                </button>
            </div>
        </div>
      </div>
    </section>
  );
}
