
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
import { FormSelect } from '@/components/ui/form-select';

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
            <FormSelect 
                id="grade_id" 
                icon={<Layers className="h-4 w-4" />}
                value={formData.grade_id}
                onChange={(e) => setFormData({...formData, grade_id: e.target.value})}
                required
            >
                <option value="">Select Target Level</option>
                {grades?.map((grade: any) => (
                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
            </FormSelect>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stream Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. West, Alpha, Red" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form_teacher_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Head of Stream (Teacher)</Label>
            <FormSelect 
                id="form_teacher_id" 
                icon={<User className="h-4 w-4" />}
                value={formData.form_teacher_id}
                onChange={(e) => setFormData({...formData, form_teacher_id: e.target.value})}
            >
                <option value="">Unassigned (Mobile)</option>
                {staff?.map((member: any) => (
                    <option key={member.id} value={member.id}>
                    {member.user.first_name} {member.user.last_name} ({member.designation})
                    </option>
                ))}
            </FormSelect>
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
