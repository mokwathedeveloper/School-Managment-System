
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
import { Plus, Loader2, CreditCard, User, Calendar, Wallet } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard className="h-24 w-24" />
            </div>
            <DialogHeader className="relative z-10">
                <DialogTitle className="text-2xl font-black tracking-tight">Generate Invoice</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                    Institutional Billing Terminal
                </DialogDescription>
            </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-2">
            <Label htmlFor="f_student_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Student</Label>
            <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <select 
                    id="f_student_id" 
                    className="flex h-12 w-full rounded-xl border-2 border-slate-50 bg-white pl-12 pr-3 text-sm font-bold focus:ring-blue-600/10 outline-none appearance-none"
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    required
                >
                    <option value="">Select Student</option>
                    {students?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name} ({s.admission_no})</option>
                    ))}
                </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="f_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Invoice Title</Label>
            <Input 
              id="f_title" 
              placeholder="e.g. Term 1 Tuition Fees" 
              required 
              className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="f_amount" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount (KES)</Label>
              <div className="relative group">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="f_amount" 
                    type="number" 
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-black"
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
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
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
      </DialogContent>
    </Dialog>
  );
}
