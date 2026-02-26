'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function LMSDashboard() {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [view, setView] = useState<'assignments' | 'resources'>('assignments');

  const handleAction = (action: string) => {
    alert(`${action} functionality coming soon! Our engineers are polishing the final workflow.`);
  };

  const { data: classes } = useQuery({
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Learning Management
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Distribute assignments, share notes, and manage digital courseware.</p>
        </div>
        <Button 
          className="shadow-md" 
          onClick={() => handleAction(view === 'assignments' ? 'Post Assignment' : 'Upload Resource')}
        >
          <Plus className="mr-2 h-4 w-4" />
          {view === 'assignments' ? 'Post Assignment' : 'Upload Resource'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Sidebar: Class & View Selection */}
        <div className="space-y-6">
          <Card className="shadow-sm border-muted/50 overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Class</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {classes?.map((cls: any) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    selectedClassId === cls.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted"
                  )}
                >
                  {cls.grade?.name} {cls.name}
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setView('assignments')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border font-bold transition-all",
                view === 'assignments' ? "bg-white border-primary text-primary shadow-sm" : "bg-muted/30 text-muted-foreground"
              )}
            >
              <Calendar className="h-4 w-4" /> Assignments
            </button>
            <button 
              onClick={() => setView('resources')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border font-bold transition-all",
                view === 'resources' ? "bg-white border-primary text-primary shadow-sm" : "bg-muted/30 text-muted-foreground"
              )}
            >
              <FileText className="h-4 w-4" /> Course Material
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          {view === 'assignments' ? (
            <div className="space-y-4">
              {!selectedClassId ? (
                <Card className="h-64 flex flex-col items-center justify-center border-dashed text-muted-foreground">
                  <Calendar className="h-12 w-12 opacity-10 mb-4" />
                  <p>Please select a class to view assignments.</p>
                </Card>
              ) : loadingAssignments ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : assignments?.length === 0 ? (
                <Card className="h-64 flex flex-col items-center justify-center border-dashed text-muted-foreground text-center p-8">
                  <p className="font-bold text-slate-900 mb-1">No active assignments</p>
                  <p className="text-sm">Great job! All students are up to date with their coursework.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => handleAction('Post Assignment')}>
                    Post First Assignment
                  </Button>
                </Card>
              ) : (
                assignments?.map((assignment: any) => (
                  <Card key={assignment.id} className="shadow-sm border-muted/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase">{assignment.subject.name}</Badge>
                          <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due {new Date(assignment.due_date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-black">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{assignment.description}</p>
                      </div>
                      <Button variant="outline" size="sm" className="font-bold" onClick={() => handleAction('Manage Submissions')}>
                        Manage Submissions
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {loadingResources ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : resources?.length === 0 ? (
                <Card className="h-64 flex flex-col items-center justify-center border-dashed text-muted-foreground">
                  <FileText className="h-12 w-12 opacity-10 mb-4" />
                  <p>No course materials uploaded yet.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => handleAction('Upload Resource')}>
                    Upload Your First Resource
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {resources?.map((resource: any) => (
                    <Card key={resource.id} className="shadow-sm border-muted/50 hover:shadow-md transition-shadow group cursor-pointer" onClick={() => handleAction('View Resource')}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          {resource.category === 'VIDEO' ? <Video className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <Badge variant="secondary" className="text-[9px] font-bold h-4">{resource.category}</Badge>
                            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h4 className="font-bold text-sm leading-tight">{resource.title}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{resource.subject?.name || 'General'}</p>
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
