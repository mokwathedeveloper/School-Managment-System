'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Home, Hash, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

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
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="h-9 px-4 rounded-xl border-slate-100">
        <Plus className="h-4 w-4 mr-2" />
        Add Room
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Add Dormitory Room"
        description="Register a new room within this hostel building"
        icon={Home}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="r_number" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Room Number / Name</Label>
            <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="r_number" 
                    required 
                    placeholder="e.g. 101 or A-1"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.room_number}
                    onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="r_cap" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Occupancy Capacity</Label>
            <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="r_cap" 
                    type="number"
                    required 
                    placeholder="e.g. 4"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-black"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create Room Unit
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
