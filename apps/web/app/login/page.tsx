'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success('Access granted. Welcome to the institutional terminal.');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] organic-grain p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-[440px] relative z-10">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="h-16 w-16 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/20 mb-6 group hover:scale-110 transition-premium cursor-pointer">
            <Building2 className="h-8 w-8 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">SchoolOS</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise Terminal v1.4</span>
          </div>
        </div>

        {/* Login Glass Panel */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-1000">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Institutional Sign-in</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter mt-1">Authorized personnel only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Official Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@school.com" 
                  className="h-14 pl-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-600/10 transition-all font-bold text-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Security Password</Label>
                <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-14 pl-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-600/10 transition-all font-bold text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] shadow-2xl transition-premium active:scale-[0.98] group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Authenticate Terminal
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted Session</span>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          © 2024 SchoolOS • Operational Node: Nairobi
        </p>
      </div>
    </div>
  );
}
