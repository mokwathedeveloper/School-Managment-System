'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Loader2, Send, Megaphone, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function BroadcastAdmissionAlertDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  const broadcastMutation = useMutation({
    mutationFn: async (data: any) => api.post('/messaging/announcements', data),
    onSuccess: (res) => {
      toast.success(`Institutional broadcast dispatched to ${res.data.sent || 'all'} applicants.`);
      setOpen(false);
      setFormData({ title: '', message: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to dispatch broadcast');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastMutation.mutate({
      ...formData,
      targetRole: 'APPLICANT' 
    });
  };

  return (
    <>
      <Button 
        variant="premium"
        className="h-12 px-8 shadow-xl"
        onClick={() => setOpen(true)}
      >
        <Megaphone className="mr-2 h-4 w-4" />
        Broadcast Alert
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Institutional Broadcast"
        description="Mass notification sequence for the admissions pipeline"
        icon={Megaphone}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="b_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Announcement Title</Label>
            <div className="relative group">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="b_title" 
                    required 
                    placeholder="e.g. Interview Schedule Update"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="b_message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Broadcast Message</Label>
            <Textarea 
                id="b_message" 
                required 
                placeholder="Compose your message to all prospective students..."
                className="min-h-[120px] rounded-2xl border-2 border-slate-50 focus:ring-blue-600/10 font-medium resize-none p-4"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={broadcastMutation.isPending}>
            {broadcastMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Dispatch Broadcast
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
