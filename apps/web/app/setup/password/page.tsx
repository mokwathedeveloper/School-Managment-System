'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function SetupPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsSubmitting(true);
    try {
      await api.patch('/users/profile', { password });
      toast.success('Security credentials updated successfully.');
      
      await refreshUser();
      
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] organic-grain p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 rounded-[2rem] bg-amber-500 flex items-center justify-center text-white shadow-2xl shadow-amber-500/20 mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 mb-2 text-center">Security Initialization</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter text-center">Mandatory password update required</p>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Configure New Password</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1 leading-relaxed">
              Your account is currently using a temporal access key. Please establish a permanent secure password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">New Secure Password</Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Confirm New Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  id="confirm_password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-14 pl-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-600/10 transition-all font-bold text-slate-900"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] shadow-2xl transition-premium active:scale-[0.98] group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Account
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
            
            <button 
              type="button" 
              onClick={logout}
              className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors pt-2"
            >
              Cancel & Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
