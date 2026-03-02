'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, GraduationCap, Mail, User, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function RegisterAlumnusDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    graduation_year: new Date().getFullYear().toString(),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => api.post('/alumni', {
        ...data,
        graduation_year: parseInt(data.graduation_year)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      toast.success('Alumnus has been successfully registered in the network.');
      setOpen(false);
      setFormData({ 
        first_name: '', 
        last_name: '', 
        email: '', 
        graduation_year: new Date().getFullYear().toString() 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register alumnus');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8 shadow-xl">
        <Plus className="mr-2 h-4 w-4" />
        Register Alumnus
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Alumni Registration"
        description="Integrate a graduate into the institutional legacy network"
        icon={GraduationCap}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="a_first_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="a_first_name" 
                    required 
                    placeholder="First name"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="a_last_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
              <Input 
                id="a_last_name" 
                required 
                placeholder="Last name"
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="a_email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Email</Label>
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="a_email" 
                    type="email" 
                    required 
                    placeholder="alumnus@example.com"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="a_year" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Graduation Year</Label>
            <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="a_year" 
                    type="number"
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-black"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Confirm Registration
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
