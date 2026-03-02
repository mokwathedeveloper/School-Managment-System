
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
import { Plus, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export function AddRoomDialog({ hostelId }: { hostelId: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    room_number: '',
    capacity: '4',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post(`/hostels/${hostelId}/rooms`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-rooms', hostelId] });
      toast.success('New room has been added to the dormitory.');
      setOpen(false);
      setFormData({ room_number: '', capacity: '4' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add room');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostelId) {
        toast.error('Please select a hostel first.');
        return;
    }
    createMutation.mutate({
      ...formData,
      capacity: parseInt(formData.capacity)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Dormitory Room</DialogTitle>
          <DialogDescription>
            Register a new room within this hostel building.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="room_number">Room Number / Name</Label>
            <Input 
              id="room_number" 
              placeholder="e.g. 101 or A-1" 
              required 
              value={formData.room_number}
              onChange={(e) => setFormData({...formData, room_number: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Occupancy Capacity</Label>
            <Input 
              id="capacity" 
              type="number" 
              required 
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Room
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
