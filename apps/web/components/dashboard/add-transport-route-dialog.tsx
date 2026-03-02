'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Map, Wallet, Navigation } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function AddTransportRouteDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    stops: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/transport/routes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-routes'] });
      toast.success('Transport route has been established.');
      setOpen(false);
      setFormData({ name: '', cost: '', stops: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create route');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      cost: parseFloat(formData.cost)
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8">
        <Plus className="mr-2 h-4 w-4" />
        Create Route
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Establish Transport Route"
        description="Define student pickup zones and termly billing cost"
        icon={Map}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="r_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Route Name</Label>
            <div className="relative group">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="r_name" 
                    required 
                    placeholder="e.g. Western Zone A"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="r_cost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Termly Cost (KES)</Label>
            <div className="relative group">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="r_cost" 
                    type="number"
                    required 
                    placeholder="e.g. 15000"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-black"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="r_stops" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Route Stops (Comma Separated)</Label>
            <Input 
                id="r_stops" 
                placeholder="Stop 1, Stop 2, Stop 3..."
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                value={formData.stops}
                onChange={(e) => setFormData({...formData, stops: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Confirm Route
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
