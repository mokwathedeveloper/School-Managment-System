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
import { Plus, Loader2, Calendar } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

interface AddTimetableSlotDialogProps {
  classId: string;
}

const DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
  { id: 7, name: 'Sunday' },
];

export function AddTimetableSlotDialog({ classId }: AddTimetableSlotDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    subject_id: '',
    teacher_id: '',
    room_id: '',
    day_of_week: '1',
    start_time: '08:00',
    end_time: '09:00',
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await api.get('/classes/subjects'); // Assuming this endpoint exists or similar
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

  const { data: rooms } = useQuery({
    queryKey: ['academic-rooms'],
    queryFn: async () => {
      const res = await api.get('/timetable/rooms'); // Assuming we add this endpoint
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/timetable', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable', classId] });
      toast.success('Timetable slot has been scheduled.');
      setOpen(false);
      setFormData({ 
        subject_id: '', 
        teacher_id: '', 
        room_id: '', 
        day_of_week: '1', 
        start_time: '08:00', 
        end_time: '09:00' 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Conflict detected or invalid input.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) {
        toast.error('Class context missing.');
        return;
    }
    createMutation.mutate({
      ...formData,
      class_id: classId,
      day_of_week: parseInt(formData.day_of_week)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Slot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Lesson Slot
          </DialogTitle>
          <DialogDescription>
            Assign a subject, teacher, and room to a specific time slot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="subject_id">Subject</Label>
            <select 
              id="subject_id" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.subject_id}
              onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
              required
            >
              <option value="">Select Subject</option>
              {subjects?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="teacher_id">Teacher</Label>
                <select 
                id="teacher_id" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.teacher_id}
                onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                >
                <option value="">Optional</option>
                {staff?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name}</option>
                ))}
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="room_id">Room</Label>
                <select 
                id="room_id" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.room_id}
                onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                >
                <option value="">Optional</option>
                {rooms?.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                ))}
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day_of_week">Day of Week</Label>
            <select 
              id="day_of_week" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.day_of_week}
              onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
              required
            >
              {DAYS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input 
                id="start_time" 
                type="time" 
                required 
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input 
                id="end_time" 
                type="time" 
                required 
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Schedule Lesson
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
