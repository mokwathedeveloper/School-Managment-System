
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
import { Plus, Loader2, UserCog } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export function AddStaffDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    designation: '',
    department: '',
    base_salary: '',
  });

  const createStaffMutation = useMutation({
    mutationFn: async (data: any) => api.post('/hr/directory', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-directory'] });
      toast.success('Institutional staff record has been successfully initialized.');
      setOpen(false);
      setFormData({ 
        first_name: '', 
        last_name: '', 
        email: '', 
        designation: '', 
        department: '', 
        base_salary: '' 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add staff member');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStaffMutation.mutate({
      ...formData,
      base_salary: parseFloat(formData.base_salary)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Onboard Staff Member
          </DialogTitle>
          <DialogDescription>
            Register a new institutional employee and set their initial employment details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input 
                id="first_name" 
                required 
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input 
                id="last_name" 
                required 
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input 
                id="designation" 
                placeholder="e.g. Teacher" 
                required 
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                placeholder="e.g. Science" 
                required 
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="base_salary">Base Salary (KES)</Label>
            <Input 
              id="base_salary" 
              type="number" 
              required 
              value={formData.base_salary}
              onChange={(e) => setFormData({...formData, base_salary: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full" disabled={createStaffMutation.isPending}>
            {createStaffMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Complete Onboarding
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
