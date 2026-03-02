'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  UserCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Classes for dropdown
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data;
    },
  });

  // 2. Fetch Students in selected class
  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ['students', selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return null;
      const res = await api.get(`/students?classId=${selectedClassId}`);
      return res.data;
    },
    enabled: !!selectedClassId,
  });

  // 3. Fetch Existing Attendance for the class/date
  const { data: existingAttendance, isLoading: loadingAttendance } = useQuery({
    queryKey: ['attendance', selectedClassId, selectedDate],
    queryFn: async () => {
      if (!selectedClassId || !selectedDate) return null;
      const res = await api.get(`/attendance/class/${selectedClassId}?date=${selectedDate}`);
      return res.data;
    },
    enabled: !!selectedClassId && !!selectedDate,
  });

  // Local state for attendance being marked
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});

  // Sync local state when existing attendance is loaded
  useEffect(() => {
    if (existingAttendance) {
      const state: Record<string, string> = {};
      existingAttendance.forEach((record: any) => {
        state[record.student_id] = record.status;
      });
      setAttendanceState(state);
    } else {
      setAttendanceState({});
    }
  }, [existingAttendance]);

  const markMutation = useMutation({
    mutationFn: async (records: any[]) => {
      const res = await api.post('/attendance/mark', {
        class_id: selectedClassId,
        date: selectedDate,
        records,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', selectedClassId, selectedDate] });
      toast.success('Institutional attendance records have been updated and synchronized successfully.');
    },
  });

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const records = Object.entries(attendanceState).map(([student_id, status]) => ({
      student_id,
      status,
    }));
    markMutation.mutate(records);
  };

  const markAllPresent = () => {
    const newState: Record<string, string> = {};
    studentsData?.items.forEach((s: any) => {
      newState[s.id] = 'PRESENT';
    });
    setAttendanceState(newState);
  };

  const filteredStudents = studentsData?.items.filter((s: any) => 
    `${s.user.first_name} ${s.user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admission_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Attendance</h1>
          <p className="text-muted-foreground mt-1 text-lg">Record and monitor daily student presence.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-card border rounded-lg p-1 flex items-center shadow-sm">
             <Button variant="ghost" size="icon" onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
             }}>
               <ChevronLeft className="h-4 w-4" />
             </Button>
             <div className="px-3 flex items-center gap-2 text-sm font-medium">
               <CalendarIcon className="h-4 w-4 text-primary" />
               <input 
                type="date" 
                className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
               />
             </div>
             <Button variant="ghost" size="icon" onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
             }}>
               <ChevronRight className="h-4 w-4" />
             </Button>
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Class Filter</CardTitle>
            <CardDescription>Select a class to begin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {classes?.map((cls: any) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 group",
                    selectedClassId === cls.id 
                      ? "bg-primary border-primary text-primary-foreground shadow-md ring-2 ring-primary/20 ring-offset-2" 
                      : "bg-background hover:bg-muted/50 hover:border-primary/30"
                  )}
                >
                  <div className="font-bold flex items-center justify-between">
                    {cls.grade?.name} {cls.name}
                    <Badge variant={selectedClassId === cls.id ? "secondary" : "outline"} className="ml-2">
                      {cls._count?.students}
                    </Badge>
                  </div>
                  <p className={cn(
                    "text-xs mt-1",
                    selectedClassId === cls.id ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {cls.form_teacher?.user?.first_name} {cls.form_teacher?.user?.last_name}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllPresent}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Mark All Present
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  disabled={markMutation.isPending || !selectedClassId}
                  className="shadow-sm"
                >
                  {markMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Attendance
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!selectedClassId ? (
              <div className="h-96 flex flex-col items-center justify-center text-muted-foreground">
                <CalendarIcon className="h-12 w-12 opacity-10 mb-4" />
                <p>Select a class to mark attendance.</p>
              </div>
            ) : loadingStudents ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[120px]">Adm No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="w-[200px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents?.map((student: any) => (
                    <TableRow key={student.id} className="group hover:bg-muted/20 transition-colors">
                      <TableCell className="font-mono text-xs font-semibold">{student.admission_no}</TableCell>
                      <TableCell>
                        <div className="font-medium">{student.user.first_name} {student.user.last_name}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        {attendanceState[student.id] ? (
                          <Badge 
                            variant="secondary"
                            className={cn(
                              "font-bold px-3 py-1",
                              attendanceState[student.id] === 'PRESENT' && "bg-green-100 text-green-700 hover:bg-green-100",
                              attendanceState[student.id] === 'ABSENT' && "bg-red-100 text-red-700 hover:bg-red-100",
                              attendanceState[student.id] === 'LATE' && "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
                              attendanceState[student.id] === 'EXCUSED' && "bg-blue-100 text-blue-700 hover:bg-blue-100",
                            )}
                          >
                            {attendanceState[student.id]}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Not marked</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-9 w-9 rounded-full",
                              attendanceState[student.id] === 'PRESENT' ? "bg-green-500 text-white hover:bg-green-600" : "hover:bg-green-100 text-green-600"
                            )}
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-9 w-9 rounded-full",
                              attendanceState[student.id] === 'ABSENT' ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-red-100 text-red-600"
                            )}
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-9 w-9 rounded-full",
                              attendanceState[student.id] === 'LATE' ? "bg-yellow-500 text-white hover:bg-yellow-600" : "hover:bg-yellow-100 text-yellow-600"
                            )}
                            onClick={() => handleStatusChange(student.id, 'LATE')}
                          >
                            <Clock className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
