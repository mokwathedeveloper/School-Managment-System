'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Monitor, MapPin, Fingerprint, Layers } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

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
      toast.success('Asset has been successfully registered in the registry.');
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
    <>
      <Button onClick={() => setOpen(true)} variant="premium" size="sm" className="h-12 px-6">
        <Plus className="mr-2 h-4 w-4" />
        Add Asset
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Asset Registration"
        description="Integrate a new physical asset into the institutional registry"
        icon={Monitor}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="as_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Description</Label>
            <div className="relative group">
                <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="as_name" 
                    required 
                    placeholder="e.g. Science Lab Microscope"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="as_category" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classification</Label>
                <FormSelect 
                    id="as_category" 
                    icon={<Layers className="h-4 w-4" />}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                >
                    <option value="FURNITURE">Furniture</option>
                    <option value="IT">IT Equipment</option>
                    <option value="LAB">Laboratory</option>
                    <option value="SPORTS">Sports Gear</option>
                    <option value="VEHICLE">Vehicle</option>
                </FormSelect>
            </div>
            <div className="space-y-2">
                <Label htmlFor="as_location" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Location</Label>
                <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                        id="as_location" 
                        required 
                        placeholder="e.g. Room 104"
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="as_serial" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Serial Number (Optional)</Label>
            <div className="relative group">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="as_serial" 
                    placeholder="e.g. SN-998822" 
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-mono text-xs font-bold"
                    value={formData.serial_no}
                    onChange={(e) => setFormData({...formData, serial_no: e.target.value})}
                />
            </div>
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
