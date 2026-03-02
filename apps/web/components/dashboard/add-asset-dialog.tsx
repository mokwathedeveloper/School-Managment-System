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
import { Plus, Loader2, Monitor } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export function AddAssetDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    category: 'FURNITURE',
    location: '',
    serial_no: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/inventory/assets', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-assets'] });
      toast.success('Asset registered successfully.');
      setOpen(false);
      setFormData({ name: '', category: 'FURNITURE', location: '', serial_no: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register asset');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, status: 'OPERATIONAL' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Register Institutional Asset
          </DialogTitle>
          <DialogDescription>
            Add a new item to the school's fixed asset registry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Science Lab Microscope" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                    id="category" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                >
                    <option value="FURNITURE">Furniture</option>
                    <option value="IT">IT Equipment</option>
                    <option value="LAB">Laboratory</option>
                    <option value="SPORTS">Sports Gear</option>
                    <option value="VEHICLE">Vehicle</option>
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                    id="location" 
                    placeholder="e.g. Room 104" 
                    required 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serial_no">Serial Number (Optional)</Label>
            <Input 
              id="serial_no" 
              placeholder="e.g. SN-998822" 
              value={formData.serial_no}
              onChange={(e) => setFormData({...formData, serial_no: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Complete Registration
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
