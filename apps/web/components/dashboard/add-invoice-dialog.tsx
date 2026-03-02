
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, CreditCard, User, Calendar, Wallet } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function AddInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    amount: '',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const { data: students } = useQuery({
    queryKey: ['students-list'],
    queryFn: async () => {
      const res = await apiClient.get('/students');
      return res.data.items;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/finance', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice has been successfully generated.');
      setOpen(false);
      setFormData({ 
        student_id: '', 
        title: '', 
        amount: '', 
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create invoice');
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
      amount: parseFloat(formData.amount),
      due_date: new Date(formData.due_date).toISOString()
    });
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Invoice
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Generate Invoice"
        description="Institutional Billing Terminal"
        icon={CreditCard}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="f_student_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Student</Label>
            <FormSelect 
                id="f_student_id" 
                icon={<User className="h-4 w-4" />}
                value={formData.student_id}
                onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                required
            >
                <option value="">Select Student</option>
                {students?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name} ({s.admission_no})</option>
                ))}
            </FormSelect>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="f_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Invoice Title</Label>
            <Input 
              id="f_title" 
              placeholder="e.g. Term 1 Tuition Fees" 
              required 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="f_amount" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount (KES)</Label>
              <div className="relative group">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                    id="f_amount" 
                    type="number" 
                    required 
                    className="pl-12 font-black"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="f_due_date" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Due Date</Label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                    id="f_due_date" 
                    type="date" 
                    required 
                    className="pl-12 font-bold"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Issue Statement
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
