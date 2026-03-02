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
import { Plus, Loader2, Box } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

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
      toast.success('Stock item added to inventory.');
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Stock Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            New Consumable Item
          </DialogTitle>
          <DialogDescription>
            Add an item to the consumable inventory and set low-stock alerts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Chalk, A4 Paper" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                    id="category" 
                    placeholder="e.g. Stationery" 
                    required 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input 
                    id="unit" 
                    placeholder="e.g. PCS, KG, BOX" 
                    required 
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Initial Quantity</Label>
              <Input 
                id="quantity" 
                type="number" 
                required 
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_quantity">Reorder Level (Min)</Label>
              <Input 
                id="min_quantity" 
                type="number" 
                required 
                value={formData.min_quantity}
                onChange={(e) => setFormData({...formData, min_quantity: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add to Inventory
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
