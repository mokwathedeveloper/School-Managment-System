'use client';

import React from 'react';
import { 
  Plus, 
  ChevronRight, 
  ShieldCheck, 
  Database, 
  Smartphone,
  Lock,
  Zap,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: "How secure is our institutional data?",
    answer: "Every school node is architected with complete data isolation. We utilize AES-256 encryption for data at rest and TLS 1.3 for all terminal communications, ensuring military-grade security.",
    icon: Lock
  },
  {
    question: "Does the M-Pesa integration support real-time settlement?",
    answer: "Yes. Our direct Daraja API integration triggers instant STK pushes and processes callbacks in milliseconds, updating student ledger balances in real-time.",
    icon: Smartphone
  },
  {
    question: "Can we migrate our existing student records?",
    answer: "Our ingestion engine supports bulk CSV and Excel synchronization. Our technical team also provides specialized migration scripts for legacy SQL databases.",
    icon: Database
  },
  {
    question: "Is there a limit to the number of school nodes?",
    answer: "The SchoolOS architecture is built on top of a highly-available multi-tenant infrastructure designed to scale to thousands of institutional nodes without latency impact.",
    icon: Globe
  }
];

export function Faq() {
  return (
    <section id="faq" className="py-32 bg-slate-50 relative overflow-hidden organic-grain">
      <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-5xl">
        <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                <ShieldCheck className="h-3.5 w-3.5 fill-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Technical Compliance</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
                Governance & <span className="text-blue-600">Trust.</span>
            </h2>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:border-blue-100 transition-premium cursor-default"
            >
              <div className="flex items-start gap-6">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 transition-premium group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:rotate-3 shadow-sm border border-slate-100">
                    <faq.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-3 pt-1">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                        {faq.question}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                        {faq.answer}
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-[2rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="h-20 w-20 text-white" />
            </div>
            <div className="relative z-10">
                <h4 className="text-2xl font-black tracking-tight leading-none">Still have technical questions?</h4>
                <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest font-bold">Our engineering team is available for deep-dive consultations.</p>
            </div>
            <button className="h-14 px-10 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-premium shadow-xl shadow-blue-600/20 relative z-10 active:scale-95">
                Contact Engineering
            </button>
        </div>
      </div>
    </section>
  );
}
