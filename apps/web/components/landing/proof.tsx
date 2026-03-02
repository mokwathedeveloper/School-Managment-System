'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';

export function Proof() {
  const logos = [
    "Alliance High", "Starehe Center", "Mang'u High", "Nairobi School", "Precious Blood"
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-50 px-4 relative overflow-hidden organic-grain">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center gap-16">
          <div className="flex flex-col items-center gap-4">
            <div className="h-px w-12 bg-blue-600/20" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">
                Institutional Trust Registry
            </p>
            <div className="h-px w-12 bg-blue-600/20" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 opacity-20 grayscale contrast-200 hover:opacity-40 transition-premium duration-700">
            {logos.map((logo) => (
              <span key={logo} className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 italic hover:text-blue-600 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl pt-16 border-t border-slate-50">
            <ProofCard 
                icon={<ShieldCheck className="h-6 w-6 text-blue-600" />}
                title="Ministry Compliant"
                desc="Fully aligned with regional educational governance standards."
                bg="bg-blue-50"
            />
            <ProofCard 
                icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
                title="ISO 27001 Infrastructure"
                desc="Military-grade encryption for institutional data at rest."
                bg="bg-emerald-50"
            />
            <ProofCard 
                icon={<Award className="h-6 w-6 text-purple-600" />}
                title="Innovation Leader"
                desc="Voted Best Institutional FinTech Solution in East Africa 2024."
                bg="bg-purple-50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofCard({ icon, title, desc, bg }: any) {
    return (
        <div className="flex flex-col items-center text-center gap-4 group transition-premium hover:-translate-y-1">
            <div className={`h-14 w-14 rounded-2xl ${bg} flex items-center justify-center shadow-sm border border-white transition-premium group-hover:scale-110 group-hover:rotate-3`}>
                {icon}
            </div>
            <div className="space-y-2">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-tighter">{title}</h4>
                <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[200px] mx-auto italic">{desc}</p>
            </div>
        </div>
    );
}
