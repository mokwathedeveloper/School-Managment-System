
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function Outcomes() {
  const metrics = [
    {
      label: "Revenue Recovery",
      value: "22%",
      description: "Average increase in collection rates within the first 6 months of automation.",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      label: "Operational Efficiency",
      value: "40hr",
      description: "Monthly administrative time saved through automated reporting and billing.",
      icon: <Users className="h-5 w-5" />
    },
    {
      label: "Data Accuracy",
      value: "100%",
      description: "Elimination of manual entry errors in financial reconciliation and grading.",
      icon: <CheckCircle2 className="h-5 w-5" />
    }
  ];

  return (
    <section className="py-24 bg-white px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Measurable outcomes for <br /><span className="text-blue-600">institutional success.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              Moving beyond traditional management. We provide the technical infrastructure to eliminate revenue leakage and optimize academic trajectories.
            </p>
            
            <div className="space-y-4">
                {["Real-time institutional oversight", "Bank-grade financial security", "Automated student performance tracking"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-slate-700 font-bold">
                        <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                        {item}
                    </div>
                ))}
            </div>
          </div>

          <div className="grid gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="border-slate-100 shadow-sm rounded-3xl hover:border-blue-200 transition-colors">
                <CardContent className="p-8 flex items-center gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
                    {metric.icon}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">{metric.value}</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{metric.label}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mt-1">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
