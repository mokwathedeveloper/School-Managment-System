'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Banknote, Tag, Calendar, Wallet } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function RecordExpenseDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    category: 'UTILITIES',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/finance', data, { params: { type: 'expense' } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-expenses'] });
      toast.success('Institutional expense has been successfully logged.');
      setOpen(false);
      setFormData({ title: '', category: 'UTILITIES', amount: '', date: new Date().toISOString().split('T')[0] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record expense');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="h-12 px-8 rounded-xl shadow-lg shadow-rose-500/10" variant="danger">
        <Plus className="mr-2 h-4 w-4" />
        Record Expense
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Record Expenditure"
        description="Log institutional outflow and operational costs"
        icon={Banknote}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="e_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expense Title</Label>
            <Input 
                id="e_title" 
                required 
                placeholder="e.g. Monthly Electricity Bill"
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="e_category" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</Label>
            <FormSelect 
                id="e_category" 
                icon={<Tag className="h-4 w-4" />}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
            >
                <option value="UTILITIES">Utilities</option>
                <option value="SALARIES">Salaries & Wages</option>
                <option value="SUPPLIES">Teaching Supplies</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="FOOD">Food & Catering</option>
                <option value="TRANSPORT">Transport Fuel/Repair</option>
                <option value="OTHER">Other Operational Cost</option>
            </FormSelect>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="e_amount" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount (KES)</Label>
              <div className="relative group">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="e_amount" 
                    type="number"
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-black"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="e_date" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Transaction Date</Label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                    id="e_date" 
                    type="date"
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-rose-600/20" variant="danger" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Banknote className="mr-2 h-4 w-4" />}
            Confirm Log
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
