
'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105 active:scale-95">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">SchoolOS</span>
            </Link>
            <p className="text-slate-500 font-medium text-sm leading-relaxed italic">
              Engineered for the unique operational requirements of African educational institutions.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
                <Twitter className="h-5 w-5 hover:text-blue-400 cursor-pointer transition-colors" />
                <Github className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 hover:text-blue-700 cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Product</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="#features" className="hover:text-blue-600 transition-colors">Capabilities</Link></li>
              <li><Link href="#workflow" className="hover:text-blue-600 transition-colors">Implementation</Link></li>
              <li><Link href="/login" className="hover:text-blue-600 transition-colors">Terminal Login</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Governance</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Data Privacy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Security Audits</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Multi-Tenancy</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Contact</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Support Desk</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Sales Intelligence</Link></li>
              <li className="text-slate-400 font-medium">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <p>© 2024 SchoolOS Platform. Built for the future of education.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-900">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-900">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
