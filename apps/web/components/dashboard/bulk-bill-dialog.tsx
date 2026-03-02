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
import { Layers, Loader2 } from 'lucide-react';
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
      const res = await apiClient.get('/finance/terms'); // Assuming this endpoint
      return res.data;
    }
  });

  const bulkMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/finance/bulk-invoice', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success(`Success! Created ${res.data.created} invoices. ${res.data.skipped} were skipped (duplicates).`);
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
        <Button variant="outline" size="sm">
          <Layers className="mr-2 h-4 w-4" />
          Bulk Billing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Bulk Institutional Billing
          </DialogTitle>
          <DialogDescription>
            Generate invoices for all students in a specific grade level based on the defined fee structure.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="grade_id">Grade Level</Label>
            <select 
              id="grade_id" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.grade_id}
              onChange={(e) => setFormData({...formData, grade_id: e.target.value})}
              required
            >
              <option value="">Select Grade</option>
              {grades?.map((g: any) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="term_id">Academic Term</Label>
            <select 
              id="term_id" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.term_id}
              onChange={(e) => setFormData({...formData, term_id: e.target.value})}
              required
            >
              <option value="">Select Term</option>
              {terms?.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} ({new Date(t.start_date).getFullYear()})</option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={bulkMutation.isPending}>
            {bulkMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Bulk Invoices
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
