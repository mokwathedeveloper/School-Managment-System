
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, ShieldCheck, Zap } from 'lucide-react';

export function Workflow() {
  const steps = [
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: "1. Institutional Onboarding",
      description: "Quickly register your institution and bulk-import students, staff, and historical records through our automated migration engine."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "2. Workflow Automation",
      description: "Activate real-time M-Pesa reconciliation, automated grading rubrics, and instant attendance alerts to transform your operations."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "3. Scalable Governance",
      description: "Monitor multi-tenant data securely, track academic trajectories, and make data-driven decisions through our analytical command center."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">The implementation lifecycle.</h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed italic">Engineered for immediate operational impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-none bg-white/50 backdrop-blur-sm shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-500 group rounded-[2.5rem]">
              <CardContent className="p-8 md:p-10 space-y-6">
                <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
