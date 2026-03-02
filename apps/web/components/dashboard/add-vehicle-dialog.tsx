'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Bus, Fingerprint, Users, ShieldCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function AddVehicleDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    reg_number: '',
    capacity: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/transport/vehicles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-vehicles'] });
      toast.success('Vehicle successfully added to fleet.');
      setOpen(false);
      setFormData({ reg_number: '', capacity: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add vehicle');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      capacity: parseInt(formData.capacity)
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8">
        <Plus className="mr-2 h-4 w-4" />
        Add Vehicle
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Fleet Registry"
        description="Register a new institutional transport vehicle"
        icon={Bus}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="v_reg" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registration Number</Label>
            <div className="relative group">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="v_reg" 
                    required 
                    placeholder="e.g. KCA 123X"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-mono font-bold"
                    value={formData.reg_number}
                    onChange={(e) => setFormData({...formData, reg_number: e.target.value.toUpperCase()})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="v_cap" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Passenger Capacity</Label>
            <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="v_cap" 
                    type="number"
                    required 
                    placeholder="e.g. 33"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-black"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            Confirm Fleet Entry
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
