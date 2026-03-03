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
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    temporalPassword: '',
  });

  const onboardMutation = useMutation({
    mutationFn: async (data: any) => api.post('/super-admin/schools', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-schools'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
      toast.success('New institution and admin have been successfully integrated.');
      setOpen(false);
      setFormData({ 
        name: '', 
        slug: '', 
        email: '',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        temporalPassword: '',
      });
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
        description="Register a new school node and its administrator"
        icon={Building2}
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60 border-b border-blue-50 pb-2">Institutional Profile</h3>
            
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

            <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Institutional Email</Label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                        id="school_email" 
                        type="email"
                        required 
                        placeholder="info@school.com"
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60 border-b border-blue-50 pb-2">Primary Administrator</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin_first_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                <Input 
                    id="admin_first_name" 
                    required 
                    placeholder="John"
                    className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.adminFirstName}
                    onChange={(e) => setFormData({...formData, adminFirstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin_last_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                <Input 
                    id="admin_last_name" 
                    required 
                    placeholder="Doe"
                    className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.adminLastName}
                    onChange={(e) => setFormData({...formData, adminLastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Personal Admin Email</Label>
              <Input 
                  id="admin_email" 
                  type="email"
                  required 
                  placeholder="admin@school.com"
                  className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporal Password</Label>
              <Input 
                  id="admin_password" 
                  type="password"
                  required 
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                  value={formData.temporalPassword}
                  onChange={(e) => setFormData({...formData, temporalPassword: e.target.value})}
              />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1 italic">
                  Administrator will be forced to change this on first login
              </p>
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
