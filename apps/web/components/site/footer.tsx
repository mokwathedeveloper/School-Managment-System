'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Github, Twitter, Linkedin, ShieldCheck, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-24 relative overflow-hidden organic-grain">
      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg transition-premium group-hover:scale-110 active:scale-95 group-hover:rotate-3">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">SchoolOS</span>
            </Link>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
              The premium operating system for modern educational institutions. Engineered for technical precision and operational excellence.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Linkedin className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Github className="h-4 w-4" />} />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Ecosystem</h4>
            <ul className="space-y-4">
              <FooterLink href="#features">Capabilities</FooterLink>
              <FooterLink href="#workflow">Infrastructure</FooterLink>
              <FooterLink href="/login">Initialize OS</FooterLink>
              <FooterLink href="#">Documentation</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Governance</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Service Terms</FooterLink>
              <FooterLink href="#">Security Audit</FooterLink>
              <FooterLink href="#">Compliance</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Platform Status</h4>
            <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">All Nodes Active</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 italic">Enterprise Node: Nairobi</span>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            © 2024 SchoolOS v1.4.2-stable • All Rights Reserved
          </p>
          <div className="flex items-center gap-6 opacity-40">
            <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001</span>
            <span className="text-[10px] font-black uppercase tracking-widest">SOC2 TYPE II</span>
            <span className="text-[10px] font-black uppercase tracking-widest">GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: any) {
  return (
    <li>
      <Link href={href} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-premium flex items-center gap-1 group">
        {children}
        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-premium -translate-y-0.5" />
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: any) {
  return (
    <Link 
      href={href} 
      className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-premium hover:-translate-y-1"
    >
      {icon}
    </Link>
  );
}
