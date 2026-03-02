
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Trophy, Search, Calendar, TrendingUp } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function AddExamDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    subject_id: '',
    term_id: '',
    date: new Date().toISOString().split('T')[0],
    max_marks: '100',
    weightage: '1.0',
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await api.get('/classes/subjects');
      return res.data;
    }
  });

  const { data: terms } = useQuery({
    queryKey: ['academic-terms'],
    queryFn: async () => {
      const res = await api.get('/finance/terms');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/exams', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Academic assessment has been successfully scheduled.');
      setOpen(false);
      setFormData({ 
        name: '', 
        subject_id: '', 
        term_id: '', 
        date: new Date().toISOString().split('T')[0], 
        max_marks: '100', 
        weightage: '1.0' 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule exam');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject_id || !formData.term_id) {
        toast.error('Please select both subject and term');
        return;
    }
    createMutation.mutate({
      ...formData,
      max_marks: parseFloat(formData.max_marks),
      weightage: parseFloat(formData.weightage),
      date: new Date(formData.date).toISOString()
    });
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
      >
        <Plus className="mr-2 h-4 w-4" />
        Schedule Assessment
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Schedule Assessment"
        description="Academic Evaluation Registry"
        icon={Trophy}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="e_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assessment Name</Label>
            <Input 
              id="e_name" 
              placeholder="e.g. End of Term One Math" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="e_subject_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</Label>
                <FormSelect 
                    id="e_subject_id" 
                    icon={<Search className="h-4 w-4" />}
                    value={formData.subject_id}
                    onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                    required
                >
                    <option value="">Select Subject</option>
                    {subjects?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </FormSelect>
            </div>
            <div className="space-y-2">
                <Label htmlFor="e_term_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Term</Label>
                <FormSelect 
                    id="e_term_id" 
                    value={formData.term_id}
                    onChange={(e) => setFormData({...formData, term_id: e.target.value})}
                    required
                >
                    <option value="">Select Term</option>
                    {terms?.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </FormSelect>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="e_date" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assessment Date</Label>
            <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                    id="e_date" 
                    type="date" 
                    required 
                    className="pl-12"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="max_marks" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Max Marks</Label>
              <Input 
                id="max_marks" 
                type="number" 
                required 
                className="text-center"
                value={formData.max_marks}
                onChange={(e) => setFormData({...formData, max_marks: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightage" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Weightage (0-1)</Label>
              <Input 
                id="weightage" 
                type="number" 
                step="0.1"
                required 
                className="text-center"
                value={formData.weightage}
                onChange={(e) => setFormData({...formData, weightage: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Confirm Schedule
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
