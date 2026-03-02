'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, UserCog, Mail, User, Briefcase } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export function AddStaffDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    designation: '',
    department: '',
  });

  const createStaffMutation = useMutation({
    mutationFn: async (data: any) => api.post('/hr/directory', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Personnel record has been successfully onboarded.');
      setOpen(false);
      setFormData({ first_name: '', last_name: '', email: '', designation: '', department: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to onboard staff');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStaffMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-16 justify-start gap-4 rounded-2xl border-slate-100 px-5 group/btn">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100 group-hover/btn:scale-110 transition-premium">
                <UserCog className="h-5 w-5" />
            </div>
            <div className="text-left">
                <p className="text-xs font-black text-slate-900 leading-none">Add Staff</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">HR Onboarding</p>
            </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <UserCog className="h-24 w-24" />
            </div>
            <DialogHeader className="relative z-10">
                <DialogTitle className="text-2xl font-black tracking-tight">Onboard Personnel</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                    Institutional HR Integration
                </DialogDescription>
            </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="s_first_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="s_first_name" 
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="s_last_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
              <Input 
                id="s_last_name" 
                required 
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="s_email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Email</Label>
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="s_email" 
                    type="email" 
                    required 
                    placeholder="name@school.com"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="designation" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Designation</Label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="designation" 
                    placeholder="e.g. Senior Teacher"
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Department</Label>
              <Input 
                id="department" 
                placeholder="e.g. Sciences"
                required 
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createStaffMutation.isPending}>
            {createStaffMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Complete Onboarding
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
