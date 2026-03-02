'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, History, User, Calendar, Fingerprint } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function BorrowBookDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    student_id: '',
    barcode: '',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const { data: students } = useQuery({
    queryKey: ['students-list-library'],
    queryFn: async () => {
      const res = await api.get('/students');
      return res.data.items;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/library/borrows', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-borrows'] });
      toast.success('Borrowing transaction has been successfully recorded.');
      setOpen(false);
      setFormData({ 
        student_id: '', 
        barcode: '', 
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record borrowing');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id) {
        toast.error('Please select a student');
        return;
    }
    createMutation.mutate({
      ...formData,
      due_date: new Date(formData.due_date).toISOString()
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8 shadow-xl">
        <Plus className="mr-2 h-4 w-4" />
        New Borrowing
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Borrowing Terminal"
        description="Initialize a new book circulation transaction"
        icon={History}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="l_student_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Student Borrower</Label>
            <FormSelect 
                id="l_student_id" 
                icon={<User className="h-4 w-4" />}
                value={formData.student_id}
                onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                required
            >
                <option value="">Select Scholar</option>
                {students?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name} ({s.admission_no})</option>
                ))}
            </FormSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="l_barcode" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Copy Barcode</Label>
            <div className="relative group">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="l_barcode" 
                    required 
                    placeholder="Scan or enter barcode"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-mono font-bold"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value.toUpperCase()})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="l_due" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expected Return Date</Label>
            <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                    id="l_due" 
                    type="date" 
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Confirm Transaction
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
