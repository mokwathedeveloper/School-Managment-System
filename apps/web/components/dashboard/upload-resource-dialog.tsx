'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, FileUp, Search, BookOpen } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function UploadResourceDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    category: 'NOTES',
    subject_id: '',
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await api.get('/classes/subjects');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/lms/resources', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Learning resource has been successfully synchronized.');
      setOpen(false);
      setFormData({ title: '', category: 'NOTES', subject_id: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload resource');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <>
      <Button 
        variant="premium"
        className="h-12 px-8 shadow-xl"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Upload Resource
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Institutional Repository"
        description="Synchronize course materials and learning resources"
        icon={FileUp}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="r_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resource Title</Label>
            <Input 
                id="r_title" 
                required 
                placeholder="e.g. Geometry Lecture Notes"
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="r_category" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classification</Label>
                <FormSelect 
                    id="r_category" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                >
                    <option value="NOTES">Lecture Notes</option>
                    <option value="VIDEO">Video Tutorial</option>
                    <option value="EBOOK">Digital Book</option>
                    <option value="QUIZ">Practice Quiz</option>
                </FormSelect>
            </div>
            <div className="space-y-2">
                <Label htmlFor="r_subject" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Subject</Label>
                <FormSelect 
                    id="r_subject" 
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
          </div>

          <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center hover:border-blue-200 transition-all group cursor-pointer bg-slate-50/30">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-100 mx-auto mb-4">
                  <FileUp className="h-8 w-8" />
              </div>
              <p className="font-black text-slate-900 text-sm">Attach Document Payload</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">PDF, MP4, or EPUB (Max 50MB)</p>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
            Confirm Upload
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
