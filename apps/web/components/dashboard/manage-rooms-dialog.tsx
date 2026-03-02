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
import { Plus, Loader2, MapPin, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export function ManageRoomsDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [roomName, setRoomName] = useState('');

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['academic-rooms'],
    queryFn: async () => {
      const res = await api.get('/timetable/rooms');
      return res.data;
    },
    enabled: open
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => api.post('/timetable/rooms', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-rooms'] });
      toast.success('Room created successfully.');
      setRoomName('');
    }
  });

  // Need to add POST to /timetable/rooms
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    createMutation.mutate(roomName);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Manage Rooms
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Institutional Rooms
          </DialogTitle>
          <DialogDescription>
            Define academic rooms and labs available for scheduling.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddRoom} className="flex gap-2 pt-4">
            <Input 
                placeholder="Room Name (e.g. Lab 1)" 
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
            />
            <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
        </form>

        <div className="mt-6 space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {isLoading ? (
                <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto opacity-20" /></div>
            ) : rooms?.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground italic border-2 border-dashed rounded-xl">
                    No academic rooms defined yet.
                </div>
            ) : (
                rooms?.map((room: any) => (
                    <div key={room.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-transparent hover:border-primary/20 transition-all">
                        <span className="font-bold text-sm">{room.name}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
