'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, UserPlus, Fingerprint, Mail, User, Lock, Users, School } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    admission_no: '',
    password: '',
    parent_id: '',
    class_id: '',
  });

  const { data: parents } = useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      const res = await apiClient.get('/parents');
      return res.data;
    },
    enabled: open,
  });

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await apiClient.get('/classes');
      return res.data;
    },
    enabled: open,
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/students', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student record has been successfully initialized.');
      setOpen(false);
      setFormData({ 
        first_name: '', 
        last_name: '', 
        email: '', 
        admission_no: '', 
        password: '',
        parent_id: '',
        class_id: '',
      });
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

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="parent_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign Guardian</Label>
                <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors z-10" />
                    <FormSelect 
                        id="parent_id"
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                        value={formData.parent_id}
                        onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
                    >
                        <option value="">Select Parent</option>
                        {parents?.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.user.first_name} {p.user.last_name}</option>
                        ))}
                    </FormSelect>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="class_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign Class</Label>
                <div className="relative group">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors z-10" />
                    <FormSelect 
                        id="class_id"
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                        value={formData.class_id}
                        onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                    >
                        <option value="">Select Class</option>
                        {classes?.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name} ({c?.grade?.name})</option>
                        ))}
                    </FormSelect>
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporal Password</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
              <Input 
                  id="student_password" 
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1 italic">
                Leave blank to use default (student123)
            </p>
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
