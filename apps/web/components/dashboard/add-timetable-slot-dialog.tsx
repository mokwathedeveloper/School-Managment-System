'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Calendar, BookOpen, User, MapPin, Clock } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

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
      const res = await api.get('/classes/subjects');
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
      const res = await api.get('/timetable/rooms');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/timetable', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable', classId] });
      toast.success('Timetable slot has been successfully scheduled.');
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
    <>
      <Button size="sm" onClick={() => setOpen(true)} className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
        <Plus className="h-4 w-4 mr-2" />
        Schedule Slot
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Schedule Lesson"
        description="Assign a subject, teacher, and room to a specific time slot"
        icon={Calendar}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="t_subject" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Subject</Label>
            <FormSelect 
                id="t_subject" 
                icon={<BookOpen className="h-4 w-4" />}
                value={formData.subject_id}
                onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                required
            >
                <option value="">Select Subject</option>
                {subjects?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </FormSelect>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="t_teacher" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instructor</Label>
                <FormSelect 
                    id="t_teacher" 
                    icon={<User className="h-4 w-4" />}
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                >
                    <option value="">Optional</option>
                    {staff?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name}</option>
                    ))}
                </FormSelect>
            </div>
            <div className="space-y-2">
                <Label htmlFor="t_room" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</Label>
                <FormSelect 
                    id="t_room" 
                    icon={<MapPin className="h-4 w-4" />}
                    value={formData.room_id}
                    onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                >
                    <option value="">Optional</option>
                    {rooms?.map((r: any) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </FormSelect>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="t_day" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Day of Week</Label>
            <FormSelect 
              id="t_day" 
              value={formData.day_of_week}
              onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
              required
            >
              {DAYS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </FormSelect>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="t_start" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Time</Label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                    id="t_start" 
                    type="time" 
                    required 
                    className="pl-12 font-black"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t_end" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">End Time</Label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                    id="t_end" 
                    type="time" 
                    required 
                    className="pl-12 font-black"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
            Confirm Schedule
          </Button>
        </form>
      </DialogShell>
    </>
  );
}
