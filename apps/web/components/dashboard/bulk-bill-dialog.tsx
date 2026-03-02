
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
import { Label } from '@/components/ui/label';
import { Layers, Loader2, Database, Search } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export function BulkBillDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    grade_id: '',
    term_id: '',
  });

  const { data: grades } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await apiClient.get('/grade-levels');
      return res.data;
    }
  });

  const { data: terms } = useQuery({
    queryKey: ['academic-terms'],
    queryFn: async () => {
      const res = await apiClient.get('/finance/terms');
      return res.data;
    }
  });

  const bulkMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/finance/bulk-invoice', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success(`Success! Created ${res.data.created} invoices. ${res.data.skipped} were skipped.`);
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate bulk invoices');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grade_id || !formData.term_id) {
        toast.error('Please select both grade and term');
        return;
    }
    bulkMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-200">
          <Layers className="mr-2 h-4 w-4" />
          Bulk Billing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Database className="h-24 w-24" />
            </div>
            <DialogHeader className="relative z-10">
                <DialogTitle className="text-2xl font-black tracking-tight">Institutional Billing</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                    Mass invoice generation sequence
                </DialogDescription>
            </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-2">
            <Label htmlFor="b_grade_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Grade Level</Label>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <select 
                    id="b_grade_id" 
                    className="flex h-12 w-full rounded-xl border-2 border-slate-50 bg-white pl-12 pr-3 text-sm font-bold focus:ring-blue-600/10 outline-none appearance-none"
                    value={formData.grade_id}
                    onChange={(e) => setFormData({...formData, grade_id: e.target.value})}
                    required
                >
                    <option value="">Select Target Grade</option>
                    {grades?.map((g: any) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="b_term_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Term</Label>
            <select 
              id="b_term_id" 
              className="flex h-12 w-full rounded-xl border-2 border-slate-50 bg-white px-4 text-sm font-bold focus:ring-blue-600/10 outline-none appearance-none"
              value={formData.term_id}
              onChange={(e) => setFormData({...formData, term_id: e.target.value})}
              required
            >
              <option value="">Select Target Term</option>
              {terms?.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} ({new Date(t.start_date).getFullYear()})</option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full h-16 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={bulkMutation.isPending}>
            {bulkMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            Execute Bulk Billing
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
