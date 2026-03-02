'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, UserPlus, Fingerprint, Search, ShieldCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function AddVisitorDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    full_name: '',
    id_number: '',
    purpose: '',
    whom_to_see: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/gate/visitors', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-visitors'] });
      toast.success('Visitor session has been successfully logged.');
      setOpen(false);
      setFormData({ full_name: '', id_number: '', purpose: '', whom_to_see: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to log visitor');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8">
        <UserPlus className="mr-2 h-4 w-4" />
        Log New Visitor
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Visitor Registration"
        description="Secure gate entry and identification sequence"
        icon={ShieldCheck}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="v_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Visitor Full Name</Label>
            <Input 
                id="v_name" 
                required 
                placeholder="e.g. Samuel Okoth"
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="v_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identification Number</Label>
            <div className="relative group">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="v_id" 
                    required 
                    placeholder="National ID / Passport"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-mono font-bold"
                    value={formData.id_number}
                    onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="v_whom" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Whom to See</Label>
              <Input 
                id="v_whom" 
                placeholder="e.g. Principal"
                required 
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.whom_to_see}
                onChange={(e) => setFormData({...formData, whom_to_see: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v_purpose" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Purpose of Visit</Label>
              <Input 
                id="v_purpose" 
                placeholder="e.g. Official"
                required 
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            Authorize Entry
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
