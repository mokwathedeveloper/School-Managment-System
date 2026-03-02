
'use client';

import React from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-600/20">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">SchoolOS</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              The professional operating system for modern educational institutions. Engineered for precision, built for scale.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500">Product</h4>
              <ul className="space-y-2 text-sm font-medium text-slate-300">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#workflow" className="hover:text-white transition-colors">Workflow</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500">Legal</h4>
              <ul className="space-y-2 text-sm font-medium text-slate-300">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
            <div className="space-y-4 hidden sm:block">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500">Company</h4>
              <ul className="space-y-2 text-sm font-medium text-slate-300">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <p>© 2024 SchoolOS Platform. All institutional data secured.</p>
          <p className="italic">Powered by modern technical infrastructure.</p>
        </div>
      </div>
    </footer>
  );
}
