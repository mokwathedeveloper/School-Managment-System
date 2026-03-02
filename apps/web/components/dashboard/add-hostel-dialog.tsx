'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Home, Building2, Layers } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function AddHostelDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/hostels', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast.success('New hostel building has been successfully registered.');
      setOpen(false);
      setFormData({ name: '', type: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add hostel');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
        <Plus className="mr-2 h-4 w-4" />
        Add New Hostel
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Register Hostel"
        description="Add a new dormitory building to the campus"
        icon={Home}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="h_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Building Name</Label>
            <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="h_name" 
                    required 
                    placeholder="e.g. Nile House"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="h_type" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Allocation Type</Label>
            <FormSelect 
                id="h_type" 
                icon={<Layers className="h-4 w-4" />}
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
            >
                <option value="">Select Type...</option>
                <option value="BOYS">Boys Only</option>
                <option value="GIRLS">Girls Only</option>
                <option value="MIXED">Mixed</option>
            </FormSelect>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Confirm Registration
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
