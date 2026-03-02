'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, BookOpen, Layers, User } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function AddClassDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    grade_id: '',
    form_teacher_id: '',
  });

  const { data: grades } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    }
  });

  const { data: staff } = useQuery({
    queryKey: ['staff-directory'],
    queryFn: async () => {
      const res = await api.get('/hr/directory');
      return res.data;
    }
  });

  const createClassMutation = useMutation({
    mutationFn: async (data: any) => api.post('/classes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('New institutional stream has been successfully defined.');
      setOpen(false);
      setFormData({ name: '', grade_id: '', form_teacher_id: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create class');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grade_id) {
        toast.error('Please select a grade level');
        return;
    }
    createClassMutation.mutate(formData);
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
      >
        <Plus className="mr-2 h-4 w-4" />
        Define New Stream
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Define Class Stream"
        description="Academic Structural Organization"
        icon={BookOpen}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="grade_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Grade Level</Label>
            <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <select 
                    id="grade_id" 
                    className="flex h-12 w-full rounded-xl border-2 border-slate-50 bg-white pl-12 pr-3 text-sm font-bold focus:ring-blue-600/10 focus:border-primary outline-none transition-all appearance-none"
                    value={formData.grade_id}
                    onChange={(e) => setFormData({...formData, grade_id: e.target.value})}
                    required
                >
                    <option value="">Select Target Level</option>
                    {grades?.map((grade: any) => (
                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                    ))}
                </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stream Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. West, Alpha, Red" 
              required 
              className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form_teacher_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Head of Stream (Teacher)</Label>
            <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <select 
                    id="form_teacher_id" 
                    className="flex h-12 w-full rounded-xl border-2 border-slate-50 bg-white pl-12 pr-3 text-sm font-bold focus:ring-blue-600/10 outline-none transition-all appearance-none"
                    value={formData.form_teacher_id}
                    onChange={(e) => setFormData({...formData, form_teacher_id: e.target.value})}
                >
                    <option value="">Unassigned (Mobile)</option>
                    {staff?.map((member: any) => (
                        <option key={member.id} value={member.id}>
                        {member.user.first_name} {member.user.last_name} ({member.designation})
                        </option>
                    ))}
                </select>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createClassMutation.isPending}>
            {createClassMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Confirm Definition
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
