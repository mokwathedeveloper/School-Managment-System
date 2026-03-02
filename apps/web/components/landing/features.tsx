
'use client';

import React from 'react';
import { 
  CreditCard, 
  BarChart3, 
  Users, 
  Zap, 
  BookOpen, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Features() {
  const features = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Automated Finance",
      description: "Real-time M-Pesa reconciliation and bulk invoicing. Eliminate revenue leakage with automated tracking.",
      iconBg: "bg-blue-600"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Academic Insights",
      description: "Auto-grading rubrics and instant report card generation. Track student trajectories with data.",
      iconBg: "bg-emerald-600"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Parent Engagement",
      description: "A secure dedicated portal for parents to track progress, receive alerts, and pay fees instantly.",
      iconBg: "bg-purple-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Live Attendance",
      description: "Digital registers with instant SMS alerts to parents. Monitor institutional presence in real-time.",
      iconBg: "bg-amber-600"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Resource Management",
      description: "Centralized library systems, hostel allocation, and transport route optimization in one place.",
      iconBg: "bg-rose-600"
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Tenant Isolation",
      description: "Enterprise-grade security with strict multi-tenant data isolation. Your institution is a fortress.",
      iconBg: "bg-indigo-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white px-4 md:px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">Everything your institution needs to <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">operate at scale.</span></h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed italic">Engineered for precision, designed for absolute simplicity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group space-y-6">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                feature.iconBg
              )}>
                {feature.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer">
                Explore capabilities <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
