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
import { Plus, Loader2, CreditCard } from 'lucide-react';
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
        <Button size="sm" className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Generate Student Invoice
          </DialogTitle>
          <DialogDescription>
            Issue a new billing statement to a specific student.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="student_id">Select Student</Label>
            <select 
              id="student_id" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          
          <div className="space-y-2">
            <Label htmlFor="title">Invoice Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Term 1 Tuition Fees" 
              required 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input 
                id="amount" 
                type="number" 
                required 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input 
                id="due_date" 
                type="date" 
                required 
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate & Issue Invoice
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
