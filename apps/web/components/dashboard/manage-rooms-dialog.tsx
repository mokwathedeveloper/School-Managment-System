'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, MapPin, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

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

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    createMutation.mutate(roomName);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="h-12 px-6 rounded-xl border-slate-100">
          <MapPin className="h-4 w-4 mr-2" />
          Manage Rooms
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Institutional Rooms"
        description="Define academic rooms and labs available for scheduling"
        icon={MapPin}
      >
        <div className="space-y-6">
            <form onSubmit={handleAddRoom} className="flex gap-2">
                <Input 
                    placeholder="Room Name (e.g. Lab 1)" 
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                    className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                />
                <Button type="submit" disabled={createMutation.isPending} size="icon" className="h-12 w-12 rounded-xl">
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
            </form>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
                {isLoading ? (
                    <div className="text-center py-12 opacity-20"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
                ) : rooms?.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-300 font-black uppercase tracking-widest italic border-2 border-dashed border-slate-50 rounded-[2rem]">
                        No academic rooms defined
                    </div>
                ) : (
                    rooms?.map((room: any) => (
                        <div key={room.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm border border-slate-100 transition-colors">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <span className="font-black text-sm text-slate-900">{room.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-rose-600 rounded-lg">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
      </DialogShell>
    </>
  );
}
