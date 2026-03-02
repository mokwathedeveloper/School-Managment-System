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
import { Plus, Loader2, BookOpen } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export function AddClassDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    grade_id: '',
    form_teacher_id: '',
  });

  const { data: grades } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    }
  });

  const { data: staff } = useQuery({
    queryKey: ['staff-directory'],
    queryFn: async () => {
      const res = await api.get('/hr/directory');
      return res.data;
    }
  });

  const createClassMutation = useMutation({
    mutationFn: async (data: any) => api.post('/classes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('New institutional stream has been successfully defined.');
      setOpen(false);
      setFormData({ name: '', grade_id: '', form_teacher_id: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create class');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grade_id) {
        toast.error('Please select a grade level');
        return;
    }
    createClassMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Define New Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Define Institutional Stream
          </DialogTitle>
          <DialogDescription>
            Create a new student group by specifying its grade level and name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="grade_id">Grade Level</Label>
            <select 
              id="grade_id" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.grade_id}
              onChange={(e) => setFormData({...formData, grade_id: e.target.value})}
              required
            >
              <option value="">Select Grade Level</option>
              {grades?.map((grade: any) => (
                <option key={grade.id} value={grade.id}>{grade.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Class/Stream Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. West, Alpha, Red" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form_teacher_id">Form Teacher (Optional)</Label>
            <select 
              id="form_teacher_id" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.form_teacher_id}
              onChange={(e) => setFormData({...formData, form_teacher_id: e.target.value})}
            >
              <option value="">Select Form Teacher</option>
              {staff?.map((member: any) => (
                <option key={member.id} value={member.id}>
                  {member.user.first_name} {member.user.last_name} ({member.designation})
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={createClassMutation.isPending}>
            {createClassMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Define Class Stream
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
