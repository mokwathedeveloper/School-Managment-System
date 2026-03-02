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
import { Plus, Loader2, Trophy } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Exam
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Schedule Academic Assessment
          </DialogTitle>
          <DialogDescription>
            Register a new examination or assessment for a subject.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Assessment Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. End of Term One Math" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="subject_id">Subject</Label>
                <select 
                    id="subject_id" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.subject_id}
                    onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                    required
                >
                    <option value="">Select Subject</option>
                    {subjects?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="term_id">Term</Label>
                <select 
                    id="term_id" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.term_id}
                    onChange={(e) => setFormData({...formData, term_id: e.target.value})}
                    required
                >
                    <option value="">Select Term</option>
                    {terms?.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Exam Date</Label>
            <Input 
              id="date" 
              type="date" 
              required 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_marks">Max Marks</Label>
              <Input 
                id="max_marks" 
                type="number" 
                required 
                value={formData.max_marks}
                onChange={(e) => setFormData({...formData, max_marks: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightage">Weightage (0.0 - 1.0)</Label>
              <Input 
                id="weightage" 
                type="number" 
                step="0.1"
                required 
                value={formData.weightage}
                onChange={(e) => setFormData({...formData, weightage: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Schedule Assessment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
