'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { AddTimetableSlotDialog } from '@/components/dashboard/add-timetable-slot-dialog';
import { ManageRoomsDialog } from '@/components/dashboard/manage-rooms-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';

const DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
];

export default function TimetablePage() {
  const [selectedClassId, setSelectedClassId] = useState('');

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data;
    },
  });

  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ['timetable', selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return null;
      const res = await api.get(`/timetable/class/${selectedClassId}`);
      return res.data;
    },
    enabled: !!selectedClassId,
  });

  if (loadingClasses) return <PremiumLoader message="Syncing Institutional Schedules" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            Timetable Terminal
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Lesson Scheduling & Room Allocation</p>
        </div>
        <div className="flex gap-3">
            <ManageRoomsDialog />
            <AddTimetableSlotDialog classId={selectedClassId} />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Class Selector Sidebar */}
        <Card className="md:col-span-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Class Matrix</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {classes?.map((cls: any) => (
                <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={cn(
                        "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300",
                        selectedClassId === cls.id 
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]" 
                            : "bg-white border-slate-50 hover:border-blue-100 hover:bg-slate-50"
                    )}
                >
                    <div className="font-black text-sm tracking-tight">{cls.grade?.name} {cls.name}</div>
                    <div className={cn(
                        "text-[10px] font-bold uppercase tracking-widest mt-1",
                        selectedClassId === cls.id ? "text-blue-100" : "text-slate-400"
                    )}>
                        {cls.form_teacher?.user?.first_name} {cls.form_teacher?.user?.last_name}
                    </div>
                </button>
            ))}
          </CardContent>
        </Card>

        {/* Timetable Grid Area */}
        <div className="md:col-span-3 space-y-4">
            {!selectedClassId ? (
                <Card className="h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-2 border-dashed border-slate-100">
                    <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                        <Calendar className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Schedule View Inactive</h3>
                    <p className="text-sm font-bold text-slate-400 max-w-xs uppercase tracking-widest leading-relaxed">
                        Select a target class to populate the weekly lesson matrix.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {DAYS.map((day) => (
                        <div key={day.id} className="space-y-4">
                            <div className="bg-slate-900 text-white p-3 rounded-2xl text-center font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10">
                                {day.name}
                            </div>
                            <div className="space-y-3">
                                {loadingSlots ? (
                                    <div className="flex justify-center p-8 opacity-20">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : slots?.filter((s: any) => s.day_of_week === day.id).length === 0 ? (
                                    <div className="text-[10px] font-black text-center text-slate-300 uppercase tracking-widest py-8 border-2 border-dashed border-slate-50 rounded-2xl italic">No Slots</div>
                                ) : slots?.filter((s: any) => s.day_of_week === day.id).map((slot: any) => (
                                    <Card key={slot.id} className="border-none shadow-sm bg-white hover:shadow-xl transition-premium group relative overflow-hidden rounded-2xl">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge variant="secondary" className="text-[9px] font-black font-mono h-5 px-2 bg-blue-50 text-blue-600 border-none rounded-lg">
                                                    {slot.start_time} - {slot.end_time}
                                                </Badge>
                                            </div>
                                            <h4 className="font-black text-slate-900 text-xs leading-tight mb-2 group-hover:text-blue-600 transition-colors">{slot.subject.name}</h4>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    <User className="h-3 w-3 text-blue-400" />
                                                    {slot.teacher?.user.first_name} {slot.teacher?.user.last_name[0]}.
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    <MapPin className="h-3 w-3 text-emerald-400" />
                                                    {slot.room?.name || 'Open Area'}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
