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
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Classes for dropdown
  const { data: classes, isLoading } = useQuery({
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
      toast.success('Institutional attendance records synchronized successfully.');
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

  if (isLoading && !classes) return <PremiumLoader message="Syncing Registry Nodes" />;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Daily Attendance"
        text="Student Presence Terminal"
      >
        <div className="flex items-center gap-3">
           <div className="bg-white border-2 border-slate-100 rounded-2xl p-1 flex items-center shadow-sm">
             <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
             }}>
               <ChevronLeft className="h-4 w-4" />
             </Button>
             <div className="px-4 flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-tighter">
               <CalendarIcon className="h-3.5 w-3.5 text-blue-600" />
               <input 
                type="date" 
                className="bg-transparent border-none focus:ring-0 p-0 text-[10px] font-black" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
               />
             </div>
             <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
             }}>
               <ChevronRight className="h-4 w-4" />
             </Button>
           </div>
        </div>
      </DashboardHeader>

      <div className="grid gap-8 md:grid-cols-4">
        <Card className="md:col-span-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden h-fit">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Selection</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {classes?.map((cls: any) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 group",
                  selectedClassId === cls.id 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]" 
                    : "bg-white border-slate-50 hover:border-blue-100 hover:bg-slate-50"
                )}
              >
                <div className="font-black flex items-center justify-between text-sm tracking-tight">
                  {cls.grade?.name} {cls.name}
                  <Badge variant={selectedClassId === cls.id ? "secondary" : "outline"} className={cn(
                      "font-black text-[10px]",
                      selectedClassId === cls.id ? "bg-white/20 text-white border-none" : "text-slate-400"
                  )}>
                    {cls._count?.students}
                  </Badge>
                </div>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-widest mt-1",
                  selectedClassId === cls.id ? "text-blue-100" : "text-slate-400"
                )}>
                  {cls.form_teacher?.user?.first_name} {cls.form_teacher?.user?.last_name}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative w-full max-w-sm group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-12 h-12 rounded-2xl border-2 border-slate-100 bg-white focus:ring-blue-600/10 font-bold" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-6" onClick={markAllPresent}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Mark All Present
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={markMutation.isPending || !selectedClassId}
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-primary/20"
                >
                  {markMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Records
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!selectedClassId ? (
              <div className="h-[500px] flex flex-col items-center justify-center text-center p-12">
                <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                    <CalendarIcon className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-tighter">Registry Inactive</h3>
                <p className="text-sm font-bold text-slate-400 max-w-xs uppercase tracking-widest leading-relaxed">
                    Select a class from the left sidebar to initialize the attendance terminal.
                </p>
              </div>
            ) : loadingStudents ? (
              <div className="h-[500px] flex items-center justify-center">
                <PremiumLoader message="Syncing Registry Data" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 w-[150px]">Admission No</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Student Identity</TableHead>
                    <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Current Status</TableHead>
                    <TableHead className="pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400 text-right">Terminal Controls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents?.map((student: any) => (
                    <TableRow key={student.id} className="group hover:bg-slate-50/50 transition-colors border-b-slate-50">
                      <TableCell className="pl-8 py-5 font-black text-blue-600 text-xs tracking-tighter">{student.admission_no}</TableCell>
                      <TableCell>
                        <div className="font-black text-slate-900 text-sm">{student.user.first_name} {student.user.last_name}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        {attendanceState[student.id] ? (
                          <Badge 
                            variant="secondary"
                            className={cn(
                              "font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm border-none",
                              attendanceState[student.id] === 'PRESENT' && "bg-emerald-50 text-emerald-600",
                              attendanceState[student.id] === 'ABSENT' && "bg-rose-50 text-rose-600",
                              attendanceState[student.id] === 'LATE' && "bg-amber-50 text-amber-600",
                              attendanceState[student.id] === 'EXCUSED' && "bg-blue-50 text-blue-600",
                            )}
                          >
                            {attendanceState[student.id]}
                          </Badge>
                        ) : (
                          <div className="h-6 w-24 bg-slate-50 rounded-full mx-auto border border-dashed border-slate-200" />
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-all duration-300">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-10 w-10 rounded-xl transition-all active:scale-90",
                              attendanceState[student.id] === 'PRESENT' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "hover:bg-emerald-50 text-emerald-600"
                            )}
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-10 w-10 rounded-xl transition-all active:scale-90",
                              attendanceState[student.id] === 'ABSENT' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "hover:bg-rose-600"
                            )}
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-10 w-10 rounded-xl transition-all active:scale-90",
                              attendanceState[student.id] === 'LATE' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "hover:bg-amber-600"
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
    </DashboardShell>
  );
}
