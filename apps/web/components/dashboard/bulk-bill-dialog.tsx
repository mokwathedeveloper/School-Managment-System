
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Layers, Loader2, Database, Search, Calendar } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

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
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-200"
      >
        <Layers className="mr-2 h-4 w-4" />
        Bulk Billing
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Institutional Billing"
        description="Mass invoice generation sequence"
        icon={Database}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="b_grade_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Grade Level</Label>
            <FormSelect 
                id="b_grade_id" 
                icon={<Search className="h-4 w-4" />}
                value={formData.grade_id}
                onChange={(e) => setFormData({...formData, grade_id: e.target.value})}
                required
            >
                <option value="">Select Target Grade</option>
                {grades?.map((g: any) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
            </FormSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="b_term_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Term</Label>
            <FormSelect 
              id="b_term_id" 
              icon={<Calendar className="h-4 w-4" />}
              value={formData.term_id}
              onChange={(e) => setFormData({...formData, term_id: e.target.value})}
              required
            >
              <option value="">Select Target Term</option>
              {terms?.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} ({new Date(t.start_date).getFullYear()})</option>
              ))}
            </FormSelect>
          </div>

          <Button type="submit" className="w-full h-16 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={bulkMutation.isPending}>
            {bulkMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            Execute Bulk Billing
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
