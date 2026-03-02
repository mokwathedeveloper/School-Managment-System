'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Calendar, Sparkles, Tag, Clock } from 'lucide-react';
import { useMutation as useMut, useQueryClient as useQC } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function AddEventDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQC();
  const [formData, setFormData] = useState({
    title: '',
    category: 'ACADEMIC',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const createMutation = useMut({
    mutationFn: async (data: any) => api.post('/calendar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Institutional event has been successfully scheduled.');
      setOpen(false);
      setFormData({ 
        title: '', 
        category: 'ACADEMIC', 
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule event');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8 shadow-xl">
        <Plus className="mr-2 h-4 w-4" />
        Schedule Event
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Institutional Event"
        description="Register a new occurrence on the school calendar"
        icon={Calendar}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="e_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Title</Label>
            <div className="relative group">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="e_title" 
                    required 
                    placeholder="e.g. Annual Sports Day"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="e_category" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Classification</Label>
            <FormSelect 
                id="e_category" 
                icon={<Tag className="h-4 w-4" />}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
            >
                <option value="ACADEMIC">Academic Activity</option>
                <option value="HOLIDAY">Public Holiday</option>
                <option value="SPORTS">Sports & Athletics</option>
                <option value="EXAM">Examination Period</option>
                <option value="OTHER">Other Institution Event</option>
            </FormSelect>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="e_start" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</Label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                    id="e_start" 
                    type="date"
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="e_end" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">End Date</Label>
              <Input 
                id="e_end" 
                type="date"
                required 
                className="h-12 rounded-xl border-2 border-slate-50 font-bold"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
            Confirm Schedule
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
