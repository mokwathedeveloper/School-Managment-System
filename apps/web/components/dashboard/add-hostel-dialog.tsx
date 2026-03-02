
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
import { Plus, Loader2, Home } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add New Hostel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Register Hostel Building
          </DialogTitle>
          <DialogDescription>
            Add a new dormitory building to the institutional campus.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hostel Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Nile House" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Hostel Type</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={formData.type}
              required
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="">Select Type...</option>
              <option value="BOYS">Boys Only</option>
              <option value="GIRLS">Girls Only</option>
              <option value="MIXED">Mixed</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Register Building
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
