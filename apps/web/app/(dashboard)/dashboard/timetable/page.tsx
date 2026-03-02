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

const DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
];

export default function TimetablePage() {
  const [selectedClassId, setSelectedClassId] = useState('');

  const { data: classes } = useQuery({
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
          <p className="text-muted-foreground mt-1">Schedule lessons, assign rooms, and manage teacher rotations.</p>
        </div>
        <div className="flex gap-2">
            <ManageRoomsDialog />
            <AddTimetableSlotDialog classId={selectedClassId} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Class Selector Sidebar */}
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {classes?.map((cls: any) => (
                <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={cn(
                        "w-full text-left px-4 py-3 rounded-lg border transition-all",
                        selectedClassId === cls.id 
                            ? "bg-primary border-primary text-primary-foreground shadow-sm" 
                            : "hover:bg-muted/50"
                    )}
                >
                    <div className="font-bold">{cls.grade?.name} {cls.name}</div>
                    <div className={cn("text-[10px] uppercase tracking-widest opacity-70", selectedClassId === cls.id ? "text-white" : "text-muted-foreground")}>
                        {cls.form_teacher?.user?.first_name} {cls.form_teacher?.user?.last_name}
                    </div>
                </button>
            ))}
          </CardContent>
        </Card>

        {/* Timetable Grid Area */}
        <div className="md:col-span-3 space-y-4">
            {!selectedClassId ? (
                <Card className="h-[500px] flex flex-col items-center justify-center text-center text-muted-foreground border-dashed">
                    <Calendar className="h-12 w-12 opacity-10 mb-4" />
                    <p>Select a class to view their weekly timetable.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-5 gap-4">
                    {DAYS.map((day) => (
                        <div key={day.id} className="space-y-4">
                            <div className="bg-muted/50 p-2 rounded-lg text-center font-bold text-xs uppercase tracking-widest border">
                                {day.name}
                            </div>
                            <div className="space-y-3">
                                {loadingSlots ? (
                                    <div className="flex justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                ) : slots?.filter((s: any) => s.day_of_week === day.id).length === 0 ? (
                                    <div className="text-[10px] text-center text-muted-foreground italic py-4">No slots</div>
                                ) : slots?.filter((s: any) => s.day_of_week === day.id).map((slot: any) => (
                                    <Card key={slot.id} className="shadow-sm border-l-4 border-l-primary hover:shadow-md transition-shadow group">
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="secondary" className="text-[9px] font-mono h-4">
                                                    {slot.start_time} - {slot.end_time}
                                                </Badge>
                                            </div>
                                            <h4 className="font-bold text-sm mb-1">{slot.subject.name}</h4>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                    <User className="h-3 w-3" />
                                                    {slot.teacher?.user.first_name} {slot.teacher?.user.last_name[0]}.
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {slot.room?.name || 'No Room'}
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
