'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Users, Mail, User, Phone, Lock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function AddParentDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  });

  const createParentMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/parents', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast.success('Parent record has been successfully initialized.');
      setOpen(false);
      setFormData({ 
        first_name: '', 
        last_name: '', 
        email: '', 
        phone: '', 
        password: '' 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add parent');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createParentMutation.mutate(formData);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="w-full h-16 justify-start gap-4 rounded-2xl border-slate-100 px-5 group/btn"
      >
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100 group-hover/btn:scale-110 transition-premium">
              <Users className="h-5 w-5" />
          </div>
          <div className="text-left">
              <p className="text-xs font-black text-slate-900 leading-none">Add Parent</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Guardian Registration</p>
          </div>
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Register Guardian"
        description="Institutional Parent Onboarding"
        icon={Users}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="p_first_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="p_first_name" 
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p_last_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
              <Input 
                id="p_last_name" 
                required 
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p_email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Email</Label>
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="p_email" 
                    type="email" 
                    required 
                    placeholder="guardian@example.com"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p_phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
            <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="p_phone" 
                    placeholder="e.g. +254..."
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent_password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporal Password</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
              <Input 
                  id="parent_password" 
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1 italic">
                Leave blank to use default (parent123)
            </p>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createParentMutation.isPending}>
            {createParentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Register Guardian
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
