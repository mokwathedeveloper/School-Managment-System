'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2, BookOpen, Calendar, FileText, Search } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

interface AddAssignmentDialogProps {
  classId: string;
}

export function AddAssignmentDialog({ classId }: AddAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await api.get('/classes/subjects');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/lms/assignments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', classId] });
      toast.success('Academic assignment has been successfully published.');
      setOpen(false);
      setFormData({ 
        title: '', 
        description: '', 
        subject_id: '', 
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish assignment');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) {
        toast.error('Please select a class first.');
        return;
    }
    createMutation.mutate({
      ...formData,
      class_id: classId,
      due_date: new Date(formData.due_date).toISOString()
    });
  };

  return (
    <>
      <Button 
        variant="premium"
        className="h-12 px-8 shadow-xl"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Post Assignment
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Publish Assignment"
        description="Distribute new coursework to the digital classroom"
        icon={BookOpen}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="a_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assignment Title</Label>
            <Input 
                id="a_title" 
                required 
                placeholder="e.g. Calculus Problem Set 1"
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="a_subject" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</Label>
                <FormSelect 
                    id="a_subject" 
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
                <Label htmlFor="a_due" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Submission Deadline</Label>
                <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input 
                        id="a_due" 
                        type="date" 
                        required 
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                        value={formData.due_date}
                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    />
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="a_desc" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instructions</Label>
            <Textarea 
                id="a_desc" 
                required 
                placeholder="Provide detailed instructions for the students..."
                className="min-h-[100px] rounded-2xl border-2 border-slate-50 focus:ring-blue-600/10 font-medium p-4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Publish to Classroom
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
