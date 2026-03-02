
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
import { Plus, Loader2, UserPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    admission_no: '',
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/students', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student record has been successfully initialized.');
      setOpen(false);
      setFormData({ first_name: '', last_name: '', email: '', admission_no: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add student');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStudentMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add New Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Initialize Student Record
          </DialogTitle>
          <DialogDescription>
            Enter the student's primary details to create their institutional profile.
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
          <div className="space-y-2">
            <Label htmlFor="admission_no">Admission Number</Label>
            <Input 
              id="admission_no" 
              required 
              value={formData.admission_no}
              onChange={(e) => setFormData({...formData, admission_no: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full" disabled={createStudentMutation.isPending}>
            {createStudentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Student Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
