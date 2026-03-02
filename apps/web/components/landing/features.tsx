'use client';

import React from 'react';
import { 
  CreditCard, 
  BarChart3, 
  Users, 
  Zap, 
  BookOpen, 
  ShieldCheck,
  ChevronRight,
  Shield,
  Smartphone,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: "Financial Engine",
    description: "Automated fee collection via integrated M-Pesa STK push. Real-time reconciliation and institutional reporting.",
    icon: CreditCard,
    color: "blue"
  },
  {
    title: "Registry OS",
    description: "Multi-tenant student and staff management with biometric-ready identification and secure academic logs.",
    icon: Users,
    color: "emerald"
  },
  {
    title: "Predictive Analytics",
    description: "Big data processing for academic performance tracking and institutional growth trajectory modeling.",
    icon: BarChart3,
    color: "indigo"
  },
  {
    title: "High-Performance LMS",
    description: "Courseware distribution hub with centralized assignment tracking and automated evaluation pipelines.",
    icon: BookOpen,
    color: "purple"
  },
  {
    title: "Security Core",
    description: "Enterprise-grade encryption (AES-256) for all institutional data. Secure gate entry and visitor logging.",
    icon: ShieldCheck,
    color: "orange"
  },
  {
    title: "Unified API",
    description: "Seamlessly integrate external hardware and software modules via our high-performance terminal endpoints.",
    icon: Cpu,
    color: "rose"
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 bg-white relative overflow-hidden organic-grain">
      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 mb-6">
            <Zap className="h-3.5 w-3.5 fill-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">Advanced Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
            Institutional power <br />
            <span className="text-slate-400">delivered with precision.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-premium"
            >
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm transition-premium group-hover:scale-110 group-hover:rotate-3",
                feature.color === 'blue' && "bg-blue-50 text-blue-600",
                feature.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                feature.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                feature.color === 'purple' && "bg-purple-50 text-purple-600",
                feature.color === 'orange' && "bg-orange-50 text-orange-600",
                feature.color === 'rose' && "bg-rose-50 text-rose-600",
              )}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                {feature.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 opacity-0 group-hover:opacity-100 transition-premium cursor-pointer">
                Explore Protocol <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
