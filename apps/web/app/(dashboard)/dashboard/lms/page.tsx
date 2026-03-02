'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Loader2,
  Video,
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { AddAssignmentDialog } from '@/components/dashboard/add-assignment-dialog';
import { UploadResourceDialog } from '@/components/dashboard/upload-resource-dialog';

export default function LMSDashboard() {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [view, setView] = useState<'assignments' | 'resources'>('assignments');

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data;
    },
  });

  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: ['assignments', selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return null;
      const res = await api.get(`/lms/assignments/class/${selectedClassId}`);
      return res.data;
    },
    enabled: !!selectedClassId,
  });

  const { data: resources, isLoading: loadingResources } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const res = await api.get('/lms/resources');
      return res.data;
    },
  });

  if (loadingClasses) return <PremiumLoader message="Syncing Learning Hub" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            LMS Dashboard
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Courseware Distribution & Digital Classrooms</p>
        </div>
        <div className="flex items-center gap-3">
            {view === 'assignments' ? (
                <AddAssignmentDialog classId={selectedClassId} />
            ) : (
                <UploadResourceDialog />
            )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Sidebar: Class & View Selection */}
        <div className="space-y-6">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Class Selection</CardTitle>
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
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mt-1",
                    selectedClassId === cls.id ? "text-blue-100" : "text-slate-400"
                  )}>
                    {cls.form_teacher?.user?.first_name || 'Staff'} {cls.form_teacher?.user?.last_name || 'Assigned'}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 p-1 bg-white border shadow-sm rounded-[2rem]">
            <button 
              onClick={() => setView('assignments')}
              className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all duration-300",
                view === 'assignments' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <span className="flex items-center gap-3">
                <Calendar className="h-4 w-4" /> Assignments
              </span>
              <ChevronRight className={cn("h-3 w-3 transition-transform", view === 'assignments' ? "rotate-90" : "")} />
            </button>
            <button 
              onClick={() => setView('resources')}
              className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all duration-300",
                view === 'resources' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <span className="flex items-center gap-3">
                <FileText className="h-4 w-4" /> Repository
              </span>
              <ChevronRight className={cn("h-3 w-3 transition-transform", view === 'resources' ? "rotate-90" : "")} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          {view === 'assignments' ? (
            <div className="space-y-4">
              {!selectedClassId ? (
                <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-2 border-dashed border-slate-100">
                    <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                        <Layers className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Classroom Inactive</h3>
                    <p className="text-sm font-bold text-slate-400 max-w-xs uppercase tracking-widest leading-relaxed">
                        Select a target class to populate the digital assignment terminal.
                    </p>
                </div>
              ) : loadingAssignments ? (
                <div className="h-64 flex items-center justify-center"><PremiumLoader message="Syncing Assignments" /></div>
              ) : assignments?.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] shadow-sm border-2 border-dashed border-slate-100">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 opacity-20 mb-4" />
                  <p className="font-black text-slate-900 uppercase tracking-tighter">Classroom Synchronized</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">No active tasks found for this stream.</p>
                </div>
              ) : (
                assignments?.map((assignment: any) => (
                  <Card key={assignment.id} className="border-none shadow-sm bg-white hover:shadow-xl transition-premium group relative overflow-hidden rounded-[2rem]">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-none px-3 py-1 rounded-lg">
                            {assignment.subject.name}
                          </Badge>
                          <span className="text-[10px] font-black text-rose-600 flex items-center gap-1.5 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg">
                            <Clock className="h-3 w-3" />
                            Due {new Date(assignment.due_date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{assignment.title}</h3>
                        <p className="text-sm font-medium text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">{assignment.description}</p>
                      </div>
                      <Button variant="outline" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] group-hover:border-blue-600/20 group-hover:bg-blue-50/30 group-hover:text-blue-600">
                        Manage Submissions
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {loadingResources ? (
                <div className="h-64 flex items-center justify-center"><PremiumLoader message="Syncing Repository" /></div>
              ) : resources?.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] shadow-sm border-2 border-dashed border-slate-100">
                    <FileText className="h-12 w-12 text-slate-200 mb-4" />
                    <p className="font-black text-slate-900 uppercase tracking-tighter">Repository Empty</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Upload course materials to synchronize the library.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {resources?.map((resource: any) => (
                    <Card key={resource.id} className="border-none shadow-sm bg-white hover:shadow-xl transition-premium group cursor-pointer rounded-[2rem]" onClick={() => {
                      if (resource.file_url) {
                        window.open(resource.file_url, '_blank');
                      } else {
                        toast.success(`Initializing secure document viewer for: ${resource.title}`);
                      }
                    }}>
                      <CardContent className="p-6 flex items-start gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-all group-hover:scale-110 group-hover:rotate-3">
                          {resource.category === 'VIDEO' ? <Video className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex justify-between items-start">
                            <Badge className="text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white border-none h-5 px-2 rounded-lg">{resource.category}</Badge>
                            <ExternalLink className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h4 className="font-black text-slate-900 text-sm leading-tight truncate pr-4">{resource.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="h-1 w-1 rounded-full bg-blue-600" />
                            {resource.subject?.name || 'General Resource'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
