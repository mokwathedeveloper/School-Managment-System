'use client';

import React from 'react';
import { TrendingUp, Clock, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

const outcomes = [
  {
    label: "Efficiency Increase",
    value: "85%",
    description: "Reduction in manual administrative processing time via automated workflows.",
    icon: Clock,
    color: "blue"
  },
  {
    label: "Fee Recovery",
    value: "KES 2.4M",
    description: "Average increase in collection rates within the first two academic terms.",
    icon: TrendingUp,
    color: "emerald"
  },
  {
    label: "Data Integrity",
    value: "100%",
    description: "Cryptographic verification of all student and financial records across the node.",
    icon: ShieldCheck,
    color: "indigo"
  }
];

export function Outcomes() {
  return (
    <section className="py-32 bg-white relative overflow-hidden organic-grain">
      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    <Zap className="h-3.5 w-3.5 fill-emerald-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Measurable Impact</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
                    Performance <br />
                    <span className="text-slate-400 italic">quantified.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                    SchoolOS delivers tangible operational improvements through technical excellence and precision engineering.
                </p>
            </div>

            <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-start gap-4 transition-premium hover:bg-white hover:shadow-xl group">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-premium">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-tighter">Real-time Intelligence</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Access instantaneous reporting across all institutional metrics.</p>
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-start gap-4 transition-premium hover:bg-white hover:shadow-xl group">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-premium">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-tighter">Audit-Ready Compliance</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Every transaction and registry update is immutable and verifiable.</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid gap-6">
            {outcomes.map((outcome, i) => (
              <div 
                key={i} 
                className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-premium"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{outcome.label}</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{outcome.value}</h3>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-premium group-hover:scale-110 shadow-sm border ${
                    outcome.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                    outcome.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    <outcome.icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-4 leading-relaxed relative z-10">
                  {outcome.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
