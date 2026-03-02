
'use client';

import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Faq() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: "Is my school's data secure?",
      answer: "Yes. We employ bank-grade encryption, regular security audits, and strict multi-tenant isolation. Your school's data is private, protected, and accessible only by authorized personnel."
    },
    {
      question: "How does the M-Pesa integration work?",
      answer: "We connect directly to your Safaricom Paybill via the Daraja API. When a parent pays via your Paybill number, our system receives a real-time callback and automatically reconciles the student's invoice."
    },
    {
      question: "Can we migrate our existing data?",
      answer: "Absolutely. Our smart bulk-onboarding engine allows you to upload CSV files for students, staff, and historical records. Our team also provides assisted migration services for complex datasets."
    },
    {
      question: "Does it support multiple curriculums?",
      answer: "SchoolOS is flexible. Whether you follow CBC, 8-4-4, British Curriculum (IGCSE), or any other system, our grading rubrics and report card templates can be customized to fit your academic standards."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold tracking-wider uppercase">Support & Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <span className="font-bold text-slate-900 md:text-lg">{faq.question}</span>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-slate-400 transition-transform duration-500",
                    openIndex === index && "rotate-180"
                  )} />
                </button>
                <div className={cn(
                  "px-6 pb-6 md:px-8 md:pb-8 text-slate-500 font-medium leading-relaxed transition-all duration-500",
                  openIndex === index ? "block animate-in fade-in slide-in-from-top-2" : "hidden"
                )}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
