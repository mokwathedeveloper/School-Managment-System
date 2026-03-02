'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Building2, Globe, Mail, ShieldCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function OnboardSchoolDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
  });

  const onboardMutation = useMutation({
    mutationFn: async (data: any) => api.post('/super-admin/schools', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-schools'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
      toast.success('New institution has been successfully integrated.');
      setOpen(false);
      setFormData({ name: '', slug: '', email: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to onboard institution');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onboardMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8 shadow-xl">
        <Plus className="mr-2 h-4 w-4" />
        Onboard Institution
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Onboard Institution"
        description="Register a new school node on the platform"
        icon={Building2}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="school_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">School Name</Label>
            <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="school_name" 
                    required 
                    placeholder="e.g. Greenwood Academy"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school_slug" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">System URL Slug</Label>
            <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="school_slug" 
                    required 
                    placeholder="e.g. greenwood"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-mono font-bold"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1 italic">
                Final URL: schoolos.com/node/{formData.slug || 'slug'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school_email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Admin Email</Label>
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="school_email" 
                    type="email"
                    required 
                    placeholder="admin@school.com"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={onboardMutation.isPending}>
            {onboardMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            Provision Institution
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
