'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Box, Tag, Package, Hash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function AddStockItemDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    category: 'STATIONERY',
    unit: 'PCS',
    quantity: '0',
    min_quantity: '5',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/inventory/stock', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-stock'] });
      toast.success('Inventory balance has been successfully initialized.');
      setOpen(false);
      setFormData({ name: '', category: 'STATIONERY', unit: 'PCS', quantity: '0', min_quantity: '5' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add stock item');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      quantity: parseInt(formData.quantity),
      min_quantity: parseInt(formData.min_quantity)
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" size="sm" className="h-12 px-6">
        <Plus className="mr-2 h-4 w-4" />
        Add Stock
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Inventory Inflow"
        description="Initialize stock balance for consumable institutional resources"
        icon={Box}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="st_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Item Description</Label>
            <div className="relative group">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="st_name" 
                    required 
                    placeholder="e.g. Chalk, A4 Paper" 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="st_category" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classification</Label>
                <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                        id="st_category" 
                        placeholder="e.g. Stationery" 
                        required 
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="st_unit" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Unit of Measure</Label>
                <div className="relative group">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                        id="st_unit" 
                        placeholder="e.g. PCS, KG, BOX" 
                        required 
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="st_qty" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Opening Balance</Label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="st_qty" 
                    type="number" 
                    required 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-black"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="st_min" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Reorder Threshold</Label>
              <Input 
                id="st_min" 
                type="number" 
                required 
                className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-black text-center"
                value={formData.min_quantity}
                onChange={(e) => setFormData({...formData, min_quantity: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Confirm Balance
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
