
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, UserPlus, Fingerprint, Mail, User } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    admission_no: '',
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/students', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student record has been successfully initialized.');
      setOpen(false);
      setFormData({ first_name: '', last_name: '', email: '', admission_no: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add student');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStudentMutation.mutate(formData);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="w-full h-16 justify-start gap-4 rounded-2xl border-slate-100 px-5 group/btn"
      >
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100 group-hover/btn:scale-110 transition-premium">
              <UserPlus className="h-5 w-5" />
          </div>
          <div className="text-left">
              <p className="text-xs font-black text-slate-900 leading-none">Add Student</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Manual Enrollment</p>
          </div>
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Enroll New Scholar"
        description="Institutional Student Onboarding"
        icon={UserPlus}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="first_name" 
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
              <Input 
                id="last_name" 
                required 
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Parental Email</Label>
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="email" 
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
            <Label htmlFor="admission_no" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Admission Number</Label>
            <div className="relative group">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="admission_no" 
                    required 
                    placeholder="e.g. SCH-2024-001"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-mono font-bold"
                    value={formData.admission_no}
                    onChange={(e) => setFormData({...formData, admission_no: e.target.value})}
                />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createStudentMutation.isPending}>
            {createStudentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Initialize Profile
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
