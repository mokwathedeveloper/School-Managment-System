'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  Mail,
  Smartphone,
  ClipboardList,
  GraduationCap,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { InsightCard } from '@/components/dashboard/insight-card';
import { FormSelect } from '@/components/ui/form-select';

export default function AdmissionsDashboard() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admissions', selectedStatus],
    queryFn: async () => {
      const res = await api.get('/admissions/applications', { params: { status: selectedStatus || undefined } });
      return res.data;
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: async (data: any) => api.post('/messaging/announcements', data),
    onSuccess: (res) => {
      toast.success(`Broadcast dispatched to ${res.data.sent} applicants.`);
    }
  });

  const handleBroadcast = () => {
    const title = window.prompt('Enter announcement title:');
    if (!title) return;
    const message = window.prompt('Enter message for applicants:');
    if (!message) return;

    broadcastMutation.mutate({
      title,
      message,
      targetRole: 'APPLICANT' 
    });
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.patch(`/admissions/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      toast.success('Application status updated.');
    }
  });

  if (isLoading) return <PremiumLoader message="Syncing Admissions Pipeline" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-blue-600" />
            Admissions Pipeline
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Registry Flow & Prospect Management</p>
        </div>
        <Button 
          variant="premium"
          className="h-12 px-8"
          onClick={handleBroadcast}
          disabled={broadcastMutation.isPending}
        >
          {broadcastMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          Broadcast Alert
        </Button>
      </div>

      {/* Summary Stats using InsightCard */}
      <div className="grid gap-6 md:grid-cols-4">
        <InsightCard 
          title="Total Applied" 
          value={applications?.length || 0} 
          subValue="Prospect Lifecycle"
          icon={Users} 
          color="blue"
        />
        <InsightCard 
          title="In Review" 
          value={applications?.filter((a: any) => a.status === 'REVIEWING').length || 0} 
          subValue="Active Evaluation"
          icon={Clock} 
          color="indigo"
        />
        <InsightCard 
          title="Accepted" 
          value={applications?.filter((a: any) => a.status === 'ACCEPTED').length || 0} 
          subValue="Provisionally Admitted"
          icon={CheckCircle2} 
          color="emerald"
        />
        <InsightCard 
          title="Enrolled" 
          value={applications?.filter((a: any) => a.status === 'ENROLLED').length || 0} 
          subValue="Finalized Records"
          icon={GraduationCap} 
          color="slate"
        />
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black text-slate-900">Applicant Registry</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Review credentials and stage transitions</CardDescription>
          </div>
          <div className="flex items-center gap-3 min-w-[240px]">
             <FormSelect 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                icon={<Filter className="h-4 w-4" />}
                className="h-11 rounded-xl border-slate-200"
             >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="REVIEWING">In Review</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="ENROLLED">Enrolled</option>
             </FormSelect>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Prospect Identity</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Applied For</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Communication</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400 text-center">Pipeline Stage</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Workflow</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <ClipboardList className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">Registry Empty</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                applications?.map((app: any) => (
                  <TableRow key={app.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="font-black text-slate-900 text-sm">{app.first_name} {app.last_name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Applied {new Date(app.created_at).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border-slate-200">
                        {app.applied_grade.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Mail className="h-3 w-3 text-slate-300" /> {app.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <Smartphone className="h-3 w-3 text-slate-300" /> {app.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm border-none",
                        app.status === 'ACCEPTED' ? "bg-emerald-50 text-emerald-600" : 
                        app.status === 'PENDING' ? "bg-amber-50 text-amber-600" : 
                        app.status === 'REJECTED' ? "bg-rose-50 text-rose-600" : 
                        "bg-blue-50 text-blue-600"
                      )}>
                        {app.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        {app.status === 'PENDING' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-9 px-4 rounded-xl"
                            onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'REVIEWING' })}
                          >
                            Mark Review
                          </Button>
                        )}
                        {app.status === 'REVIEWING' && (
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="h-9 px-4 rounded-xl"
                            onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'INTERVIEW_SCHEDULED' })}
                          >
                            Schedule Interview
                          </Button>
                        )}
                        {app.status === 'INTERVIEW_SCHEDULED' && (
                          <Button 
                            size="sm" 
                            variant="premium"
                            className="h-9 px-4 rounded-xl"
                            onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                          >
                            Accept Student
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-blue-600">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
