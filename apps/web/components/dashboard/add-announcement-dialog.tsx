'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Megaphone, Loader2, Send, Sparkles, Users, GraduationCap, Filter } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function AddAnnouncementDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'PARENT',
    gradeId: '',
  });

  const { data: grades } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/messaging/announcements', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Broadcast dispatched to ${data.sent} recipients.`);
      setOpen(false);
      setFormData({ title: '', message: '', targetRole: 'PARENT', gradeId: '' });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to dispatch broadcast');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8 shadow-xl">
        <Megaphone className="mr-2 h-4 w-4" />
        New Announcement
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Institutional Broadcast"
        description="Dispatch mass notifications to the school community"
        icon={Megaphone}
        className="sm:max-w-[600px]"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ann_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Announcement Title</Label>
            <div className="relative group">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="ann_title" 
                    required 
                    placeholder="e.g. End of Term Resumption"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Audience</Label>
                <FormSelect 
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  icon={<Filter className="h-4 w-4" />}
                >
                  <option value="PARENT">All Guardians</option>
                  <option value="TEACHER">All Staff</option>
                  <option value="STUDENT">All Students</option>
                </FormSelect>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Grade Level (Optional)</Label>
                <FormSelect 
                  value={formData.gradeId}
                  onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
                  icon={<GraduationCap className="h-4 w-4" />}
                >
                  <option value="">Consolidated School</option>
                  {grades?.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </FormSelect>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ann_msg" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message Content</Label>
            <Textarea 
                id="ann_msg" 
                required 
                placeholder="Compose your mass institutional alert..."
                className="min-h-[120px] p-4"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={broadcastMutation.isPending}>
            {broadcastMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Initialize Broadcast
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
