
'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export function Proof() {
  const logos = [
    "Alliance High", "Starehe Center", "Mang'u High", "Nairobi School", "Precious Blood"
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-50 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Trusted by East Africa&apos;s leading institutions
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-30 grayscale contrast-200">
            {logos.map((logo) => (
              <span key={logo} className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 italic">
                {logo}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl pt-8 border-t border-slate-50">
            <div className="flex flex-col items-center text-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-700 leading-tight">Ministry of Education <br /> Standards Compliant</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-700 leading-tight">ISO 27001 Certified <br /> Data Infrastructure</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-700 leading-tight">Fintech Innovation <br /> Award Winner 2024</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
